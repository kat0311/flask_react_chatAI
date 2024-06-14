import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import './App.css';

const Chats=()=> {
  const [userInput, setUserInput] = useState('');
  const [systemMessage, setSystemMessage] = useState('You are a helpful assistant.');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSystemMessageChange = (e) => {
    setSystemMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    const userMessage = { sender: 'user', text: userInput };
    setConversation([...conversation, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8558/chat', { question: userInput, system_message: systemMessage });
      const botMessage = { sender: 'bot', text: res.data.answer };
      setConversation([...conversation, userMessage, botMessage]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching the response:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [conversation, loading]);

  return (
    <Container className="p-3">
      <header className="App-header">
        <h1>Hey, I'm your Chat GPT</h1>
      </header>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card id="chat-container" className="chat-container mb-3">
            <Card.Body>
              {conversation.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <Card.Text>{msg.text}</Card.Text>
                </div>
              ))}
              {loading && (
                <div className="message bot">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
            </Card.Body>
          </Card>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>System Message</Form.Label>
              <Form.Control
                type="text"
                value={systemMessage}
                onChange={handleSystemMessageChange}
                placeholder="Set the behavior of the assistant"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="You: "
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Chats;

