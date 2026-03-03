import { useState, useRef, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import Header from "./components/Header";
import FileTree from "./components/FileTree";
import Editor from "./components/Editor";
import Preview from "./components/Preview";

function App() {
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  // Editor/Preview split ratio (percentage of editor within the right area)
  const [editorRatio, setEditorRatio] = useState(50);
  const isDragging = useRef(false);
  const rightAreaRef = useRef<HTMLDivElement>(null);

  const isModified = content !== savedContent;

  // Open folder dialog
  const handleOpenFolder = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "フォルダを選択",
      });
      if (selected && typeof selected === "string") {
        setRootPath(selected);
        setCurrentFilePath(null);
        setContent("");
        setSavedContent("");
      }
    } catch (err) {
      console.error("Failed to open folder:", err);
    }
  }, []);

  // Open file from tree
  const handleFileSelect = useCallback(async (path: string) => {
    try {
      const fileContent = await invoke<string>("read_file", { path });
      setCurrentFilePath(path);
      setContent(fileContent);
      setSavedContent(fileContent);
    } catch (err) {
      console.error("Failed to read file:", err);
    }
  }, []);

  // Save file
  const handleSave = useCallback(async () => {
    if (!currentFilePath) return;
    try {
      await invoke("save_file", { path: currentFilePath, content });
      setSavedContent(content);
    } catch (err) {
      console.error("Failed to save file:", err);
    }
  }, [currentFilePath, content]);

  // New file
  const handleNewFile = useCallback(async () => {
    try {
      const selected = await open({
        directory: false,
        multiple: false,
        title: "新しいファイルの保存先を選択",
        filters: [{ name: "Markdown", extensions: ["md"] }],
      });
      if (selected && typeof selected === "string") {
        await invoke("save_file", { path: selected, content: "" });
        setCurrentFilePath(selected);
        setContent("");
        setSavedContent("");
      }
    } catch (err) {
      console.error("Failed to create file:", err);
    }
  }, []);

  // PDF export via window.print()
  const handleExportPdf = useCallback(() => {
    window.print();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Drag resize for editor/preview splitter
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !rightAreaRef.current) return;
      const rect = rightAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.min(80, Math.max(20, (x / rect.width) * 100));
      setEditorRatio(pct);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <Header
        currentFilePath={currentFilePath}
        isModified={isModified}
        onNewFile={handleNewFile}
        onOpenFolder={handleOpenFolder}
        onSave={handleSave}
        onExportPdf={handleExportPdf}
      />

      {/* Main content area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left pane - File tree (fixed width) */}
        <div style={{ width: 220, flexShrink: 0, borderRight: "1px solid var(--color-border)" }}>
          <FileTree
            rootPath={rootPath}
            onFileSelect={handleFileSelect}
            currentFilePath={currentFilePath}
          />
        </div>

        {/* Right area: Editor + Splitter + Preview */}
        <div ref={rightAreaRef} style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
          {/* Editor */}
          <div style={{ width: `${editorRatio}%`, overflow: "hidden" }}>
            <Editor content={content} onChange={setContent} />
          </div>

          {/* Drag splitter */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: 6,
              flexShrink: 0,
              cursor: "col-resize",
              background: "var(--color-border)",
              transition: "background 0.15s",
              position: "relative",
              zIndex: 10,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--color-accent)"; }}
            onMouseLeave={(e) => { if (!isDragging.current) (e.currentTarget as HTMLDivElement).style.background = "var(--color-border)"; }}
          />

          {/* Preview */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Preview content={content} previewRef={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
