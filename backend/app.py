from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from Angular (Cross-Origin)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    # Mock response logic (replace with actual LLM logic as needed)
    mock_response = f"🤖 LLM Response: You said '{prompt}'"

    return jsonify({'response': mock_response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
