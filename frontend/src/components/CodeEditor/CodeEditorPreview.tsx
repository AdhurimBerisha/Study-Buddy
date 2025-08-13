import { SandpackPreview } from "@codesandbox/sandpack-react";
import type { CodeEditorPreviewProps } from "./types";

const CodeEditorPreview = ({ showPreview }: CodeEditorPreviewProps) => {
  if (!showPreview) return null;

  return (
    <div
      className="border-l border-gray-200 flex-shrink-0 overflow-hidden bg-white"
      style={{ width: "65%" }}
    >
      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <h4 className="text-sm font-semibold text-green-700 flex items-center gap-2">
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
        className="h-full w-full bg-white"
      />
    </div>
  );
};

export default CodeEditorPreview;
