import React, { useRef, useState, useEffect } from 'react';
import { Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { analyzeTrafficFrame, TrafficAnalysis } from '../lib/gemini';
import { cn } from '../lib/utils';

interface TrafficFeedProps {
  onAnalysis: (analysis: TrafficAnalysis) => void;
}

export const TrafficFeed: React.FC<TrafficFeedProps> = ({ onAnalysis }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
      console.error(err);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    
    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0) return;

    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const analysis = await analyzeTrafficFrame(base64Image);
        onAnalysis(analysis);
      } catch (err) {
        console.error("Analysis failed:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Auto-analyze every 10 seconds
  useEffect(() => {
    const interval = setInterval(captureAndAnalyze, 10000);
    return () => clearInterval(interval);
  }, [stream]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden border border-zinc-800 aspect-video group">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
          <AlertCircle className="w-12 h-12 mb-4 text-red-500/50" />
          <p className="text-sm">{error}</p>
          <button 
            onClick={startCamera}
            className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover opacity-80"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/80">Live Feed: Junction 04</span>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={captureAndAnalyze}
              disabled={isAnalyzing}
              className={cn(
                "p-3 rounded-full backdrop-blur-md border transition-all",
                isAnalyzing 
                  ? "bg-white/10 border-white/5 text-white/40 cursor-not-allowed" 
                  : "bg-white/20 border-white/20 text-white hover:bg-white/30"
              )}
            >
              <RefreshCw className={cn("w-5 h-5", isAnalyzing && "animate-spin")} />
            </button>
          </div>
        </>
      )}
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
};
