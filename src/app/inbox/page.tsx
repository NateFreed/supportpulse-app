'use client';

import { useState } from 'react';
import ConversationList from '@/components/ConversationList';
import ChatView from '@/components/ChatView';
import type { Conversation, ConversationWithMessages, Message } from '@/lib/types';

// Mock data
const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', workspace_id: 'w1', visitor_name: 'Sarah Johnson', visitor_email: 'sarah@example.com', status: 'open', assigned_to: null, channel: 'widget', ai_handled: false, last_message_at: '2026-03-28T14:30:00Z', created_at: '2026-03-28T14:00:00Z' },
  { id: '2', workspace_id: 'w1', visitor_name: 'Mike Chen', visitor_email: 'mike@techstart.com', status: 'open', assigned_to: null, channel: 'widget', ai_handled: true, last_message_at: '2026-03-28T13:45:00Z', created_at: '2026-03-28T13:00:00Z' },
  { id: '3', workspace_id: 'w1', visitor_name: 'Lisa Park', visitor_email: 'lisa@design.co', status: 'resolved', assigned_to: 'Agent', channel: 'email', ai_handled: false, last_message_at: '2026-03-28T10:00:00Z', created_at: '2026-03-27T16:00:00Z' },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', conversation_id: '1', sender_type: 'visitor', sender_name: 'Sarah Johnson', content: 'Hi, I placed an order yesterday but haven\'t received a confirmation email. Order #4521.', ai_confidence: null, created_at: '2026-03-28T14:00:00Z' },
    { id: 'm2', conversation_id: '1', sender_type: 'ai', sender_name: 'AI Assistant', content: 'Hi Sarah! I can help with that. Let me look up order #4521 for you. It looks like the confirmation email was sent to sarah@example.com at 3:15 PM yesterday. Could you check your spam folder?', ai_confidence: 82, created_at: '2026-03-28T14:01:00Z' },
    { id: 'm3', conversation_id: '1', sender_type: 'visitor', sender_name: 'Sarah Johnson', content: 'Found it in spam, thanks! But I also wanted to change the shipping address. Is that still possible?', ai_confidence: null, created_at: '2026-03-28T14:30:00Z' },
  ],
  '2': [
    { id: 'm4', conversation_id: '2', sender_type: 'visitor', sender_name: 'Mike Chen', content: 'What are your pricing plans for teams?', ai_confidence: null, created_at: '2026-03-28T13:00:00Z' },
    { id: 'm5', conversation_id: '2', sender_type: 'ai', sender_name: 'AI Assistant', content: 'Great question, Mike! We offer three plans:\n\n• Free: Up to 100 conversations/month\n• Pro ($29/mo): Unlimited conversations, AI responses, analytics\n• Business ($79/mo): Everything in Pro + team access, custom branding, priority support\n\nWould you like me to help you choose the right plan?', ai_confidence: 95, created_at: '2026-03-28T13:01:00Z' },
    { id: 'm6', conversation_id: '2', sender_type: 'visitor', sender_name: 'Mike Chen', content: 'The Pro plan sounds good. How do I upgrade?', ai_confidence: null, created_at: '2026-03-28T13:45:00Z' },
  ],
};

export default function InboxPage() {
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>('1');
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const activeConversation: ConversationWithMessages | null = activeConvId
    ? { ...conversations.find((c) => c.id === activeConvId)!, messages: MOCK_MESSAGES[activeConvId] ?? [] }
    : null;

  function handleSendMessage(content: string) {
    // TODO: Save to Supabase, trigger AI response
    console.log('Send:', content);
  }

  function handleResolve() {
    // TODO: Update conversation status in Supabase
    console.log('Resolve conversation');
  }

  function handleAIReply() {
    // TODO: Call AI support engine
    console.log('Generate AI reply');
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <ConversationList
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        filter={filter}
        onFilterChange={setFilter}
      />

      {activeConversation ? (
        <ChatView
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          onResolve={handleResolve}
          onAIReply={handleAIReply}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted">
          Select a conversation to view
        </div>
      )}
    </div>
  );
}
