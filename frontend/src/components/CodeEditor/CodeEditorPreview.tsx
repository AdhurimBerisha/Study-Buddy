import { SandpackPreview } from "@codesandbox/sandpack-react";
import type { CodeEditorPreviewProps } from "./types";

const CodeEditorPreview = ({ showPreview }: CodeEditorPreviewProps) => {
  if (!showPreview) return null;

  return (
    <div className="border-l border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-hidden bg-white dark:bg-gray-800 w-full lg:w-[50%]">
      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-green-800">
        <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
  );
};

export default CodeEditorPreview;
