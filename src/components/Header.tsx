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

    const iconBtnStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 6,
        border: "none",
        background: "transparent",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.15s, color 0.15s",
    };

    const disabledStyle: React.CSSProperties = {
        ...iconBtnStyle,
        opacity: 0.35,
        cursor: "not-allowed",
    };

    return (
        <header
            data-tauri-drag-region
            style={{
                display: "flex",
                alignItems: "center",
                height: 44,
                background: "var(--color-bg-secondary)",
                borderBottom: "1px solid var(--color-border)",
                padding: "0 8px",
                gap: 8,
                userSelect: "none",
                position: "relative",
                zIndex: 100,
                flexShrink: 0,
            }}
        >
            {/* Left: Logo + filename (takes remaining space, truncates) */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0, overflow: "hidden" }}>
                {/* Logo */}
                <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>

                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>
                    MD Editor
                </span>

                {/* Divider */}
                <div style={{ width: 1, height: 18, background: "var(--color-border)", flexShrink: 0 }} />

                {/* File name - this is the only part that should truncate */}
                <div style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {fileName ? (
                        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                            {fileName}
                            {isModified && (
                                <span style={{
                                    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                                    background: "var(--color-warning)", marginLeft: 6, verticalAlign: "middle",
                                }} title="未保存の変更があります" />
                            )}
                        </span>
                    ) : (
                        <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontStyle: "italic" }}>
                            ファイルが開かれていません
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Action buttons (never shrink, always visible) */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                {/* Open Folder */}
                <button
                    onClick={onOpenFolder}
                    style={iconBtnStyle}
                    title="フォルダを開く"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </button>

                {/* New File */}
                <button
                    onClick={onNewFile}
                    style={iconBtnStyle}
                    title="新規作成"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                {/* Save */}
                <button
                    onClick={onSave}
                    disabled={!currentFilePath || !isModified}
                    style={currentFilePath && isModified ? { ...iconBtnStyle, color: "var(--color-accent-hover)" } : disabledStyle}
                    title="保存 (Ctrl+S)"
                    onMouseEnter={(e) => { if (currentFilePath && isModified) { e.currentTarget.style.background = "var(--color-accent-glow)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                </button>

                {/* PDF Export */}
                <button
                    onClick={onExportPdf}
                    disabled={!currentFilePath}
                    style={currentFilePath ? iconBtnStyle : disabledStyle}
                    title="PDF出力"
                    onMouseEnter={(e) => { if (currentFilePath) { e.currentTarget.style.background = "var(--color-bg-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
