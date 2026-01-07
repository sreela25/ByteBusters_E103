import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Compass, User, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex gap-4 group",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md",
        isUser 
          ? "bg-gradient-to-br from-slate-700 to-slate-800" 
          : "bg-gradient-to-br from-indigo-500 to-indigo-600"
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Compass className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[85%] relative",
        isUser ? "flex justify-end" : ""
      )}>
        <div className={cn(
          "rounded-2xl px-5 py-4 shadow-sm",
          isUser 
            ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-tr-md" 
            : "bg-white border border-slate-200/80 rounded-tl-md"
        )}>
          {isUser ? (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-[15px] leading-relaxed text-slate-700 mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="space-y-2 my-3 ml-1">{children}</ul>,
                  ol: ({ children }) => <ol className="space-y-2 my-3 ml-1 list-decimal list-inside">{children}</ol>,
                  li: ({ children }) => <li className="text-[15px] text-slate-700 leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
                      {children}
                    </a>
                  ),
                  code: ({ inline, children }) => 
                    inline ? (
                      <code className="px-1.5 py-0.5 bg-slate-100 rounded text-sm font-mono text-indigo-600">{children}</code>
                    ) : (
                      <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto my-3">
                        <code className="text-sm font-mono">{children}</code>
                      </pre>
                    ),
                  h1: ({ children }) => <h1 className="text-lg font-bold text-slate-900 mt-4 mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold text-slate-900 mt-4 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold text-slate-900 mt-3 mb-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-indigo-400 pl-4 py-1 my-3 bg-indigo-50/50 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy Button for Assistant Messages */}
        {!isUser && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-slate-600"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <p className={cn(
            "text-xs text-slate-400 mt-2",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}