
#  AI Portfolio Assistant

###  Overview

**AI Portfolio Assistant** is a web-based tool that helps users generate professional content for their portfolios using a **Generative AI API (Gemini)**.  
It can create:

*  Professional Bios  
*  Project Summaries  
*  Learning Reflections  

Built collaboratively by **Team Avengers_2.1k** using **JavaScript** for the backend and **HTML, CSS, JavaScript** for the frontend.

 **GitHub Repository:** [Avengers-2.1k](https://github.com/Trapholo01/Avengers-2.1k)

---

## Project Goal

To build a simple generative AI-powered application that uses a pre-trained model to create professional portfolio content based on user inputs.

---

## Team & Roles

| Member                    | Role                             | Responsibilities                                                                        |
| ------------------------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| **Lerato Matamela**       | Scrum Master & Backend Developer | Facilitate sprint planning, manage Git workflow, build backend server & API integration |
| **Thelezinhle Buthelezi** | Frontend Developer               | Build HTML structure, CSS styling, JS logic for form handling and API calls             |
| **Thato Rapholo**         | Documentation & UI/UX Developer  | Create wireframes, layout, README, Sprint docs, test features                           |

---

## Features

* Generate professional bios based on user input  
* Create project summaries from key project details  
* Generate structured learning reflections  
* Responsive web interface  
* Connected frontend & backend using Node.js  
* Gemini API integration  

---

## Project Structure

```

Avengers-2.1k/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── .env.example
│   └── node_modules/
│
├── README.md
└── SPRINT_PLANNING.md

````

---

## How to Run

### Backend

1. Navigate to backend folder:

```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and add your Gemini API key:

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
| Backend         | Node.js                     |
| API             | Gemini API                  |
| Hosting         | Local / Deployment optional |
| Version Control | Git & GitHub                |

---

## Expected Deliverables

* Functional AI Portfolio Assistant (at least one feature working)
* Connected frontend & backend
* Complete documentation
* Sprint backlog tracked via GitHub Projects

---

**Team Avengers_2.1k © 2025**
Members: Lerato Matamela · Thelezinhle Buthelezi · Thato Rapholo
 “Building intelligent tools, one sprint at a time.”


