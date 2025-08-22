import { lazy, Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner";
import type { CodeEditorProps } from "./types";

const LazyCodeEditorComponent = lazy(() => import("./CodeEditor"));

export const LazyCodeEditorHeader = lazy(() => import("./CodeEditorHeader"));
export const LazyCodeEditorSidebar = lazy(() => import("./CodeEditorSidebar"));
export const LazyCodeEditorMain = lazy(() => import("./CodeEditorMain"));
export const LazyCodeEditorPreview = lazy(() => import("./CodeEditorPreview"));
export const LazyCodeEditorConsole = lazy(() => import("./CodeEditorConsole"));
export const LazyCodeEditorStatusBar = lazy(
  () => import("./CodeEditorStatusBar")
);

type LazyCodeEditorProps = CodeEditorProps;

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

export default LazyCodeEditor;
