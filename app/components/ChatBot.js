// src/components/ChatBotButton.jsx

'use client';

import { FaComments } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChatBotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Cargar mensajes previos del localStorage si existen
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    // Scroll automático al final cuando se agregan nuevos mensajes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') {
      toast.error('Por favor, ingresa un mensaje.');
      return;
    }

    const userMessage = { text: inputMessage, user: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    // Enviar mensajes al backend para obtener respuesta
    setIsLoading(true);
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const botMessage = { text: data.message, user: 'bot' };
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      localStorage.setItem('chatMessages', JSON.stringify(newMessages));
      toast.success('Chatbot respondió exitosamente.');
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al obtener la respuesta del chatbot.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        {/* Botón flotante */}
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center"
        >
          <FaComments className="text-2xl" />
        </button>

        {/* Ventana de chat flotante */}
        {isOpen && (
          <div className="w-80 h-96 bg-white shadow-lg rounded-lg fixed bottom-20 right-5 border border-gray-300 z-50 flex flex-col">
            {/* Header del Chat */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-bold">Chat Bot</h3>
              <button onClick={toggleChat} className="text-xl font-bold focus:outline-none">
                ✕
              </button>
            </div>
            {/* Área de Mensajes */}
            <div className="p-4 flex-1 overflow-y-auto bg-gray-100">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2 flex ${
                      message.user === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <p
                      className={`p-2 rounded-lg max-w-xs ${
                        message.user === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">¡Hola! ¿En qué puedo ayudarte?</p>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input y Botón de Envío */}
            <div className="p-4 bg-gray-200">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="mt-2 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenedor de Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
