# 🌐 Soumadip Portfolio

A modern, interactive personal portfolio website designed to showcase **projects, skills, experience, achievements, and professional identity** through a clean and responsive interface.

🔗 **Live Demo:** [soumadip-profolio.vercel.app](https://soumadip-profolio.vercel.app/)

---

## ✨ Features

* 🎨 **Modern & Responsive UI** — Optimized for desktop, tablet, and mobile devices.
* 👨‍💻 **Personal Portfolio** — Showcase profile, skills, projects, and professional journey.
* 🚀 **Project Showcase** — Present projects with relevant information and technologies.
* ✨ **Smooth Animations** — Interactive transitions and motion effects for a better user experience.
* 🤖 **AI Integration** — Uses Google's Gemini API for AI-powered functionality.
* 📄 **PDF Generation** — Generate downloadable documents using jsPDF.
* 🌙 **Clean Visual Design** — Minimal, modern interface focused on readability and presentation.
* ⚡ **Fast Development** — Built with Vite for a fast development and build experience.
* 📱 **Responsive Layout** — Designed to work across different screen sizes.

---

## 🛠️ Tech Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* **Motion**

### AI & Backend

* **Google Gemini API**
* **Express.js**
* **dotenv**

### Utilities

* **jsPDF**
* **Node.js**
* **TypeScript**

---

## 📂 Project Structure

```text
Soumadip-Profolio/
│
├── public/              # Static assets
│
├── src/                 # Main React application
│   ├── components/     # Reusable UI components
│   ├── ...
│   └── ...
│
├── scripts/             # Project utility scripts
│
├── .github/
│   └── workflows/       # GitHub Actions workflows
│
├── .env.example         # Environment variable template
├── index.html           # Application entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── metadata.json        # Project metadata
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Arka3434/Soumadip-Profolio.git
```

### 2. Navigate into the project

```bash
cd Soumadip-Profolio
```

### 3. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 4. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Add the required API configuration to the `.env` file.

> ⚠️ Never commit API keys or other secrets to GitHub.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the application for production |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Run TypeScript checks                |
| `npm run clean`   | Remove generated build/server files  |

---

## 🤖 AI Integration

The portfolio includes integration with **Google Gemini** through the `@google/genai` package.

This allows the application to incorporate generative AI capabilities into the portfolio experience.

The Gemini API configuration should be provided through environment variables rather than being hard-coded into the application.

---

## 🎨 Design Philosophy

The portfolio focuses on three principles:

### 1. Simplicity

The interface avoids unnecessary complexity and keeps the focus on the person's work and achievements.

### 2. Interaction

Animations and interactive elements are used to make the portfolio feel dynamic rather than like a static resume.

### 3. Professional Presentation

Projects, technical skills, and personal information are organized in a way that makes the portfolio useful for recruiters, collaborators, and potential employers.

---

## 🌍 Deployment

The project can be deployed to platforms such as:

* Vercel
* Netlify
* GitHub Pages
* Other platforms supporting Vite applications

A live deployment of this project is available at:

**https://soumadip-profolio.vercel.app/**

---

## 🔐 Environment Variables

If you use Gemini or other external services, configure their credentials through `.env`.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Do not expose private API keys in frontend source code or commit `.env` files to the repository.

---

## 📌 Future Improvements

Potential improvements include:

* [ ] Add a dedicated project details page
* [ ] Add a blog/articles section
* [ ] Add contact form integration
* [ ] Improve accessibility
* [ ] Add SEO metadata
* [ ] Add automated testing
* [ ] Add CI/CD checks
* [ ] Add more AI-powered portfolio features
* [ ] Improve performance and image optimization

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add your feature"
```

5. Push the branch.

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---

## 📄 License

This project is intended as a personal portfolio project.

If you plan to reuse or redistribute substantial portions of the project, please check the repository for applicable licensing information.

---

## 👨‍💻 Author

### Soumadip

A developer passionate about building modern web experiences and exploring the intersection of **software development and AI**.

---

⭐ If you find this project useful or interesting, consider giving the repository a star!

**Repository:**
https://github.com/Arka3434/Soumadip-Profolio

**Live Portfolio:**
https://soumadip-profolio.vercel.app/
