from flask import Flask, request, jsonify
from transformers import GPT2Tokenizer, TFGPT2LMHeadModel
import tensorflow as tf
import tf_keras as keras
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = TFGPT2LMHeadModel.from_pretrained("gpt2")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data['prompt']
    inputs = tokenizer.encode(prompt, return_tensors="tf")
    outputs = model.generate(inputs, max_length=100, num_return_sequences=1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({'response': response})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
