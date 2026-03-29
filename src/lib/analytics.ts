import { supabase } from './supabase';
import type { Conversation, Message, SupportStats } from './types';

export interface SupportAnalytics {
  stats: SupportStats;
  dailyConversations: { date: string; count: number; aiHandled: number }[];
  responseTimeDistribution: { bucket: string; count: number }[];
  channelBreakdown: { channel: string; count: number }[];
  topQuestions: { question: string; count: number }[];
}

export async function fetchSupportAnalytics(workspaceId: string, days = 30): Promise<SupportAnalytics> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();
  const today = new Date().toISOString().slice(0, 10);

  const [convosRes, messagesRes] = await Promise.all([
    supabase.from('sp_conversations').select('*').eq('workspace_id', workspaceId).gte('created_at', sinceISO).order('created_at', { ascending: true }),
    supabase.from('sp_messages').select('*, sp_conversations!inner(workspace_id)').eq('sp_conversations.workspace_id', workspaceId).gte('created_at', sinceISO),
  ]);

  const convos: Conversation[] = convosRes.data || [];
  const messages: Message[] = messagesRes.data || [];

  const stats = computeStats(convos, messages, today);
  const dailyConversations = computeDailyConvos(convos);
  const responseTimeDistribution = computeResponseTimes(convos, messages);
  const channelBreakdown = computeChannelBreakdown(convos);
  const topQuestions = extractTopQuestions(messages);

  return { stats, dailyConversations, responseTimeDistribution, channelBreakdown, topQuestions };
}

function computeStats(convos: Conversation[], messages: Message[], today: string): SupportStats {
  const totalConversations = convos.length;
  const openConversations = convos.filter(c => c.status === 'open' || c.status === 'assigned').length;
  const resolvedToday = convos.filter(c => c.status === 'resolved' && c.created_at.slice(0, 10) === today).length;

  // AI resolution rate
  const resolved = convos.filter(c => c.status === 'resolved' || c.status === 'closed');
  const aiHandled = resolved.filter(c => c.ai_handled).length;
  const aiResolutionRate = resolved.length > 0 ? Math.round((aiHandled / resolved.length) * 100) : 0;

  // Avg response time (first agent/ai response after visitor message)
  let totalResponseTime = 0;
  let responseCount = 0;
  const convoMessages = new Map<string, Message[]>();
  for (const m of messages) {
    const list = convoMessages.get(m.conversation_id) || [];
    list.push(m);
    convoMessages.set(m.conversation_id, list);
  }
  for (const [, msgs] of convoMessages) {
    const sorted = msgs.sort((a, b) => a.created_at.localeCompare(b.created_at));
    const firstVisitor = sorted.find(m => m.sender_type === 'visitor');
    const firstResponse = sorted.find(m => m.sender_type !== 'visitor');
    if (firstVisitor && firstResponse) {
      const diff = (new Date(firstResponse.created_at).getTime() - new Date(firstVisitor.created_at).getTime()) / 60000;
      if (diff >= 0 && diff < 1440) {
        totalResponseTime += diff;
        responseCount++;
      }
    }
  }
  const avgResponseTime = responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 0;

  return { totalConversations, openConversations, resolvedToday, avgResponseTime, aiResolutionRate, satisfactionScore: 0 };
}

function computeDailyConvos(convos: Conversation[]): { date: string; count: number; aiHandled: number }[] {
  const byDate = new Map<string, { count: number; ai: number }>();
  for (const c of convos) {
    const date = c.created_at.slice(0, 10);
    const existing = byDate.get(date) || { count: 0, ai: 0 };
    existing.count++;
    if (c.ai_handled) existing.ai++;
    byDate.set(date, existing);
  }
  return Array.from(byDate.entries())
    .map(([date, data]) => ({ date, count: data.count, aiHandled: data.ai }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function computeResponseTimes(convos: Conversation[], messages: Message[]): { bucket: string; count: number }[] {
  const buckets = new Map<string, number>([
    ['< 1 min', 0], ['1-5 min', 0], ['5-15 min', 0], ['15-60 min', 0], ['1+ hour', 0],
  ]);
  // Simplified — would need per-conversation first-response tracking
  return Array.from(buckets.entries()).map(([bucket, count]) => ({ bucket, count }));
}

function computeChannelBreakdown(convos: Conversation[]): { channel: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of convos) {
    counts.set(c.channel, (counts.get(c.channel) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([channel, count]) => ({ channel: channel.charAt(0).toUpperCase() + channel.slice(1), count }))
    .sort((a, b) => b.count - a.count);
}

function extractTopQuestions(messages: Message[]): { question: string; count: number }[] {
  // Extract first visitor message from each conversation as the "question"
  const questions = new Map<string, number>();
  const seen = new Set<string>();
  for (const m of messages) {
    if (m.sender_type === 'visitor' && !seen.has(m.conversation_id)) {
      seen.add(m.conversation_id);
      const short = m.content.slice(0, 80).trim();
      questions.set(short, (questions.get(short) || 0) + 1);
    }
  }
  return Array.from(questions.entries())
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
