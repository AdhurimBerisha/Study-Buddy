import React, { useState } from "react";
import CodeEditor from "../../components/CodeEditor";
import Button from "../../components/Button";

const CodeEditorDemo = () => {
  const [activeTab, setActiveTab] = useState("react");
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  const reactFiles = {
    "/App.js": `import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6 font-heading">
          Interactive Counter
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <p className="text-6xl font-bold text-blue-600 mb-4">{count}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCount(count - 1)}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Decrease
            </button>
            <button
              onClick={() => setCount(count + 1)}
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              Increase
            </button>
          </div>
        </div>
        <p className="text-lg text-gray-700 font-inter">
          Click the buttons to see the counter in action!
        </p>
      </div>
    </div>
  );
}`,
    "/App.css": `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

.font-heading {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
}

.font-inter {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

button {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}`,
  };

  const vanillaFiles = {
    "/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla JS Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1 class="title">Vanilla JavaScript Demo</h1>
        <div class="card">
            <p class="counter" id="counter">0</p>
            <div class="buttons">
                <button onclick="decrease()" class="btn btn-decrease">Decrease</button>
                <button onclick="increase()" class="btn btn-increase">Increase</button>
            </div>
        </div>
        <p class="description">Pure JavaScript without any framework!</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    "/styles.css": `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    background: linear-gradient(135deg, #dbeafe 0%, #f1f5f9 50%, #dbeafe 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
}

.title {
    font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: #2563eb;
    margin-bottom: 2rem;
}

.card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.counter {
    font-size: 4rem;
    font-weight: 700;
    color: #2563eb;
    margin-bottom: 1.5rem;
}

.buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.75rem;
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-decrease {
    background: #ef4444;
    color: white;
}

.btn-decrease:hover {
    background: #dc2626;
}

.btn-increase {
    background: #10b981;
    color: white;
}

.btn-increase:hover {
    background: #059669;
}

.description {
    font-size: 1.125rem;
    color: #374151;
}`,
    "/script.js": `let count = 0;

function updateCounter() {
    document.getElementById('counter').textContent = count;
}

function decrease() {
    count--;
    updateCounter();
}

function increase() {
    count++;
    updateCounter();
}

// Initialize counter
updateCounter();`,
  };

  const typescriptFiles = {
    "/App.tsx": `import React, { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = (text: string): void => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number): void => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center font-heading">
          TypeScript Todo App
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo(inputValue)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => addTodo(inputValue)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}`,
    "/App.css": `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

.font-heading {
  font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif;
}

.font-inter {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}`,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4 font-heading">
            Code Editor Demo
          </h1>
          <p className="text-lg text-gray-700 font-inter max-w-3xl mx-auto">
            Experience the power of our custom code editor built with Sandpack
            React. Choose from different templates and see your code come to
            life in real-time.
          </p>
        </div>

        {/* Main Code Editor */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-heading">
            Code Editor
          </h2>
          <CodeEditor
            files={
              activeTab === "react"
                ? reactFiles
                : activeTab === "typescript"
                ? typescriptFiles
                : vanillaFiles
            }
            template={
              activeTab === "react"
                ? "react"
                : activeTab === "typescript"
                ? "react-ts"
                : "vanilla"
            }
            showFileExplorer={showFileExplorer}
            showConsole={showConsole}
            showPreview={showPreview}
            height="600px"
            consoleHeight="200px"
          />
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading">
            Choose Template
          </h3>
          <div className="flex gap-4">
            <Button
              variant={activeTab === "react" ? "primary" : "outline"}
              onClick={() => setActiveTab("react")}
            >
              React
            </Button>
            <Button
              variant={activeTab === "typescript" ? "primary" : "outline"}
              onClick={() => setActiveTab("typescript")}
            >
              TypeScript
            </Button>
            <Button
              variant={activeTab === "vanilla" ? "primary" : "outline"}
              onClick={() => setActiveTab("vanilla")}
            >
              Vanilla JS
            </Button>
          </div>
        </div>

        {/* Editor Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading">
            Editor Options
          </h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showFileExplorer}
                onChange={(e) => setShowFileExplorer(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">File Explorer</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showConsole}
                onChange={(e) => setShowConsole(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Console</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Live Preview</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorDemo;
