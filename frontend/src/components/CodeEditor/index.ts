export { default as CodeEditor } from "./CodeEditor.tsx";
export { default as CodeEditorHeader } from "./CodeEditorHeader.tsx";
export { default as CodeEditorSidebar } from "./CodeEditorSidebar.tsx";
export { default as CodeEditorMain } from "./CodeEditorMain.tsx";
export { default as CodeEditorPreview } from "./CodeEditorPreview.tsx";
export { default as CodeEditorConsole } from "./CodeEditorConsole.tsx";
export { default as CodeEditorStatusBar } from "./CodeEditorStatusBar.tsx";

export type {
  TemplateType,
  CodeEditorProps,
  CodeEditorHeaderProps,
  CodeEditorSidebarProps,
  CodeEditorMainProps,
  CodeEditorPreviewProps,
  CodeEditorConsoleProps,
} from "./types";

export {
  defaultFiles,
  reactFiles,
  vanillaFiles,
  typescriptFiles,
  getFilesForTemplate,
} from "./constants";
