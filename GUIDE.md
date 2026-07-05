# 📚 BooksStore Frontend — Complete Beginner Guide

> **What is this?** This document teaches you everything you need to know about React and
> this specific project so you can confidently build features and ask for what you want.
> Read it top to bottom — it's written like a story, not a textbook.

---

## Table of Contents

1. [What is React? (The Big Picture)](#1-what-is-react-the-big-picture)
2. [What is Vite? (The Tool That Runs Everything)](#2-what-is-vite-the-tool-that-runs-everything)
3. [Your Project Map — Every File & Folder Explained](#3-your-project-map--every-file--folder-explained)
4. [How the Code Flows (Step by Step)](#4-how-the-code-flows-step-by-step)
5. [React Core Concepts You Must Know](#5-react-core-concepts-you-must-know)
6. [How the Backend Gets Connected](#6-how-the-backend-gets-connected)
7. [What You'll Need to Install Next](#7-what-youll-need-to-install-next)
8. [How to Run This App](#8-how-to-run-this-app)
9. [How to Prompt Me for Features](#9-how-to-prompt-me-for-features)

---

## 1. What is React? (The Big Picture)

Think of a normal HTML page: you write all the HTML, open it in a browser, done.
The problem? When you want to update **part** of the page (like showing a list of books
after the user searches), you'd have to manipulate the DOM with JavaScript — it gets messy fast.

**React solves this.** Instead of writing HTML directly, you write **components** —
small JavaScript functions that return HTML-like code called **JSX**.

```jsx
// This IS a React component. It's just a function that returns HTML-like code.
function Greeting() {
  return <h1>Hello, welcome to BooksStore!</h1>;
}
```

**Key idea:** Your entire page is built from components, like LEGO blocks.
A `BookCard` component, a `Navbar` component, a `SearchBar` component —
you build each piece, then combine them.

---

## 2. What is Vite? (The Tool That Runs Everything)

Your project uses **Vite** (pronounced "veet", it's French for "fast").

Vite does 3 things:
1. **Dev Server** — Runs your app locally at `http://localhost:5173` while you code
2. **Hot Reload** — When you save a file, the browser updates instantly (no manual refresh)
3. **Build** — When you're done, it bundles everything into optimized files for production

You never interact with Vite directly. You just run commands:
- `npm run dev` → starts the dev server
- `npm run build` → creates production files in a `dist/` folder

---

## 3. Your Project Map — Every File & Folder Explained

Here is your **entire** project structure with what each thing does:

```
booksstore-frontend/
│
├── index.html              ← 🏠 THE ENTRY POINT (where everything begins)
├── package.json            ← 📋 Project config + list of dependencies
├── package-lock.json       ← 🔒 Exact versions of every dependency (don't touch)
├── vite.config.js          ← ⚙️  Vite configuration
├── .env                    ← 🔑 Secret/config variables (your backend URL lives here)
├── .env.example            ← 📄 Template showing what .env should look like
├── .gitignore              ← 🚫 Tells Git which files to NOT upload (node_modules, .env, etc.)
├── .oxlintrc.json          ← 🧹 Linting rules (code style checker)
│
├── public/                 ← 📁 Static files served as-is (images, favicon, etc.)
│   └── (empty right now)
│
├── node_modules/           ← 📦 All installed packages (NEVER touch this, NEVER commit it)
│
└── src/                    ← 🧠 YOUR CODE LIVES HERE — this is where you work
    │
    ├── main.jsx            ← 🚀 THE BOOT FILE — mounts React into the HTML page
    ├── App.jsx             ← 🎯 THE ROOT COMPONENT — the "boss" of all components
    ├── App.css             ← 🎨 Styles for App (currently has ComingSoon page styles)
    ├── index.css           ← 🌍 GLOBAL styles (colors, fonts, resets — applies everywhere)
    │
    ├── assets/             ← 🖼️  Images, icons, SVGs you import into components
    │   └── (empty right now)
    │
    ├── components/         ← 🧩 REUSABLE PIECES (buttons, cards, navbars, badges, etc.)
    │   └── StatusBadge.jsx ← A small component showing backend connection status
    │
    ├── pages/              ← 📄 FULL PAGES (each page is a component too)
    │   └── ComingSoon.jsx  ← The "Coming Soon" landing page you see right now
    │
    └── services/           ← 🔌 BACKEND CONNECTION CODE (API calls live here)
        └── api.js          ← Functions that talk to your backend server
```

### The difference between `components/` and `pages/`

| Folder        | What goes there                  | Example                              |
|---------------|----------------------------------|--------------------------------------|
| `components/` | Small reusable pieces            | `BookCard`, `Navbar`, `SearchBar`    |
| `pages/`      | Full screens/pages               | `HomePage`, `LoginPage`, `BookPage`  |

**Rule of thumb:** If it's a whole screen → `pages/`. If it's a piece used inside screens → `components/`.

---

## 4. How the Code Flows (Step by Step)

Here is exactly what happens when someone opens your app in a browser:

```
Step 1:  Browser loads  index.html
                           │
                           ▼
Step 2:  index.html has  <div id="root"></div>  ← an empty box
         and loads       <script src="/src/main.jsx">
                           │
                           ▼
Step 3:  main.jsx runs → ReactDOM.createRoot(document.getElementById('root'))
         This tells React: "Take control of that empty <div id="root"> box"
                           │
                           ▼
Step 4:  main.jsx renders  <App />  inside that box
                           │
                           ▼
Step 5:  App.jsx returns   <ComingSoon />
                           │
                           ▼
Step 6:  ComingSoon.jsx renders the page you see:
         - Title, subtitle, footer
         - Calls checkBackendStatus() from api.js
         - Shows <StatusBadge /> with the result
                           │
                           ▼
Step 7:  StatusBadge.jsx shows a dot + text:
         🟡 "Connecting..."  →  🟢 "Connected"  or  🔴 "Offline"
```

### Visual summary:

```
index.html  →  main.jsx  →  App.jsx  →  ComingSoon.jsx  →  StatusBadge.jsx
                                              │
                                              ↓
                                         api.js (talks to backend)
```

**That's the entire flow.** Every React app follows this same pattern:
`HTML → main.jsx → App.jsx → Your pages/components`

---

## 5. React Core Concepts You Must Know

### 5.1 — JSX (HTML inside JavaScript)

In React, you write HTML directly inside JavaScript. This is called **JSX**.

```jsx
// This looks like HTML but it's actually JavaScript
function BookCard() {
  return (
    <div className="book-card">
      <h2>The Great Gatsby</h2>
      <p>By F. Scott Fitzgerald</p>
    </div>
  );
}
```

**Key differences from real HTML:**
| HTML            | JSX              | Why                                |
|-----------------|------------------|------------------------------------|
| `class="..."`   | `className="..."` | `class` is a reserved word in JS  |
| `for="..."`     | `htmlFor="..."`  | `for` is a reserved word in JS     |
| `onclick="..."` | `onClick={...}`  | camelCase + curly braces           |

---

### 5.2 — Components (Functions that return JSX)

Every piece of UI is a **component** = a JavaScript function that returns JSX.

```jsx
// ✅ This is a component (capital letter name, returns JSX)
function Navbar() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/books">Books</a>
    </nav>
  );
}

export default Navbar;
```

You use components inside other components like custom HTML tags:

```jsx
function App() {
  return (
    <div>
      <Navbar />           {/* ← Using the Navbar component */}
      <BookList />         {/* ← Using another component */}
    </div>
  );
}
```

---

### 5.3 — Props (Passing data to components)

**Props** = data you pass from a parent component to a child component.
Think of it like function arguments.

```jsx
// Parent passes data
<BookCard title="The Great Gatsby" author="F. Scott Fitzgerald" />

// Child receives it
function BookCard({ title, author }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>By {author}</p>
    </div>
  );
}
```

**In YOUR project:** Look at `StatusBadge.jsx` — it receives `status` as a prop:
```jsx
// ComingSoon passes:    <StatusBadge status={status} />
// StatusBadge receives: function StatusBadge({ status }) { ... }
```

---

### 5.4 — State (Data that changes over time)

**State** = variables that, when changed, cause the component to re-render (update on screen).

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  //      ↑         ↑                ↑
  //  the value  function to     initial value
  //             change it

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**In YOUR project:** Look at `ComingSoon.jsx`:
```jsx
const [status, setStatus] = useState('checking');
// status starts as 'checking'
// Later, setStatus('connected') changes it to 'connected'
// When status changes → the page re-renders → StatusBadge shows the new status
```

**The rule:** Use `useState` whenever you have data that can change (user input, API
responses, toggling menus, etc.)

---

### 5.5 — useEffect (Do something when the component loads)

**useEffect** = "run this code when the component first appears on screen" (or when
certain data changes).

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // This code runs ONCE when the component first loads
  console.log('Component loaded!');
}, []);  // ← empty array = run only once
```

**In YOUR project:** Look at `ComingSoon.jsx`:
```jsx
useEffect(() => {
  checkBackendStatus().then((result) => {
    setStatus(result.connected ? 'connected' : 'offline');
  });
}, []);
// When the page loads → call the backend → update the status
```

**Common uses of useEffect:**
- Fetching data from the backend when a page loads
- Setting up a timer or interval
- Listening for window events

---

### 5.6 — import / export (How files connect to each other)

Every file can **export** something and other files can **import** it.

```jsx
// In BookCard.jsx — EXPORTING
function BookCard() { ... }
export default BookCard;

// In HomePage.jsx — IMPORTING
import BookCard from '../components/BookCard';
```

**The `../` means "go up one folder."** Here's how paths work:
```
from:  src/pages/HomePage.jsx
to:    src/components/BookCard.jsx

Path:  ../components/BookCard
       ↑                ↑
   go up to src/    then into components/
```

---

### 5.7 — Conditional Rendering (Show/hide things)

```jsx
function LoginStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in</p>}
    </div>
  );
}
```

Or to show something only when a condition is true:
```jsx
{isLoading && <p>Loading...</p>}
```

---

### 5.8 — Rendering Lists (Showing arrays of data)

```jsx
function BookList({ books }) {
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
}
```

**Important:** Every item in a list MUST have a unique `key` prop.

---

## 6. How the Backend Gets Connected

This is crucial for your project. Here's the full picture:

### 6.1 — The .env file (where the backend URL is stored)

```env
VITE_API_URL=https://booksstore-hw6x.onrender.com
```

- This is your **backend server URL** hosted on Render
- The `VITE_` prefix is required — Vite only exposes variables that start with `VITE_`
- **Never commit this file** to GitHub (it's in `.gitignore` already ✅)

### 6.2 — The services/api.js file (where API calls are made)

```javascript
const API_URL = import.meta.env.VITE_API_URL;
//                    ↑
//   This reads the VITE_API_URL value from .env

export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/api/books`);
    //                                ↑
    //   This becomes: https://booksstore-hw6x.onrender.com/api/books
    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
```

### 6.3 — The full backend connection flow

```
.env  →  has the URL: https://booksstore-hw6x.onrender.com
                  ↓
api.js  →  reads the URL with: import.meta.env.VITE_API_URL
                  ↓
api.js  →  uses fetch() to make HTTP requests to that URL
                  ↓
ComingSoon.jsx  →  calls checkBackendStatus() from api.js
                  ↓
ComingSoon.jsx  →  updates state based on the response
                  ↓
StatusBadge.jsx  →  shows 🟢 or 🔴 based on the state
```

### 6.4 — How you'll add more API calls

As you build features, you'll add more functions to `api.js`:

```javascript
// Example: Get all books
export async function getAllBooks() {
  const response = await fetch(`${API_URL}/api/books`);
  const data = await response.json();  // Convert response to JavaScript object
  return data;
}

// Example: Get one book by ID
export async function getBookById(id) {
  const response = await fetch(`${API_URL}/api/books/${id}`);
  const data = await response.json();
  return data;
}

// Example: Add a new book (POST request)
export async function addBook(bookData) {
  const response = await fetch(`${API_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  const data = await response.json();
  return data;
}
```

Then use them in your pages:

```jsx
// In a page component
useEffect(() => {
  getAllBooks().then((books) => {
    setBooks(books);  // Save to state → page re-renders with book data
  });
}, []);
```

---

## 7. What You'll Need to Install Next

Your project is bare-bones right now. As you build, you'll likely need:

### React Router (for multiple pages/navigation)
```bash
npm install react-router-dom
```
This lets you have different URLs show different pages:
- `/` → Home page
- `/books` → Books listing page
- `/books/123` → Single book page
- `/login` → Login page

### Axios (optional, cleaner alternative to fetch)
```bash
npm install axios
```
Makes API calls simpler (but `fetch` works fine too — your choice).

### React Icons (for icons)
```bash
npm install react-icons
```
Thousands of icons you can use as components: `<FaBook />`, `<FiSearch />`, etc.

---

## 8. How to Run This App

```bash
# 1. Open terminal in the project folder

# 2. Install dependencies (only needed once, or when package.json changes)
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser to:
#    http://localhost:5173
```

The page will auto-refresh every time you save a file.

---

## 9. How to Prompt Me for Features

Now that you understand the structure, here's how to ask me to build things effectively:

### ✅ Good prompts (specific, clear):

```
"Add a homepage that shows a list of books fetched from the backend endpoint
GET /api/books. Each book should show its title, author, and cover image in
a card layout."
```

```
"Create a login page with email and password fields. When the user submits,
send a POST request to /api/auth/login with the email and password."
```

```
"Add a navigation bar at the top with links to Home, Books, and Login pages.
Use React Router for navigation."
```

```
"Create a book detail page at /books/:id that fetches and shows a single
book's full information from GET /api/books/:id"
```

### ❌ Vague prompts (I'll have to guess):

```
"Make the books page"  → Which page? What should it show? Where does the data come from?
"Add authentication"   → Login only? Register too? Google login? What does the backend expect?
```

### Template for feature requests:

```
Feature: [What you want]
Page/Component: [Where it should be — new page? existing page?]
Backend Endpoint: [The API URL it needs to talk to, if any]
Design: [Any specific look you want — colors, layout, etc.]
```

---

## Quick Reference Cheat Sheet

| Concept       | What it is                        | Example in your project                     |
|---------------|-----------------------------------|---------------------------------------------|
| Component     | A function that returns HTML/JSX  | `ComingSoon.jsx`, `StatusBadge.jsx`         |
| Props         | Data passed to a component        | `<StatusBadge status={status} />`           |
| State         | Data that changes & re-renders UI | `const [status, setStatus] = useState(...)` |
| useEffect     | Run code on component load        | `useEffect(() => { ... }, [])`              |
| import/export | Connect files together            | `import StatusBadge from '../components/...'`|
| .env          | Store config/secrets              | `VITE_API_URL=https://...`                  |
| services/     | Backend API call functions        | `api.js → checkBackendStatus()`             |
| pages/        | Full screen components            | `ComingSoon.jsx`                            |
| components/   | Small reusable UI pieces          | `StatusBadge.jsx`                           |
| fetch()       | Make HTTP requests to backend     | `fetch(\`\${API_URL}/api/books\`)`          |

---

## What's Currently in the App

Right now the app is a simple **"Coming Soon"** page that:
1. Shows a beautiful landing message: *"Building your library"*
2. Pings your backend at `https://booksstore-hw6x.onrender.com/api/books`
3. Shows a status dot: 🟢 Connected / 🔴 Offline

**Your next steps** will be to start building real pages — book listings, login,
reading pages, etc. Just tell me what you want to build next and reference the
backend endpoints you have! 🚀

---

*This guide was written specifically for your BooksStore project. Keep it as a reference
as you build. Good luck!* ✨
