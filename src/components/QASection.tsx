import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Loader2, ExternalLink } from 'lucide-react';
import { FormattedText, parseCitationsFromResponse, Citation } from '@/lib/formatScientificText';

interface QASectionProps {
  resultsData: Record<string, unknown>;
}

interface QAMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export function QASection({ resultsData }: QASectionProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://tejanaidu6.app.n8n.cloud/webhook/Q&A_overcome_limitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          context: resultsData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Parse the response - handle different response formats
      let answerText = '';
      if (typeof data === 'string') {
        answerText = data;
      } else if (Array.isArray(data) && data.length > 0) {
        answerText = data[0]?.answer || data[0]?.response || data[0]?.message || JSON.stringify(data[0]);
      } else if (data.answer) {
        answerText = data.answer;
      } else if (data.response) {
        answerText = data.response;
      } else if (data.message) {
        answerText = data.message;
      } else {
        answerText = JSON.stringify(data, null, 2);
      }

      // Parse citations from response
      const { cleanText, citations } = parseCitationsFromResponse(answerText);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanText,
        citations 
      }]);
    } catch (error) {
      console.error('Q&A Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your question. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (message: QAMessage) => {
    const lines = message.content.split('\n');
    
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          if (!line.trim()) return <br key={idx} />;
          
          // Check if line starts with number (numbered list)
          const numberedMatch = line.match(/^(\d+)\.\s*(.*)/);
          if (numberedMatch) {
            return (
              <div key={idx} className="flex gap-2">
                <span className="text-primary font-semibold min-w-[20px]">{numberedMatch[1]}.</span>
                <span><FormattedText content={numberedMatch[2]} /></span>
              </div>
            );
          }
          
          // Check for bullet points
          if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
            return (
              <div key={idx} className="flex gap-2 pl-2">
                <span className="text-primary">•</span>
                <span><FormattedText content={line.replace(/^[\s*-]+/, '')} /></span>
              </div>
            );
          }
          
          return <p key={idx}><FormattedText content={line} /></p>;
        })}
        
        {/* Citations Section */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">References:</p>
            <div className="space-y-1">
              {message.citations.map((citation) => (
                <a
                  key={citation.number}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-[10px] font-medium">
                    {citation.number}
                  </span>
                  <span className="truncate flex-1">{citation.title || citation.url}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="result-card mt-6"
    >
      <div className="section-title">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span>Ask a Question</span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Have questions about the analysis? Ask anything about the recommended materials or technical details.
      </p>

      {/* Messages */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mb-4 max-h-96 overflow-y-auto"
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary/5 border border-primary/20 ml-8'
                    : 'bg-muted/50 border border-border mr-4'
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {msg.role === 'user' ? 'Your Question' : 'AI Response'}
                </p>
                <div className="text-sm text-foreground">
                  {msg.role === 'user' ? msg.content : renderMessageContent(msg)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-4"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing your question...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 px-4 py-3 rounded-lg bg-input border border-border text-foreground 
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                     focus:ring-primary/20 focus:border-primary/50 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </motion.div>
  );
}
