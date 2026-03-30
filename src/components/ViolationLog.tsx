import React from 'react';
import { ShieldAlert, Car, Clock, ChevronRight } from 'lucide-react';
import { TrafficAnalysis } from '../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface ViolationLogProps {
  violations: TrafficAnalysis['violations'];
}

export const ViolationLog: React.FC<ViolationLogProps> = ({ violations }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-bottom border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Lane Violation Log</h3>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Real-time detection active</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
          {violations.length} RECENT
        </span>
      </div>

      <div className="divide-y divide-zinc-800/50 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {violations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-zinc-600">No violations detected in the current session.</p>
            </div>
          ) : (
            violations.map((violation, idx) => (
              <motion.div 
                key={`${violation.timestamp}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <Car className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">{violation.type}</span>
                      <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-mono">
                        {(violation.confidence * 100).toFixed(0)}% CONF
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Car className="w-3 h-3" /> {violation.vehicleType}
                      </span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {violation.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
