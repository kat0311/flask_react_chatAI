import React, { useState } from 'react';
import axios from 'axios';
import './Summarize.css';

function HandleSummarize() {
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8558/api/summarize');
      setSummary(response.data.summary);
    } catch (err) {
      setError('Failed to summarize conversation.');
    }
  };

  return (
    <div className="Summarize">
      <h2>Summarize Conversation</h2>
      <button onClick={handleSummarize}>Summarize</button>
      {summary && (
        <div className="summary">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default HandleSummarize;
