'use client';

import Tutorial from './Tutorial';

const STEPS = [
  {
    title: 'Build Your Knowledge Base',
    description: 'Add FAQ articles and documentation. The AI learns from your content to answer customer questions accurately.',
  },
  {
    title: 'Deploy the Chatbot',
    description: 'Grab the embed code and drop it on your website. Your AI support agent goes live in seconds.',
  },
  {
    title: 'Handle Conversations',
    description: 'Monitor your inbox as conversations come in. The AI handles routine questions — you step in when it needs a human touch.',
  },
  {
    title: 'Review Performance',
    description: 'Track resolution rates, response times, and chatbot effectiveness. See where the AI shines and where to improve.',
  },
];

export default function AppTutorial() {
  return (
    <Tutorial
      appName="SupportPulse"
      steps={STEPS}
      accentColor="bg-accent"
    />
  );
}
