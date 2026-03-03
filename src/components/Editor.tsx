import { useState, useRef } from "react";
import {
    Heading1,
    Heading2,
    Heading3,
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Code,
    Link,
    Image as ImageIcon,
} from "lucide-react";

interface EditorProps {
    content: string;
    onChange: (value: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // Helper function to insert text around selection
    const insertFormat = (prefix: string, suffix: string = "", defaultText: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let newSelectedText = selectedText;
        if (selectedText.length === 0 && defaultText) {
            newSelectedText = defaultText;
        }

        const newValue =
            content.substring(0, start) +
            prefix +
            newSelectedText +
            suffix +
            content.substring(end);

        onChange(newValue);

        // Move cursor inside or after the inserted format
        requestAnimationFrame(() => {
            textarea.focus();
            if (selectedText.length === 0 && defaultText) {
                textarea.selectionStart = start + prefix.length;
                textarea.selectionEnd = start + prefix.length + defaultText.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + prefix.length + newSelectedText.length + suffix.length;
            }
        });
    };

    // Helper for heading lines
    const toggleHeading = (level: number) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;

        // Find line start
        const lastNewline = content.lastIndexOf("\n", start - 1);
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

        const prefix = "#".repeat(level) + " ";
        const newValue = content.substring(0, lineStart) + prefix + content.substring(lineStart);

        onChange(newValue);

        requestAnimationFrame(() => {
            textarea.focus();
            const newCursor = start + prefix.length;
            textarea.selectionStart = textarea.selectionEnd = newCursor;
        });
    };

    const toggleLinePrefix = (prefix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lastNewline = content.lastIndexOf("\n", start - 1);
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

        const newValue = content.substring(0, lineStart) + prefix + content.substring(lineStart);

        onChange(newValue);

        requestAnimationFrame(() => {
            textarea.focus();
            const newCursor = start + prefix.length;
            textarea.selectionStart = textarea.selectionEnd = newCursor;
        });
    };

    const ToolbarButton = ({ icon: Icon, onClick, title }: { icon: any, onClick: () => void, title: string }) => (
        <button
            onClick={onClick}
            title={title}
            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] rounded-md transition-colors"
        >
            <Icon size={16} />
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
            {/* Editor header & toolbar */}
            <div
                className={`flex flex-col border-b transition-all duration-200 ${isScrolled
                    ? "border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/80 backdrop-blur-sm"
                    : "border-[var(--color-border)]"
                    }`}
            >
                <div className="flex items-center px-4 py-2 border-b border-[var(--color-border)]/50">
                    <svg
                        className="w-4 h-4 text-[var(--color-accent)] mr-2"
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

                {/* Format Toolbar */}
                <div className="flex items-center px-3 py-1 gap-1 overflow-x-auto no-scrollbar">
                    <ToolbarButton icon={Heading1} title="見出し 1" onClick={() => toggleHeading(1)} />
                    <ToolbarButton icon={Heading2} title="見出し 2" onClick={() => toggleHeading(2)} />
                    <ToolbarButton icon={Heading3} title="見出し 3" onClick={() => toggleHeading(3)} />

                    <div className="w-px h-4 bg-[var(--color-border)] mx-1" />

                    <ToolbarButton icon={Bold} title="太字" onClick={() => insertFormat("**", "**", "太字テキスト")} />
                    <ToolbarButton icon={Italic} title="斜体" onClick={() => insertFormat("*", "*", "斜体テキスト")} />

                    <div className="w-px h-4 bg-[var(--color-border)] mx-1" />

                    <ToolbarButton icon={List} title="箇条書きリスト" onClick={() => toggleLinePrefix("- ")} />
                    <ToolbarButton icon={ListOrdered} title="番号付きリスト" onClick={() => toggleLinePrefix("1. ")} />

                    <div className="w-px h-4 bg-[var(--color-border)] mx-1" />

                    <ToolbarButton icon={Quote} title="引用" onClick={() => toggleLinePrefix("> ")} />
                    <ToolbarButton icon={Code} title="コードブロック" onClick={() => insertFormat("```\n", "\n```", "コードを入力")} />

                    <div className="w-px h-4 bg-[var(--color-border)] mx-1" />

                    <ToolbarButton icon={Link} title="リンク" onClick={() => insertFormat("[", "](URL)", "リンクテキスト")} />
                    <ToolbarButton icon={ImageIcon} title="画像" onClick={() => insertFormat("![", "](画像URL)", "代替テキスト")} />
                </div>
            </div>

            {/* Editor textarea */}
            <textarea
                ref={textareaRef}
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
