import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UrlInputCard({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (value) => {
    try {
      const urlObj = new URL(value.startsWith('http') ? value : `https://${value}`);
      return urlObj.href;
    } catch {
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const validUrl = validateUrl(url);
    if (!validUrl) {
      setError('Please enter a valid URL');
      return;
    }
    
    onSubmit(validUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 mb-5">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter Website URL</h2>
          <p className="text-slate-500 text-[15px]">
            Paste any website URL and I'll help you navigate and find information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
            <Input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://example.com"
              disabled={isLoading}
              className={cn(
                "h-14 pl-12 pr-4 text-[15px] rounded-xl border-slate-200 bg-slate-50/50",
                "focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100",
                "placeholder:text-slate-400",
                error && "border-red-300 focus:border-red-300 focus:ring-red-100"
              )}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!url.trim() || isLoading}
            className={cn(
              "w-full h-14 rounded-xl text-[15px] font-semibold transition-all duration-300",
              "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
              "shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Website...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Start Navigation
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Suggestions */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-3">Try these examples</p>
          <div className="flex flex-wrap gap-2">
            {['github.com', 'stripe.com', 'notion.so'].map((example) => (
              <button
                key={example}
                onClick={() => setUrl(`https://${example}`)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}