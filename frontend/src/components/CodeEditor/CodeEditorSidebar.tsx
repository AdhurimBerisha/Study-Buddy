import { SandpackFileExplorer } from "@codesandbox/sandpack-react";
import type { CodeEditorSidebarProps } from "./types";

const CodeEditorSidebar = ({ showFileExplorer }: CodeEditorSidebarProps) => {
  if (!showFileExplorer) return null;

  return (
    <div className="w-full lg:w-auto border-r border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          Files
        </h4>
      </div>
      <div className="overflow-x-auto">
        <SandpackFileExplorer className="border-none w-full lg:w-[200px] min-w-[200px]" />
      </div>
    </div>
  );
};

export default CodeEditorSidebar;
