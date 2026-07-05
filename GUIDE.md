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
7. [The Status Badge — Full Workflow Explained](#7-the-status-badge--full-workflow-explained)
8. [What You'll Need to Install Next](#8-what-youll-need-to-install-next)
9. [How to Run This App](#9-how-to-run-this-app)
10. [How to Prompt Me for Features](#10-how-to-prompt-me-for-features)

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

## 7. The Status Badge — Full Workflow Explained

This section explains **exactly** what the status badge does, what each state means,
what is happening behind the scenes at every step, and every reason it could show
"Connection unavailable." Read this carefully — once you understand this, you
understand how **any** frontend talks to **any** backend.

---

### 7.1 — The Three States of the Badge

| Badge State | Dot Color | Message | What it means |
|---|---|---|---|
| `checking` | 🟡 Pulsing clay | *"Connecting to library systems…"* | The app just loaded and is **currently trying** to reach the backend. The request is in-flight — no answer yet. |
| `connected` | 🟢 Green | *"Connected and ready"* | The backend replied with an **HTTP 200 OK** response. Everything is working. |
| `offline` | 🔴 Red | *"Connection unavailable"* | Something went wrong — the request **failed** or the backend replied with an **error status**. The backend could not be reached or refused the request. |

---

### 7.2 — The Full Timeline (What Happens Step by Step)

Here is the **exact** sequence of events from the moment you open the app:

```
Timeline:

  0 ms    Browser loads your page
             │
             ▼
  ~50 ms   React mounts the <ComingSoon /> component
             │
             ▼
           useState('checking') runs
             → status = 'checking'
             → Badge shows: 🟡 "Connecting to library systems…"
             │
             ▼
           useEffect() fires (runs once after first render)
             → calls checkBackendStatus() from api.js
             │
             ▼
           checkBackendStatus() runs:
             → builds URL: "https://booksstore-hw6x.onrender.com/api/books"
             → calls fetch() — this sends an HTTP GET request over the internet
             │
             ▼
  ~50 ms   Your browser resolves the domain name (DNS lookup)
  to       → "booksstore-hw6x.onrender.com" → some IP address like 216.24.57.1
  ~200 ms    │
             ▼
           Browser opens a TCP connection to that IP address
             → a network handshake happens (SYN → SYN-ACK → ACK)
             │
             ▼
           Browser sends the HTTP request:
             GET /api/books HTTP/1.1
             Host: booksstore-hw6x.onrender.com
             │
             ▼
           The backend server receives the request
             → Your Node.js/Express server processes it
             → It queries the database, gets the books
             → Sends back a response with status 200 and the data
             │
             ▼
  ~300 ms  Browser receives the response
  to         │
  ~3000 ms   ▼
           Back in api.js:
             → response.ok is TRUE (status 200 is "ok")
             → function returns { connected: true }
             │
             ▼
           Back in ComingSoon.jsx:
             → .then((result) => { ... }) runs
             → result.connected is true
             → setStatus('connected') is called
             → React re-renders the component
             → Badge shows: 🟢 "Connected and ready"
```

**That's the happy path.** But what happens when things go wrong?

---

### 7.3 — Why "Connection unavailable" Appears (Every Possible Reason)

The badge turns 🔴 red whenever `checkBackendStatus()` returns `{ connected: false }`.
This happens in **two** scenarios inside `api.js`:

```javascript
export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/api/books`);
    if (!response.ok) {
      // ❌ SCENARIO 1: Backend replied, but with an error status code
      throw new Error(`Backend responded with status ${response.status}`);
    }
    return { connected: true };  // ✅ Only reaches here if everything is OK
  } catch (error) {
    // ❌ SCENARIO 2: fetch() itself threw an error (couldn't reach backend at all)
    return { connected: false, error: error.message };
  }
}
```

Let's break down **every real-world reason** these scenarios happen:

#### Scenario 1 — The backend IS reachable but sends an error

The request reached the server, the server replied, but the HTTP status code was
not in the 200–299 range (so `response.ok` is `false`).

| Status Code | Meaning | Why it might happen |
|---|---|---|
| `400` Bad Request | Server didn't understand the request | Malformed URL or query |
| `401` Unauthorized | You need to log in first | Endpoint requires authentication |
| `403` Forbidden | You're logged in but not allowed | Missing permissions |
| `404` Not Found | The `/api/books` endpoint doesn't exist | Typo in URL, or backend route not set up |
| `500` Internal Server Error | Server crashed while processing | Bug in backend code, database error |
| `502` Bad Gateway | The hosting platform couldn't reach your server | Your server process crashed or isn't running |
| `503` Service Unavailable | Server is temporarily overloaded or down | Render is restarting your service |

#### Scenario 2 — The backend is NOT reachable at all (fetch itself fails)

`fetch()` throws an error **before** it even gets a response. The request never
completed. Common reasons:

| Problem | What happened | Real-world cause |
|---|---|---|
| **DNS failure** | Browser can't translate the domain name to an IP | Domain doesn't exist, typo in URL, DNS servers down |
| **Network error** | Browser can't establish a connection | You have no internet, server is completely offline, firewall blocking |
| **CORS error** | Browser blocked the response for security | Backend doesn't include the right `Access-Control-Allow-Origin` header (very common during development!) |
| **Timeout** | Request took too long and was abandoned | Backend is sleeping (Render free tier spins down after inactivity — can take 30–60 seconds to wake up) |
| **SSL/TLS error** | Secure connection couldn't be established | Certificate expired, HTTPS misconfigured |
| **Wrong URL** | `VITE_API_URL` in `.env` is wrong | Typo, outdated URL, missing `https://` |

---

### 7.4 — The Render Free Tier "Cold Start" Problem

This is the **#1 most common** reason you'll see the 🔴 red dot when everything
is actually fine.

**What happens:** Render's free tier puts your backend to sleep after ~15 minutes
of inactivity. When a request comes in:

```
Your app sends fetch() request
        │
        ▼
  Render receives it
        │
        ▼
  "Oh, this server is sleeping. Let me wake it up."
        │
        ▼
  Render boots your Node.js server (installs dependencies, starts the process)
        │
        ▼
  This takes 30–60 seconds (sometimes longer)
        │
        ▼
  Meanwhile, your fetch() might TIME OUT and throw an error
        │
        ▼
  checkBackendStatus() catches the error → returns { connected: false }
        │
        ▼
  Badge shows 🔴 "Connection unavailable"
```

**The fix?** Wait a minute and refresh the page. The server will be awake by then
and respond instantly. This only affects the **first** request after a period of
inactivity.

---

### 7.5 — The Code Walkthrough (Line by Line)

Let's trace through every line of code involved:

**Step 1 — `ComingSoon.jsx` creates the initial state:**

```jsx
const [status, setStatus] = useState('checking');
//                                     ↑
// The badge starts in 'checking' state. The user sees the pulsing 🟡 dot
// and "Connecting to library systems…" immediately — before any network
// request has even been made. This is just the DEFAULT value.
```

**Step 2 — `useEffect` triggers the backend check:**

```jsx
useEffect(() => {
  checkBackendStatus().then((result) => {
    setStatus(result.connected ? 'connected' : 'offline');
  });
}, []);
// The empty [] means: "Run this ONCE, right after the component appears on screen."
//
// What this does:
// 1. Calls checkBackendStatus() — this returns a Promise (because it's async)
// 2. .then() waits for the Promise to resolve
// 3. When it resolves, result is either { connected: true } or { connected: false }
// 4. If connected → setStatus('connected') → badge becomes 🟢
//    If not      → setStatus('offline')    → badge becomes 🔴
```

**Step 3 — `api.js` does the actual network request:**

```javascript
const API_URL = import.meta.env.VITE_API_URL;
// Reads "https://booksstore-hw6x.onrender.com" from your .env file

export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/api/books`);
    // ↑ This line does ALL the network work:
    //   1. DNS lookup (domain → IP)
    //   2. TCP connection (handshake with server)
    //   3. Send HTTP GET request
    //   4. Wait for server to respond
    //   5. Receive the response
    //
    // If ANY of those steps fail → jumps to catch block

    if (!response.ok) {
      // response.ok is TRUE only when status is 200-299
      // If the server sent 404, 500, etc. → this throws
      throw new Error(`Backend responded with status ${response.status}`);
    }

    return { connected: true };
    // 🎉 We only get here if the server responded with 200-299
  } catch (error) {
    return { connected: false, error: error.message };
    // 😞 We get here if:
    //    - fetch() itself failed (network error, CORS, timeout, etc.)
    //    - OR we manually threw because response.ok was false
  }
}
```

**Step 4 — `StatusBadge.jsx` displays the result:**

```jsx
function StatusBadge({ status }) {
  // status is one of: 'checking', 'connected', 'offline'

  const messages = {
    checking: 'Connecting to library systems…',
    connected: 'Connected and ready',
    offline: 'Connection unavailable',
  };

  return (
    <div className={`status-badge status-badge--${status}`}>
      {/*  ↑ This creates class names like:
              status-badge status-badge--checking   → 🟡 pulsing dot
              status-badge status-badge--connected  → 🟢 green dot
              status-badge status-badge--offline    → 🔴 red dot
           The CSS in App.css uses these classes to change the dot color */}
      <span className="status-badge__dot" />
      <span>{messages[status]}</span>
      {/*        ↑ Looks up the right message for the current status */}
    </div>
  );
}
```

---

### 7.6 — How the CSS Makes the Dot Change Color

The dot color is controlled entirely by CSS classes in `App.css`:

```css
/* Default dot style */
.status-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;        /* Makes it a circle */
  background: var(--clay);   /* Default: earthy brown */
}

/* When status is 'checking' → dot pulses */
.status-badge--checking .status-badge__dot {
  background: var(--clay);   /* Brown */
  animation: pulse-dot 1.8s ease-in-out infinite;  /* Pulses forever */
}

/* When status is 'connected' → dot is green */
.status-badge--connected .status-badge__dot {
  background: var(--success);  /* Green: #6d8659 */
}

/* When status is 'offline' → dot is red */
.status-badge--offline .status-badge__dot {
  background: var(--error);    /* Red: #a85a5a */
}
```

The class name `status-badge--${status}` is built dynamically from the `status`
state variable. When `setStatus('connected')` runs, React re-renders, the class
changes from `status-badge--checking` to `status-badge--connected`, and the CSS
automatically applies the green color.

---

### 7.7 — Quick Diagnostic: What to Check When You See 🔴

If you see the red dot, here's a checklist to diagnose the problem:

```
1. Open your browser DevTools (F12 → Network tab)
   → Look for the request to /api/books
   → Check the status code and any error messages

2. Check your .env file
   → Is VITE_API_URL correct?
   → Does it start with https:// ?
   → Is there a trailing slash? (there shouldn't be)
   ✅ Correct: VITE_API_URL=https://booksstore-hw6x.onrender.com
   ❌ Wrong:   VITE_API_URL=https://booksstore-hw6x.onrender.com/
   ❌ Wrong:   VITE_API_URL=booksstore-hw6x.onrender.com

3. Try opening the backend URL directly in your browser
   → Go to: https://booksstore-hw6x.onrender.com/api/books
   → If you see JSON data → backend is fine, problem is CORS or frontend
   → If you see an error page → backend is down

4. Render cold start?
   → If the backend hasn't been used in 15+ minutes, wait 60 seconds
   → Refresh the page and try again

5. Check the browser console (F12 → Console tab)
   → Look for red error messages
   → CORS errors will say something like:
     "Access to fetch at '...' has been blocked by CORS policy"
```

---

### 7.8 — The Big Picture: Frontend vs. Backend

This is the most important concept to understand:

```
┌─────────────────────────┐         ┌─────────────────────────┐
│     YOUR FRONTEND       │         │      YOUR BACKEND       │
│  (React app in browser) │         │  (Node.js on Render)    │
│                         │         │                         │
│  - Runs in the USER's   │  HTTP   │  - Runs on a server     │
│    browser              │ Request │    somewhere on the     │
│  - Shows the UI         │ ──────► │    internet             │
│  - Sends requests       │         │  - Processes requests   │
│  - Displays responses   │ ◄────── │  - Talks to database    │
│                         │  HTTP   │  - Sends back data      │
│  localhost:5173         │ Response │  - Has the real data    │
│  (during development)   │         │                         │
└─────────────────────────┘         └─────────────────────────┘

  The frontend CANNOT access the database directly.
  It MUST ask the backend, which acts as a middleman.

  The status badge simply answers one question:
  "Can my frontend successfully talk to my backend right now?"

    🟢 Yes → Connected and ready
    🔴 No  → Connection unavailable
```

The frontend and backend are **two completely separate programs** running on
**two completely separate computers**. The frontend runs inside your browser.
The backend runs on Render's servers. They talk to each other over the internet
using HTTP requests — just like when you visit any website.

The `checkBackendStatus()` function is simply asking: *"Hey backend, are you
there? Can you respond?"* If yes → 🟢. If anything goes wrong → 🔴.

---

## 8. What You'll Need to Install Next

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

## 9. How to Run This App

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

## 10. How to Prompt Me for Features

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
