from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI API
openai.api_key = os.getenv("OPEsk-proj-dKmeGo9_FpvPMoB2xFPxuiGVlEdU0c1cdKpcaSglqCmzzvOwUJPBjSJWSodmLZCGHp0cc9tersT3BlbkFJMGxTiSw9LxJosfdA9K__VRItmC7XZ4IyFpGUbXdKwnCgDD6ud9Z9U_SimTmBHboAZxZWzs8nAANAI_API_KEY")


@app.route("/api/generate", methods=["POST"])
def generate_content():
    try:
        data = request.get_json()

        # Validate incoming data
        if not data.get("type"):
            return jsonify({"error": "Missing content type (bio, project, or reflection)."}), 400

        content_type = data["type"]
        form_data = data.get("formData", {})

        # Generate the prompt based on content type
        prompt = generate_prompt(content_type, form_data)

        print(f"[INFO] Generating {content_type} content...")

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional content generator that writes formal, well-structured materials."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )

        generated_text = response.choices[0].message.content.strip()

        return jsonify({"generated_text": generated_text, "type": content_type}), 200

    except openai.error.AuthenticationError:
        return jsonify({"error": "Invalid API key. Please check your .env file."}), 401
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": str(e)}), 500


def generate_prompt(content_type, data):
    """Generate the prompt for the AI based on the content type."""
    if content_type == "bio":
        name = data.get("name", "A professional individual")
        skills = data.get("skills", "Not specified")
        achievements = data.get("achievements", "Not specified")
        tone = data.get("tone", "professional")

        return (
            f"Create a {tone} professional biography for {name}.\n\n"
            f"Skills: {skills}\n"
            f"Achievements: {achievements}\n\n"
            f"Write a 150–200 word biography highlighting expertise, accomplishments, and career journey."
        )

    elif content_type == "project":
        title = data.get("title", "Untitled Project")
        description = data.get("description", "No description provided.")
        technologies = data.get("technologies", "Not specified")
        outcomes = data.get("outcomes", "No outcomes provided.")

        return (
            f"Write a 200–250 word professional project summary.\n\n"
            f"Title: {title}\n"
            f"Description: {description}\n"
            f"Technologies Used: {technologies}\n"
            f"Results/Outcomes: {outcomes}\n\n"
            f"Structure it clearly and use a formal, informative tone."
        )

    elif content_type == "reflection":
        topic = data.get("topic", "Unspecified Learning Topic")
        experience = data.get("experience", "No experience provided.")
        learnings = data.get("learnings", "No key insights provided.")
        future = data.get("future", "No applications mentioned.")

        return (
            f"Compose a 250–300 word professional learning reflection.\n\n"
            f"Topic: {topic}\n"
            f"Experience: {experience}\n"
            f"Insights: {learnings}\n"
            f"Applications: {future}\n\n"
            f"Maintain a formal and analytical tone, focusing on skill growth and professional development."
        )

    else:
        return "Write a professional summary based on provided input."


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend connected successfully"}), 200


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Avengers_2.1k AI Backend Running")
    print("=" * 60)
    print("📡 Server: http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, port=5000)
