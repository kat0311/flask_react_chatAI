from flask import request,jsonify
from config import db,app
from models import Contact
from urllib.parse import unquote
from process import split_text_chunks_and_summary_generator

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
    
    
    
        

if __name__=="__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True,port = 8558)