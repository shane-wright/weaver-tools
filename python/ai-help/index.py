from flask import Flask, request, jsonify
from embedchain import App
import tempfile

app = Flask(__name__)
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

if __name__ == "__main__":
    app.run(debug=True)
