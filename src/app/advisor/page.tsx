import ChatAssistant from '../../components/ChatAssistant';

export const metadata = {
  title: 'AI Financial Advisor — TELECASH',
  description: 'Proactive AI assistant with typed server-side tool calling and Generative UI budget calculations.',
};

// Server Component by default
export default function AdvisorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          AI Financial Advisor
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Ask questions in plain English to evaluate real-time budget impacts, simulate prospective purchases, and analyze spending risks.
        </p>
      </div>

      <ChatAssistant />
    </div>
  );
}
