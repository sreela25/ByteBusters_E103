import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import UrlInputCard from '../Components/url/UrlInputCard';
import ConversationCard from '../Components/conversations/ConversationCard';
import { Compass, Sparkles, Shield, Globe, Zap, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-updated_date', 3),
  });

  const handleUrlSubmit = async (url) => {
    setIsLoading(true);
    try {
      // Fetch website content
      const websiteData = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this website URL and extract key navigation structure, main sections, and important information: ${url}`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            main_sections: { type: "array", items: { type: "string" } },
            navigation_items: { type: "array", items: { type: "string" } },
            key_features: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Create conversation
      const conversation = await base44.entities.Conversation.create({
        title: websiteData.title || new URL(url).hostname,
        website_url: url,
        website_content: JSON.stringify(websiteData),
        messages: [{
          role: 'assistant',
          content: `I've analyzed **${websiteData.title || url}**! Here's what I found:\n\n**Main Sections:**\n${websiteData.main_sections?.map(s => `- ${s}`).join('\n') || 'No sections detected'}\n\n**Navigation:**\n${websiteData.navigation_items?.map(n => `- ${n}`).join('\n') || 'No navigation items detected'}\n\nHow can I help you navigate this website? You can ask me things like:\n- "Where can I find pricing information?"\n- "How do I create an account?"\n- "What features does this website offer?"`,
          timestamp: new Date().toISOString()
        }],
        status: 'active'
      });

      navigate(createPageUrl(`Chat?id=${conversation.id}`));
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Globe,
      title: 'Analyze Any Website',
      description: 'Simply paste a URL and get instant insights about the site structure'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Guidance',
      description: 'Get step-by-step navigation instructions tailored to your questions'
    },
    {
      icon: Zap,
      title: 'Instant Answers',
      description: 'Find information quickly without browsing through multiple pages'
    },
    {
      icon: Shield,
      title: 'Multi-Language Support',
      description: 'Ask questions in any language and get responses in your language'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Website Navigation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Navigate Any Website
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
                With AI Assistance
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop struggling with unfamiliar websites. Our AI understands site structure and guides you to exactly what you need.
            </p>
          </div>

          {/* URL Input */}
          <UrlInputCard onSubmit={handleUrlSubmit} isLoading={isLoading} />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center mb-4 group-hover:from-indigo-100 group-hover:to-indigo-200 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Conversations */}
      {conversations && conversations.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Conversations</h2>
            <a 
              href={createPageUrl('Conversations')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversationsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              conversations.map((conv) => (
                <ConversationCard key={conv.id} conversation={conv} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}