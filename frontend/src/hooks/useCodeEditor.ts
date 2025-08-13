import { useState, useCallback } from "react";

interface CodeFile {
  path: string;
  code: string;
  language?: string;
}

interface UseCodeEditorReturn {
  files: Record<string, string>;
  activeFile: string;
  addFile: (path: string, code: string) => void;
  updateFile: (path: string, code: string) => void;
  removeFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  resetFiles: (files: Record<string, string>) => void;
  getFileContent: (path: string) => string | undefined;
}

export const useCodeEditor = (
  initialFiles: Record<string, string> = {}
): UseCodeEditorReturn => {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const [activeFile, setActiveFile] = useState<string>(
    Object.keys(initialFiles)[0] || ""
  );

  const addFile = useCallback(
    (path: string, code: string) => {
      setFiles((prev) => ({
        ...prev,
        [path]: code,
      }));
      if (!activeFile) {
        setActiveFile(path);
      }
    },
    [activeFile]
  );

  const updateFile = useCallback((path: string, code: string) => {
    setFiles((prev) => ({
      ...prev,
      [path]: code,
    }));
  }, []);

  const removeFile = useCallback(
    (path: string) => {
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[path];
        return newFiles;
      });

      if (activeFile === path) {
        const remainingFiles = Object.keys(files).filter((p) => p !== path);
        setActiveFile(remainingFiles[0] || "");
      }
    },
    [activeFile, files]
  );

  const resetFiles = useCallback((newFiles: Record<string, string>) => {
    setFiles(newFiles);
    setActiveFile(Object.keys(newFiles)[0] || "");
  }, []);

  const getFileContent = useCallback(
    (path: string) => {
      return files[path];
    },
    [files]
  );

  return {
    files,
    activeFile,
    addFile,
    updateFile,
    removeFile,
    setActiveFile,
    resetFiles,
    getFileContent,
  };
};

export default useCodeEditor;
