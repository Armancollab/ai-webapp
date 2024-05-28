from flask import Flask, request, jsonify
from transformers import GPT2Tokenizer, TFGPT2LMHeadModel
import tensorflow as tf
import tf_keras as keras


app = Flask(__name__)

model_name = "gpt2"
model = TFGPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)


@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.json.get('prompt')
    inputs = tokenizer.encode(prompt, return_tensors='tf')
    outputs = model.generate(inputs, max_length=150, num_return_sequences=1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({'response': response.split('Assistant:')[-1].strip()})


if __name__ == '__main__':
    app.run(debug=True)
