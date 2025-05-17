import os
# import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from google import genai
from dotenv import load_dotenv
from models import db, Messages

load_dotenv()

app = Flask(__name__)
key = os.environ.get('GENAI_KEY')
if not key:
    raise ValueError("GENAI_KEY environment variable is not set")
client = genai.Client(api_key=key)
CORS(app)
# Load DB URL from environment variable
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# @app.route('/api/messages', methods=['GET'])
# def get_messages():
#     messages = db.session.execute(
#         db.select(Messages).order_by(Messages.timestamp.desc())
#     ).scalars().all()
#     return jsonify([msg.to_dict() for msg in messages])

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    response = client.models.generate_content(
        model= os.environ.get('GENAI_MODEL'),
        contents=[prompt],
    )
    if not response:
        return jsonify({'error': 'No response from model'}), 500
    msg = Messages(
        prompt=prompt,
        response=response.text,
        role="user",
    )
    db.session.add(msg)
    db.session.commit()
    # mock_response = f"LLM Response: You said '{prompt}'"
   
    return jsonify({'response': response.text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
