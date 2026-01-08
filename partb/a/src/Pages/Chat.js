import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MessageBubble from '../Components/chat/MessageBubble.js';
import ChatInput from '../Components/chat/ChatInput.js';
import TypingIndicator from '../Components/chat/TypingIndicator.js';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  ExternalLink, 
  Trash2, 
  ArrowLeft,
  Loader2,
  Compass,
  RefreshCw
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';

export default function Chat() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Get conversation ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get('id');

  // Redirect if no ID
  useEffect(() => {
    if (!conversationId) {
      navigate(createPageUrl('Home'));
    }
  }, [conversationId, navigate]);

  // Fetch conversation
  const { data: conversation, isLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const conversations = await base44.entities.Conversation.filter({ id: conversationId });
      return conversations[0];
    },
    enabled: !!conversationId,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isTyping]);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content) => {
      setIsTyping(true);
      
      // Add user message
      const updatedMessages = [
        ...(conversation.messages || []),
        {
          role: 'user',
          content,
          timestamp: new Date().toISOString()
        }
      ];

      // Update conversation with user message first
      await base44.entities.Conversation.update(conversationId, {
        messages: updatedMessages
      });

      // Get AI response
      const websiteContext = conversation.website_content || '';
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful website navigation assistant. You're helping a user navigate and find information on this website: ${conversation.website_url}

Website context and structure:
${websiteContext}

Previous conversation:
${updatedMessages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}

User's question: ${content}

Provide clear, helpful guidance. If asking about navigation, give specific step-by-step instructions. If they ask in a different language, respond in that language. Be friendly and helpful. Use markdown formatting for better readability.`,
        add_context_from_internet: true
      });

      // Add assistant response
      const finalMessages = [
        ...updatedMessages,
        {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        }
      ];

      // Update conversation
      await base44.entities.Conversation.update(conversationId, {
        messages: finalMessages
      });

      return finalMessages;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversation', conversationId]);
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    }
  });

  // Delete conversation mutation
  const deleteConversation = useMutation({
    mutationFn: () => base44.entities.Conversation.delete(conversationId),
    onSuccess: () => {
      navigate(createPageUrl('Home'));
    }
  });

  // Refresh website analysis
  const refreshAnalysis = useMutation({
    mutationFn: async () => {
      setIsTyping(true);
      const websiteData = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this website URL and extract key navigation structure, main sections, and important information: ${conversation.website_url}`,
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

      const newMessage = {
        role: 'assistant',
        content: `I've refreshed my analysis of **${websiteData.title || conversation.website_url}**!\n\n**Main Sections:**\n${websiteData.main_sections?.map(s => `- ${s}`).join('\n') || 'No sections detected'}\n\n**Navigation:**\n${websiteData.navigation_items?.map(n => `- ${n}`).join('\n') || 'No navigation items detected'}\n\nWhat would you like to know about this website?`,
        timestamp: new Date().toISOString()
      };

      await base44.entities.Conversation.update(conversationId, {
        website_content: JSON.stringify(websiteData),
        messages: [...(conversation.messages || []), newMessage]
      });

      setIsTyping(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversation', conversationId]);
    },
    onError: () => {
      setIsTyping(false);
    }
  });

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <Compass className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Conversation not found</h2>
        <p className="text-slate-500 mb-6">This conversation may have been deleted.</p>
        <Button onClick={() => navigate(createPageUrl('Home'))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl('Home'))}
                className="flex-shrink-0 lg:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              
              <div className="min-w-0">
                <h1 className="font-semibold text-slate-900 truncate">
                  {conversation.title || 'Website Analysis'}
                </h1>
                <a 
                  href={conversation.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 truncate"
                >
                  {conversation.website_url}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshAnalysis.mutate()}
                disabled={refreshAnalysis.isPending || isTyping}
                className="hidden sm:flex"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshAnalysis.isPending ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this conversation and all its messages. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteConversation.mutate()}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {conversation.messages?.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-200/80 bg-gradient-to-t from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput 
            onSend={(msg) => sendMessage.mutate(msg)}
            isLoading={sendMessage.isPending || isTyping}
            placeholder={`Ask about ${conversation.title || 'this website'}...`}
          />
        </div>
      </div>
    </div>
  );
}