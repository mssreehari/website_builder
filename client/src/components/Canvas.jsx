import { useState } from 'react';

export default function Canvas({ components, onDrop, onUpdateComponent }) {
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const data = JSON.parse(e.dataTransfer.getData('component'));
    onDrop(data);
  };

  const handleTextEdit = (id, newContent) => {
    onUpdateComponent(id, { content: newContent });
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOverComponent = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newComponents = [...components];
    const draggedComponent = newComponents[dragIndex];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(index, 0, draggedComponent);
    
    onUpdateComponent(null, null, newComponents);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const renderComponent = (comp, index) => {
    const baseClasses = "w-full p-4 rounded-lg transition-all duration-200 hover:shadow-md relative group";
    const isEditing = editingId === comp.id;
    
    switch (comp.type) {
      case 'header':
        return (
          <div
            key={comp.id || index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOverComponent(e, index)}
            onDragEnd={handleDragEnd}
            className={`${baseClasses} ${dragIndex === index ? 'opacity-50' : ''}`}
          >
            {isEditing ? (
              <input
                type="text"
                value={comp.content}
                onChange={(e) => handleTextEdit(comp.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                className="w-full text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                autoFocus
              />
            ) : (
              <h1 
                className="text-3xl font-bold text-gray-900"
                onClick={() => setEditingId(comp.id)}
              >
                {comp.content}
              </h1>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingId(comp.id)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                ✏️
              </button>
            </div>
          </div>
        );
      case 'text':
        return (
          <div
            key={comp.id || index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOverComponent(e, index)}
            onDragEnd={handleDragEnd}
            className={`${baseClasses} ${dragIndex === index ? 'opacity-50' : ''}`}
          >
            {isEditing ? (
              <textarea
                value={comp.content}
                onChange={(e) => handleTextEdit(comp.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                className="w-full text-gray-700 leading-relaxed bg-transparent border-2 border-blue-500 rounded p-2 focus:outline-none"
                autoFocus
              />
            ) : (
              <p 
                className="text-gray-700 leading-relaxed"
                onClick={() => setEditingId(comp.id)}
              >
                {comp.content}
              </p>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingId(comp.id)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                ✏️
              </button>
            </div>
          </div>
        );
      case 'image':
        return (
          <div
            key={comp.id || index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOverComponent(e, index)}
            onDragEnd={handleDragEnd}
            className={`${baseClasses} ${dragIndex === index ? 'opacity-50' : ''}`}
          >
            <img 
              src={comp.src} 
              alt={comp.alt || ''} 
              className="w-full h-auto rounded-lg object-cover"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="text"
                value={comp.src}
                onChange={(e) => onUpdateComponent(comp.id, { src: e.target.value })}
                className="w-64 p-1 text-sm border rounded"
                placeholder="Enter image URL"
              />
            </div>
          </div>
        );
      case 'button':
        return (
          <div
            key={comp.id || index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOverComponent(e, index)}
            onDragEnd={handleDragEnd}
            className={`${baseClasses} ${dragIndex === index ? 'opacity-50' : ''}`}
          >
            {isEditing ? (
              <input
                type="text"
                value={comp.content}
                onChange={(e) => handleTextEdit(comp.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-4 py-2"
                autoFocus
              />
            ) : (
              <button
                className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-4 py-2"
                onClick={() => setEditingId(comp.id)}
              >
                {comp.content}
              </button>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingId(comp.id)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                ✏️
              </button>
            </div>
          </div>
        );
      case 'divider':
        return (
          <div
            key={comp.id || index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOverComponent(e, index)}
            onDragEnd={handleDragEnd}
            className={`${baseClasses} ${dragIndex === index ? 'opacity-50' : ''}`}
          >
            <hr className="my-4 border-t border-gray-200" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-[500px] rounded-lg transition-all duration-200 ${
        isDragging 
          ? 'border-2 border-dashed border-blue-500 bg-blue-50' 
          : 'border-2 border-dashed border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p className="text-center">
            Drag and drop components here<br />
            <span className="text-sm">Start building your page</span>
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {components.map((comp, index) => renderComponent(comp, index))}
        </div>
      )}
    </div>
  );
}
