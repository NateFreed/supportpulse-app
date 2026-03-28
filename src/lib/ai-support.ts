import { supabase } from './supabase';
import type { KnowledgeArticle, Message } from './types';

/**
 * AI Support Response Engine — the core product.
 * Answers visitor questions using the knowledge base context.
 *
 * Flow:
 * 1. Visitor sends message
 * 2. Fetch relevant KB articles (keyword matching, v2: embeddings)
 * 3. Send to Claude API with KB context
 * 4. Return response with confidence score
 * 5. If confidence < threshold, escalate to human
 */

const CONFIDENCE_THRESHOLD = 60; // Below this, escalate to human

export async function generateAIResponse(
  workspaceId: string,
  conversationId: string,
  visitorMessage: string,
  conversationHistory: Message[]
): Promise<{ response: string; confidence: number; shouldEscalate: boolean }> {
  try {
    // Fetch relevant knowledge base articles
    const articles = await findRelevantArticles(workspaceId, visitorMessage);

    // Call Edge Function for AI response
    const { data, error } = await supabase.functions.invoke('ai-support-response', {
      body: {
        workspace_id: workspaceId,
        conversation_id: conversationId,
        visitor_message: visitorMessage,
        conversation_history: conversationHistory.slice(-10).map(m => ({
          role: m.sender_type,
          content: m.content,
        })),
        knowledge_context: articles.map(a => `## ${a.title}\n${a.content}`).join('\n\n'),
      },
    });

    if (!error && data?.response) {
      const confidence = data.confidence || 70;
      return {
        response: data.response,
        confidence,
        shouldEscalate: confidence < CONFIDENCE_THRESHOLD,
      };
    }

    // Fallback
    return fallbackResponse(visitorMessage, articles);
  } catch {
    return fallbackResponse(visitorMessage, await findRelevantArticles(workspaceId, visitorMessage));
  }
}

/**
 * Find relevant knowledge base articles using keyword matching.
 * V2: Replace with vector embeddings for semantic search.
 */
async function findRelevantArticles(
  workspaceId: string,
  query: string
): Promise<KnowledgeArticle[]> {
  const keywords = query.toLowerCase()
    .split(/[\s,?.!]+/)
    .filter(w => w.length > 2);

  // Fetch all published articles for this workspace
  const { data: articles } = await supabase
    .from('sp_knowledge_base')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_published', true);

  if (!articles || articles.length === 0) return [];

  // Score articles by keyword match
  const scored = articles.map(article => {
    const text = (article.title + ' ' + article.content).toLowerCase();
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) score++;
    }
    return { article, score };
  });

  // Return top 3 matches
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.article as KnowledgeArticle);
}

/**
 * Fallback responses when AI API is unavailable.
 */
function fallbackResponse(
  query: string,
  articles: KnowledgeArticle[]
): { response: string; confidence: number; shouldEscalate: boolean } {
  if (articles.length > 0) {
    // Found relevant articles — provide a helpful response
    const topArticle = articles[0];
    const snippet = topArticle.content.slice(0, 200);
    return {
      response: `Based on our help center, here's what I found about "${topArticle.title}":\n\n${snippet}...\n\nWould you like more details, or would you prefer to speak with a team member?`,
      confidence: 55,
      shouldEscalate: false,
    };
  }

  // No articles found — escalate
  return {
    response: "I don't have enough information to answer that question confidently. Let me connect you with a team member who can help. One moment please!",
    confidence: 20,
    shouldEscalate: true,
  };
}

/**
 * Save AI message to the conversation.
 */
export async function saveAIMessage(
  conversationId: string,
  content: string,
  confidence: number
): Promise<void> {
  await supabase.from('sp_messages').insert({
    conversation_id: conversationId,
    sender_type: 'ai',
    sender_name: 'AI Assistant',
    content,
    ai_confidence: confidence,
  });
}

/**
 * Escalate conversation to human agent.
 */
export async function escalateToHuman(conversationId: string): Promise<void> {
  await supabase
    .from('sp_conversations')
    .update({ status: 'assigned', ai_handled: false })
    .eq('id', conversationId);
}
