export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  widget_color: string;
  widget_greeting: string;
  plan: 'free' | 'pro' | 'business';
  created_at: string;
}

export interface Conversation {
  id: string;
  workspace_id: string;
  visitor_name: string;
  visitor_email: string;
  status: 'open' | 'assigned' | 'resolved' | 'closed';
  assigned_to: string | null;  // agent name
  channel: 'widget' | 'email';
  ai_handled: boolean;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'visitor' | 'agent' | 'ai';
  sender_name: string;
  content: string;
  ai_confidence: number | null;  // 0-100 for AI responses
  created_at: string;
}

export interface KnowledgeArticle {
  id: string;
  workspace_id: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  workspace_id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  is_active: boolean;
  created_at: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface SupportStats {
  totalConversations: number;
  openConversations: number;
  resolvedToday: number;
  avgResponseTime: number;    // minutes
  aiResolutionRate: number;   // percentage
  satisfactionScore: number;  // 1-5
}
