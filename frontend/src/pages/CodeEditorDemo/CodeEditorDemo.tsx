import { useState } from "react";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { getFilesForTemplate } from "../../components/CodeEditor/constants";
import type { TemplateType } from "../../components/CodeEditor/types";
import { FaCode, FaPlay } from "react-icons/fa";
import bannerBg from "../../assets/bannerBg.webp";
import Banner from "../../components/Banner";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

const CodeEditorDemo = () => {
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("react");

  useCustomPageTitle("Code Editor");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0">
            <div className="flex items-center gap-3 order-2 sm:order-1 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
              <FaCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Interactive Code Editor
              </h1>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 order-1 sm:order-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 mb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm text-blue-800 dark:text-blue-200">
            <FaPlay className="w-4 h-4 mt-0.5 sm:mt-0 flex-shrink-0" />
            <span className="text-center sm:text-left">
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
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        />
      </div>
      <Banner
        imageSrc={bannerBg}
        title="Start learning a new language today!"
        buttonText="Sign Up"
      />
    </div>
  );
};

export default CodeEditorDemo;
