import React from 'react';
import { base44 } from '../api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ConversationCard from '../Components/conversations/ConversationCard';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Plus, MessageSquare, Inbox } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function Conversations() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-updated_date'),
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Conversations</h1>
            <p className="text-slate-500 mt-1">Your website analysis history</p>
          </div>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25">
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Conversations List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations && conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <ConversationCard key={conv.id} conversation={conv} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No conversations yet</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Start analyzing websites and your conversation history will appear here.
            </p>
            <Link to={createPageUrl('Home')}>
              <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Analyze a Website
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}