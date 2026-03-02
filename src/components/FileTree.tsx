import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface FileInfoItem {
    name: string;
    path: string;
    is_dir: boolean;
    children: FileInfoItem[] | null;
}

interface FileTreeProps {
    rootPath: string | null;
    onFileSelect: (path: string) => void;
    currentFilePath: string | null;
}

interface TreeNodeProps {
    item: FileInfoItem;
    depth: number;
    onFileSelect: (path: string) => void;
    currentFilePath: string | null;
}

function TreeNode({ item, depth, onFileSelect, currentFilePath }: TreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(depth < 1);

    const isActive = currentFilePath === item.path;
    const isMarkdown = !item.is_dir && /\.(md|mdx|markdown)$/i.test(item.name);

    const handleClick = () => {
        if (item.is_dir) {
            setIsExpanded(!isExpanded);
        } else {
            onFileSelect(item.path);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`w-full flex items-center gap-1.5 px-2 py-1 text-left text-sm transition-colors duration-150 rounded-md mx-1 ${isActive
                        ? "bg-[var(--color-accent-glow)] text-[var(--color-accent-hover)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                    }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                title={item.path}
            >
                {/* Icon */}
                {item.is_dir ? (
                    <svg
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""
                            } text-[var(--color-text-muted)]`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                ) : (
                    <svg
                        className={`w-4 h-4 flex-shrink-0 ${isMarkdown ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                            }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                )}

                {/* Name */}
                <span className="truncate text-xs">{item.name}</span>
            </button>

            {/* Children */}
            {item.is_dir && isExpanded && item.children && (
                <div>
                    {item.children.map((child) => (
                        <TreeNode
                            key={child.path}
                            item={child}
                            depth={depth + 1}
                            onFileSelect={onFileSelect}
                            currentFilePath={currentFilePath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileTree({ rootPath, onFileSelect, currentFilePath }: FileTreeProps) {
    const [tree, setTree] = useState<FileInfoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!rootPath) return;

        const loadTree = async () => {
            setLoading(true);
            setError(null);
            try {
                const items = await invoke<FileInfoItem[]>("read_dir", { path: rootPath });
                setTree(items);
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        loadTree();
    }, [rootPath]);

    const folderName = rootPath ? rootPath.split(/[\\/]/).pop() || rootPath : null;

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]">
            {/* Header */}
            <div className="flex items-center px-3 py-2 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2 min-w-0">
                    <svg
                        className="w-4 h-4 flex-shrink-0 text-[var(--color-accent)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                    </svg>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider truncate">
                        {folderName || "Explorer"}
                    </span>
                </div>
            </div>

            {/* Tree content */}
            <div className="flex-1 overflow-auto py-1">
                {!rootPath && (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <svg
                            className="w-8 h-8 text-[var(--color-text-muted)] mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            フォルダを開いてください
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="p-3 m-2 rounded-md bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-400">{error}</p>
                    </div>
                )}

                {!loading && !error && tree.length > 0 && (
                    <div>
                        {tree.map((item) => (
                            <TreeNode
                                key={item.path}
                                item={item}
                                depth={0}
                                onFileSelect={onFileSelect}
                                currentFilePath={currentFilePath}
                            />
                        ))}
                    </div>
                )}

                {!loading && !error && rootPath && tree.length === 0 && (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-[var(--color-text-muted)]">空のフォルダ</p>
                    </div>
                )}
            </div>
        </div>
    );
}
