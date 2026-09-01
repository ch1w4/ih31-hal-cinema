'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'いらっしゃいませ。HALCINEMAの予約アシスタントです。座席予約についてご案内いたします。どのようなご用件でしょうか？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      // JSONデータを先に取得する（エラーメッセージが含まれている可能性があるため）
      const data = await response.json().catch(() => ({}));

      // ステータスコードが200番台以外の場合、バックエンドからのエラーメッセージを投げる
      if (!response.ok) {
        throw new Error(data.error || 'サーバーでエラーが発生しました。');
      }

      if (data.reply) {
        setMessages((prev) => [...prev, data.reply]);
      }
    } catch (error: any) {
      // エラー内容を画面に表示する
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `[エラー] ${error.message || '通信エラーが発生しました。'}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] w-80 md:w-96 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] mb-4">
          {/* ヘッダー */}
          <div className="bg-black border-b border-[#2a2a2a] text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-sm">HALCINEMA アシスタント</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#0f0f0f] flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white self-end rounded-br-none' 
                    : 'bg-[#2a2a2a] text-gray-100 self-start rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-[#2a2a2a] text-gray-400 self-start p-3 rounded-lg rounded-bl-none text-sm">入力中...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-3 bg-[#1a1a1a] border-t border-[#2a2a2a] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="メッセージ..."
              className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}