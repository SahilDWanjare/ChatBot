import React from 'react';
import { Message, MessageType, Sender } from '../types';
import { User, Skull } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { formatDataUrl } from '../utils/imageUtils';

// Duplicate constant here to ensure availability in bubbles without prop drilling complexity
const TATYA_IMG = "https://i.pinimg.com/1200x/53/b3/63/53b36329f0f2900f54d56b70422ae7d3.jpg";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;
  const isError = message.isError;

  // Helper to determine image source
  const getImageSource = (content: string) => {
    if (content.startsWith('http')) return content; // It's a URL (like the reaction image)
    return formatDataUrl(content, 'image/jpeg'); // It's likely base64
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end`}>
        
        {/* Avatar Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 shadow-lg overflow-hidden ${
          isUser 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-black border-red-800'
        }`}>
          {isUser ? (
            <User size={20} className="text-gray-300" />
          ) : (
            <img src={TATYA_IMG} alt="Bot" className="w-full h-full object-cover filter contrast-125" />
          )}
        </div>

        {/* Bubble Content */}
        <div className={`p-3 px-4 rounded-xl relative shadow-lg text-sm md:text-base border ${
          isUser 
            ? 'bg-stone-800 text-gray-200 rounded-br-none border-stone-600' 
            : isError
              ? 'bg-red-950/90 text-red-200 rounded-bl-none border-red-800'
              : 'bg-neutral-900 text-red-50 rounded-bl-none border-red-900/50 shadow-[0_2px_10px_rgba(220,38,38,0.1)]'
        }`}>
          
          {message.type === MessageType.TEXT && (
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-0 font-sans tracking-wide">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {message.type === MessageType.IMAGE && (
            <div className="rounded-lg overflow-hidden bg-black/50 border border-red-900/30">
              <img 
                src={getImageSource(message.content)} 
                alt="Generated content" 
                className="w-full h-auto max-h-[300px] object-contain"
                loading="lazy"
              />
              {!message.content.startsWith('http') && (
                <div className="mt-2 text-right">
                   <a 
                     href={getImageSource(message.content)} 
                     download={`tatya-cursed-img-${message.timestamp}.jpg`}
                     className="text-xs font-bold underline opacity-70 hover:opacity-100 text-red-500"
                   >
                     Save Cursed Image
                   </a>
                </div>
              )}
            </div>
          )}
          
          <span className={`text-[10px] block mt-1 text-right opacity-50 font-mono ${isUser ? 'text-gray-400' : 'text-red-300'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;