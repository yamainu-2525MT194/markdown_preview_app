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
        // Save an empty file then open it
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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Left pane - File tree (20%) */}
        <div className="w-[20%] min-w-[180px] max-w-[320px] flex-shrink-0">
          <FileTree
            rootPath={rootPath}
            onFileSelect={handleFileSelect}
            currentFilePath={currentFilePath}
          />
        </div>

        {/* Center pane - Editor (40%) */}
        <div className="flex-1 border-r border-[var(--color-border)]">
          <Editor content={content} onChange={setContent} />
        </div>

        {/* Right pane - Preview (40%) */}
        <div className="flex-1">
          <Preview content={content} previewRef={previewRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
