import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import Button from "./Button";
import {
  FaCode,
  FaPlay,
  FaUndo,
  FaTrash,
  FaCopy,
  FaDownload,
} from "react-icons/fa";

const FreeCodeEditor = () => {
  const [code, setCode] = useState(`// Welcome to StudyBuddy Code Editor!
// Practice coding in your free time
// Choose your language and start coding!

function helloWorld() {
  console.log("Hello, StudyBuddy!");
  return "Ready to code!";
}

helloWorld();`);

  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
  ];

  const runCode = async () => {
    setIsRunning(true);
    try {
      if (language === "javascript") {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((arg) => String(arg)).join(" "));
        };

        const result = new Function(code)();
        console.log = originalLog;

        const outputText =
          logs.length > 0
            ? `Console Output:\n${logs.join("\n")}\n\nReturn Value: ${result}`
            : `Result: ${result}`;
        setOutput(outputText);
      } else {
        setOutput(
          `Language "${language}" execution requires backend support. For now, you can practice syntax and structure.`
        );
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => setOutput("");
  const resetCode = () => setCode("// Start coding here...");
  const copyCode = () => navigator.clipboard.writeText(code);
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Template functions to avoid template literal conflicts
  const getFunctionTemplate = () => `// JavaScript Function Template
function exampleFunction(param) {
  // Your logic here
  return param;
}

// Test the function
console.log(exampleFunction("Hello World"));`;

  const getClassTemplate = () => `// JavaScript Class Template
class ExampleClass {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return "Hello, " + this.name + "!";
  }
}

const instance = new ExampleClass("StudyBuddy");
console.log(instance.greet());`;

  const getArrayMethodsTemplate = () => `// Array Methods Practice
const numbers = [1, 2, 3, 4, 5];

// Map example
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Filter example
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log("Even numbers:", evenNumbers);

// Reduce example
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);`;

  const getAsyncTemplate = () => `// Async/Await Example
async function fetchData() {
  try {
    // Simulate API call
    const response = await new Promise(resolve => 
      setTimeout(() => resolve("Data fetched!"), 1000)
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6 shadow-lg">
            <FaCode className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Free Code Editor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Practice coding in your free time. Choose your language and start
            coding! Perfect for experimenting with new concepts, practicing
            algorithms, or just coding for fun.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Editor */}
          <div className="xl:col-span-2 space-y-6">
            {/* Editor Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Language:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetCode}
                    className="flex items-center shadow-sm"
                  >
                    <FaUndo className="mr-2" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyCode}
                    className="flex items-center shadow-sm"
                  >
                    <FaCopy className="mr-2" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadCode}
                    className="flex items-center shadow-sm"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center shadow-lg"
                  >
                    <FaPlay className="mr-2" />
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-gray-300 text-sm font-medium">
                    {language.toUpperCase()} • StudyBuddy Editor
                  </span>
                </div>
              </div>
              <Editor
                height="700px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  tabSize: 2,
                  insertSpaces: true,
                  autoIndent: "full",
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>

          {/* Right Column - Output & Features */}
          <div className="space-y-6">
            {/* Output Panel */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Output</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearOutput}
                    className="text-xs bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="bg-gray-900 text-green-400 p-6 font-mono text-sm h-80 overflow-auto">
                <pre className="whitespace-pre-wrap">
                  {output ||
                    "// Output will appear here when you run your code...\n\nTry running the JavaScript code to see results!"}
                </pre>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaCode className="mr-3 text-blue-600" />
                Quick Templates
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCode(getFunctionTemplate())}
                  className="text-sm h-auto py-3 text-left justify-start shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="text-left">
                    <div className="font-semibold">Function Template</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Basic function structure with parameters
                    </div>
                  </div>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCode(getClassTemplate())}
                  className="text-sm h-auto py-3 text-left justify-start shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="text-left">
                    <div className="font-semibold">Class Template</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ES6 class with constructor and methods
                    </div>
                  </div>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCode(getArrayMethodsTemplate())}
                  className="text-sm h-auto py-3 text-left justify-start shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="text-left">
                    <div className="font-semibold">Array Methods</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Map, filter, and reduce examples
                    </div>
                  </div>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCode(getAsyncTemplate())}
                  className="text-sm h-auto py-3 text-left justify-start shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="text-left">
                    <div className="font-semibold">Async/Await</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Modern async programming pattern
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">💡</span>
                Coding Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>
                    Use{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded-md font-mono text-blue-800">
                      console.log()
                    </code>{" "}
                    to see your output
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>
                    Try different languages to practice syntax and structure
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>Use the templates to get started quickly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>
                    Experiment with different coding patterns and algorithms
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>Save your code using the download button</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeCodeEditor;
