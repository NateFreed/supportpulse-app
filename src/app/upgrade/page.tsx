'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  async function handleSubscribe() {
    setLoading(true);
    try {
      const user = await getUser();
      if (!user?.email) { window.location.href = '/auth/login'; return; }
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', { body: { plan_id: 'supportpulse_pro', user_email: user.email } });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch { alert('Unable to start checkout.'); } finally { setLoading(false); }
  }
  return (
    <div className="max-w-lg mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-2">Upgrade to SupportPulse Pro</h1>
      <p className="text-muted mb-6">AI customer support</p>
      <div className="glow-card p-6 mb-6">
        <div className="mb-4"><span className="text-4xl font-bold">$29</span><span className="text-muted">/mo</span></div>
        <ul className="space-y-2 mb-6 text-left">
          1000 conversations/mo\n          AI chatbot\n          Custom branding\n          Knowledge base\n          Team inbox
        </ul>
        <button onClick={handleSubscribe} disabled={loading}
          className="w-full py-3 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold shadow-lg shadow-accent/25 transition-all disabled:opacity-50">
          {loading ? 'Loading...' : 'Subscribe Now'}
        </button>
      </div>
      <p className="text-xs text-muted">Secure payment via Stripe. Cancel anytime.</p>
    </div>
  );
}
