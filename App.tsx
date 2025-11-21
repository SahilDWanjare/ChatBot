import React, { useState, useEffect, useRef } from 'react';
import { Message, MessageType, Sender, AppMode, BotState } from './types';
import { generateChatResponse, generateImageFromText, modifyImage } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';

// --- ASSETS ---
const TATYA_IMG = "https://i.pinimg.com/736x/a3/db/e2/a3dbe2bf993d51a0897593ffa3c58d0a.jpg"; 

// (BotDisplay component remains unchanged)

const BotDisplay: React.FC<{ state: BotState }> = ({ state }) => {
  let animationClass = "";

  switch (state) {
    case BotState.GREETING:
      animationClass = "animate-pulse";
      break;
    case BotState.THINKING:
      animationClass = "animate-wiggle";
      break;
    case BotState.RESULT:
      animationClass = "scale-105 transition-transform duration-300 brightness-150";
      break;
    default:
      animationClass = "";
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 transition-all duration-500 select-none relative z-10">
      <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-red-900/80 shadow-[0_0_40px_rgba(220,38,38,0.4)] overflow-hidden bg-black ${animationClass}`}>
        <img 
          src="https://i.pinimg.com/736x/5e/9f/bb/5e9fbbdcb47508b4dcb04ada2c882b44.jpg"
          alt="Tatya Vinchu" 
          className="w-full h-full object-cover filter contrast-125" 
        />
      </div>
      <div className="mt-3 relative">
        <h1 className="font-horror text-4xl md:text-5xl text-red-600 tracking-wider animate-flicker drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Tatya Vinchu 💀
        </h1>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [botState, setBotState] = useState<BotState>(BotState.GREETING);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: Sender.MODEL,
      type: MessageType.TEXT,
      content: "Bhagni Bhagodari bhagmase youmnee omm bhatt swaha🔥💀... Ask whatever you want... if you dare.",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset greeting to idle after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (botState === BotState.GREETING) {
        setBotState(BotState.IDLE);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [botState]);

  const handleSendMessage = async (text: string, attachment: string | null, mode: AppMode) => {
    const newMessageId = Date.now().toString();
    const userMsg: Message = {
      id: newMessageId,
      sender: Sender.USER,
      type: attachment ? MessageType.IMAGE : MessageType.TEXT,
      content: attachment || text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setBotState(BotState.THINKING);

    try {
      // 1. IMAGE GENERATION MODE
      if (mode === AppMode.GENERATE_IMAGE) {
        // First, generate the image
        const imageBase64 = await generateImageFromText(text);
        
        // Add Text Response First
        const textResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: Sender.MODEL,
          type: MessageType.TEXT,
          content: `Here is your cursed image containing "${text}"... Om Bhatt Swaha!`,
          timestamp: Date.now()
        };
        
        // Add Image Response Second
        const imageResponse: Message = {
          id: (Date.now() + 2).toString(),
          sender: Sender.MODEL,
          type: MessageType.IMAGE,
          content: imageBase64,
          timestamp: Date.now() + 10 // Slight offset
        };

        setMessages(prev => [...prev, textResponse, imageResponse]);
      } 
      // 2. IMAGE MODIFICATION MODE
      else if (attachment) {
        const modifiedImageBase64 = await modifyImage(attachment, text || "Describe this image");
        
        const textResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: Sender.MODEL,
          type: MessageType.TEXT,
          content: `I have distorted the image as you asked.`,
          timestamp: Date.now()
        };

        const imageResponse: Message = {
          id: (Date.now() + 2).toString(),
          sender: Sender.MODEL,
          type: MessageType.IMAGE,
          content: modifiedImageBase64,
          timestamp: Date.now() + 10
        };

        setMessages(prev => [...prev, textResponse, imageResponse]);
      } 
      // 3. CHAT MODE
      else {
        const responseText = await generateChatResponse(text);
        
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: Sender.MODEL,
          type: MessageType.TEXT,
          content: responseText,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMsg]);

        // Check for the specific "Irrelevant" phrase trigger
        if (responseText.includes("Ata tu padun raha")) {
           // Send the Tatya Vinchu image as a reaction
           const reactionMsg: Message = {
             id: (Date.now() + 2).toString(),
             sender: Sender.MODEL,
             type: MessageType.IMAGE,
             content: TATYA_IMG, 
             timestamp: Date.now() + 10
           };
           setMessages(prev => [...prev, reactionMsg]);
        }
      }

      setBotState(BotState.RESULT);
      setTimeout(() => setBotState(BotState.IDLE), 4000);

    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.MODEL,
        type: MessageType.TEXT,
        content: `Arrrgh! The spirits failed me: ${error.message}`,
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      setBotState(BotState.IDLE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed 'h-[100dvh]' container to 'flex flex-col h-[100dvh]' to enable stretching
    <div className="flex flex-col h-[100dvh] w-full md:max-w-md mx-auto bg-black shadow-[0_0_50px_rgba(127,29,29,0.3)] overflow-hidden md:border-x border-red-900/30 font-sans relative">
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-0"></div>

      {/* Header / Bot Display Area */}
      <div className="bg-gradient-to-b from-red-950/40 to-transparent pt-4 pb-2 shrink-0 z-10">
        <BotDisplay state={botState} />
      </div>

      {/* Chat Area (Takes remaining vertical space) */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth space-y-4 z-10 relative">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 z-20 relative">
        <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* 👻 NEW FOOTER/CREDIT BAR 👻 */}
      <footer className="shrink-0 text-center py-1.5 text-xs text-red-700/60 bg-red-950/50 border-t border-red-900/30 z-20">
        Created by @Sahil Wanjare with &hearts; and lots of coffee.
      </footer>
    </div>
  );
};

export default App;