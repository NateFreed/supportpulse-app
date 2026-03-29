'use client';

import type { Conversation } from '@/lib/types';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  filter: 'all' | 'open' | 'resolved';
  onFilterChange: (filter: 'all' | 'open' | 'resolved') => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const STATUS_DOT: Record<string, string> = {
  open: 'bg-amber-400',
  assigned: 'bg-blue-400',
  resolved: 'bg-emerald-400',
  closed: 'bg-gray-500',
};

export default function ConversationList({ conversations, activeId, onSelect, filter, onFilterChange }: ConversationListProps) {
  const filtered = filter === 'all' ? conversations : conversations.filter((c) =>
    filter === 'open' ? (c.status === 'open' || c.status === 'assigned') : c.status === 'resolved'
  );

  return (
    <div className="w-80 h-full flex flex-col border-r border-border bg-background">
      {/* Filter tabs */}
      <div className="p-3 border-b border-border">
        <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border">
          {(['all', 'open', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-4 py-3 border-b border-border/50 transition-colors ${
              activeId === conv.id ? 'bg-surface' : 'hover:bg-surface/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${STATUS_DOT[conv.status]}`} />
                <span className="text-sm font-medium text-foreground truncate max-w-[150px]">
                  {conv.visitor_name || 'Anonymous'}
                </span>
              </div>
              <span className="text-[10px] text-muted">{timeAgo(conv.last_message_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              {conv.ai_handled && (
                <span className="text-[10px] text-accent font-medium">✨ AI</span>
              )}
              <span className="text-xs text-muted truncate">{conv.visitor_email}</span>
            </div>
            {conv.channel === 'email' && (
              <span className="text-[10px] text-muted/50">via email</span>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-muted">
            No conversations
          </div>
        )}
      </div>

      {/* Count */}
      <div className="px-4 py-2 border-t border-border text-xs text-muted">
        {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
