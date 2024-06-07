import React from 'react'

const ContactList = ({contacts,updateContact,updateCallback})=>{
    const onDelete = async (id)=>{
        const options = {
            method: "DELETE"
        }
        const url = `http://127.0.0.1:8558/delete_contact/${id}`
        const response = await fetch(url,options)
        if (response.status===200){
            updateCallback()
        }else{
            console.log("Failed to delete")
        }
    }
    return <div>
        <h2>Contacts</h2>
        <table>
            <thead>
                <tr>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {contacts.map((contact)=>(
                    <tr key={contact.id}>
                        <td>{contact.firstName}</td>
                        <td>{contact.lastName}</td>
                        <td>{contact.email}</td>
                        <td>
                            <button onClick={()=>updateContact(contact)}>Update</button>
                            <button onClick={()=>onDelete(contact.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
export default ContactList;
   

