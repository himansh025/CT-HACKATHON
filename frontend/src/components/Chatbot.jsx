import  { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/apiconfig';
import quickResponses from '../data/mockChatResponse'
export default function Chatbot() {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', content: 'Hi! Ask me about your tickets or events 🎟️' }
    ]);

    const [quickQuestions, setQuickQuestions] = useState([])
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEnd = useRef(null);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), type: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/chatbot/chathandler',{ message:input})
            console.log(data);
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                content: data.response || 'Sorry, something went wrong!'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Unable to connect. Please try again.'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    setQuickQuestions(quickResponses[user?.role])
    }, []);


    return (
        user && (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    className="w-12 h-12 bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-950"
                    onClick={() => {
                        const chatbotElement = document.getElementById('chatbot-container');
                        if (chatbotElement) {
                            chatbotElement.classList.toggle('hidden');
                        }
                    }}
                >
                    💬
                </button>

                <div className="fixed bottom-4 right-4 z-50">
                    {!isOpen && (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="bg-blue-800 hover:bg-blue-950 text-white rounded-full p-3 shadow-lg"
                        >
                            <MessageCircle size={24} />
                        </button>
                    )}

                    {/* Chat Window */}
                    {isOpen && (
                        <div className="bg-white rounded-lg shadow-xl w-80 h-96 md:w-96  md:h-100 flex flex-col">
                            {/* Header */}
                            <div className="bg-blue-800 text-white p-3 rounded-t-lg flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Bot size={20} />
                                    <span className="font-medium">EventX Bot</span>
                                </div>
                                <button onClick={() => setIsOpen(false)}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-2">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs p-2 rounded-lg text-sm ${msg.type === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 p-2 rounded-lg text-sm">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEnd} />
                            </div>

                            {/* Quick Questions */}
                            {messages.length === 1  && (
                                <div className="p-2   border-t">
                                    <div className="text-xs text-gray-500 mb-1">Quick questions:</div>
                                    {quickQuestions?.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(q)}
                                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded mr-1 mb-1 hover:bg-blue-100"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

  {messages.length === 1 && messages[0].id!=1 && (
                                <div className="p-2   border-t">
                                    <div className="text-xs text-gray-500 mb-1">Quick questions:</div>
                                    {quickQuestions?.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(q)}
                                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded mr-1 mb-1 hover:bg-blue-100"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {/* Input */}
                            <div className="p-3 border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Ask about tickets..."
                                        className="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || loading}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-1"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        )
    );
}