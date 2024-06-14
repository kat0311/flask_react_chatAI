import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="Home">
      <h2>Choose an Option</h2>
      <div className="options">
        <Link to="/summarize" className="option">
          Summarize a Web page content
        </Link>
        <Link to="/chat" className="option">
          Chat with AI
        </Link>
        <Link to="/chatNsummary" className="option">
          Chat with AI and Summary 
        </Link>

      </div>
    </div>
  );
}

export default Home;
