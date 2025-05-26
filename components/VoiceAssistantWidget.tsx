
"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Send, X } from "lucide-react";

const VoiceAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessages((prev) => [...prev, `You: ${transcript}`]);
      const response = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      });
      const audioBlob = await response.blob();
      new Audio(URL.createObjectURL(audioBlob)).play();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, `You: ${input}`]);
    const response = await fetch("/api/elevenlabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const audioBlob = await response.blob();
    new Audio(URL.createObjectURL(audioBlob)).play();
    setInput("");
  };

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      drag
      dragConstraints={{ top: 0, bottom: 600, left: 0, right: 600 }}
    >
      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer" onClick={toggleOpen}>
        🎤
      </div>

      {isOpen && (
        <div className="w-80 mt-3 p-4 bg-white rounded-xl shadow-2xl text-black">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-semibold">Assistant</h2>
            <X className="w-5 h-5 cursor-pointer" onClick={toggleOpen} />
          </div>
          <div className="max-h-60 overflow-y-auto text-sm mb-3 space-y-1">
            {messages.map((m, i) => (
              <div key={i} className="bg-gray-100 px-2 py-1 rounded">{m}</div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message"
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <Send className="w-5 h-5 text-blue-500 cursor-pointer" onClick={handleSend} />
            <Mic className="w-5 h-5 text-red-500 cursor-pointer" onClick={handleVoiceInput} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VoiceAssistantWidget;
