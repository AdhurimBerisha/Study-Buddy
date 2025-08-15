import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
import type { CodeEditorMainProps } from "./types";

const CodeEditorMain = ({ showPreview }: CodeEditorMainProps) => {
  return (
    <div
      className="flex-1 relative"
      style={{ width: showPreview ? "45%" : "calc(100% - 200px)" }}
    >
      <SandpackCodeEditor className="font-mono border-none w-full" />

      {/* Editor Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-blue-100 dark:border-blue-800 flex items-center justify-between px-3 text-xs text-blue-700 dark:text-blue-300">
        <span className="font-medium">JavaScript</span>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorMain;
