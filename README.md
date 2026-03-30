# SmartFlow: Traffic & Lane Violation System

SmartFlow is a next-generation smart city dashboard designed for real-time metropolitan traffic management. it transforms standard traffic camera feeds into intelligent data streams, detecting vehicle counts, estimating speeds, and identifying complex lane violations automatically.

## 🚀 Features

- **AI-Powered Vision**: Real-time analysis of traffic frames using Gemini 3 Flash.
- **Violation Detection**: Automated logging of lane violations (crossing solid lines, illegal turns, wrong-way driving).
- **Traffic Density Monitoring**: Live tracking of vehicle counts and congestion levels (Low, Medium, High).
- **Interactive Dashboard**: A high-density "Mission Control" UI built with React and Tailwind CSS.
- **Data Visualization**: Historical trend analysis for traffic flow and average speeds using Recharts.
- **Responsive Design**: Optimized for both desktop control centers and mobile field monitoring.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js**: Version 18 or higher.
- **Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/).

## ⚙️ Setup Instructions

1. **Clone the Repository** (if exported):
   ```bash
   git clone <your-repo-url>
   cd smartflow-traffic-system
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 🚦 How to Use

1. **Camera Access**: Upon launching, the app will request camera permissions. This simulates a live traffic camera feed.
2. **Live Feed**: The "Junction 04" window shows the live video. A grid overlay is applied for a technical "HUD" feel.
3. **Analysis**:
   - The system automatically analyzes a frame every **10 seconds**.
   - You can manually trigger an analysis by clicking the **Refresh** icon in the bottom right of the feed.
4. **Dashboard Stats**:
   - **Vehicle Count**: Shows the number of vehicles detected in the current frame.
   - **Avg. Speed**: Estimated speed of traffic flow.
   - **Congestion**: Color-coded status (Green for Low, Amber for Medium, Red for High).
5. **Violation Log**: Any detected violations appear in the right-hand sidebar with a confidence score and timestamp.

## 🛡️ Security & Privacy

- **Local Processing**: Camera data is processed frame-by-frame.
- **AI Safety**: The system uses structured JSON output to ensure data consistency and prevent prompt injection risks.

## 📄 License

This project is licensed under the Apache-2.0 License.
