import React, { useEffect, useState } from 'react';
import { getMessages, deleteMessage, markAsRead } from '../Services/MessageService';
import { FaTrash, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        const result = await getMessages();
        if (result.success) {
            setMessages(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            const result = await deleteMessage(id);
            if (result.success) {
                setMessages(messages.filter(m => m.id !== id));
            }
        }
    };

    const handleMarkAsRead = async (id, currentReadStatus) => {
        if (!currentReadStatus) {
            const result = await markAsRead(id);
            if (result.success) {
                setMessages(messages.map(m => m.id === id ? {...m, read: true} : m));
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>
            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-gray-500">No messages found.</p>
                    ) : (
                        messages.map(message => (
                            <div key={message.id} 
                                 className={`p-4 rounded-lg border ${message.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'} shadow-sm transition-all hover:shadow-md cursor-pointer`}
                                 onClick={() => handleMarkAsRead(message.id, message.read)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${message.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-500'}`}>
                                            {message.read ? <FaEnvelopeOpen /> : <FaEnvelope />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{message.subject}</h3>
                                            <p className="text-sm text-gray-600">From: {message.name} ({message.email})</p>
                                            <p className="text-xs text-gray-400">
                                                {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleString() : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}
                                        className="text-red-500 hover:text-red-700 p-2"
                                        title="Delete Message"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                <div className="mt-4 pl-12">
                                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
