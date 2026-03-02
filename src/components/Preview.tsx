import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface PreviewProps {
    content: string;
    previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function Preview({ content, previewRef }: PreviewProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 0);
    };

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg-secondary)]">
            {/* Preview header */}
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                        Preview
                    </span>
                </div>
            </div>

            {/* Preview content */}
            <div
                className="flex-1 overflow-auto"
                onScroll={handleScroll}
            >
                <div ref={previewRef} className="markdown-preview print-area">
                    {content ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {content}
                        </ReactMarkdown>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                            <p className="text-[var(--color-text-muted)] text-sm italic">
                                マークダウンを入力するとプレビューが表示されます
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
