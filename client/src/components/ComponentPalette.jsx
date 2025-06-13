const components = [
  {
    type: 'header',
    content: 'This is a header',
    icon: '📝',
    description: 'Add a heading to your page'
  },
  {
    type: 'text',
    content: 'This is text',
    icon: '📄',
    description: 'Add a paragraph of text'
  },
  {
    type: 'image',
    src: 'https://via.placeholder.com/150',
    icon: '🖼️',
    description: 'Add an image to your page'
  },
  {
    type: 'button',
    content: 'Click me',
    icon: '🔘',
    description: 'Add a button'
  },
  {
    type: 'divider',
    icon: '➖',
    description: 'Add a horizontal line'
  }
];

export default function ComponentPalette({ onDrag }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Components</h2>
      <div className="space-y-3">
        {components.map((comp, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => onDrag(e, comp)}
            className="group p-3 border border-gray-200 rounded-lg bg-white hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{comp.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900 capitalize">{comp.type}</h3>
                <p className="text-sm text-gray-500">{comp.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
