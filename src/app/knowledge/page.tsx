'use client';

import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
}

const MOCK_ARTICLES: Article[] = [
  { id: '1', title: 'How to reset your password', content: 'Go to Settings > Security > Reset Password. Enter your current password and choose a new one.', category: 'Account', is_published: true },
  { id: '2', title: 'Pricing and billing FAQ', content: 'We offer three plans: Free, Pro ($29/mo), and Business ($79/mo). All plans include a 14-day free trial.', category: 'Billing', is_published: true },
  { id: '3', title: 'Getting started guide', content: 'Welcome! Follow these steps to set up your workspace: 1. Create your account, 2. Add your team, 3. Install the chat widget.', category: 'Getting Started', is_published: true },
];

const CATEGORIES = ['All', 'Getting Started', 'Account', 'Billing', 'Features', 'Troubleshooting'];

export default function KnowledgePage() {
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Getting Started');

  const filtered = activeCategory === 'All' ? articles : articles.filter((a) => a.category === activeCategory);
  const editing = editingId ? articles.find((a) => a.id === editingId) : null;

  function handleCreate() {
    if (!newTitle.trim()) return;
    setArticles((prev) => [...prev, {
      id: Math.random().toString(36).substring(2, 8),
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      is_published: true,
    }]);
    setNewTitle('');
    setNewContent('');
    setShowNew(false);
  }

  function handleDelete(id: string) {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-sm text-muted mt-1">Train your AI with answers to common questions</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-white shadow-sm shadow-accent/10 transition-all"
        >
          {showNew ? 'Cancel' : '+ New Article'}
        </button>
      </div>

      {/* New article form */}
      {showNew && (
        <div className="glow-card p-5 space-y-3">
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Article title" className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
          <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4}
            placeholder="Write the answer... The AI will use this to respond to similar questions."
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-none" />
          <div className="flex gap-3 items-center">
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={handleCreate} className="px-4 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-medium text-white transition-colors">
              Save Article
            </button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeCategory === cat ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-foreground'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Article info banner */}
      <div className="glow-card p-4 flex items-center gap-3 border-accent/20">
        <span className="text-accent">✨</span>
        <p className="text-xs text-muted">
          Articles you add here train the AI to respond automatically. The more articles, the better the AI gets at handling conversations without human intervention.
        </p>
      </div>

      {/* Article list */}
      <div className="space-y-2">
        {filtered.map((article) => (
          <div key={article.id} className="glow-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{article.title}</h3>
                <span className="text-[10px] text-muted bg-surface border border-border rounded-full px-2 py-0.5">{article.category}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditingId(editingId === article.id ? null : article.id)}
                  className="text-xs text-muted hover:text-accent transition-colors px-2 py-1">Edit</button>
                <button onClick={() => handleDelete(article.id)}
                  className="text-xs text-muted hover:text-red-400 transition-colors px-2 py-1">Delete</button>
              </div>
            </div>
            <p className="text-xs text-muted/80 line-clamp-2">{article.content}</p>

            {editingId === article.id && (
              <textarea
                value={article.content}
                onChange={(e) => setArticles((prev) => prev.map((a) => a.id === article.id ? { ...a, content: e.target.value } : a))}
                rows={4}
                className="w-full mt-3 px-3 py-2 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              />
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted mb-2">No articles in this category.</p>
          <p className="text-xs text-muted/60">Add articles to train your AI assistant.</p>
        </div>
      )}
    </div>
  );
}
