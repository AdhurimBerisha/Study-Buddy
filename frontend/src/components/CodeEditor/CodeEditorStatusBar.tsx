const CodeEditorStatusBar = () => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Connected
        </span>
        <span>TypeScript 5.0</span>
      </div>
      <div className="flex items-center gap-4">
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
};

export default CodeEditorStatusBar;
