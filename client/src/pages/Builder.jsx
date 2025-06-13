import { useState, useCallback, useEffect } from 'react';
import ComponentPalette from '../components/ComponentPalette';
import Canvas from '../components/Canvas';
import ErrorBoundary from '../components/ErrorBoundary';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Builder() {
  const [components, setComponents] = useState([]);
  const [title, setTitle] = useState('');
  const [history, setHistory] = useState([[]]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Current components:', components);
  }, [components]);

  const updateComponents = useCallback((newComponents) => {
    try {
      console.log('Updating components with:', newComponents);
      
      // Validate components array
      if (!Array.isArray(newComponents)) {
        console.error('Invalid components array:', newComponents);
        toast.error('Invalid component data');
        return;
      }

      // Validate each component
      const validComponents = newComponents.filter(comp => {
        if (!comp || typeof comp !== 'object') {
          console.error('Invalid component:', comp);
          return false;
        }
        if (!comp.type) {
          console.error('Component missing type:', comp);
          return false;
        }
        return true;
      });

      console.log('Valid components:', validComponents);
      
      setComponents(validComponents);
      
      const newHistory = history.slice(0, currentStep + 1);
      newHistory.push(validComponents);
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
    } catch (error) {
      console.error('Error updating components:', error);
      toast.error('Failed to update components');
    }
  }, [history, currentStep]);

  const handleDrop = useCallback((comp) => {
    try {
      console.log('Handling drop with component:', comp);
      
      if (!comp || typeof comp !== 'object') {
        console.error('Invalid component data:', comp);
        toast.error('Invalid component data');
        return;
      }

      if (!comp.type) {
        console.error('Component missing type:', comp);
        toast.error('Invalid component type');
        return;
      }

      const newComponent = { 
        ...comp, 
        id: Date.now(),
        content: comp.content || '',
        style: comp.style || {},
        animation: comp.animation || { type: 'none' }
      };

      console.log('Created new component:', newComponent);
      
      const newComponents = [...components, newComponent];
      updateComponents(newComponents);
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error('Failed to add component');
    }
  }, [components, updateComponents]);

  const handleUpdateComponent = useCallback((id, updates, newComponents = null) => {
    try {
      console.log('Updating component:', { id, updates, newComponents });
      
      if (newComponents) {
        updateComponents(newComponents);
        return;
      }

      if (!id || !updates) {
        console.error('Invalid update parameters:', { id, updates });
        return;
      }

      const updatedComponents = components.map(comp => {
        if (comp.id === id) {
          return { ...comp, ...updates };
        }
        return comp;
      });

      updateComponents(updatedComponents);
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component');
    }
  }, [components, updateComponents]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a page title');
      return;
    }
    
    setIsSaving(true);
    try {
      await axios.post('http://localhost:5000/api/pages', { title, layout: components });
      toast.success('Page saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = useCallback(() => {
    try {
      if (currentStep > 0) {
        const newStep = currentStep - 1;
        setCurrentStep(newStep);
        setComponents(history[newStep]);
      }
    } catch (error) {
      console.error('Error undoing:', error);
      toast.error('Failed to undo');
    }
  }, [currentStep, history]);

  const handleRedo = useCallback(() => {
    try {
      if (currentStep < history.length - 1) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        setComponents(history[newStep]);
      }
    } catch (error) {
      console.error('Error redoing:', error);
      toast.error('Failed to redo');
    }
  }, [currentStep, history]);

  const handleDrag = useCallback((e, comp) => {
    try {
      if (!comp || !comp.type) {
        console.error('Invalid component for drag:', comp);
        return;
      }
      e.dataTransfer.setData('component', JSON.stringify(comp));
    } catch (error) {
      console.error('Error starting drag:', error);
      toast.error('Failed to start drag');
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-6">
          <div className="w-1/4">
            <ComponentPalette onDrag={handleDrag} />
          </div>
          <div className="w-3/4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Canvas 
                components={components} 
                onDrop={handleDrop} 
                onUpdateComponent={handleUpdateComponent}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="space-x-2">
            <button
              onClick={handleUndo}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={currentStep === history.length - 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Redo
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
