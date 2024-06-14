import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';

function Chat2() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  // const [apiKey, setApiKey] = useState('');

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  // const handleApiKeyChange = (e) => {
  //   setApiKey(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8558/api/chat', {
        user_input: prompt,
       
      });
      setResponse(res.data.response);
      setChatHistory(res.data.chat_history);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="Chat">
      <h2>Chat with AI</h2>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={handleInputChange}
          placeholder="Enter your message"
          required
        />
        <button type="submit">Send</button>
      </form>
      {response && (
        <div className="response">
          <h3>AI Response</h3>
          <p>{response}</p>
        </div>
      )}
      {chatHistory.length > 0 && (
        <div className="chat-history">
          <h3>Chat History</h3>
          <ul>
            {chatHistory.map((msg, index) => (
              <li key={index}>
                <strong>{msg.role}:</strong> {msg.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Chat2;
