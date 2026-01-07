import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Globe, ChevronRight, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ConversationCard({ conversation }) {
  const messageCount = conversation.messages?.length || 0;
  const lastMessage = conversation.messages?.[conversation.messages.length - 1];

  return (
    <Link to={createPageUrl(`Chat?id=${conversation.id}`)}>
      <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 p-5 cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center group-hover:from-indigo-100 group-hover:to-indigo-200 transition-colors">
            <Globe className="w-6 h-6 text-indigo-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {conversation.title || 'Untitled Conversation'}
                </h3>
                <p className="text-sm text-slate-500 truncate mt-0.5">
                  {conversation.website_url}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>

            {/* Last Message Preview */}
            {lastMessage && (
              <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {lastMessage.content}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MessageSquare className="w-3.5 h-3.5" />
                {messageCount} messages
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(conversation.updated_date || conversation.created_date), 'MMM d, h:mm a')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}