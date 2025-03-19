import React, { useState, useRef, useEffect } from 'react';

export default function DrawingCanvas({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isFilled, setIsFilled] = useState(false);
  const [isShapeDrawing, setIsShapeDrawing] = useState(false);
  const baseImageRef = useRef(null); 
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isPenDown = useRef(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setContext(ctx);
  }, []);

  useEffect(() => {

    const canvas = canvasRef.current;
    const initialState = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsMouseDown(true);

    if (tool === 'pen' || tool === 'eraser') {
      setIsDrawing(true);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    } else if (tool === 'bucket') {
      floodFill(offsetX, offsetY, color);
    } else if (!isShapeDrawing) {
      setIsShapeDrawing(true);
      setStartPos({ x: offsetX, y: offsetY });
      baseImageRef.current = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if ((tool === 'pen' || tool === 'eraser') && isMouseDown) {
      context.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      context.lineWidth = brushSize;
      context.lineCap = 'round';
      context.lineTo(offsetX, offsetY);
      context.stroke();
    } else if (isShapeDrawing && baseImageRef.current) {
      context.putImageData(baseImageRef.current, 0, 0);
      drawShape(offsetX, offsetY, true);
    }
  };

  const handleMouseUp = (e) => {
    if (isShapeDrawing) {
      const { offsetX, offsetY } = e.nativeEvent;
      drawShape(offsetX, offsetY, false);
      setIsShapeDrawing(false);
      baseImageRef.current = null;
      saveToHistory();
    }
    
    if (isDrawing) {
      saveToHistory();
    }
    
    setIsDrawing(false);
    setIsMouseDown(false);
    context.closePath();
  };

  const drawShape = (endX, endY, isPreview = false) => {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = brushSize;

    switch (tool) {
      case 'rectangle':
        const width = endX - startPos.x;
        const height = endY - startPos.y;
        if (isFilled && !isPreview) {
          context.fillStyle = color;
          context.fillRect(startPos.x, startPos.y, width, height);
        }
        context.strokeRect(startPos.x, startPos.y, width, height);
        break;

      case 'circle':
        const radius = Math.sqrt(
          Math.pow(endX - startPos.x, 2) + Math.pow(endY - startPos.y, 2)
        );
        context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        if (isFilled && !isPreview) {
          context.fillStyle = color;
          context.fill();
        }
        context.stroke();
        break;

      case 'line':
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endX, endY);
        context.stroke();
        break;
    }
  };

  const finishShape = (endX, endY) => {
    drawShape(endX, endY);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveToHistory();
    }
    setIsDrawing(false);
    isPenDown.current = false;
    context.closePath();
  };

  const floodFill = (startX, startY, fillColor) => {
    try {
      const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const pixels = imageData.data;
      
      const startPos = (startY * canvasRef.current.width + startX) * 4;
      const startR = pixels[startPos];
      const startG = pixels[startPos + 1];
      const startB = pixels[startPos + 2];

      const fillR = parseInt(fillColor.slice(1, 3), 16);
      const fillG = parseInt(fillColor.slice(3, 5), 16);
      const fillB = parseInt(fillColor.slice(5, 7), 16);


      if (startR === fillR && startG === fillG && startB === fillB) {
        return;
      }

      const stack = [[startX, startY]];
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      while (stack.length) {
        const [x, y] = stack.pop();
        const currentPos = (y * width + x) * 4;


        if (x < 0 || x >= width || y < 0 || y >= height || 
            pixels[currentPos] !== startR || 
            pixels[currentPos + 1] !== startG || 
            pixels[currentPos + 2] !== startB) {
          continue;
        }


        pixels[currentPos] = fillR;
        pixels[currentPos + 1] = fillG;
        pixels[currentPos + 2] = fillB;
        pixels[currentPos + 3] = 255;


        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }

      context.putImageData(imageData, 0, 0);
      saveToHistory();
    } catch (error) {
      console.error('Error in flood fill:', error);
    }
  };

  const clearCanvas = () => {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const currentState = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    

    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      context.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      context.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const saveToComputer = async () => {
    try {

      const canvas = canvasRef.current;
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      

      const handle = await window.showSaveFilePicker({
        suggestedName: 'drawing.png',
        types: [{
          description: 'PNG Image',
          accept: {
            'image/png': ['.png'],
          },
        }],
      });


      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {

      if (err.name !== 'AbortError') {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
        link.remove();
      }
    }
  };

  return (
    <div className="drawing-modal">
      <div className="drawing-tools">
        <div className="tool-group">
          <label>Tools:</label>
          <select value={tool} onChange={(e) => setTool(e.target.value)}>
            <option value="pen">✏️ Pen</option>
            <option value="eraser">🧹 Eraser</option>
            <option value="line">📏 Line</option>
            <option value="rectangle">⬜ Rectangle</option>
            <option value="circle">⭕ Circle</option>
            <option value="bucket">🪣 Fill</option>
          </select>
        </div>
        <div className="tool-group">
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="tool-group">
          <label>Size: {brushSize}px</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </div>
        {(tool === 'rectangle' || tool === 'circle') && (
          <div className="tool-group">
            <label>Fill:</label>
            <input
              type="checkbox"
              checked={isFilled}
              onChange={(e) => setIsFilled(e.target.checked)}
            />
          </div>
        )}
        <div className="tool-group">
          <button 
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            ↩️ Undo
          </button>
          <button 
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            ↪️ Redo
          </button>
        </div>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={() => onSave(canvasRef.current.toDataURL())}>Save</button>
        <button onClick={saveToComputer}>💾 Save to PC</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: tool === 'bucket' ? 'cell' : 'crosshair' }}
      />
    </div>
  );
}