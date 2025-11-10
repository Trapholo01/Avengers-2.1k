from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:8000"])  # allow frontend requests

# OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.route("/api/generate", methods=["POST"])
def generate_content():
    try:
        data = request.get_json()

        if not data.get("type"):
            return jsonify({"error": "Missing content type."}), 400

        content_type = data["type"]
        form_data = data.get("formData", {})

        # Map frontend IDs to backend keys
        mapped_data = {}
        if content_type == "bio":
            mapped_data["name"] = form_data.get("bio-name", "")
            mapped_data["skills"] = form_data.get("bio-skills", "")
            mapped_data["achievements"] = form_data.get("bio-achievements", "")
            mapped_data["tone"] = form_data.get("bio-tone", "professional")
        elif content_type == "project":
            mapped_data["title"] = form_data.get("project-title", "")
            mapped_data["description"] = form_data.get("project-description", "")
            mapped_data["technologies"] = form_data.get("project-technologies", "")
            mapped_data["outcomes"] = form_data.get("project-outcomes", "")
        elif content_type == "reflection":
            mapped_data["topic"] = form_data.get("reflection-topic", "")
            mapped_data["experience"] = form_data.get("reflection-experience", "")
            mapped_data["learnings"] = form_data.get("reflection-learnings", "")
            mapped_data["future"] = form_data.get("reflection-future", "")
        else:
            return jsonify({"error": "Invalid content type."}), 400

        prompt = generate_prompt(content_type, mapped_data)

        # Call OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional content generator."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )

        generated_text = response.choices[0].message.content.strip()
        return jsonify({"generated_text": generated_text, "type": content_type}), 200

    except openai.error.AuthenticationError:
        return jsonify({"error": "Invalid API key."}), 401
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": str(e)}), 500


def generate_prompt(content_type, data):
    if content_type == "bio":
        return (
            f"Create a {data.get('tone')} professional biography for {data.get('name')}.\n\n"
            f"Skills: {data.get('skills')}\n"
            f"Achievements: {data.get('achievements')}\n\n"
            "Write a 150–200 word biography highlighting expertise, accomplishments, and career journey."
        )
    elif content_type == "project":
        return (
            f"Write a 200–250 word professional project summary.\n\n"
            f"Title: {data.get('title')}\n"
            f"Description: {data.get('description')}\n"
            f"Technologies Used: {data.get('technologies')}\n"
            f"Results/Outcomes: {data.get('outcomes')}\n\n"
            "Use a formal, informative tone."
        )
    elif content_type == "reflection":
        return (
            f"Compose a 250–300 word professional learning reflection.\n\n"
            f"Topic: {data.get('topic')}\n"
            f"Experience: {data.get('experience')}\n"
            f"Insights: {data.get('learnings')}\n"
            f"Applications: {data.get('future')}\n\n"
            "Maintain a formal and analytical tone."
        )
    else:
        return "Write a professional summary based on provided input."


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend connected successfully"}), 200


if __name__ == "__main__":
    print("=" * 60)
    print("Avengers_2.1k AI Backend Running")
    print("=" * 60)
    print("Server: http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, port=5000)
