
#  AI Portfolio Assistant – Sprint Planning

###  Overview

**AI Portfolio Assistant** is a web-based tool that helps users generate professional content for their portfolios using a **Generative AI API (Gemini)**.
It can create:

* Professional Bios
* Project Summaries
* Learning Reflections

Built collaboratively by **Team Avengers_2.1k** using **JavaScript** for the backend and **HTML, CSS, JavaScript** for the frontend.

🔗 **GitHub Repository:** [Avengers-2.1k](https://github.com/Trapholo01/Avengers-2.1k)

---

## Project Goal

To build a simple generative AI-powered application that uses a pre-trained model to create professional portfolio content based on user inputs.

---

## Sprint Overview

**Sprint Duration:** 1 week
**Sprint Goal:** Develop the first working version of AI Portfolio Assistant with at least one functional feature (AI-generated professional bio), fully integrated frontend and backend (Node.js + Express), and complete documentation.

---

## Team & Roles

| Member                    | Role                             | Responsibilities                                                                        |
| ------------------------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| **Lerato Matamela**       | Scrum Master & Backend Developer | Facilitate sprint planning, manage Git workflow, build backend server & API integration |
| **Thelezinhle Buthelezi** | Frontend Developer               | Build HTML structure, CSS styling, JS logic for form handling and API calls             |
| **Thato Rapholo**         | Documentation & UI/UX Developer  | Create wireframes, layout, README, Sprint docs, test features                           |

---

## User Stories & Acceptance Criteria

### User Story 1: Biography Generator

**As a user**, I want to generate a professional bio so that I can showcase my skills effectively.

**Acceptance Criteria:**

* Users input name, skills, achievements, and tone
* Backend returns structured text using AI API
* Output is clean, formatted, and professional

### User Story 2: Project Summary Generator

**As a user**, I want to generate a project summary from key inputs so that I can present my work concisely.

**Acceptance Criteria:**

* Users provide project title, description, tools, and outcomes
* AI-generated summary highlights purpose, tools, and results
* Output is concise, readable, and professional

### User Story 3: Learning Reflection Generator

**As a learner**, I want to generate a structured learning reflection so I can communicate what I learned.

**Acceptance Criteria:**

* Includes learning topic, insights, and future applications
* Sections are logically connected
* Output demonstrates real-world relevance

---

## Task Breakdown

| Team Member     | Task                                                   | Deliverable                                   |
| --------------- | ------------------------------------------------------ | --------------------------------------------- |
| **Lerato**      | Build backend server, integrate AI API                 | `server.js`, API routes                       |
| **Thelezinhle** | Build frontend input forms, handle JS fetch calls      | `index.html`, `style.css`, `script.js`        |
| **Thato**       | Documentation, wireframes, UI/UX design, test features | `README.md`, `SPRINT_PLANNING.md`, wireframes |

---

## How to Run

### Backend

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and add your API key:

```env
GEMINI_API_KEY=your-api-key

```

4. Run the server:

```bash
node server.js
```

Server runs on: `http://localhost:3000`

### Frontend

1. Open `frontend/index.html` in a browser or use Live Server:

```bash
npx live-server frontend
```

2. Ensure the backend server is running before generating content.

---

## GitHub Workflow

* Each member creates a personal branch:

  * `lerato`
  * `Thelezinhle`
  * `Documentation_Thato`
* Commit frequently with descriptive messages
* Submit Pull Requests for review
* Scrum Master merges into `main` after validation

---

## Tech Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Frontend        | HTML, CSS, JavaScript       |
| Backend         | Node.js + Express           |
| API             | Gemini API                  |
| Hosting         | Local / Deployment optional |
| Version Control | Git & GitHub                |

---

## Expected Sprint Deliverable

* Functional AI Portfolio Assistant (one feature working)
* Connected frontend & backend
* Complete documentation
* Sprint backlog tracked via GitHub Projects

---

**Team Avengers_2.1k © 2025**
Members: Lerato Matamela · Thelezinhle Buthelezi · Thato Rapholo
 “Building intelligent tools, one sprint at a time.”
