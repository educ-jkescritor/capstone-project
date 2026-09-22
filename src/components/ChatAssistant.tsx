'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useFinance } from '../context/FinanceContext';
import BudgetImpactCard, { ToolState } from './BudgetImpactCard';

export default function ChatAssistant() {
  const { state: financeState } = useFinance();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, error } = useChat({
    api: '/api/chat',
    body: {
      financeContext: {
        monthlyBudget: financeState.monthlyBudget || 2000,
        totalExpenses: financeState.totalExpenses,
      },
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `👋 Hello! I am your **Telecash AI Financial Advisor**. 

I can analyze prospective purchases in real-time, evaluate budget impact, and calculate risk metrics. Ask me a question below or pick a preset inquiry!`,
      },
    ],
  });

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const presetQueries = [
    { label: '🟢 Check $150 Dining (Safe)', query: 'Can I afford a $150 dinner with friends this weekend?' },
    { label: '🟠 Check $1,200 Laptop (High Usage)', query: 'Can I afford to buy a $1,200 laptop right now?' },
    { label: '🔴 Test Error Handling (-$50)', query: 'Simulate an error state with a -$50 negative transaction' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
      {/* Top Advisor Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            🤖
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Telecash AI Advisor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-semibold uppercase">
                Zod Tool Calling
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Active Context: Budget {financeState.currency}{financeState.monthlyBudget || 2000} • Spent {financeState.currency}{financeState.totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Generative UI Active</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-gray-50 text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* Vercel AI SDK Typed Tool Invocations */}
                {message.toolInvocations && message.toolInvocations.length > 0 && (
                  <div className="mt-4 space-y-3 w-full">
                    {message.toolInvocations.map((toolInvocation) => {
                      const isCall = toolInvocation.state === 'call';
                      const isResult = toolInvocation.state === 'result';

                      let toolState: ToolState = 'input-streaming';
                      let toolError: string | undefined = undefined;

                      if (isCall) {
                        toolState = toolInvocation.args ? 'input-available' : 'input-streaming';
                      } else if (isResult) {
                        // Check if result returned an error property or failed
                        if ('error' in toolInvocation && toolInvocation.error) {
                          toolState = 'output-error';
                          toolError = String(toolInvocation.error);
                        } else if (toolInvocation.result && typeof toolInvocation.result === 'object' && 'error' in toolInvocation.result) {
                          toolState = 'output-error';
                          toolError = String(toolInvocation.result.error);
                        } else {
                          toolState = 'output-available';
                        }
                      }

                      return (
                        <BudgetImpactCard
                          key={toolInvocation.toolCallId}
                          state={toolState}
                          input={toolInvocation.args}
                          result={isResult && !toolError ? toolInvocation.result : undefined}
                          error={toolError}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Global Loading / Streaming Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 italic">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
            <span>AI is streaming response and calculating parameters...</span>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            Network error communicating with AI route: {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Query Chips */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-gray-400 font-semibold whitespace-nowrap">Try:</span>
        {presetQueries.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() =>
              append(
                { role: 'user', content: item.query },
                {
                  body: {
                    financeContext: {
                      monthlyBudget: financeState.monthlyBudget || 2000,
                      totalExpenses: financeState.totalExpenses,
                    },
                  },
                }
              )
            }
            className="px-2.5 py-1 rounded-full bg-white border border-gray-200 hover:border-brand-500 text-gray-700 font-medium whitespace-nowrap shadow-xs transition"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          handleSubmit(e, {
            body: {
              financeContext: {
                monthlyBudget: financeState.monthlyBudget || 2000,
                totalExpenses: financeState.totalExpenses,
              },
            },
          });
        }}
        className="p-4 border-t border-surface-border bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a financial question, e.g. 'Can I afford a $250 dinner tonight?'..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-gray-900 bg-white shadow-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition flex items-center gap-2 ${
            !input.trim() || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
          }`}
        >
          <span>Ask</span>
          <span>→</span>
        </button>
      </form>
    </div>
  );
}
