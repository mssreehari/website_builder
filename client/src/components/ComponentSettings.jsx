import { useState } from 'react';

const actionTypes = {
  button: [
    { value: 'link', label: 'Open Link' },
    { value: 'scroll', label: 'Scroll to Section' },
    { value: 'modal', label: 'Open Modal' },
    { value: 'form', label: 'Submit Form' },
  ],
  image: [
    { value: 'lightbox', label: 'Open in Lightbox' },
    { value: 'link', label: 'Open Link' },
    { value: 'gallery', label: 'Show in Gallery' },
  ],
};

export default function ComponentSettings({ component, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = useState('content');

  const handleStyleChange = (property, value) => {
    onUpdate(component.id, {
      style: { ...component.style, [property]: value }
    });
  };

  const handleActionChange = (action) => {
    onUpdate(component.id, {
      action: { ...component.action, type: action }
    });
  };

  const renderContentTab = () => {
    switch (component.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Text</label>
              <input
                type="text"
                value={component.content}
                onChange={(e) => onUpdate(component.id, { content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select
                value={component.style?.size || 'h1'}
                onChange={(e) => handleStyleChange('size', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={component.content}
                onChange={(e) => onUpdate(component.id, { content: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alignment</label>
              <select
                value={component.style?.alignment || 'left'}
                onChange={(e) => handleStyleChange('alignment', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Text</label>
              <input
                type="text"
                value={component.content}
                onChange={(e) => onUpdate(component.id, { content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Action</label>
              <select
                value={component.action?.type || 'link'}
                onChange={(e) => handleActionChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {actionTypes.button.map(action => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
            </div>
            {component.action?.type === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={component.action?.url || ''}
                  onChange={(e) => onUpdate(component.id, { action: { ...component.action, url: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                value={component.src}
                onChange={(e) => onUpdate(component.id, { src: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Action</label>
              <select
                value={component.action?.type || 'lightbox'}
                onChange={(e) => handleActionChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {actionTypes.image.map(action => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
            </div>
            {component.action?.type === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={component.action?.url || ''}
                  onChange={(e) => onUpdate(component.id, { action: { ...component.action, url: e.target.value } })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderStyleTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Background Color</label>
        <input
          type="color"
          value={component.style?.backgroundColor || '#ffffff'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Text Color</label>
        <input
          type="color"
          value={component.style?.color || '#000000'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Padding</label>
        <input
          type="range"
          min="0"
          max="50"
          value={component.style?.padding || 0}
          onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Border Radius</label>
        <input
          type="range"
          min="0"
          max="20"
          value={component.style?.borderRadius || 0}
          onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );

  const renderAnimationTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Animation Type</label>
        <select
          value={component.animation?.type || 'none'}
          onChange={(e) => onUpdate(component.id, { animation: { ...component.animation, type: e.target.value } })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="none">None</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="bounce">Bounce</option>
        </select>
      </div>
      {component.animation?.type !== 'none' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (ms)</label>
            <input
              type="number"
              min="100"
              max="2000"
              step="100"
              value={component.animation?.duration || 500}
              onChange={(e) => onUpdate(component.id, { animation: { ...component.animation, duration: parseInt(e.target.value) } })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delay (ms)</label>
            <input
              type="number"
              min="0"
              max="2000"
              step="100"
              value={component.animation?.delay || 0}
              onChange={(e) => onUpdate(component.id, { animation: { ...component.animation, delay: parseInt(e.target.value) } })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Component Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 px-3 ${
                activeTab === 'content'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`py-2 px-3 ${
                activeTab === 'style'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Style
            </button>
            <button
              onClick={() => setActiveTab('animation')}
              className={`py-2 px-3 ${
                activeTab === 'animation'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Animation
            </button>
          </nav>
        </div>

        <div className="mt-4">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'style' && renderStyleTab()}
          {activeTab === 'animation' && renderAnimationTab()}
        </div>
      </div>
    </div>
  );
}