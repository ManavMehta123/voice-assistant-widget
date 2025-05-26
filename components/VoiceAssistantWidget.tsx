"use client";

import { useEffect } from "react";

export default function VoiceAssistantWidget() {
  useEffect(() => {
    console.log("Voice Assistant Widget Mounted");
  }, []);

  return (
    <div className="fixed bottom-5 right-5 w-16 h-16 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white text-xl">
      🎤
    </div>
  );
}
