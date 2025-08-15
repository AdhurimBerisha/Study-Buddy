import { useState } from "react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackConsole,
} from "@codesandbox/sandpack-react";

interface CodeEditorProps {
  files?: Record<string, string>;
  template?:
    | "react"
    | "react-ts"
    | "vanilla"
    | "vanilla-ts"
    | "angular"
    | "vue"
    | "vue-ts";
  showFileExplorer?: boolean;
  showConsole?: boolean;
  showPreview?: boolean;
  onToggleFileExplorer?: (show: boolean) => void;
  onToggleConsole?: (show: boolean) => void;
  onTogglePreview?: (show: boolean) => void;
  height?: string;
  consoleHeight?: string;
  className?: string;
}

const defaultFiles = {
  "/App.js": `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4 font-heading">
          Welcome to StudyBuddy
        </h1>
        <p className="text-lg text-gray-700 font-inter">
          Start coding and learning!
        </p>
      </div>
    </div>
  );
}`,
  "/index.css": `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
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

const CodeEditor = ({
  files = defaultFiles,
  template = "react",
  showFileExplorer = true,
  showConsole = true,
  showPreview = true,
  onToggleFileExplorer,
  onToggleConsole,
  onTogglePreview,
  height = "600px",
  consoleHeight = "200px",
  className = "",
}: CodeEditorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    | "react"
    | "react-ts"
    | "vanilla"
    | "vanilla-ts"
    | "angular"
    | "vue"
    | "vue-ts"
  >(template);
  const customTheme = {
    colors: {
      surface1: "#ffffff",
      surface2: "#f8fafc",
      surface3: "#f1f5f9",
      clickable: "#64748b",
      base: "#334155",
      disabled: "#94a3b8",
      hover: "#475569",
      accent: "#2563eb",
      error: "#dc2626",
      errorSurface: "#fef2f2",
    },
    syntax: {
      plain: "#334155",
      comment: "#94a3b8",
      keyword: "#2563eb",
      definition: "#7c3aed",
      punctuation: "#64748b",
      property: "#059669",
      tag: "#dc2626",
      static: "#7c2d12",
      string: "#059669",
    },
    font: {
      body: "Inter, ui-sans-serif, system-ui, sans-serif",
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      size: "14px",
      lineHeight: "1.5",
    },
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-3 h-3 bg-red-400 rounded-full shadow-inner"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-inner"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-inner"></div>
          </div>

          <h3 className="text-white font-bold text-lg font-heading relative z-10 flex items-center gap-2">
            Code Editor
          </h3>

          <div className="flex items-center gap-3 relative z-10">
            <div className="flex gap-2">
              {(
                [
                  "react",
                  "react-ts",
                  "vanilla",
                  "vanilla-ts",
                  "angular",
                  "vue",
                  "vue-ts",
                ] as const
              ).map((temp) => (
                <button
                  key={temp}
                  onClick={() => setSelectedTemplate(temp)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    selectedTemplate === temp
                      ? "bg-white dark:bg-gray-200 text-blue-700 dark:text-blue-800 shadow-md"
                      : "text-blue-100 hover:bg-blue-500/20"
                  }`}
                >
                  {temp.replace("-", " ").toUpperCase()}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-blue-400/30"></div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-xs text-blue-100">
                <input
                  type="checkbox"
                  checked={showFileExplorer}
                  onChange={(e) => {
                    if (onToggleFileExplorer) {
                      onToggleFileExplorer(e.target.checked);
                    }
                  }}
                  className="w-3 h-3 text-blue-600 rounded border-blue-300"
                />
                Files
              </label>
              <label className="flex items-center gap-1 text-xs text-blue-100">
                <input
                  type="checkbox"
                  checked={showConsole}
                  onChange={(e) => {
                    if (onToggleConsole) {
                      onToggleConsole(e.target.checked);
                    }
                  }}
                  className="w-3 h-3 text-blue-600 rounded border-blue-300"
                />
                Console
              </label>
              <label className="flex items-center gap-1 text-xs text-blue-100">
                <input
                  type="checkbox"
                  checked={showPreview}
                  onChange={(e) => {
                    if (onTogglePreview) {
                      onTogglePreview(e.target.checked);
                    }
                  }}
                  className="w-3 h-3 text-blue-600 rounded border-blue-300"
                />
                Preview
              </label>
            </div>
            <div className="w-px h-6 bg-blue-400/30"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-blue-100 text-sm font-medium">Ready</span>
            </div>
          </div>
        </div>

        <div style={{ height }} data-editor-container>
          <SandpackProvider
            template={selectedTemplate}
            files={files}
            theme={customTheme}
          >
            <SandpackLayout className="min-h-0 flex flex-col overflow-hidden">
              <div
                className="flex overflow-hidden"
                style={{
                  height: showConsole
                    ? `calc(${height} - ${consoleHeight})`
                    : height,
                }}
              >
                {showFileExplorer && (
                  <div className="border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                      <h4 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                        Files
                      </h4>
                    </div>
                    <SandpackFileExplorer
                      className="border-none"
                      style={{ width: "200px" }}
                    />
                  </div>
                )}

                <div
                  className="flex-1 relative"
                  style={{ width: showPreview ? "45%" : "calc(100% - 200px)" }}
                >
                  <SandpackCodeEditor className="font-mono border-none w-full" />

                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 flex items-center justify-between px-3 text-xs text-blue-700">
                    <span className="font-medium">JavaScript</span>
                    <div className="flex items-center gap-4">
                      <span>Ln 1, Col 1</span>
                      <span>Spaces: 2</span>
                    </div>
                  </div>
                </div>

                {showPreview && (
                  <div
                    className="border-l border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-hidden bg-white dark:bg-gray-800"
                    style={{ width: "65%" }}
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-green-800">
                      <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Preview
                      </h4>
                    </div>
                    <SandpackPreview
                      showNavigator={true}
                      showRefreshButton={true}
                      className="h-full w-full bg-white dark:bg-gray-800"
                    />
                  </div>
                )}
              </div>

              {showConsole && (
                <div
                  className="border-t border-gray-200 flex-shrink-0 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800"
                  style={{ height: consoleHeight }}
                >
                  <div className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.666l-.345.667a.75.75 0 11-1.374-.666l.345-.667A6.5 6.5 0 1116 10a6.5 6.5 0 01-6.5 6.5A6.5 6.5 0 013 10a6.5 6.5 0 016.5-6.5A6.5 6.5 0 0116 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Console
                    </h4>
                    <button
                      onClick={() => {
                        const selectors = [
                          "[data-sandpack-console]",
                          ".sp-console",
                          ".sp-console-content",
                          '[class*="console"]',
                          '[class*="Console"]',
                        ];

                        for (const selector of selectors) {
                          const elements = document.querySelectorAll(selector);
                          elements.forEach((el) => {
                            if (
                              el.innerHTML.includes("log") ||
                              el.innerHTML.includes("error") ||
                              el.innerHTML.includes("warn")
                            ) {
                              el.innerHTML = "";
                            }
                          });
                        }

                        const allElements = document.querySelectorAll("*");
                        allElements.forEach((el) => {
                          if (
                            el.className &&
                            typeof el.className === "string" &&
                            (el.className.includes("console") ||
                              el.className.includes("log"))
                          ) {
                            if (el.innerHTML && el.innerHTML.length > 0) {
                              el.innerHTML = "";
                            }
                          }
                        });
                      }}
                      className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 rounded transition-colors flex items-center gap-1"
                      title="Clear console"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Clear
                    </button>
                  </div>
                  <SandpackConsole className="text-sm h-full w-full bg-transparent" />
                </div>
              )}
            </SandpackLayout>
          </SandpackProvider>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Connected
            </span>
            <span>TypeScript 5.0</span>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>LF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
