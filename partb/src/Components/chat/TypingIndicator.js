import React from 'react';
import { Compass } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
        <Compass className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}