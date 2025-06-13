import { useState, useCallback } from 'react';
import ComponentSettings from './ComponentSettings';
import ErrorBoundary from './ErrorBoundary';

export default function Canvas({ components = [], onDrop, onUpdateComponent }) {
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [settingsComponent, setSettingsComponent] = useState(null);
  const [draggedComponent, setDraggedComponent] = useState(null);

  // Debug logging
  console.log('Canvas rendering with components:', components);

  const handleDragStart = useCallback((index) => {
    setDragIndex(index);
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragIndex(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    try {
      e.preventDefault();
      setIsDragging(false);
      
      const componentData = e.dataTransfer.getData('component');
      console.log('Received component data:', componentData);
      
      if (!componentData) {
        console.error('No component data received');
        return;
      }

      let comp;
      try {
        comp = JSON.parse(componentData);
      } catch (error) {
        console.error('Failed to parse component data:', error);
        return;
      }

      console.log('Parsed component:', comp);
      
      if (!comp || !comp.type) {
        console.error('Invalid component data:', comp);
        return;
      }

      onDrop(comp);
    } catch (error) {
      console.error('Error in handleDrop:', error);
    }
  }, [onDrop]);

  const handleTextEdit = useCallback((id, newContent) => {
    onUpdateComponent(id, { content: newContent });
  }, [onUpdateComponent]);

  const handleComponentClick = useCallback((e, component) => {
    try {
      e.stopPropagation();
      console.log('Component clicked:', component);
      
      if (!component || !component.id) {
        console.error('Invalid component clicked:', component);
        return;
      }

      if (component.action?.type === 'link' && component.action?.url) {
        window.open(component.action.url, '_blank');
      } else if (component.action?.type === 'modal') {
        console.log('Modal action triggered');
      } else if (component.action?.type === 'scroll') {
        const element = document.getElementById(component.action.target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error handling component click:', error);
    }
  }, []);

  const getComponentStyle = useCallback((component) => {
    try {
      if (!component || !component.style) {
        console.warn('Component or style missing:', component);
        return {};
      }

      const baseStyle = {
        position: 'relative',
        cursor: 'pointer',
        ...component.style
      };

      if (component.animation && component.animation.type !== 'none') {
        baseStyle.animation = `${component.animation.type} ${component.animation.duration || '1s'} ${component.animation.timing || 'ease'}`;
      }

      return baseStyle;
    } catch (error) {
      console.error('Error getting component style:', error);
      return {};
    }
  }, []);

  const renderComponent = useCallback((component) => {
    try {
      if (!component) {
        console.error('Attempted to render undefined component');
        return null;
      }

      if (!component.type) {
        console.error('Component missing type:', component);
        return null;
      }

      console.log('Rendering component:', component);

      const style = getComponentStyle(component);
      const commonProps = {
        key: component.id,
        onClick: (e) => handleComponentClick(e, component),
        style,
        className: `component ${component.animation?.type || ''}`
      };

      const settingsButton = (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSettingsComponent(component);
            }}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            ⚙️
          </button>
        </div>
      );

      switch (component.type) {
        case 'header':
          return (
            <div {...commonProps}>
              {editingId === component.id ? (
                <input
                  type="text"
                  value={component.content || ''}
                  onChange={(e) => handleTextEdit(component.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  className="w-full text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-3xl font-bold text-gray-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(component.id);
                  }}
                >
                  {component.content || ''}
                </h1>
              )}
              {settingsButton}
            </div>
          );
        case 'text':
          return (
            <div {...commonProps}>
              {editingId === component.id ? (
                <textarea
                  value={component.content || ''}
                  onChange={(e) => handleTextEdit(component.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  className="w-full text-gray-700 leading-relaxed bg-transparent border-2 border-blue-500 rounded p-2 focus:outline-none"
                  autoFocus
                />
              ) : (
                <p 
                  className="text-gray-700 leading-relaxed"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(component.id);
                  }}
                  style={{ textAlign: component.style?.alignment || 'left' }}
                >
                  {component.content || ''}
                </p>
              )}
              {settingsButton}
            </div>
          );
        case 'image':
          return (
            <div {...commonProps}>
              <img 
                src={component.src || ''} 
                alt={component.alt || ''} 
                className="w-full h-auto rounded-lg object-cover"
              />
              {settingsButton}
            </div>
          );
        case 'button':
          return (
            <div {...commonProps}>
              {editingId === component.id ? (
                <input
                  type="text"
                  value={component.content || ''}
                  onChange={(e) => handleTextEdit(component.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-4 py-2"
                  autoFocus
                />
              ) : (
                <button
                  className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-4 py-2"
                  onClick={(e) => {
                    handleComponentClick(e, component);
                    if (component.onClick) {
                      component.onClick();
                    }
                  }}
                >
                  {component.content || ''}
                </button>
              )}
              {settingsButton}
            </div>
          );
        case 'divider':
          return (
            <div {...commonProps}>
              <hr className="my-4 border-t border-gray-200" />
              {settingsButton}
            </div>
          );
        default:
          console.warn('Unknown component type:', component.type);
          return null;
      }
    } catch (error) {
      console.error('Error rendering component:', error, component);
      return null;
    }
  }, [editingId, handleTextEdit, handleComponentClick, getComponentStyle]);

  return (
    <ErrorBoundary>
      <div
        className={`min-h-[500px] p-4 border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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
          <div className="space-y-4">
            {components.map(renderComponent)}
          </div>
        )}
      </div>

      {settingsComponent && (
        <ComponentSettings
          component={settingsComponent}
          onUpdate={onUpdateComponent}
          onClose={() => setSettingsComponent(null)}
        />
      )}
    </ErrorBoundary>
  );
}
