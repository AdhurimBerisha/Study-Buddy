import { lazy, Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner";

// Lazy load the main CodeEditor component
const LazyCodeEditorComponent = lazy(() => import("./CodeEditor"));

// Lazy load individual CodeEditor components for more granular control
export const LazyCodeEditorHeader = lazy(() => import("./CodeEditorHeader"));
export const LazyCodeEditorSidebar = lazy(() => import("./CodeEditorSidebar"));
export const LazyCodeEditorMain = lazy(() => import("./CodeEditorMain"));
export const LazyCodeEditorPreview = lazy(() => import("./CodeEditorPreview"));
export const LazyCodeEditorConsole = lazy(() => import("./CodeEditorConsole"));
export const LazyCodeEditorStatusBar = lazy(
  () => import("./CodeEditorStatusBar")
);

// Main lazy CodeEditor with Suspense wrapper
interface LazyCodeEditorProps {
  files?: any;
  template?: string;
  showFileExplorer?: boolean;
  showConsole?: boolean;
  showPreview?: boolean;
  onToggleFileExplorer?: () => void;
  onToggleConsole?: () => void;
  onTogglePreview?: () => void;
  height?: string;
  consoleHeight?: string;
  className?: string;
}

export const LazyCodeEditor = (props: LazyCodeEditorProps) => {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <LoadingSpinner
              text="Loading Code Editor..."
              size="lg"
              className="min-h-[400px]"
            />
          </div>
        </div>
      }
    >
      <LazyCodeEditorComponent {...props} />
    </Suspense>
  );
};

// Export the lazy components for individual use
export default LazyCodeEditor;
