import { useEffect, useState } from 'react';
import './App.css';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
function App() {
  const [contacts, setContact] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [currentContact,setCurrentContact] = useState({})
  useEffect(() => {
    fetchContacts()
  }, [])
  const fetchContacts = async () => {
    const response = await fetch('http://127.0.0.1:8558/contacts')
    const data = await response.json();

    setContact(data.contacts)
    console.log(data.contacts)
  }
  const closeModal = () => {
    setisModalOpen(false);
    setCurrentContact({})
  }
  const openModal = () => {
    if (!isModalOpen) setisModalOpen(true);
  }
  const openEditModal = (contact)=>{
    if (isModalOpen) return 
    setCurrentContact(contact)
    setisModalOpen(true)
  }
  const onUpdate = ()=>{
    closeModal()
    fetchContacts()
  }
  // const deleteContact = async (id)=>{
  //   contacts.filter()
  // }
  return (
    <>
      <h1>this is my app</h1>
      <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate}/>
        <button onClick={openModal}>Create a Contact</button>
        {isModalOpen && <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={closeModal}>&times;</span>
            <ContactForm existingContact={currentContact} updateCallback={onUpdate}></ContactForm>
          </div>
        </div>}
    

    </>


  );
}

export default App;
