'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Globe,
} from 'lucide-react';
import {
  AITutorContext,
  ChatMessage,
  generateSocraticTutorReply,
} from '@/lib/ai-tutor-engine';

interface AITutorWidgetProps {
  context: AITutorContext;
}

export const AITutorWidget: React.FC<AITutorWidgetProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [hasError, setHasError] = useState(false);

  // Initialize messages with topic context greeting
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const greetingText =
      context.language === 'hi'
        ? `नमस्ते! मैं आपका पर्सनल AI ट्यूटर हूँ **${context.topicTitle}** के लिए।\n\nआप मुझसे इस टॉपिक या **${context.currentLessonTitle}** के बारे में कोई भी सवाल पूछ सकते हैं!`
        : context.language === 'hinglish'
        ? `Hello! Main aapka personal AI Tutor hoon **${context.topicTitle}** ke liye.\n\nAap mujhse is topic ya **${context.currentLessonTitle}** se related koi bhi doubt ya question puch sakte hain!`
        : `Hello! I am your personal AI Tutor for **${context.topicTitle}**.\n\nAsk me any question, request a simpler explanation, or ask for a practical scenario for **${context.currentLessonTitle}**!`;

    setMessages([
      {
        id: '1',
        sender: 'tutor',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [context.topicTitle, context.currentLessonTitle, context.language]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setHasError(false);
    const studentMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, studentMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInputText('');

    // Execute Socratic Response Engine with full topic context
    setTimeout(() => {
      try {
        const tutorReplyText = generateSocraticTutorReply(query, context, updatedHistory);
        const tutorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: tutorReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, tutorMsg]);
      } catch {
        setHasError(true);
      }
    }, 400);
  };

  const handleRetry = () => {
    setHasError(false);
    if (messages.length > 0) {
      const lastStudentMsg = [...messages].reverse().find((m) => m.sender === 'student');
      if (lastStudentMsg) {
        handleSendMessage(lastStudentMsg.text);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col h-[560px]">
      {/* WIDGET HEADER WITH CONTEXT LABELS */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-4 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Bot className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                <span>🤖 AI TUTOR</span>
                <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                  Topic Locked
                </span>
              </h3>
            </div>

            {/* CONTEXTUAL TOPIC & LESSON LABEL */}
            <p className="text-[10px] text-cyan-300 font-bold mt-0.5 truncate max-w-[200px]">
              Currently learning: <span className="text-slate-100">{context.topicTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded-md flex items-center gap-1">
            <Globe className="h-2.5 w-2.5 text-cyan-400" />
            <span>{context.language.toUpperCase()}</span>
          </span>
          <button className="text-slate-400 hover:text-cyan-400 transition-colors">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {/* QUICK-ACTION PROMPT CHIPS TAILORED TO TOPIC */}
          <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => handleSendMessage('Explain this concept in simpler words')}
              className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-cyan-900/80 transition-colors"
            >
              <BookOpen className="h-3 w-3" />
              <span>Explain Simply</span>
            </button>
            <button
              onClick={() => handleSendMessage('Give me a practical example for this topic')}
              className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-emerald-900/80 transition-colors"
            >
              <Lightbulb className="h-3 w-3" />
              <span>Practical Example</span>
            </button>
            <button
              onClick={() => handleSendMessage('Where is this used in real life?')}
              className="flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-purple-900/80 transition-colors"
            >
              <HelpCircle className="h-3 w-3" />
              <span>Real-World Use</span>
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'student' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'student'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950'
                  }`}
                >
                  {msg.sender === 'student' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'student'
                      ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.text}
                  <span className="block text-[9px] text-slate-500 text-right mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* ERROR CARD IF API FAILS */}
            {hasError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center justify-between gap-2">
                <span>Sorry, I couldn't answer that right now. Please try again.</span>
                <button
                  onClick={handleRetry}
                  className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-100 font-bold rounded-lg flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Retry</span>
                </button>
              </div>
            )}
          </div>

          {/* USER INPUT FOOTER */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask about ${context.topicTitle}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="h-9 w-9 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
