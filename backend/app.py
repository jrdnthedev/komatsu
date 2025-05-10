from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)
key = os.environ.get('GENAI_KEY')
if not key:
    raise ValueError("GENAI_KEY environment variable is not set")
client = genai.Client(api_key=key)
CORS(app)

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
    
    return jsonify({'response': response.text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
