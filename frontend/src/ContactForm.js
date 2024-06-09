import React from "react";
import { useState } from "react";

// updateCallBack is  a function that we are going to call as soon as we perform any updates.
function ContactForm({existingContact,updateCallback}) {
    const [firstName,setFirstName] = useState(existingContact.firstName||"")
    const [lastName,setLastName] = useState(existingContact.lastName||"")
    const [email,setEmail] = useState(existingContact.email||"");
    const updating =Object.entries(existingContact).length !==0;

    // const [firstName,setFirstName] = useState(existingContact.firstName|| "");
    // const [lastName,setLastName] = useState(existingContact.lastName|| "");
    // const [email,setEmail] = useState(existingContact.email|| "");
    // const updating = Object.entries(existingContact).length !==0;
    const onSubmit = async (e)=>{
        e.preventDefault()
        const data = {
            firstName,
            lastName,
            email
        };
        const url = "http://127.0.0.1:8558/"+(updating?`update_contact/${existingContact.id}`:"create_contact")
        const options = {
            method: updating?"PATCH":"POST",
            headers:{
                "Content-type":"applicattion/json"
            },
            body:JSON.stringify(data)
        }
        const response = await fetch(url,options)
        if (response.status!==200&&response.status!==201){
            const data = response.json()
            alert(data.message)
        }else{
            updateCallback()
        }
    }
    // const onSubmit =async (e)=>{
    //     e.preventDefault()
    //     const data = {
    //         firstName,
    //         lastName,
    //         email
    //     };
    //     const url = "http://127.0.0.1:8558/"+(updating?`update_contact/${existingContact.id}`:"create_contact")
    //     const options = {
    //         method : updating? "PATCH":"POST",
    //         headers :{
    //             "Content-type":"application/json"
    //         },
    //         body:JSON.stringify(data)

    //     }
    //     const response = await fetch(url,options)
    //     console.log(response);
    //     // const data2 = response.json()
    //     // console.log(data2)
    //     if (response.status!==201&&response.status!==200){
    //         const data = response.json()
    //         alert(data.message)
    //     }else{
    //         updateCallback()
    //     }
    // }
    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="firstName">FirstName:</label>
                <input
                    type="text"
                    id ="firstName"
                    value={firstName}
                    onChange={(e)=>(setFirstName(e.target.value))}
                    
                    />
            </div>
            <div>
            {/* This means that when a user clicks on the “LastName:” label, 
            the browser will automatically focus on the form control with the id “lastName”. */}
                <label htmlFor="lastName">LastName:</label>
                <input
                    type="text"
                    id ="lastName"
                    value={lastName}
                    onChange={(e)=>(setLastName(e.target.value))}
                    // this code creates a two-way binding between the input field and the lastName state variable.
                    //  When the user types into the field, the lastName state variable is updated, 
                    // and the input field always displays the current value of the lastName state variable                   
                    />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id ="email"
                    value={email}
                    onChange={(e)=>(setEmail(e.target.value))}
                    
                    />
            </div>
            <button type="submit">{updating?"Update":"Create Contact"}</button>
        </form>
    )
}
  

export default ContactForm;