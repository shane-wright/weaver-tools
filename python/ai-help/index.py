from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
from embedchain import App
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
db_path: str = tempfile.mkdtemp()

embedchain_app = App.from_config(
    config={
        "llm": {
            "provider": "ollama",
            "config": {
                "model": "tinyllama:latest",
                "max_tokens": 250,
                "temperature": 0.5,
                "stream": True,
                "base_url": 'http://localhost:11434'
            }
        },
        "vectordb": {"provider": "chroma", "config": {"dir": db_path}},
        "embedder": {
            "provider": "ollama",
            "config": {
                "model": "tinyllama:latest",
                "base_url": 'http://localhost:11434'
            }
        },
    }
)

@app.route("/add", methods=["POST"])
def add_data():
    data = request.get_json()
    if not data or "data" not in data:
        return jsonify({"error": "Missing data"}), 400
    try:
        embedchain_app.add(str(data["data"]["file_path"]), data_type="pdf_file")
        return jsonify({"message": "Data added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/query", methods=["POST"])
def query_data():
    data = request.get_json()
    if not data or "query" not in data:
        return jsonify({"error": "Missing query"}), 400
    try:
        response = embedchain_app.query(data["query"])
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def chat_data():
    session_id = "developer"
    config = {
        "prompt": "You are an AI help chatbot to answer questions about a swarm robotics project.",
        "temperature": 0.7,
        "number_documents": 5
    }

    data = request.get_json()

    if not data or "chat" not in data:
        return jsonify({"error": "Missing chat"}), 400
    try:
        # response = embedchain_app.chat(data["chat"], session_id=session_id, config=config)
        response = embedchain_app.chat(data["chat"], session_id=session_id)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

