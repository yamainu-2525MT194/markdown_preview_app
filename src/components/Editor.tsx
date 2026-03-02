import { useState } from "react";

interface EditorProps {
    content: string;
    onChange: (value: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Tab key inserts spaces instead of changing focus
        if (e.key === "Tab") {
            e.preventDefault();
            const target = e.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const newValue = content.substring(0, start) + "  " + content.substring(end);
            onChange(newValue);
            // Restore cursor position
            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 2;
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
            {/* Editor header */}
            <div
                className={`flex items-center px-4 py-2 border-b transition-all duration-200 ${isScrolled
                        ? "border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/80 backdrop-blur-sm"
                        : "border-[var(--color-border)]"
                    }`}
            >
                <div className="flex items-center gap-2">
                    <svg
                        className="w-4 h-4 text-[var(--color-accent)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                        Editor
                    </span>
                </div>
            </div>

            {/* Editor textarea */}
            <textarea
                className="editor-textarea flex-1"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                placeholder="# マークダウンを入力してください..."
                spellCheck={false}
            />
        </div>
    );
}
