import React from "react";
import { useState } from "react";
const Summary=()=>{
    const [url, setUrl] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = async () => {
        
        try {
            const response = await fetch(`http://127.0.0.1:8558/get_summary?url=${encodeURIComponent(url)}`, { method: 'POST' });
            
            const data = await response.json();
            setSummary(data.summary)
        } catch (error) {
            console.error('Error fetching summary:', error);
            setSummary('Error fetching summary');
        }
    };
    return <div>
    <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Enter URL"
    />
    
    <button onClick={handleSubmit}>Get Summary</button>
    {summary && (
        <div>
            <h2>Summary</h2>
            <p>{summary}</p>
        </div>
    )}
</div>
}
export default Summary;