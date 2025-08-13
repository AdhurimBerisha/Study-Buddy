import { SandpackFileExplorer } from "@codesandbox/sandpack-react";
import type { CodeEditorSidebarProps } from "./types";

const CodeEditorSidebar = ({ showFileExplorer }: CodeEditorSidebarProps) => {
  if (!showFileExplorer) return null;

  return (
    <div className="border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <h4 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
  );
};

export default CodeEditorSidebar;
