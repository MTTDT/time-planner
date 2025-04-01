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
import { $getRoot, $createParagraphNode } from 'lexical';

function Editor({ onChange, initialValue }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    const debouncedUpdate = debounce((editorState) => {
      Promise.resolve().then(() => {
        onChange(JSON.stringify(editorState));
      });
    }, 100);

    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      debouncedUpdate(editorState);
    });
    
    if (initialValue) {
      Promise.resolve().then(() => {
        const initialState = editor.parseEditorState(JSON.parse(initialValue));
        editor.setEditorState(initialState);
      });
    }

    return () => {
      removeListener();
      debouncedUpdate.cancel();
    };
  }, [editor, onChange, initialValue]);

  return null;
}

function debounce(func, wait) {
  let timeout;
  const debouncedFunc = function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
  debouncedFunc.cancel = function() {
    clearTimeout(timeout);
  };
  return debouncedFunc;
}

const NotesEditor = ({ notes, onSave, onCancel, onDelete }) => {
  const [editorContent, setEditorContent] = useState(notes || '');

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
      ImageNode 
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

  return (
    <div className="notes-editor-wrapper">
      <div className="notes-editor">
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
        <div className="notes-editor-actions">
          <button onClick={() => onSave(editorContent)}>Save</button>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default NotesEditor;
