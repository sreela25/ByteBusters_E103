import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatInput({ onSend, isLoading, placeholder = "Ask about the website..." }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={cn(
            "w-full resize-none bg-transparent px-5 py-4 pr-16 text-[15px] text-slate-800 placeholder:text-slate-400",
            "focus:outline-none focus:ring-0",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <div className="absolute right-3 bottom-3">
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl transition-all duration-200",
              message.trim() && !isLoading
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25"
                : "bg-slate-100 text-slate-400"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </form>
  );
}