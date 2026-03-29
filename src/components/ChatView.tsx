'use client';

import { useState } from 'react';
import type { ConversationWithMessages, Message } from '@/lib/types';

interface ChatViewProps {
  conversation: ConversationWithMessages;
  onSendMessage: (content: string) => void;
  onResolve: () => void;
  onAIReply: () => void;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const SENDER_STYLES: Record<string, { align: string; bubble: string; name: string }> = {
  visitor: {
    align: 'items-start',
    bubble: 'bg-surface border border-border rounded-2xl rounded-tl-md',
    name: 'text-foreground',
  },
  agent: {
    align: 'items-end',
    bubble: 'bg-accent/15 border border-accent/20 rounded-2xl rounded-tr-md',
    name: 'text-accent',
  },
  ai: {
    align: 'items-end',
    bubble: 'bg-accent/10 border border-accent/15 rounded-2xl rounded-tr-md',
    name: 'text-accent',
  },
};

export default function ChatView({ conversation, onSendMessage, onResolve, onAIReply }: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('');

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage('');
  }

  // Group messages by date
  let lastDate = '';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{conversation.visitor_name || 'Anonymous'}</h2>
          <p className="text-xs text-muted">{conversation.visitor_email}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAIReply}
            className="px-3 py-1.5 bg-accent/15 text-accent rounded-lg text-xs font-medium hover:bg-accent/25 transition-colors"
          >
            ✨ AI Reply
          </button>
          {conversation.status !== 'resolved' && (
            <button
              onClick={onResolve}
              className="px-3 py-1.5 bg-success/15 text-success rounded-lg text-xs font-medium hover:bg-success/25 transition-colors"
            >
              ✓ Resolve
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {conversation.messages.map((msg) => {
          const style = SENDER_STYLES[msg.sender_type];
          const msgDate = formatDate(msg.created_at);
          const showDate = msgDate !== lastDate;
          lastDate = msgDate;

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center text-[10px] text-muted/50 py-2">{msgDate}</div>
              )}
              <div className={`flex flex-col ${style.align}`}>
                <div className={`max-w-[75%] px-4 py-2.5 ${style.bubble}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium ${style.name}`}>
                      {msg.sender_type === 'ai' ? '✨ AI Assistant' : msg.sender_name}
                    </span>
                    <span className="text-[10px] text-muted/50">{formatTime(msg.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{msg.content}</p>
                  {msg.ai_confidence !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-12 h-1 bg-border rounded-full">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${msg.ai_confidence}%` }} />
                      </div>
                      <span className="text-[9px] text-muted">{msg.ai_confidence}% confidence</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-5 py-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a reply..."
            className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2.5 bg-accent hover:bg-accent-light disabled:opacity-50 rounded-xl text-sm font-medium text-white transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
