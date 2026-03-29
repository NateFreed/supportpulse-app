'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [notifications, setNotifications] = useState({
    newTicket: true,
    escalation: true,
    aiHandoff: true,
    dailySummary: false,
  });
  const [aiSettings, setAiSettings] = useState({
    autoReply: true,
    confidenceThreshold: 80,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  }

  const inputClass = "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Business info */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Business</h2>
        <div className="glow-card p-5 space-y-3">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Business Name</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">Support Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="support@company.com" className={inputClass} />
          </div>
        </div>
      </section>

      {/* AI Settings */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">AI Assistant</h2>
        <div className="glow-card p-5 space-y-4">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <span className="text-sm text-foreground">Auto-reply to common questions</span>
              <p className="text-xs text-muted">AI responds instantly when confidence is above threshold</p>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${aiSettings.autoReply ? 'bg-accent' : 'bg-border-light'}`}
              onClick={() => setAiSettings((prev) => ({ ...prev, autoReply: !prev.autoReply }))}>
              <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${aiSettings.autoReply ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
          <div>
            <label className="text-xs text-muted mb-1.5 block">Confidence threshold: {aiSettings.confidenceThreshold}%</label>
            <input type="range" min={50} max={100} value={aiSettings.confidenceThreshold}
              onChange={(e) => setAiSettings((prev) => ({ ...prev, confidenceThreshold: Number(e.target.value) }))}
              className="w-full accent-accent" />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>More AI replies (50%)</span>
              <span>Fewer, safer replies (100%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Notifications</h2>
        <div className="glow-card p-5 space-y-3">
          {[
            { key: 'newTicket' as const, label: 'New tickets', desc: 'Email when a new support ticket arrives' },
            { key: 'escalation' as const, label: 'Escalations', desc: 'Alert when a ticket is escalated to human' },
            { key: 'aiHandoff' as const, label: 'AI handoff alerts', desc: 'When AI cannot resolve and needs human review' },
            { key: 'dailySummary' as const, label: 'Daily summary', desc: 'Overview of tickets resolved and pending' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="text-sm text-foreground">{item.label}</span>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${notifications[item.key] ? 'bg-accent' : 'bg-border-light'}`}
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}>
                <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Plan */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Subscription</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'free' as const, name: 'Free', price: '$0', features: '50 tickets/mo, basic inbox' },
            { id: 'pro' as const, name: 'Pro', price: '$29/mo', features: 'Unlimited tickets, AI auto-reply, knowledge base, analytics' },
          ].map((tier) => (
            <button key={tier.id} onClick={() => setPlan(tier.id)}
              className={`glow-card p-4 text-left transition-all ${plan === tier.id ? '!border-accent' : ''}`}>
              <h3 className="text-sm font-semibold text-foreground">{tier.name}</h3>
              <p className="text-lg font-bold text-accent mt-1">{tier.price}</p>
              <p className="text-xs text-muted mt-2">{tier.features}</p>
              {plan === tier.id && <span className="text-[10px] text-accent font-medium mt-2 block">Current plan</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-danger">Danger Zone</h2>
        <div className="glow-card p-5 !border-danger/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Delete account</h3>
              <p className="text-xs text-muted">Permanently remove all tickets, knowledge base, and data</p>
            </div>
            <button className="px-4 py-2 bg-danger/15 text-danger rounded-xl text-xs font-medium hover:bg-danger/25 transition-colors">Delete</button>
          </div>
        </div>
      </section>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-50 rounded-xl font-semibold text-white shadow-lg shadow-accent/25 transition-all">
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
