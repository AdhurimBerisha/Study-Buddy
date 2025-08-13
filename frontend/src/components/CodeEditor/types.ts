export type TemplateType =
  | "react"
  | "react-ts"
  | "vanilla"
  | "vanilla-ts"
  | "angular"
  | "vue"
  | "vue-ts";

export interface CodeEditorProps {
  files?: Record<string, string>;
  template?: TemplateType;
  showFileExplorer?: boolean;
  showConsole?: boolean;
  showPreview?: boolean;
  onToggleFileExplorer?: (show: boolean) => void;
  onToggleConsole?: (show: boolean) => void;
  onTogglePreview?: (show: boolean) => void;
  height?: string;
  consoleHeight?: string;
  className?: string;
}

export interface CodeEditorHeaderProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  showFileExplorer: boolean;
  showConsole: boolean;
  showPreview: boolean;
  onToggleFileExplorer?: (show: boolean) => void;
  onToggleConsole?: (show: boolean) => void;
  onTogglePreview?: (show: boolean) => void;
}

export interface CodeEditorSidebarProps {
  showFileExplorer: boolean;
}

export interface CodeEditorMainProps {
  showPreview: boolean;
  showFileExplorer: boolean;
}

export interface CodeEditorPreviewProps {
  showPreview: boolean;
}

export interface CodeEditorConsoleProps {
  showConsole: boolean;
  consoleHeight: string;
}
