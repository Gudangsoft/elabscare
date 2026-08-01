import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Code, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Type, Undo } from 'lucide-react';
import { FC, useCallback, useEffect, useState } from 'react';

// Define types for MenuBar props
interface MenuBarProps {
    editor: Editor | null;
}

// Define types for TiptapEditor props
interface TiptapEditorProps {
    content: string;
    onChange: (newContent: string) => void;
    placeholder?: string;
    className?: string;
}

// Define button configuration for better maintainability
interface MenuButton {
    label: string;
    action: () => void;
    isActive: boolean;
    canExecute: boolean;
    icon: React.ReactNode;
}

const MenuBar: FC<MenuBarProps> = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const formatButtons: MenuButton[] = [
        {
            label: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
            canExecute: editor.can().chain().focus().toggleBold().run(),
            icon: <Bold size={16} />,
        },
        {
            label: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
            canExecute: editor.can().chain().focus().toggleItalic().run(),
            icon: <Italic size={16} />,
        },
        {
            label: 'Strike',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
            canExecute: editor.can().chain().focus().toggleStrike().run(),
            icon: <Strikethrough size={16} />,
        },
        {
            label: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: editor.isActive('code'),
            canExecute: editor.can().chain().focus().toggleCode().run(),
            icon: <Code size={16} />,
        },
    ];

    const headingButtons: MenuButton[] = [
        {
            label: 'Paragraph',
            action: () => editor.chain().focus().setParagraph().run(),
            isActive: editor.isActive('paragraph'),
            canExecute: true,
            icon: <Type size={16} />,
        },
        {
            label: 'Heading 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive('heading', { level: 1 }),
            canExecute: true,
            icon: <Heading1 size={16} />,
        },
        {
            label: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
            canExecute: true,
            icon: <Heading2 size={16} />,
        },
        {
            label: 'Heading 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive('heading', { level: 3 }),
            canExecute: true,
            icon: <Heading3 size={16} />,
        },
    ];

    const listButtons: MenuButton[] = [
        {
            label: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
            canExecute: true,
            icon: <List size={16} />,
        },
        {
            label: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
            canExecute: true,
            icon: <ListOrdered size={16} />,
        },
        {
            label: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive('blockquote'),
            canExecute: true,
            icon: <Quote size={16} />,
        },
    ];

    const actionButtons: MenuButton[] = [
        {
            label: 'Undo',
            action: () => editor.chain().focus().undo().run(),
            isActive: false,
            canExecute: editor.can().chain().focus().undo().run(),
            icon: <Undo size={16} />,
        },
        {
            label: 'Redo',
            action: () => editor.chain().focus().redo().run(),
            isActive: false,
            canExecute: editor.can().chain().focus().redo().run(),
            icon: <Redo size={16} />,
        },
    ];

    const renderButton = (button: MenuButton, key: string) => (
        <button
            key={key}
            type="button"
            className={`btn btn-sm d-flex align-items-center justify-content-center me-1 ${
                button.isActive ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={button.action}
            disabled={!button.canExecute}
            title={button.label}
            style={{
                width: '32px',
                height: '32px',
                opacity: button.canExecute ? 1 : 0.5,
                cursor: button.canExecute ? 'pointer' : 'not-allowed',
            }}
        >
            <span className="flex-shrink-0">{button.icon}</span>
        </button>
    );

    return (
        <div className="bg-light border-bottom p-3">
            <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="btn-group me-3" role="group" aria-label="Format text">
                    {formatButtons.map((button, index) => renderButton(button, `format-${index}`))}
                </div>
                <div className="btn-group me-3" role="group" aria-label="Headings">
                    {headingButtons.map((button, index) => renderButton(button, `heading-${index}`))}
                </div>
                <div className="btn-group me-3" role="group" aria-label="Lists and quotes">
                    {listButtons.map((button, index) => renderButton(button, `list-${index}`))}
                </div>
                <div className="btn-group" role="group" aria-label="Undo and redo">
                    {actionButtons.map((button, index) => renderButton(button, `action-${index}`))}
                </div>
            </div>
        </div>
    );
};

const TiptapEditor: FC<TiptapEditorProps> = ({ content, onChange, placeholder = 'Start writing your story...', className = '' }) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    // Callback untuk handle perubahan konten
    const handleUpdate = useCallback(
        ({ editor }: { editor: Editor }) => {
            const html = editor.getHTML();
            onChange(html);
            // Force re-render untuk update toolbar state
            setForceUpdate((prev) => prev + 1);
        },
        [onChange],
    );

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Configure heading levels
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            CharacterCount.configure({
                limit: 10000,
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                // FIXED: Removed conflicting classes and improved styling
                class: 'tiptap-prosemirror-content',
                style: 'min-height: 300px; outline: none; padding: 1rem;',
            },
        },
        onUpdate: handleUpdate,
        onSelectionUpdate: () => {
            // Update toolbar state saat selection berubah
            setForceUpdate((prev) => prev + 1);
        },
    });

    // Update content dari props jika berubah dari luar
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, {});
        }
    }, [editor, content]);

    const characterCount = editor?.storage.characterCount || { characters: () => 0 };
    const characterLimit = 10000;
    const currentCount = characterCount.characters();
    const isNearLimit = currentCount > characterLimit * 0.9;
    const isOverLimit = currentCount > characterLimit;

    return (
        <div className={`tiptap-editor-container ${className}`}>
            <style>{`
                /* FIXED: Improved scroll handling and layout */
                .tiptap-prosemirror-content {
                    outline: none !important;
                    border: none !important;
                    font-family: inherit;
                    line-height: 1.6;
                    width: 100%;
                    height: 100%;
                }

                .tiptap-editor-content {
                    max-height: 320px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    border: 1px solid #dee2e6;
                    position: relative;
                    /* FIXED: Better scroll behavior */
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                }

                .tiptap-editor-content:focus-within {
                    border-color: #86b7fe;
                    outline: 0;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }

                /* FIXED: Ensure ProseMirror takes full height and handles scroll properly */
                .tiptap-editor-content .ProseMirror {
                    outline: none !important;
                    border: none !important;
                    background: transparent;
                    font-family: inherit;
                    line-height: 1.6;
                    padding: 1rem;
                    margin: 0;
                    min-height: 300px;
                    width: 100%;
                    /* FIXED: Remove conflicting positioning */
                    position: static;
                    overflow: visible;
                }

                /* Typography Styles */
                .ProseMirror h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 1rem 0 0.5rem 0;
                    line-height: 1.2;
                    color: #212529;
                }

                .ProseMirror h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 1rem 0 0.5rem 0;
                    line-height: 1.3;
                    color: #212529;
                }

                .ProseMirror h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 1rem 0 0.5rem 0;
                    line-height: 1.4;
                    color: #212529;
                }

                .ProseMirror p {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                }

                .ProseMirror strong {
                    font-weight: 700;
                }

                .ProseMirror em {
                    font-style: italic;
                }

                .ProseMirror s {
                    text-decoration: line-through;
                }

                .ProseMirror code {
                    background-color: #f8f9fa;
                    color: #e83e8c;
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                    font-size: 0.875em;
                    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
                }

                .ProseMirror ul {
                    list-style-type: disc;
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }

                .ProseMirror ol {
                    list-style-type: decimal;
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }

                .ProseMirror li {
                    margin: 0.25rem 0;
                    line-height: 1.6;
                }

                .ProseMirror blockquote {
                    border-left: 4px solid #dee2e6;
                    margin: 1rem 0;
                    padding: 0.5rem 0 0.5rem 1rem;
                    background-color: #f8f9fa;
                    font-style: italic;
                    color: #6c757d;
                }

                .ProseMirror .is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #6c757d;
                    pointer-events: none;
                    height: 0;
                    font-style: italic;
                    opacity: 0.7;
                }

                .character-count-warning {
                    color: #fd7e14 !important;
                }

                .character-count-danger {
                    color: #dc3545 !important;
                }

                /* FIXED: Custom scrollbar for better UX */
                .tiptap-editor-content::-webkit-scrollbar {
                    width: 8px;
                }

                .tiptap-editor-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }

                .tiptap-editor-content::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }

                .tiptap-editor-content::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>

            <div className="card shadow-sm">
                <MenuBar editor={editor} />

                {/* FIXED: Updated class name and improved structure */}
                <div className="tiptap-editor-content">
                    <EditorContent editor={editor} />
                </div>

                <div className="bg-light border-top d-flex justify-content-between align-items-center px-3 py-2">
                    <div className="d-flex align-items-center">
                        <span
                            className={`fw-medium me-1 ${
                                isOverLimit ? 'character-count-danger' : isNearLimit ? 'character-count-warning' : 'text-dark'
                            }`}
                        >
                            {currentCount}
                        </span>
                        <span className="me-2 text-muted">/ {characterLimit} characters</span>
                        {isOverLimit && <span className="badge bg-danger ms-2">Limit exceeded</span>}
                        {isNearLimit && !isOverLimit && <span className="badge bg-warning ms-2">Near limit</span>}
                    </div>
                    <small className="text-uppercase fw-medium text-muted">Rich Text Editor</small>
                </div>
            </div>
        </div>
    );
};

export default TiptapEditor;
