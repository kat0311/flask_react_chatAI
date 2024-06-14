// import { useEffect, useState } from 'react';
import './App.css';
// import Chat from './Chat';
// import ContactList from './ContactList';
// import ContactForm from './ContactForm';
import Summary from './Summary';
import Home from './Home';
// import Memory from './Memory';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chats from './Chats';
import ChatNSummary from './ChatNSummary';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <h1>AI Assistant</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/summarize">Summarize</Link>
          <Link to="/chat">Chat</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/summarize" element={<Summary />} />
          <Route path="/chat" element={<Chats />} />
          <Route path="/chatNsummary" element={<ChatNSummary/>}></Route>
        </Routes>
      </main>
    </div>
  </Router>
  )
  

  // const [contacts, setContact] = useState([]);
  // const [isModalOpen, setisModalOpen] = useState(false);
  // const [currentContact,setCurrentContact] = useState({})
  // useEffect(() => {
  //   fetchContacts()
  // }, [])
  // const fetchContacts = async () => {
  //   const response = await fetch('http://127.0.0.1:8558/contacts')
  //   const data = await response.json();

  //   setContact(data.contacts)
  //   console.log(data.contacts)
  // }
  // const closeModal = () => {
  //   setisModalOpen(false);
  //   setCurrentContact({})
  // }
  // const openModal = () => {
  //   if (!isModalOpen) setisModalOpen(true);
  // }
  // const openEditModal = (contact)=>{
  //   if (isModalOpen) return 
  //   setCurrentContact(contact)
  //   setisModalOpen(true)
  // }
  // const onUpdate = ()=>{
  //   closeModal()
  //   fetchContacts()
  // }

  // return (
  //   <>
  //     <h1>this is my app</h1>
  //     <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate}/>
      
  //       <button onClick={openModal}>Create a Contact</button>
  //       {isModalOpen && <div className='modal'>
  //         <div className='modal-content'>
  //           <span className='close' onClick={closeModal}>&times;</span>
  //           <ContactForm existingContact={currentContact} updateCallback={onUpdate}></ContactForm>
  //         </div>
  //       </div>}
  //       <Summary></Summary>
    

  //   </>


  // );
}

export default App;
