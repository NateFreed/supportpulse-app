import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Support</span>
          <span className="text-foreground">Pulse</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/auth/signup" className="px-5 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-white shadow-sm shadow-accent/20 transition-all hover:-translate-y-0.5">Start Free Trial</Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden py-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/5 blur-[140px] pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted">Flat $29/mo. No per-resolution fees. AI-first.</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Support</span>
            <span className="text-foreground">Pulse</span>
          </h1>
          <p className="text-xl text-muted mb-3">AI customer support that actually works.</p>
          <p className="text-lg text-muted/60 mb-10">Train an AI on your FAQ. Embed it on your site. From <span className="text-foreground font-semibold">$29/mo flat</span>.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/auth/signup" className="px-8 py-3.5 bg-accent hover:bg-accent-light rounded-xl font-semibold text-lg text-white shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5">Start Free Trial</Link>
            <Link href="/auth/login" className="px-8 py-3.5 border border-border hover:border-border-light rounded-xl font-semibold text-lg text-muted hover:text-foreground transition-all hover:-translate-y-0.5">Sign In</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted mb-12">AI-powered support in minutes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'AI Chatbot', desc: 'Trained on your FAQ, answers instantly', icon: '🤖' },
              { title: 'Live Chat', desc: 'Seamless AI-to-human handoff', icon: '💬' },
              { title: 'Knowledge Base', desc: 'Add articles, AI learns automatically', icon: '📚' },
              { title: 'Analytics', desc: 'Resolution rates, response times', icon: '📊' },
            ].map((f) => (
              <div key={f.title} className="glow-card p-6 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted mb-4">Pricing</h2>
          <p className="text-center text-sm text-muted/60 mb-12">Zendesk: $69/agent. Intercom: $39 + fees. <span className="text-accent font-semibold">SupportPulse: $29/mo flat.</span></p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glow-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Free</h3>
              <p className="text-3xl font-bold text-foreground mb-4">$0<span className="text-sm text-muted font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted mb-6"><li>100 conversations/mo</li><li>1 agent</li><li>Basic chatbot</li></ul>
              <Link href="/auth/signup" className="block w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-center text-muted hover:text-foreground transition-all">Get Started</Link>
            </div>
            <div className="glow-card p-6 ring-2 ring-accent/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent rounded-full text-xs font-semibold text-white">Popular</div>
              <h3 className="text-lg font-bold text-foreground mb-1">Pro</h3>
              <p className="text-3xl font-bold text-foreground mb-4">$29<span className="text-sm text-muted font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted mb-6"><li>1,000 conversations</li><li>3 agents</li><li>Custom branding</li><li>Full analytics</li></ul>
              <Link href="/auth/signup" className="block w-full py-2.5 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-center text-white shadow-sm shadow-accent/20 transition-all hover:-translate-y-0.5">Start Free Trial</Link>
            </div>
            <div className="glow-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Business</h3>
              <p className="text-3xl font-bold text-foreground mb-4">$79<span className="text-sm text-muted font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted mb-6"><li>Unlimited</li><li>10 agents</li><li>API access</li><li>Priority support</li></ul>
              <Link href="/auth/signup" className="block w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-center text-muted hover:text-foreground transition-all">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 text-center">
        <span className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">Support</span>
          <span className="text-foreground">Pulse</span>
        </span>
        <p className="text-sm text-muted mt-2">AI customer support for small businesses.</p>
      </footer>
    </main>
  );
}
