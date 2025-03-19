import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function ImageComponent({ src, altText, nodeKey, initialPosition = 'inline' }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zPosition, setZPosition] = useState(initialPosition);
  const imageRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; 
    e.preventDefault();
    e.stopPropagation();
    
    const rect = imageRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const editorRect = editor.getRootElement().getBoundingClientRect();
    const newX = e.clientX - editorRect.left - offsetRef.current.x;
    const newY = e.clientY - editorRect.top - offsetRef.current.y;

    setPosition({ x: newX, y: newY });
  }, [isDragging, editor]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const imageStyle = {
    position: isDragging ? 'absolute' : 'relative',
    cursor: isDragging ? 'grabbing' : 'grab',
    transform: isDragging ? `translate(${position.x}px, ${position.y}px)` : 'none',
    border: isSelected ? '2px solid #007bff' : 'none',
    zIndex: isDragging ? 1000 : 'auto',
    userSelect: 'none',
    maxWidth: '100%',
    height: 'auto'
  };

  return (
    <div 
      className="image-wrapper"
      onClick={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        style={imageStyle}
        onMouseDown={handleMouseDown}
        draggable={false}
      />
      {isSelected && (
        <div className="image-controls">
          <button onClick={() => setZPosition('behind')}>Behind Text</button>
          <button onClick={() => setZPosition('front')}>In Front</button>
          <button onClick={() => imageRef.current.remove()}>Delete</button>
        </div>
      )}
    </div>
  );
}