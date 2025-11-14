"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useCallback } from "react";

export function RichTextEditor({
    placeholder = "Describe your media...",
    onChange,
}: {
    placeholder?: string;
    onChange?: (html: string) => void;
}) {
    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: "",
        immediatelyRender: false, // ✅ prevents hydration mismatch
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (onChange) onChange(html);
        },
    });

    const addBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
    const addItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
    const addUnderline = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor]);

    return (
        <div
            className={[
                "w-full",
                "border",
                "border-neutral-200",
                "rounded-lg",
                "focus-within:outline-none",
                "focus-within:ring-2",
                "focus-within:ring-primary-500",
                "focus-within:border-transparent",
                "bg-white",
                "transition-all",
                "duration-200",
                "overflow-hidden"
            ].join(" ")}
        >
            {/* Toolbar */}
            <div className="flex gap-4 p-2 border-b border-neutral-200 bg-gray-50">
                <button
                    type="button"
                    onClick={addBold}
                    className={`font-bold px-1 py-0.5 rounded transition-colors ${
                        editor?.isActive("bold") ? "text-primary-600 bg-primary-50" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    tabIndex={-1}
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={addItalic}
                    className={`italic px-1 py-0.5 rounded transition-colors ${
                        editor?.isActive("italic") ? "text-primary-600 bg-primary-50" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    tabIndex={-1}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={addUnderline}
                    className={`underline px-1 py-0.5 rounded transition-colors ${
                        editor?.isActive("underline") ? "text-primary-600 bg-primary-50" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    tabIndex={-1}
                >
                    U
                </button>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="p-3 min-h-[120px] outline-none bg-white placeholder:text-neutral-400 text-neutral-900"
                placeholder={placeholder}
            />
        </div>
    );
}
