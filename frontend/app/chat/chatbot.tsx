'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'いらっしゃいませ。HALCINEMAの予約アシスタントです。座席予約、上映スケジュール、キャンセルについてご案内できます。',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = ['座席を予約したい', '上映スケジュール', 'キャンセルについて'];

  useEffect(() => {
    const syncSidebarState = () => {
      setIsSidebarOpen(document.body.classList.contains('sidebar-open'));
    };

    syncSidebarState();
    const observer = new MutationObserver(syncSidebarState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'サーバーでエラーが発生しました。');
      }

      const replyText = data.reply?.content ?? data.reply ?? data.message ?? 'ご案内を確認しました。';
      const assistantReply: Message = {
        role: 'assistant',
        content: typeof replyText === 'string' ? replyText : JSON.stringify(replyText),
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `[エラー] ${error.message || '通信エラーが発生しました。'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
  };

  const panelRight = isSidebarOpen ? 232 : 16;

  return (
    <div
      className="fixed bottom-4 z-50 flex flex-col items-end sm:bottom-6"
      style={{ right: `${panelRight}px` }}
    >
      {isOpen && (
        <div className="mb-4 flex h-[min(560px,calc(100vh-2rem))] w-[min(360px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[22px] border border-[#d9b35a]/30 bg-[#111111]/95 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-sm md:w-[420px]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[linear-gradient(135deg,#171717_0%,#0f0f0f_30%,#1b170f_100%)] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9b35a]/40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_25%),linear-gradient(135deg,#171717_0%,#0f0f0f_30%,#1f1a12_100%)] text-sm text-[#f5d678] shadow-[0_0_18px_rgba(217,179,90,0.18)]">
                💬
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.18em] text-[#d9b35a] uppercase">Support</p>
                <h3 className="text-sm font-bold text-white">HALCINEMA アシスタント</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="チャットを閉じる"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9b35a]/30 bg-[#0d0d0d] text-lg text-[#f5d678] transition hover:bg-[#1a1a1a]"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-[#2a2a2a] bg-[#151515] px-3 py-2">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="whitespace-nowrap rounded-full border border-[#d9b35a]/30 bg-[#1d1d1d] px-3 py-1.5 text-[10px] font-medium tracking-[0.08em] text-[#f5d678] transition hover:border-[#d9b35a]/60 hover:bg-[#242018]"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#0c0c0c] px-3 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-auto rounded-br-md bg-[linear-gradient(135deg,#4d77ff_0%,#2d5be9_100%)] text-white shadow-[0_8px_18px_rgba(45,91,233,0.35)]'
                      : 'mr-auto rounded-bl-md border border-[#2a2a2a] bg-[#1a1a1a] text-[#f3f3f3]'
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {isLoading && (
                <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-md border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-[#d4d4d4]">
                  入力中...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-[#2a2a2a] bg-[#141414] p-2.5">
            <div className="flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-1.5 shadow-inner shadow-black/30">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="メッセージを入力..."
                className="flex-1 bg-transparent px-2.5 py-1 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9b35a]/40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_25%),linear-gradient(135deg,#171717_0%,#0f0f0f_30%,#1f1a12_100%)] text-base font-bold text-[#f5d678] shadow-[0_10px_24px_rgba(0,0,0,0.55),0_0_18px_rgba(217,179,90,0.18)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'チャットを閉じる' : 'チャットを開く'}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d9b35a]/40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_25%),linear-gradient(135deg,#171717_0%,#0f0f0f_30%,#1f1a12_100%)] text-2xl font-black text-[#f5d678] shadow-[0_10px_24px_rgba(0,0,0,0.55),0_0_18px_rgba(217,179,90,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_14px_30px_rgba(0,0,0,0.7),0_0_22px_rgba(217,179,90,0.24)] active:scale-95"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}