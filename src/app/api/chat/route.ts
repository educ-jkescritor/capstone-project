import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { budgetImpactInputSchema, computeBudgetImpact, BudgetImpactInput } from '../../../lib/tools/budget-impact';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, financeContext } = await req.json();

  const userBudget = typeof financeContext?.monthlyBudget === 'number' && financeContext.monthlyBudget > 0
    ? financeContext.monthlyBudget
    : 2000;
  const userExpenses = typeof financeContext?.totalExpenses === 'number'
    ? financeContext.totalExpenses
    : 0;

  // Extract the latest user message
  const lastUserMessage = messages[messages.length - 1]?.content || '';

  // Check if live OpenAI API Key is configured
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const result = streamText({
        model: openai('gpt-4o-mini'),
        messages,
        system: `You are Telecash AI Advisor, an intelligent personal finance copilot. 
When a user asks about spending money, purchasing an item, or asking if they can afford something, you MUST call the "calculateBudgetImpact" tool with the estimated dollar amount and category.
If the user asks to test an error or passes a negative amount, call calculateBudgetImpact with simulateError: true.
Active user context: Monthly Budget is $${userBudget}, Current Spent is $${userExpenses}.`,
        tools: {
          calculateBudgetImpact: tool({
            description: 'Evaluates budget impact and affordability of a proposed expense',
            parameters: budgetImpactInputSchema,
            execute: async (params: BudgetImpactInput) => {
              return computeBudgetImpact(params, {
                currentBudget: userBudget,
                currentTotalExpenses: userExpenses,
              });
            },
          }),
        },
      });

      return result.toDataStreamResponse();
    } catch (err) {
      console.error('OpenAI stream failed, using resilient fallback:', err);
    }
  }

  // --------------------------------------------------------------------------
  // DETERMINISTIC RESILIENT FALLBACK (Guarantees zero crashes & 100% testability)
  // --------------------------------------------------------------------------
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      // Helper to push Vercel AI SDK Data Stream protocol lines
      // '0:' is text part, '9:' is tool call start, 'a:' is tool result
      const push = (text: string) => controller.enqueue(encoder.encode(text));

      // Parse user inquiry using heuristic parameter extraction
      const isErrorTest = /error|fail|negative|-\d+/i.test(lastUserMessage);
      const amountMatch = lastUserMessage.match(/\$?(\d+(?:\.\d{2})?)/);
      const extractedAmount = isErrorTest ? -50 : amountMatch ? parseFloat(amountMatch[1]) : 150;

      let extractedCategory = 'Food & Dining';
      if (/laptop|tech|gadget|phone/i.test(lastUserMessage)) extractedCategory = 'Electronics & Tech';
      else if (/flight|travel|hotel|trip/i.test(lastUserMessage)) extractedCategory = 'Travel & Vacation';
      else if (/clothes|shopping|shoes/i.test(lastUserMessage)) extractedCategory = 'Shopping';
      else if (/entertainment|concert|movie|game/i.test(lastUserMessage)) extractedCategory = 'Entertainment';

      const toolCallId = `call_${Date.now()}`;

      // 1. Text stream introduction
      push(`0:${JSON.stringify("Let me analyze your budget and calculate the financial impact of this transaction.\n\n")}\n`);
      await new Promise((r) => setTimeout(r, 400));

      // 2. Stream tool call start (input-streaming -> input-available)
      push(
        `9:${JSON.stringify({
          toolCallId,
          toolName: 'calculateBudgetImpact',
          args: {
            expenseAmount: extractedAmount,
            category: extractedCategory,
            description: lastUserMessage.slice(0, 50),
            simulateError: isErrorTest,
          },
        })}\n`
      );
      await new Promise((r) => setTimeout(r, 600));

      // 3. Output result or error
      if (isErrorTest || extractedAmount <= 0) {
        push(
          `a:${JSON.stringify({
            toolCallId,
            error: isErrorTest
              ? 'Simulated Execution Error: Tool triggered an intentional failure for error-state verification.'
              : `Invalid transaction value: $${extractedAmount.toFixed(2)}. Expense amount must be strictly greater than zero.`,
          })}\n`
        );
      } else {
        const resultData = computeBudgetImpact(
          {
            expenseAmount: extractedAmount,
            category: extractedCategory,
            description: lastUserMessage,
          },
          {
            currentBudget: userBudget,
            currentTotalExpenses: userExpenses,
          }
        );

        push(
          `a:${JSON.stringify({
            toolCallId,
            result: resultData,
          })}\n`
        );
      }

      // 4. Concluding guidance
      await new Promise((r) => setTimeout(r, 300));
      push(
        `0:${JSON.stringify(
          isErrorTest
            ? "\n\nThe calculation was halted due to invalid parameters. Please review the error diagnosis above."
            : `\n\nBased on your active monthly budget, this purchase has been evaluated and scored above. Let me know if you would like to adjust your goals!`
        )}\n`
      );

      // Finish stream
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Vercel-AI-Data-Stream': 'v1',
    },
  });
}
