import dynamic from "next/dynamic";

const VoiceAssistantWidget = dynamic(() => import("../components/VoiceAssistantWidget"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-5">Voice Assistant Demo</h1>
      <p>Click the floating orb in the bottom-right to interact.</p>
      <VoiceAssistantWidget />
    </main>
  );
}
