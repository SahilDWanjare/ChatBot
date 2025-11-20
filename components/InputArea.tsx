import React, { useState, useRef } from 'react';
import { AppMode } from '../types';
import { Send, X, Paperclip, Sparkles, Skull } from 'lucide-react';
import { fileToBase64, formatDataUrl } from '../utils/imageUtils';

interface InputAreaProps {
  onSendMessage: (text: string, attachment: string | null, mode: AppMode) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [attachment, setAttachment] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!inputValue.trim() && !attachment) || isLoading) return;
    onSendMessage(inputValue, attachment, mode);
    setInputValue('');
    setAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setAttachment(base64);
      } catch (err) {
        console.error("File read error", err);
      }
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === AppMode.CHAT ? AppMode.GENERATE_IMAGE : AppMode.CHAT);
    if (mode === AppMode.CHAT) {
      setAttachment(null);
    }
  };

  return (
    <div className="p-4 bg-black/80 backdrop-blur-md border-t border-red-900/30">
      
      {/* Attachment Preview */}
      {attachment && (
        <div className="relative inline-block mb-2 animate-pulse">
          <img 
            src={formatDataUrl(attachment, 'image/jpeg')} 
            alt="Upload preview" 
            className="h-16 w-16 object-cover rounded border-2 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] grayscale hover:grayscale-0 transition-all"
          />
          <button 
            onClick={() => setAttachment(null)}
            className="absolute -top-2 -right-2 bg-red-900 text-red-100 rounded-full p-1 hover:bg-red-700 transition border border-red-500"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Input Container */}
      <div className="flex flex-col gap-2">
        
        {/* Mode Toggles */}
        <div className="flex gap-2 justify-center">
           <button 
             onClick={toggleMode}
             className={`px-4 py-1 rounded-sm text-xs font-bold tracking-widest transition-all uppercase border ${
                mode === AppMode.CHAT 
                ? 'bg-red-900/50 text-red-100 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                : 'bg-black text-gray-600 border-gray-800 hover:border-gray-600'
             }`}
           >
             Chat
           </button>
           <button 
             onClick={toggleMode}
             className={`px-4 py-1 rounded-sm text-xs font-bold tracking-widest transition-all flex items-center gap-1 uppercase border ${
                mode === AppMode.GENERATE_IMAGE 
                ? 'bg-red-700 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                : 'bg-black text-gray-600 border-gray-800 hover:border-gray-600'
             }`}
           >
             <Skull size={12} /> Manifest Image
           </button>
        </div>

        <div className="flex items-end gap-2 bg-stone-950 p-2 rounded border border-red-900/30 focus-within:border-red-600 transition-colors shadow-inner">
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={mode === AppMode.GENERATE_IMAGE} 
            className={`p-2 transition-colors ${attachment ? 'text-red-500' : 'text-gray-600 hover:text-red-400'} ${mode === AppMode.GENERATE_IMAGE ? 'opacity-20 cursor-not-allowed' : ''}`}
          >
            <Paperclip size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileSelect}
          />

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === AppMode.GENERATE_IMAGE ? "Conjure an image..." : "Speak to the spirit..."}
            className="flex-1 bg-transparent text-gray-300 placeholder-gray-700 resize-none outline-none py-2 max-h-24 overflow-y-auto font-sans"
            rows={1}
            style={{ minHeight: '2.5rem' }}
          />

          <button
            onClick={handleSend}
            disabled={isLoading || (!inputValue.trim() && !attachment)}
            className={`p-3 flex items-center justify-center transition-all duration-300 ${
              inputValue.trim() || attachment
                ? 'bg-red-900 text-red-100 hover:bg-red-700 shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                : 'bg-stone-900 text-stone-700 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-red-900/30 border-t-red-500 rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;

//img