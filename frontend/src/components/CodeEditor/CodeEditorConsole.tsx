import { SandpackConsole } from "@codesandbox/sandpack-react";
import type { CodeEditorConsoleProps } from "./types";

const CodeEditorConsole = ({
  showConsole,
  consoleHeight,
}: CodeEditorConsoleProps) => {
  if (!showConsole) return null;

  const clearConsole = () => {
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
        (el.className.includes("console") || el.className.includes("log"))
      ) {
        if (el.innerHTML && el.innerHTML.length > 0) {
          el.innerHTML = "";
        }
      }
    });
  };

  return (
    <div
      className="border-t border-gray-200 flex-shrink-0 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800"
      style={{ height: consoleHeight }}
    >
      <div className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.666l-.345.667a.75.75 0 11-1.374-.666l.345-.667A6.5 6.5 0 1116 10a6.5 6.5 0 01-6.5 6.5A6.5 6.5 0 013 10a6.5 6.5 0 016.5-6.5A6.5 6.5 0 0116 10z"
              clipRule="evenodd"
            />
          </svg>
          Console
        </h4>
        <button
          onClick={clearConsole}
          className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 rounded transition-colors flex items-center gap-1"
          title="Clear console"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
  );
};

export default CodeEditorConsole;
