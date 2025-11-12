
# AI Portfolio Assistant – Reflection

## Introduction

The **AI Portfolio Assistant** project is a web-based tool designed to help users generate professional content for their portfolios using the **Gemini Generative AI API**. The tool can create professional bios, project summaries, and learning reflections based on user input.

I contributed as the **Documentation & UI/UX Developer**, responsible for creating wireframes, designing layouts, testing features, and preparing documentation. Our team, **Team Avengers_2.1k**, also included Lerato Matamela, who acted as Scrum Master and Backend Developer, and Thelezinhle Buthelezi, who served as Frontend Developer.

---

## Objectives Achieved

The main goal of this project was to build a functional AI-powered portfolio assistant that integrates frontend and backend workflows. During the sprint, we successfully implemented the **Biography Generator feature**, allowing users to input their name, skills, achievements, and preferred tone, and receive a professional, well-formatted output from the AI API.

We also set up the project with a clear folder structure, including frontend HTML/CSS/JS files, backend Node.js server with API integration, and proper documentation files. The GitHub repository was organized with separate feature branches, demonstrating collaborative version control.

---

## Technical Challenges and Solutions

One of the main technical challenges was **connecting the backend to the frontend**. Initially, we built the backend in Python (Flask), but integrating it with our JavaScript frontend proved difficult, and attempts to pair it with the OpenAI API were unsuccessful. To solve this, we **rewrote the backend in JavaScript**, which allowed smooth communication with the frontend using fetch requests.

We also switched from OpenAI to **Gemini API**, which successfully handled our AI content generation needs. Handling asynchronous requests and ensuring proper data flow between the frontend and backend required careful attention, solved by using **JavaScript fetch API** and structured backend routes.

Additionally, we faced minor issues with **UI responsiveness**, ensuring the forms and outputs displayed correctly on different screen sizes. Using CSS flex layouts and media queries helped achieve a clean and professional interface.

---

## Teamwork and Agile Process

Working in a small, agile team was an invaluable learning experience. We used GitHub feature branches for each member:

* `lerato` – Lerato handled the backend server and API integration
* `Thelezinhle` – Thelezinhle implemented frontend forms and JS logic
* `Documentation_Thato` – I created documentation, wireframes, and tested features

---

## User Experience & UI/UX Considerations

I focused on designing a clean and intuitive interface. Wireframes guided the layout of input forms and output areas. Users can easily enter their information, select the type of content they want, and receive AI-generated text.

The interface is responsive and accessible, ensuring usability on different devices. Testing the input-output flow ensured that the AI responses were displayed clearly and formatted professionally.

---

## Lessons Learned

Through this project, I strengthened both technical and soft skills:

* **Technical Skills:** Learned how to integrate a Generative AI API (Gemini), handle asynchronous requests, and structure frontend-backend communication in JavaScript. Also learned the importance of choosing a compatible backend technology for seamless integration.
* **UI/UX Skills:** Developed wireframes and layouts that improved usability and responsiveness.
* **Collaboration Skills:** Gained experience working in an Agile team, managing Git branches, and reviewing Pull Requests.
* **AI Understanding:** Learned how prompt structure affects the quality of AI-generated outputs.

---

## Future Improvements

Future iterations of the AI Portfolio Assistant could include:

* **Additional Features:** Adding project summaries and learning reflection generators.
* **Export Options:** Allowing users to download generated content as PDF or Word documents.
* **Authentication:** Implementing a login system to save user content.
* **Enhanced AI Responses:** Optimizing prompts for more professional, concise outputs.

---

## Conclusion

The AI Portfolio Assistant project allowed me to combine technical development, UI/UX design, and documentation skills into a cohesive, functioning tool. The process of switching the backend from Python to JavaScript and using Gemini for AI generation provided valuable lessons in flexibility and problem-solving. Collaborating with Lerato and Thelezinhle improved my understanding of Agile workflow and teamwork.

Overall, this project provided practical experience in building AI-powered applications and reinforced the importance of clear communication, structured development, and user-centered design. I am confident that the skills learned here will be valuable for future AI and web development projects.

---

**Team Avengers_2.1k © 2025**
Members: Lerato Matamela · Thelezinhle Buthelezi · Thato Rapholo
💡 “Building intelligent tools, one sprint at a time.”


