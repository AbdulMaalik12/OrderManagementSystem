import { useState, useRef, useEffect } from 'react';
import aiService from '../services/ai.service';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import {
  HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineRefresh,
  HiOutlineLightBulb, HiOutlineChartBar,
} from 'react-icons/hi';

/* ── Markdown-like renderer (bold, bullets, headings) ─────────────────────── */
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;

    // ### Heading
    if (line.startsWith('### '))
      return <h3 key={i} className="text-sm font-bold text-primary-300 mt-4 mb-1 uppercase tracking-wider">{line.slice(4)}</h3>;
    if (line.startsWith('## '))
      return <h2 key={i} className="text-base font-black text-white mt-5 mb-2" style={{ fontFamily: "'Exo 2',sans-serif" }}>{line.slice(3)}</h2>;
    if (line.startsWith('# '))
      return <h1 key={i} className="text-lg font-black text-white mt-5 mb-2" style={{ fontFamily: "'Exo 2',sans-serif" }}>{line.slice(2)}</h1>;

    // Bullet points
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2);
      return (
        <div key={i} className="flex items-start gap-2 my-1">
          <span className="text-primary-400 mt-0.5 shrink-0">▸</span>
          <span className="text-sm text-dark-100" dangerouslySetInnerHTML={{ __html: boldify(content) }} />
        </div>
      );
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <div key={i} className="flex items-start gap-2 my-1">
          <span className="text-xs font-bold text-primary-400 w-5 shrink-0 mt-0.5">{numMatch[1]}.</span>
          <span className="text-sm text-dark-100" dangerouslySetInnerHTML={{ __html: boldify(numMatch[2]) }} />
        </div>
      );
    }

    // Emoji section headers (lines starting with emoji)
    if (/^[\u{1F300}-\u{1FFFF}]/u.test(line)) {
      return <p key={i} className="text-sm font-semibold text-white mt-4 mb-1" dangerouslySetInnerHTML={{ __html: boldify(line) }} />;
    }

    return <p key={i} className="text-sm text-dark-200 my-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldify(line) }} />;
  });
}

function boldify(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-white">$1</span>')
    .replace(/`(.*?)`/g, '<code class="font-mono text-cyan-400 bg-cyan-500/10 px-1 rounded">$1</code>');
}

/* ── Suggested quick questions ────────────────────────────────────────────── */
const QUICK_QUESTIONS = [
  'Which product is selling the most?',
  'How much revenue have I collected?',
  'What is my order cancellation rate?',
  'Which city has the most orders?',
  'How many orders are still pending?',
  'What is my average order value?',
];

/* ── Chat Message ─────────────────────────────────────────────────────────── */
function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
        isUser
          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
      }`} style={{ boxShadow: isUser ? '0 0 12px rgba(99,102,241,0.2)' : '0 0 12px rgba(6,182,212,0.2)' }}>
        {isUser ? 'YOU' : <HiOutlineSparkles className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'rounded-tr-sm text-sm text-white'
          : 'rounded-tl-sm'
      }`} style={isUser
        ? { background: 'linear-gradient(135deg, rgba(79,70,229,0.4), rgba(99,102,241,0.2))', border: '1px solid rgba(99,102,241,0.3)' }
        : { background: 'rgba(13,17,31,0.8)', border: '1px solid rgba(99,102,241,0.1)' }
      }>
        {isUser
          ? <p className="text-sm text-white">{message.content}</p>
          : <div className="text-sm text-dark-100 leading-relaxed">{renderMarkdown(message.content)}</div>
        }
        <p className="text-[10px] text-dark-500 mt-2">{message.time}</p>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */
export default function InsightsPage() {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your **AI business analyst**. I have access to all your order data and I'm ready to help.\n\nYou can:\n- Click **Generate Summary** for a full business report\n- Ask me any specific question about your orders\n- Use the quick questions below to get started",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const timestamp = () => new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setSummary(null);
    try {
      const res = await aiService.generateSummary();
      if (res.data.success) {
        setSummary(res.data.data.insight);
        toast.success('Summary generated!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleAsk = async (question = input.trim()) => {
    if (!question) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question, time: timestamp() }]);
    setChatLoading(true);
    try {
      const res = await aiService.askQuestion(question);
      if (res.data.success) {
        setMessages((prev) => [...prev, { role: 'ai', content: res.data.data.answer, time: timestamp() }]);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      setMessages((prev) => [...prev, { role: 'ai', content: errMsg, time: timestamp() }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            <HiOutlineSparkles className="w-6 h-6 text-primary-400" style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' }} />
            AI Insights
          </h1>
          <p className="text-sm text-dark-400 mt-0.5">Powered by Google Gemini · Trained on your order data</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 pulse-dot" />
          <span className="text-xs text-primary-300 font-medium">Gemini 1.5 Flash</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Left: Auto Summary ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary card */}
          <div className="gradient-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <HiOutlineChartBar className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>Business Summary</h2>
                  <p className="text-[10px] text-dark-400">Full AI-generated analysis</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleGenerateSummary} disabled={summaryLoading}>
                {summaryLoading ? <Spinner size="sm" /> : <HiOutlineRefresh className="w-3.5 h-3.5 mr-1" />}
                {summaryLoading ? 'Analyzing...' : 'Generate'}
              </Button>
            </div>

            {!summary && !summaryLoading && (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 float"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <HiOutlineLightBulb className="w-6 h-6 text-primary-400" />
                </div>
                <p className="text-sm text-dark-300 mb-1">No summary yet</p>
                <p className="text-xs text-dark-500">Click Generate to get a full AI analysis of your business</p>
              </div>
            )}

            {summaryLoading && (
              <div className="text-center py-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <HiOutlineSparkles className="w-6 h-6 text-primary-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-xs text-primary-400 animate-pulse tracking-widest uppercase">Analyzing your data...</p>
                </div>
              </div>
            )}

            {summary && !summaryLoading && (
              <div className="max-h-96 overflow-y-auto pr-1 space-y-1">
                {renderMarkdown(summary)}
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="gradient-border p-4">
            <p className="text-xs font-bold text-dark-300 uppercase tracking-widest mb-3">Quick Questions</p>
            <div className="space-y-2">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} onClick={() => handleAsk(q)} disabled={chatLoading}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-dark-200 transition-all cursor-pointer disabled:opacity-40"
                  style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)'}>
                  <span className="text-primary-500 mr-1.5">›</span>{q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Chat Interface ───────────────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col gradient-border overflow-hidden" style={{ minHeight: '600px' }}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
            <div className="relative">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(99,102,241,0.2))', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 0 16px rgba(6,182,212,0.2)' }}>
                <HiOutlineSparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success-400 border-2"
                style={{ borderColor: '#050816', boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white" style={{ fontFamily: "'Exo 2',sans-serif" }}>OrderFlow AI</p>
              <p className="text-[10px] text-success-400">● Online · Ready to assist</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ minHeight: '400px' }}>
            {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}

            {chatLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <HiOutlineSparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"
                  style={{ background: 'rgba(13,17,31,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-400"
                        style={{ animation: `pulseDot 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                    ))}
                  </div>
                  <span className="text-xs text-dark-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your orders..."
                maxLength={500}
                className="input-neon flex-1 px-4 py-3 rounded-xl text-sm"
                disabled={chatLoading}
              />
              <button type="submit" disabled={chatLoading || !input.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 shrink-0"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                <HiOutlinePaperAirplane className="w-4 h-4 text-white" />
              </button>
            </form>
            <p className="text-[10px] text-dark-500 mt-2 text-center">
              AI responses are based on your actual order data only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
