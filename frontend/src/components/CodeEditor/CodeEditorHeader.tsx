import type { CodeEditorHeaderProps } from "./types";

const CodeEditorHeader = ({
  selectedTemplate,
  onTemplateChange,
  showFileExplorer,
  showConsole,
  showPreview,
  onToggleFileExplorer,
  onToggleConsole,
  onTogglePreview,
}: CodeEditorHeaderProps) => {
  const templates = [
    "react",
    "react-ts",
    "vanilla",
    "vanilla-ts",
    "angular",
    "vue",
    "vue-ts",
  ] as const;

  const handleToggleFileExplorer = (show: boolean) => {
    if (onToggleFileExplorer) {
      onToggleFileExplorer(show);
    }
  };

  const handleToggleConsole = (show: boolean) => {
    if (onToggleConsole) {
      onToggleConsole(show);
    }
  };

  const handleTogglePreview = (show: boolean) => {
    if (onTogglePreview) {
      onTogglePreview(show);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-4 sm:px-6 py-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
      </div>

      <div className="lg:hidden flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full shadow-inner"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-inner"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-inner"></div>
          </div>

          <h3 className="text-white font-bold text-lg font-heading flex items-center gap-2">
            Code Editor
          </h3>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-blue-100 text-sm font-medium">Ready</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-center">
          <div className="flex gap-1 overflow-x-auto">
            {templates.map((temp) => (
              <button
                key={temp}
                onClick={() => onTemplateChange(temp)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedTemplate === temp
                    ? "bg-white dark:bg-gray-200 text-blue-700 dark:text-blue-800 shadow-md"
                    : "text-blue-100 hover:bg-blue-500/20"
                }`}
              >
                {temp.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1 text-xs text-blue-100">
              <input
                type="checkbox"
                checked={showFileExplorer}
                onChange={(e) => handleToggleFileExplorer(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded border-blue-300"
              />
              Files
            </label>
            <label className="flex items-center gap-1 text-xs text-blue-100">
              <input
                type="checkbox"
                checked={showConsole}
                onChange={(e) => handleToggleConsole(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded border-blue-300"
              />
              Console
            </label>
            <label className="flex items-center gap-1 text-xs text-blue-100">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => handleTogglePreview(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded border-blue-300"
              />
              Preview
            </label>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full shadow-inner"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-inner"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full shadow-inner"></div>
        </div>

        <h3 className="text-white font-bold text-lg font-heading relative z-10 flex items-center gap-2">
          Code Editor
        </h3>

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex gap-2">
            {templates.map((temp) => (
              <button
                key={temp}
                onClick={() => onTemplateChange(temp)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  selectedTemplate === temp
                    ? "bg-white dark:bg-gray-200 text-blue-700 dark:text-blue-800 shadow-md"
                    : "text-blue-100 hover:bg-blue-500/20"
                }`}
              >
                {temp.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-blue-400/30"></div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-xs text-blue-100">
              <input
                type="checkbox"
                checked={showFileExplorer}
                onChange={(e) => handleToggleFileExplorer(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded border-blue-300"
              />
              Files
            </label>
            <label className="flex items-center gap-1 text-xs text-blue-100">
              <input
                type="checkbox"
                checked={showConsole}
                onChange={(e) => handleToggleConsole(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded border-blue-300"
              />
              Console
            </label>
            <label className="flex items-center gap-1 text-xs text-blue-100">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => handleTogglePreview(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded border-blue-300"
              />
              Preview
            </label>
          </div>

          <div className="w-px h-6 bg-blue-400/30"></div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-blue-100 text-sm font-medium">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorHeader;
