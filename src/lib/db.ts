import { supabase } from './supabase';
import type { Workspace, Conversation, Message, KnowledgeArticle } from './types';

// Workspace
export async function getWorkspace(userId: string): Promise<Workspace | null> {
  const { data, error } = await supabase.from('sp_workspaces').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createWorkspace(userId: string, name: string): Promise<Workspace> {
  const { data, error } = await supabase
    .from('sp_workspaces')
    .insert({ user_id: userId, name, widget_color: '#14b8a6', widget_greeting: 'Hi! How can we help?', plan: 'free' })
    .select().single();
  if (error) throw error;
  return data;
}

// Conversations
export async function getConversations(workspaceId: string, status?: string): Promise<Conversation[]> {
  let query = supabase.from('sp_conversations').select('*').eq('workspace_id', workspaceId).order('last_message_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const { data, error } = await supabase.from('sp_conversations').select('*').eq('id', conversationId).single();
  if (error) return null;
  return data;
}

export async function updateConversationStatus(conversationId: string, status: Conversation['status']): Promise<void> {
  await supabase.from('sp_conversations').update({ status }).eq('id', conversationId);
}

// Messages
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase.from('sp_messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(conversationId: string, senderType: Message['sender_type'], senderName: string, content: string): Promise<Message> {
  const { data, error } = await supabase
    .from('sp_messages')
    .insert({ conversation_id: conversationId, sender_type: senderType, sender_name: senderName, content })
    .select().single();
  if (error) throw error;
  await supabase.from('sp_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId);
  return data;
}

// Knowledge Base
export async function getArticles(workspaceId: string): Promise<KnowledgeArticle[]> {
  const { data, error } = await supabase.from('sp_knowledge_articles').select('*').eq('workspace_id', workspaceId).order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createArticle(workspaceId: string, title: string, content: string, category = 'General'): Promise<KnowledgeArticle> {
  const { data, error } = await supabase
    .from('sp_knowledge_articles')
    .insert({ workspace_id: workspaceId, title, content, category, is_published: true })
    .select().single();
  if (error) throw error;
  return data;
}

export async function updateArticle(articleId: string, updates: Partial<KnowledgeArticle>): Promise<void> {
  await supabase.from('sp_knowledge_articles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', articleId);
}

export async function deleteArticle(articleId: string): Promise<void> {
  await supabase.from('sp_knowledge_articles').delete().eq('id', articleId);
}

// Stats
export async function getSupportStats(workspaceId: string): Promise<{
  totalConversations: number;
  openConversations: number;
  resolvedToday: number;
  aiResolutionRate: number;
}> {
  const { data: all } = await supabase.from('sp_conversations').select('status, ai_handled, created_at').eq('workspace_id', workspaceId);
  const convos = all ?? [];
  const today = new Date().toISOString().split('T')[0];
  const total = convos.length;
  const open = convos.filter(c => c.status === 'open' || c.status === 'assigned').length;
  const resolvedToday = convos.filter(c => (c.status === 'resolved' || c.status === 'closed') && c.created_at?.startsWith(today)).length;
  const aiHandled = convos.filter(c => c.ai_handled).length;
  const aiRate = total > 0 ? Math.round((aiHandled / total) * 100) : 0;
  return { totalConversations: total, openConversations: open, resolvedToday, aiResolutionRate: aiRate };
}
