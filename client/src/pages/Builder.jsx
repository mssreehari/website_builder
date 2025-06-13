import { useState, useCallback } from 'react';
import ComponentPalette from '../components/ComponentPalette';
import Canvas from '../components/Canvas';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Builder() {
  const [components, setComponents] = useState([]);
  const [title, setTitle] = useState('');
  const [history, setHistory] = useState([[]]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const updateComponents = useCallback((newComponents) => {
    setComponents(newComponents);
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(newComponents);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }, [history, currentStep]);

  const handleDrop = (comp) => {
    const newComponents = [...components, { ...comp, id: Date.now() }];
    updateComponents(newComponents);
  };

  const handleUpdateComponent = (id, updates, newComponents = null) => {
    if (newComponents) {
      updateComponents(newComponents);
      return;
    }

    const updatedComponents = components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    );
    updateComponents(updatedComponents);
  };

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
      toast.error('Failed to save page');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setComponents(history[currentStep - 1]);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      setComponents(history[currentStep + 1]);
    }
  };

  const handleDrag = (e, comp) => {
    e.dataTransfer.setData('component', JSON.stringify(comp));
  };

  return (
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
  );
}
