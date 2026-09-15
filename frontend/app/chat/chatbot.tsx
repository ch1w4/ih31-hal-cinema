'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type MovieRef = {
  id: string | number;
  title: string;
  poster?: string;
  posterColor?: string;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  movies?: MovieRef[];
};

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function renderReplyText(content: string, movies?: MovieRef[]) {
  if (!movies?.length) return content;

  const sorted = [...movies].sort((a, b) => b.title.length - a.title.length);
  const pattern = new RegExp(`(${sorted.map(m => escapeRegExp(m.title)).join('|')})`, 'g');
  const parts = content.split(pattern);

  return parts.map((part, i) => {
    const movie = sorted.find(m => m.title === part);
    if (!movie) return <span key={i}>{part}</span>;

    return (
      <Link
        key={i}
        href={`/movies/${movie.id}`}
        className="text-blue-300 underline underline-offset-2 hover:text-blue-200"
      >
        {movie.title}
      </Link>
    );
  });
}

function MovieCards({ movies }: { movies?: MovieRef[] }) {
  if (!movies?.length) return null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          href={`/movies/${movie.id}`}
          className="flex gap-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-2 hover:border-blue-600 transition-colors"
        >
          {movie.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-24 rounded object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-16 h-24 rounded flex-shrink-0"
              style={{ backgroundColor: movie.posterColor || '#333' }}
            />
          )}
          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold text-white">{movie.title}</span>
            <span className="text-xs text-blue-300 mt-1">詳細を見る →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function renderReplyWithMovies(content: string, movies?: MovieRef[]) {
  if (!movies?.length) return content;

  const sorted = [...movies].sort((a, b) => b.title.length - a.title.length);
  const pattern = new RegExp(`(${sorted.map(m => escapeRegExp(m.title)).join('|')})`, 'g');
  const parts = content.split(pattern);

  return parts.map((part, i) => {
    const movie = sorted.find(m => m.title === part);
    if (!movie) return <span key={i}>{part}</span>;

    return (
      <Link
        key={i}
        href={`/movies/${movie.id}`}
        className="inline-flex items-center gap-1 align-middle text-blue-300 underline underline-offset-2 hover:text-blue-200"
      >
        {movie.poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.poster}
            alt={movie.title}
            className="inline-block w-5 h-7 rounded object-cover align-middle"
          />
        )}
        {movie.title}
      </Link>
    );
  });
}

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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'サーバーでエラーが発生しました。');
      }

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { ...data.reply, movies: data.movies || [] }
        ]);
      }
    } catch (error: any) {
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
          <div className="bg-black border-b border-[#2a2a2a] text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-sm">HALCINEMA アシスタント</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>

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
              {msg.role === 'assistant' ? (
                <>
                  {renderReplyText(msg.content, msg.movies)}
                  <MovieCards movies={msg.movies} />
                </>
              ) : (
                msg.content
              )}
            </div>
          ))}
            {isLoading && (
              <div className="bg-[#2a2a2a] text-gray-400 self-start p-3 rounded-lg rounded-bl-none text-sm">入力中...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

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