from flask import request,jsonify,session
from config import db,app
from models import Contact
from urllib.parse import unquote
from process import split_text_chunks_and_summary_generator
# from langchain.schema import AIMessage, SystemMessage
from langchain_core.messages import HumanMessage,AIMessage,SystemMessage
from langchain_openai import AzureChatOpenAI
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import ConversationSummaryMemory
import os
import json
from dotenv import load_dotenv
os.environ["AZURE_OPENAI_API_KEY"] = os.getenv("AZURE_OPENAI_API_KEY")
os.environ["AZURE_OPENAI_ENDPOINT"] = os.getenv("AZURE_OPENAI_ENDPOINT")
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
@app.route("/contacts",methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x:x.to_jason(),contacts))
    
    return jsonify({"contacts":json_contacts})
@app.route("/create_contact",methods = ["POST"])
def create_contacts():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    if not first_name or not last_name or not email:
        return (
            jsonify({"message":"you must include a first name and last name and email"}),400
        )
    new_contact = Contact(first_name=first_name,last_name=last_name,email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message":str(e)}),400
    
    return jsonify({"message":"user created"}),201
@app.route("/update_contact/<int:user_id>",methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message":"User Contact not found"}),400
    data = request.json
    contact.first_name = data.get("firstName",contact.first_name)
    contact.last_name = data.get("lastName",contact.last_name)
    contact.email = data.get("email",contact.email)
    db.session.commit()
    return jsonify({"message":"the user got updated"}),200

@app.route("/delete_contact/<int:user_id>",methods=["DELETE"])
def delete_contact(user_id):
    print("contact")
    contact = Contact.query.get(user_id)
    
    if not contact:
        return jsonify({"message":"User Contact not found"}),400
    db.session.delete(contact)
    
    db.session.commit()
    print("contact")
    return jsonify({"message":"Contact deleted"}),200
@app.route("/get_summary",methods = ["POST"])
def get_summary():
    encode_url=unquote(unquote(request.args.get('url')))
    if not encode_url:
        return jsonify({'error':'URL is required'}), 400
    summary = split_text_chunks_and_summary_generator(encode_url)
    print(summary)
    response= {
        'submitted_url': encode_url,
        'summary': summary
    }
    return jsonify(response)
llm = AzureChatOpenAI(openai_api_version="2023-05-15", 
                      azure_deployment="gpt-4",temperature=0)

def message_to_dict(message):
    return {
        "type": type(message).__name__,
        "content": message.content
    }

def dict_to_message(d):
    if d['type'] == 'SystemMessage':
        return SystemMessage(content=d['content'])
    elif d['type'] == 'HumanMessage':
        return HumanMessage(content=d['content'])
    elif d['type'] == 'AIMessage':
        return AIMessage(content=d['content'])

@app.route('/chat', methods=['POST'])
def chat_with_gpt():
    data = request.json
    question = data.get('question', '')
    system_message_content = data.get('system_message', 'You are a helpful assistant.')
    if 'sessionMessages' not in session:
        session['sessionMessages'] = [
            message_to_dict(SystemMessage(content=system_message_content))
        ]

    session['sessionMessages'].append(message_to_dict(HumanMessage(content=question)))

    messages = [dict_to_message(m) for m in session['sessionMessages']]
    assistant_answer = llm.invoke(messages)
    print(chat.get_prompts)
    
    session['sessionMessages'].append(message_to_dict(AIMessage(content=assistant_answer.content)))

    return jsonify({"answer": assistant_answer.content})
conversation = None
chat_history = []

@app.route('/api/summarize', methods=['POST'])
def summarize():
    global conversation

    if conversation:
        summary = "Nice chatting with you my friend ❤️:\n\n" + conversation.memory.buffer
        return jsonify({"summary": summary}), 200
    return jsonify({"error": "No conversation to summarize"}), 400

@app.route('/api/chat', methods=['POST'])
def chat():
    global conversation

    data = request.json
    user_input = data.get('user_input')
    

    if conversation is None:
        
        conversation = ConversationChain(
            llm=llm,
            verbose=True,
            memory=ConversationSummaryMemory(llm=llm)
        )

    response = conversation.predict(input=user_input)
    chat_history.append({"role": "user", "content": user_input})
    chat_history.append({"role": "assistant", "content": response})

    return jsonify({"response": response, "chat_history": chat_history}), 200
    
    
        

if __name__=="__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True,port = 8558)