# 🧪 TestPilot AI

### 🌐 [Live Demo](https://testpilot-ai.me/)

**TestPilot AI is a full-stack developer tool that brings automated test generation directly into the GitHub workflow.** Select a repository and source file, generate framework-aware tests, review the result, and write the test directly back to GitHub — while maintaining a persistent history of every generation.

The application is built with a **Next.js frontend and Express backend**, with both deployed on **AWS EC2**. The backend handles GitHub integration, AI services, and persistent application data.

## ✨ Features

* **🔗 GitHub Repository Integration**
  Browse repositories and source files directly through the application.

* **🧪 Framework-Aware Test Generation**
  Generate tests based on the project's language, framework, and source-code context.

* **⬆️ GitHub Write-Back**
  Commit generated test files directly to the selected GitHub repository.

* **🕘 Persistent Generation History**
  Save and revisit previous test generations even after leaving the generation workflow.

* **☁️ Full-Stack AWS Deployment**
  Both the Next.js frontend and Express backend run on a cloud-hosted AWS EC2 instance.

## 🏗️ Architecture

```text
                         ┌─────────────────┐
                         │     GitHub      │
                         │      API       │
                         └────────▲────────┘
                                  │
                                  │
┌───────────────┐          ┌──────┴────────┐
│               │   HTTP   │               │
│    Next.js    ├─────────►│    Express    │
│    Frontend   │          │    Backend    │
│               │          │               │
└───────────────┘          └───────┬───────┘
                                   │
                          ┌────────┴────────┐
                          │                 │
                       Gemini          Persistence
```

Both frontend and backend are deployed on **AWS EC2**.

## 🛠️ Tech Stack

| Layer           | Technologies                 |
| --------------- | ---------------------------- |
| **Frontend**    | Next.js, React, TypeScript   |
| **Backend**     | Node.js, Express, TypeScript |
| **AI**          | Google Gemini API            |
| **Integration** | GitHub API                   |
| **Persistence** | Generation History           |
| **Deployment**  | AWS EC2                      |

## 🚀 Workflow

```text
GitHub Repository
       ↓
Select Source File
       ↓
Generate Test
       ↓
Review
       ↓
Save to History
       ↓
Write Back to GitHub
```

The generated test becomes an **actual file in the repository**, while the generation itself remains accessible through TestPilot's history.

## ☁️ Deployment

TestPilot runs as a full-stack application on **AWS EC2**, with the Next.js frontend and Express backend hosted on the same cloud instance.

```text
                    AWS EC2
        ┌─────────────────────────────┐
        │                             │
        │     Next.js   ◄──► Express  │
        │      Frontend       Backend │
        │                             │
        └─────────────────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
         GitHub API        Gemini API
```

## 💻 Run Locally

### Frontend

```bash
cd testpilot-ai/client
npm install
npm run dev
```

### Backend

```bash
cd testpilot-ai/server
npm install
npm run dev
```


### Server
```bash
cd server
npm install
npm run dev
```
