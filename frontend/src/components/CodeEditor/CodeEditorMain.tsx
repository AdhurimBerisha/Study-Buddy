import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { useEffect, useRef, useState } from "react";
import type { CodeEditorMainProps } from "./types";

const CodeEditorMain = ({ showPreview }: CodeEditorMainProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showHorizontalScrollbar, setShowHorizontalScrollbar] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);

  useEffect(() => {
    const checkScrollbar = () => {
      const cmScroller = editorRef.current?.querySelector(
        ".cm-scroller"
      ) as HTMLElement;
      if (cmScroller) {
        const hasHorizontalScroll =
          cmScroller.scrollWidth > cmScroller.clientWidth;
        setShowHorizontalScrollbar(hasHorizontalScroll);
        setScrollLeft(cmScroller.scrollLeft);
        setMaxScrollLeft(cmScroller.scrollWidth - cmScroller.clientWidth);
      }
    };

    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    const observer = new MutationObserver(checkScrollbar);
    if (editorRef.current) {
      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    const interval = setInterval(checkScrollbar, 1000);

    return () => {
      window.removeEventListener("resize", checkScrollbar);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleScrollbarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollRatio = clickX / rect.width;
    const newScrollLeft = scrollRatio * maxScrollLeft;

    const cmScroller = editorRef.current?.querySelector(
      ".cm-scroller"
    ) as HTMLElement;
    if (cmScroller) {
      cmScroller.scrollLeft = newScrollLeft;
      setScrollLeft(newScrollLeft);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        const cmScroller = editorRef.current?.querySelector(
          ".cm-scroller"
        ) as HTMLElement;
        if (cmScroller) {
          const newScrollLeft = cmScroller.scrollLeft + e.deltaY;
          cmScroller.scrollLeft = Math.max(
            0,
            Math.min(newScrollLeft, maxScrollLeft)
          );
          setScrollLeft(cmScroller.scrollLeft);
          e.preventDefault();
        }
      }
    };

    const editorContainer = editorRef.current;
    if (editorContainer) {
      editorContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      return () => editorContainer.removeEventListener("wheel", handleWheel);
    }
  }, [maxScrollLeft]);

  return (
    <div
      ref={editorRef}
      className={`flex-1 relative overflow-auto min-h-[300px] ${
        showPreview ? "w-full lg:w-[45%]" : "w-full lg:w-[calc(100%-200px)]"
      }`}
    >
      <div className="w-full h-full overflow-auto min-h-[300px]">
        <SandpackCodeEditor
          className="font-mono border-none w-full h-full"
          style={{
            overflow: "visible",
            minHeight: "300px",
          }}
        />
      </div>

      {showHorizontalScrollbar && (
        <div className="absolute bottom-6 left-0 right-0 h-3 bg-gray-100 dark:bg-gray-700">
          <div className="relative w-full h-full">
            <div
              className="absolute top-0 left-0 right-0 h-full bg-gray-200 dark:bg-gray-600 cursor-pointer"
              onClick={handleScrollbarClick}
            />

            <div
              className="absolute top-0 h-full bg-blue-500 dark:bg-blue-400 rounded cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-300 transition-colors"
              style={{
                left: `${(scrollLeft / maxScrollLeft) * 100}%`,
                width: `${Math.max(
                  20,
                  (maxScrollLeft / (maxScrollLeft + 100)) * 100
                )}%`,
                minWidth: "20px",
              }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startScrollLeft = scrollLeft;

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  const parentElement = (e.target as HTMLElement).parentElement;
                  const scrollDelta = parentElement
                    ? (deltaX / parentElement.clientWidth) * maxScrollLeft
                    : 0;
                  const newScrollLeft = Math.max(
                    0,
                    Math.min(startScrollLeft + scrollDelta, maxScrollLeft)
                  );

                  const cmScroller = editorRef.current?.querySelector(
                    ".cm-scroller"
                  ) as HTMLElement;
                  if (cmScroller) {
                    cmScroller.scrollLeft = newScrollLeft;
                    setScrollLeft(newScrollLeft);
                  }
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-blue-100 dark:border-blue-800 flex items-center justify-between px-3 text-xs text-blue-700 dark:text-blue-300">
        <span className="font-medium">JavaScript</span>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorMain;
