import { DecoratorNode } from 'lexical';
import React from 'react';
import ImageComponent from './ImageComponent';
export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(src, altText, width, height, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 'auto';
    this.__height = height || 'auto';
  }

  createDOM() {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    return img;
  }

  updateDOM() {
    return false;
  }

  exportJSON() {
    return {
      type: 'image',
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      version: 1,
    };
  }

  static importJSON(serializedNode) {
    const node = new ImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width,
      serializedNode.height
    );
    return node;
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        nodeKey={this.__key}
        position={this.__position}
      />
    );
  }
}

export function $createImageNode({ src, altText, width, height }) {
  return new ImageNode(src, altText, width, height);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}

const handleImageUpload = (e) => {
  const files = e.target.files;
  const reader = new FileReader();

  reader.onload = function() {
    const url = reader.result;
    editor.update(() => {
      const imageNode = $createImageNode({
        src: url,
        altText: files[0].name,
        width: 'auto',
        height: 'auto'
      });
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([imageNode]);
      }
    });
  };

  if (files && files[0]) {
    reader.readAsDataURL(files[0]); // This converts the image to base64
  }
};