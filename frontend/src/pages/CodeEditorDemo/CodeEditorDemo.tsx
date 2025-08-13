import { useState } from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { getFilesForTemplate } from "../../components/CodeEditor/constants";
import type { TemplateType } from "../../components/CodeEditor/types";
import { FaCode, FaPlay } from "react-icons/fa";

const CodeEditorDemo = () => {
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("react");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
              <FaCode className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Interactive Code Editor
              </h1>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-b border-blue-200 mb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 text-sm text-blue-800">
            <FaPlay className="w-4 h-4" />
            <span>
              <strong>Tip:</strong> Start coding! The editor supports live
              preview, file management, and console output. Try changing the
              code to see real-time updates.
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <CodeEditor
          files={getFilesForTemplate(selectedTemplate)}
          template={selectedTemplate}
          showFileExplorer={showFileExplorer}
          showConsole={showConsole}
          showPreview={showPreview}
          onToggleFileExplorer={setShowFileExplorer}
          onToggleConsole={setShowConsole}
          onTogglePreview={setShowPreview}
          height="calc(100vh - 200px)"
          consoleHeight="200px"
          className="max-w-7xl mx-auto"
        />
      </div>
    </div>
  );
};

export default CodeEditorDemo;
