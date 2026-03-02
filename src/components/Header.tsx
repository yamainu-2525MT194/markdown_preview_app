interface HeaderProps {
    currentFilePath: string | null;
    isModified: boolean;
    onNewFile: () => void;
    onOpenFolder: () => void;
    onSave: () => void;
    onExportPdf: () => void;
}

export default function Header({
    currentFilePath,
    isModified,
    onNewFile,
    onOpenFolder,
    onSave,
    onExportPdf,
}: HeaderProps) {
    const fileName = currentFilePath
        ? currentFilePath.split(/[\\/]/).pop()
        : null;

    return (
        <header className="flex items-center justify-between px-4 h-12 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] select-none"
            data-tauri-drag-region
        >
            {/* Left: App name & file info */}
            <div className="flex items-center gap-3 min-w-0">
                {/* App logo */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)] hidden sm:block">
                        MD Editor
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-5 bg-[var(--color-border)]" />

                {/* File name */}
                <div className="flex items-center gap-1.5 min-w-0">
                    {fileName ? (
                        <>
                            <span className="text-sm text-[var(--color-text-secondary)] truncate max-w-[300px]">
                                {fileName}
                            </span>
                            {isModified && (
                                <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] flex-shrink-0" title="未保存の変更があります" />
                            )}
                        </>
                    ) : (
                        <span className="text-sm text-[var(--color-text-muted)] italic">
                            ファイルが開かれていません
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-1">
                {/* Open Folder */}
                <button
                    onClick={onOpenFolder}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                    title="フォルダを開く"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="hidden md:inline">フォルダ</span>
                </button>

                {/* New File */}
                <button
                    onClick={onNewFile}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                    title="新規作成"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden md:inline">新規</span>
                </button>

                {/* Save */}
                <button
                    onClick={onSave}
                    disabled={!currentFilePath || !isModified}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${currentFilePath && isModified
                            ? "text-[var(--color-accent-hover)] hover:bg-[var(--color-accent-glow)]"
                            : "text-[var(--color-text-muted)] cursor-not-allowed opacity-50"
                        }`}
                    title="保存 (Ctrl+S)"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="hidden md:inline">保存</span>
                </button>

                {/* PDF Export */}
                <button
                    onClick={onExportPdf}
                    disabled={!currentFilePath}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${currentFilePath
                            ? "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                            : "text-[var(--color-text-muted)] cursor-not-allowed opacity-50"
                        }`}
                    title="PDF出力"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden md:inline">PDF</span>
                </button>
            </div>
        </header>
    );
}
