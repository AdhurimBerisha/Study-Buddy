import { useState } from "react";
import { SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";
import CodeEditorHeader from "./CodeEditorHeader";
import CodeEditorSidebar from "./CodeEditorSidebar";
import CodeEditorMain from "./CodeEditorMain";
import CodeEditorPreview from "./CodeEditorPreview";
import CodeEditorConsole from "./CodeEditorConsole";
import CodeEditorStatusBar from "./CodeEditorStatusBar";
import { customTheme } from "./theme";
import { defaultFiles } from "./constants";
import type { CodeEditorProps, TemplateType } from "./types";

const CodeEditor = ({
  files = defaultFiles,
  template = "react",
  showFileExplorer = true,
  showConsole = true,
  showPreview = true,
  onToggleFileExplorer,
  onToggleConsole,
  onTogglePreview,
  height = "600px",
  consoleHeight = "200px",
  className = "",
}: CodeEditorProps) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>(template);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template as TemplateType);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <CodeEditorHeader
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
          showFileExplorer={showFileExplorer}
          showConsole={showConsole}
          showPreview={showPreview}
          onToggleFileExplorer={onToggleFileExplorer}
          onToggleConsole={onToggleConsole}
          onTogglePreview={onTogglePreview}
        />

        <div style={{ height }} data-editor-container>
          <SandpackProvider
            template={selectedTemplate}
            files={files}
            theme={customTheme}
          >
            <SandpackLayout className="min-h-0 flex flex-col overflow-hidden">
              <div
                className="flex overflow-hidden"
                style={{
                  height: showConsole
                    ? `calc(${height} - ${consoleHeight})`
                    : height,
                }}
              >
                <CodeEditorSidebar showFileExplorer={showFileExplorer} />
                <CodeEditorMain
                  showPreview={showPreview}
                  showFileExplorer={showFileExplorer}
                />
                <CodeEditorPreview showPreview={showPreview} />
              </div>

              <CodeEditorConsole
                showConsole={showConsole}
                consoleHeight={consoleHeight}
              />
            </SandpackLayout>
          </SandpackProvider>
        </div>

        <CodeEditorStatusBar />
      </div>
    </div>
  );
};

export default CodeEditor;
