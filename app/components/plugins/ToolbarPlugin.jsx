import { useState, useEffect, useCallback, useRef } from 'react';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $createTextNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  $createRangeSelection,
  $getRoot,
  $setSelection,
} from 'lexical';
import { 
  $createLinkNode, 
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import { $createImageNode, ImageNode } from '../nodes/ImageNode';
import { mergeRegister } from '@lexical/utils';
import DrawingCanvas from '../DrawingCanvas';

const preserveStyles = (node) => {
  const existingStyle = node.getStyle() || '';
  const styles = {};
  

  const styleMatches = existingStyle.match(/([^:]+):\s*([^;]+)/g) || [];
  styleMatches.forEach(style => {
    const [key, value] = style.split(':').map(s => s.trim());
    styles[key] = value;
  });
  
  return styles;
};

const combineStyles = (existingStyles, newStyles) => {
  const combined = { ...existingStyles, ...newStyles };
  return Object.entries(combined)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedSize, setSelectedSize] = useState('14px');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [activeStyles, setActiveStyles] = useState(new Set());
  const [activeAlignment, setActiveAlignment] = useState('left');
  const [isManualSizeChange, setIsManualSizeChange] = useState(false); 
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);


  const [activeFormat, setActiveFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  });
  const [defaultStyle, setDefaultStyle] = useState({
    fontSize: '14px',
    color: '#000000',
    fontFamily: 'Arial'
  });

  const [showSearch, setShowSearch] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const searchRef = useRef(null);
  const matches = useRef([]);

  const formatText = useCallback((format) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {

        setActiveFormat(prev => ({
          ...prev,
          [format]: !prev[format]
        }));

        if (selection.isCollapsed()) {

          editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
        } else {

          selection.formatText(format);
        }
      }
    });
  }, [editor]);

  const applyStyle = useCallback((style) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText('style', style);
      }
    });
  }, [editor]);

  const handleFontChange = useCallback((fontFamily) => {
    setSelectedFont(fontFamily);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {

            const styles = preserveStyles(node);

            const newStyle = combineStyles(styles, { 'font-family': fontFamily });
            node.setStyle(newStyle);
          }
        });
      }
    });
  }, [editor]);

  const handleSizeChange = useCallback((size) => {
    setSelectedSize(size);
    setDefaultStyle(prev => ({ ...prev, fontSize: size }));

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, { 'font-size': size });
        } else {
          selection.getNodes().forEach(node => {
            if ($isTextNode(node)) {
              const styles = preserveStyles(node);
              node.setStyle(combineStyles(styles, { 'font-size': size }));
            }
          });
        }
      }
    });
  }, [editor]);

  const handleColorChange = useCallback((color) => {
    setSelectedColor(color);
    setDefaultStyle(prev => ({ ...prev, color }));
    
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, { color });
        } else {
          selection.getNodes().forEach(node => {
            if ($isTextNode(node)) {
              const styles = preserveStyles(node);
              node.setStyle(combineStyles(styles, { color }));
            }
          });
        }
      }
    });
  }, [editor]);

  const formatElement = useCallback((alignment) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = selection.anchor.getNode();
        const parent = node.getParent();
        if (parent) {
          parent.setFormat(alignment);
          setActiveAlignment(alignment);
        } else {

          node.setFormat(alignment);
          setActiveAlignment(alignment);
        }
      }
    });
  }, [editor]);

  const insertLink = (url) => {
    if (!url) return;


    const urlWithProtocol = url.startsWith('http') ? url : `http://${url}`;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (!selection.isCollapsed()) {
          const linkNode = $createLinkNode(urlWithProtocol);
          selection.insertNodes([linkNode]);
          
          selection.getNodes().forEach(node => {
            if ($isTextNode(node)) {
              linkNode.append(node);
            }
          });
        } else {
          const linkNode = $createLinkNode(urlWithProtocol);
          const textNode = $createTextNode('Click here');

          const existingStyle = selection.anchor.getNode().getStyle();
          const fontSize = existingStyle?.['font-size'] || '14px';
          const fontFamily = existingStyle?.['font-family'] || '';
          
          let newStyle = `text-decoration: underline; color: blue; font-size: ${fontSize};`;
          if (fontFamily) newStyle += ` font-family: ${fontFamily};`;
          
          textNode.setStyle(newStyle);
          linkNode.append(textNode);
          selection.insertNodes([linkNode]);
        }
      }
    });
  };

  const handleImageUpload = (e, isDrawing = false) => {
    if (isDrawing) {
      const url = e.target.result;
      editor.update(() => {
        const imageNode = $createImageNode({ src: url, altText: 'Drawn image' });
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([imageNode]);
        }
      });
    } else {
      const files = e.target.files;
      const reader = new FileReader();

      reader.onload = function() {
        const url = reader.result;
        editor.update(() => {
          const imageNode = $createImageNode({ src: url, altText: files[0].name });
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([imageNode]);
          }
        });
      };

      if (files && files[0]) {
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const handleSearch = useCallback(() => {
    if (!searchText) return;
  
    editor.update(() => {
      clearPreviousHighlights();
      

      const nodes = [];
      const root = $getRoot();

      const collectTextNodes = (node) => {
        if ($isTextNode(node)) {
          nodes.push(node);
          return;
        }
        

        if (node.getChildren) {
          node.getChildren().forEach(collectTextNodes);
        }
      };
  

      root.getChildren().forEach(collectTextNodes);
      
      matches.current = [];
      let matchCount = 0;
  

      nodes.forEach(node => {
        const text = node.getTextContent();
        const regex = new RegExp(searchText, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          matches.current.push({
            node,
            index: match.index,
            length: match[0].length
          });
          matchCount++;
        }
      });
  
      setTotalMatches(matchCount);
      if (matchCount > 0) {
        highlightMatch(0);
      }
    });
  }, [searchText, editor]);
  

  const highlightMatch = (index) => {
    if (!matches.current[index]) return;
    
    const match = matches.current[index];
    editor.update(() => {
      try {
        const node = match.node;
        if (!node.isAttached()) return;
  

        const selection = $createRangeSelection();
        selection.anchor.set(node.getKey(), match.index, 'text');
        selection.focus.set(node.getKey(), match.index + match.length, 'text');
        $setSelection(selection);
  

        const element = editor.getElementByKey(node.getKey());
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
  

        const existingStyle = node.getStyle();
        const newStyle = existingStyle ? 
          `${existingStyle}; background-color: yellow` : 
          'background-color: yellow';
        node.setStyle(newStyle);
      } catch (error) {
        console.warn('Error highlighting match:', error);
      }
    });
  };
  
  const clearPreviousHighlights = () => {
    editor.update(() => {
      const root = $getRoot();
      const clearNode = (node) => {
        if ($isTextNode(node)) {
          const style = node.getStyle();
          if (style && style.includes('background-color: yellow')) {
            node.setStyle(
              style.replace(/background-color:\s*yellow\s*;?/g, '').trim()
            );
          }
        }
        if (node.getChildren) {
          node.getChildren().forEach(clearNode);
        }
      };
      
      try {
        root.getChildren().forEach(clearNode);
      } catch (error) {
        console.warn('Error clearing highlights:', error);
      }
    });
  };

  const navigateSearch = (direction) => {
    const newMatch = (currentMatch + direction + totalMatches) % totalMatches;
    setCurrentMatch(newMatch);
    highlightMatch(newMatch);
  };

  const clearSearch = () => {
    setSearchText('');
    setCurrentMatch(0);
    setTotalMatches(0);
    matches.current = [];
    clearPreviousHighlights();
  };

  const handleLinkClick = (event) => {
    if (event.ctrlKey || event.metaKey) {
      const href = event.target.getAttribute('href');
      if (href) {
        window.open(href, '_blank');
      }
    }
  };

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {

        const newStyles = new Set();
        if (selection.hasFormat('bold')) newStyles.add('bold');
        if (selection.hasFormat('italic')) newStyles.add('italic');
        if (selection.hasFormat('underline')) newStyles.add('underline');
        if (selection.hasFormat('strikethrough')) newStyles.add('strikethrough');
        setActiveStyles(newStyles);


        const node = selection.anchor.getNode();
        if ($isTextNode(node)) {
          const styles = preserveStyles(node);
          
          if (styles.color) {
            setSelectedColor(styles.color);
          }
          
          if (styles['font-size']) {
            setSelectedSize(styles['font-size']);
          }
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(() => {
      updateToolbar();
    });

    const removeSelectionListener = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );


    const removeClickListener = editor.registerCommand(
      'click',
      (event) => {
        if (event.target.tagName === 'A') {
          handleLinkClick(event);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );

    return () => {
      removeListener();
      removeSelectionListener();

      removeClickListener();
    };
  }, [editor, updateToolbar]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === 'Enter' && showSearch) {
        e.preventDefault();
        navigateSearch(e.shiftKey ? -1 : 1);
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const isActive = (style) => activeStyles.has(style);


  const buttonClasses = (format) => `toolbar-button ${activeFormat[format] ? 'active' : ''}`;

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-group formatting">
          {/* Font controls */}
          <select 
            value={selectedFont} 
            onChange={(e) => handleFontChange(e.target.value)}
            style={{ fontFamily: selectedFont }}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
          </select>
          
          {/* Size controls */}
          <select 
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)}
          >
            {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
              <option key={size} value={`${size}px`}>
                {size}px
              </option>
            ))}
          </select>

          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="color-picker"
          />
        </div>

        <div className="toolbar-group text-style">
          <button 
            onClick={() => formatText('bold')}
            className={buttonClasses('bold')}
          >
            B
          </button>
          <button 
            onClick={() => formatText('italic')}
            className={buttonClasses('italic')}
          >
            I
          </button>
          <button 
            onClick={() => formatText('underline')}
            className={buttonClasses('underline')}
          >
            U
          </button>
          <button 
            onClick={() => formatText('strikethrough')}
            className={buttonClasses('strikethrough')}
          >
            S
          </button>
        </div>

        <div className="toolbar-group alignment">
          <button 
            onClick={() => formatElement('left')}
            className={activeAlignment === 'left' ? 'active' : ''}
          >
            Left
          </button>
          <button 
            onClick={() => formatElement('center')}
            className={activeAlignment === 'center' ? 'active' : ''}
          >
            Center
          </button>
          <button 
            onClick={() => formatElement('right')}
            className={activeAlignment === 'right' ? 'active' : ''}
          >
            Right
          </button>
        </div>

        
        <div className="toolbar-group media">
          {!isDrawingMode ? (
            <>
              {isImageModalOpen && (
                <div className="image-modal">
                  <div className="modal-buttons">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <button onClick={() => document.getElementById('image-upload').click()}>
                      Upload Image
                    </button>
                    <button onClick={() => setIsDrawingMode(true)}>Draw Image</button>
                    <button onClick={() => setIsImageModalOpen(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <button onClick={() => setIsImageModalOpen(true)}>Insert Image</button>
            </>
          ) : (
            <DrawingCanvas
              onSave={(imageData) => {
                handleImageUpload({ target: { result: imageData } }, true);
                setIsDrawingMode(false);
                setIsImageModalOpen(false);
              }}
              onCancel={() => {
                setIsDrawingMode(false);
                setIsImageModalOpen(false);
              }}
            />
          )}
        </div>

        <div className="toolbar-group media">
          <button onClick={() => setIsLinkModalOpen(true)}>Insert Link</button>

          {isLinkModalOpen && (
            <div className="link-modal">
              <input
                type="text"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <button
                onClick={() => {
                  insertLink(linkUrl);
                  setIsLinkModalOpen(false);
                  setLinkUrl('');
                }}
              >
                Insert
              </button>
              <button onClick={() => setIsLinkModalOpen(false)}>Cancel</button>
            </div>
          )}
        </div>

        <div className="toolbar-group search">
          <button onClick={() => setShowSearch(true)}>
            Search
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="search-overlay">
          <input
            ref={searchRef}
            type="text"
            placeholder="Find in text..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button onClick={handleSearch}>Search</button>
          {totalMatches > 0 && (
            <>
              <span className="search-counter">
                {currentMatch + 1} of {totalMatches}
              </span>
              <button onClick={() => navigateSearch(-1)}>Previous</button>
              <button onClick={() => navigateSearch(1)}>Next</button>
            </>
          )}
          <button onClick={() => {
            setShowSearch(false);
            clearSearch();
          }}>Close</button>
        </div>
      )}
    </>
  );
}