import React from 'react';
import { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode } from '@lexical/rich-text';
import { QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import { ImageNode } from './nodes/ImageNode';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import './notesEditor.css';

function Editor({ onChange, initialValue }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let mounted = true;

    const initializeEditor = () => {
      try {
        if (initialValue) {
          // Use queueMicrotask to defer state updates
          queueMicrotask(() => {
            if (mounted) {
              const parsedValue = typeof initialValue === 'string' 
                ? JSON.parse(initialValue) 
                : initialValue;
              const initialState = editor.parseEditorState(parsedValue);
              editor.setEditorState(initialState);
            }
          });
        }
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    };

    // Register update listener
    const updateListener = editor.registerUpdateListener(({ editorState }) => {
      if (mounted) {
        // Defer updates to avoid flushSync issues
        queueMicrotask(() => {
          if (mounted) {
            try {
              const serializedState = JSON.stringify(editorState.toJSON());
              onChange(serializedState);
            } catch (error) {
              console.error('Error serializing editor state:', error);
            }
          }
        });
      }
    });

    initializeEditor();

    // Cleanup
    return () => {
      mounted = false;
      updateListener();
    };
  }, [editor, onChange, initialValue]);

  return null;
}

const NotesEditor = ({ notes, onSave, onCancel, onDelete, title: initialTitle, showTitle = false }) => {
  const [editorContent, setEditorContent] = useState(notes || '');
  const [title, setTitle] = useState(initialTitle || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initialConfig = {
    namespace: 'MyEditor',
    nodes: [
      LinkNode, 
      ListItemNode, 
      ListNode,
      HorizontalRuleNode,
      HeadingNode,
      QuoteNode,
      CodeNode,
      ImageNode,
      {
        replace: ImageNode,
        with: (node) => {
          const imageNode = new ImageNode(node.__src, node.__altText, node.__maxWidth);
          if (node.__state) {
            imageNode.updateFromJSON(node.__state);
          }
          return imageNode;
        },
      },
    ],
    theme: {
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        underlineStrikethrough: 'editor-text-underlineStrikethrough',
        fontSize: 'editor-text-fontSize',
      },
      fontSize: {
        '12px': 'font-size-12',
        '14px': 'font-size-14',
        '16px': 'font-size-16',
        '18px': 'font-size-18',
        '20px': 'font-size-20',
        '24px': 'font-size-24',
        '28px': 'font-size-28',
        '32px': 'font-size-32',
      }
    },
    onError(error) {
      console.error(error);
    },
  };

  const handleSave = () => {
    if (showTitle) {
      // For notebook
      onSave({ title, content: editorContent });
    } else {
      // For calendar
      onSave(editorContent);
    }
  };

  return (
    <div className="notes-editor-wrapper">
      <div className="notes-editor">
        {showTitle && (
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
              <ToolbarPlugin />
              <div className="editor-inner">
                <RichTextPlugin
                  contentEditable={<ContentEditable className="editor-input" />}
                  placeholder={<div className="editor-placeholder">Enter some text...</div>}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <LinkPlugin />
                <ListPlugin />
                <MarkdownShortcutPlugin />
                <TabIndentationPlugin />
                <Editor onChange={setEditorContent} initialValue={notes} />
              </div>
            </div>
          </LexicalComposer>
        </div>
        <div className="notes-editor-actions">
          <button onClick={handleSave}>
            Save
          </button>
          <button onClick={onCancel}>
            Cancel
          </button>
          {onDelete && (
            <button 
              className="delete-button"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="delete-confirm-modal">
            <div className="delete-confirm-content">
              <p>Are you sure you want to delete this note?</p>
              <div className="delete-confirm-actions">
                <button onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}>
                  Yes, delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesEditor;
