import React, { useState, useEffect } from "react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import Button from "./Button";

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
  height = "600px",
  consoleHeight = "200px",
  className = "",
}: CodeEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Console resizing
  const [currentConsoleHeight, setCurrentConsoleHeight] =
    useState(consoleHeight);
  const [isResizingConsole, setIsResizingConsole] = useState(false);

  // Preview resizing
  const [previewWidth, setPreviewWidth] = useState(60); // % width of preview
  const [isResizingPreview, setIsResizingPreview] = useState(false);

  const customTheme = {
    colors: {
      surface1: "#f8fafc",
      surface2: "#f1f5f9",
      surface3: "#e2e8f0",
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

  // Console height handlers
  const handleConsoleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingConsole(true);
  };
  const handleConsoleMouseMove = (e: MouseEvent) => {
    if (isResizingConsole) {
      const editorContainer = document.querySelector(
        "[data-editor-container]"
      ) as HTMLElement;
      if (!editorContainer) return;
      const rect = editorContainer.getBoundingClientRect();
      const newHeight = rect.bottom - e.clientY;
      const minHeight = 100;
      const maxHeight = parseInt(height) - 200;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setCurrentConsoleHeight(`${newHeight}px`);
      }
    }
  };
  const handleConsoleMouseUp = () => setIsResizingConsole(false);

  // Preview width handlers
  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingPreview(true);
  };
  const handlePreviewMouseMove = (e: MouseEvent) => {
    if (!isResizingPreview) return;
    const container = document.querySelector(
      "[data-editor-container]"
    ) as HTMLElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newPercent = ((rect.width - offsetX) / rect.width) * 100;
    if (newPercent >= 20 && newPercent <= 80) {
      setPreviewWidth(newPercent);
    }
  };
  const handlePreviewMouseUp = () => setIsResizingPreview(false);

  // Event listeners
  useEffect(() => {
    if (isResizingConsole) {
      document.addEventListener("mousemove", handleConsoleMouseMove);
      document.addEventListener("mouseup", handleConsoleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleConsoleMouseMove);
      document.removeEventListener("mouseup", handleConsoleMouseUp);
    };
  }, [isResizingConsole]);

  useEffect(() => {
    if (isResizingPreview) {
      document.addEventListener("mousemove", handlePreviewMouseMove);
      document.addEventListener("mouseup", handlePreviewMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handlePreviewMouseMove);
      document.removeEventListener("mouseup", handlePreviewMouseUp);
    };
  }, [isResizingPreview]);

  useEffect(() => {
    setCurrentConsoleHeight(consoleHeight);
  }, [consoleHeight]);

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <h3 className="text-white font-semibold font-heading">Code Editor</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-white border-white hover:bg-white hover:text-blue-600"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>

        {/* Editor Container */}
        <div
          className={`transition-all duration-300 ${
            isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
          }`}
          style={{ height: isFullscreen ? "100vh" : height }}
          data-editor-container
        >
          <SandpackProvider
            template={template}
            files={files}
            theme={customTheme}
          >
            <SandpackLayout className="min-h-0 flex flex-col overflow-hidden">
              <div
                className="flex overflow-hidden"
                style={{
                  height: showConsole
                    ? `calc(${height} - ${currentConsoleHeight})`
                    : height,
                }}
              >
                {showFileExplorer && (
                  <SandpackFileExplorer
                    className="border-r border-gray-200"
                    style={{ width: "200px" }}
                  />
                )}
                <SandpackCodeEditor
                  className="font-mono"
                  style={{
                    width: showPreview
                      ? `${100 - previewWidth}%`
                      : "calc(100% - 200px)",
                  }}
                />

                {showPreview && (
                  <>
                    {/* Draggable Divider (Visible Handle) */}
                    <div
                      className="w-2 bg-gray-300 hover:bg-blue-400 cursor-ew-resize flex items-center justify-center"
                      style={{
                        marginLeft: "-1px",
                        marginRight: "-1px",
                      }}
                      onMouseDown={handlePreviewMouseDown}
                    >
                      <div className="w-1 h-8 bg-gray-500 rounded"></div>
                    </div>

                    {/* Preview Panel */}
                    <div
                      className="border-l border-gray-200 flex-shrink-0 overflow-hidden bg-white"
                      style={{ width: `${previewWidth}%` }}
                    >
                      <SandpackPreview
                        showNavigator={true}
                        showRefreshButton={true}
                        className="h-full w-full bg-white"
                      />
                    </div>
                  </>
                )}
              </div>

              {showConsole && (
                <>
                  {/* Resize Handle for Console */}
                  <div
                    className="h-1 bg-gray-200 hover:bg-blue-400 cursor-ns-resize transition-colors duration-200 flex items-center justify-center group"
                    onMouseDown={handleConsoleMouseDown}
                  >
                    <div className="w-8 h-0.5 bg-gray-400 group-hover:bg-blue-500 rounded-full transition-colors duration-200"></div>
                  </div>
                  {/* Console */}
                  <div
                    className="border-t border-gray-200 flex-shrink-0 overflow-hidden"
                    style={{ height: currentConsoleHeight }}
                  >
                    <SandpackConsole className="text-sm h-full w-full" />
                  </div>
                </>
              )}
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
