import Website from '../models/Website.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createWebsite = async (req, res) => {
  try {
    const website = new Website({
      ...req.body,
      owner: req.user._id
    });
    await website.save();

    // Add website to user's websites array
    req.user.websites.push(website._id);
    await req.user.save();

    res.status(201).json(website);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getWebsites = async (req, res) => {
  try {
    const websites = await Website.find({ owner: req.user._id });
    res.json(websites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWebsite = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json(website);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWebsite = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'components', 'isPublished'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    updates.forEach(update => website[update] = req.body[update]);
    await website.save();

    res.json(website);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Remove website from user's websites array
    req.user.websites = req.user.websites.filter(
      id => id.toString() !== website._id.toString()
    );
    await req.user.save();

    res.json(website);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportToHtml = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Generate HTML content
    const htmlContent = generateHtml(website);

    // Create exports directory if it doesn't exist
    const exportDir = path.join(__dirname, '../exports');
    await fs.mkdir(exportDir, { recursive: true });

    // Save HTML file
    const fileName = `${website.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.html`;
    const filePath = path.join(exportDir, fileName);
    await fs.writeFile(filePath, htmlContent);

    // Send file to client
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up file after sending
      fs.unlink(filePath).catch(console.error);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function generateHtml(website) {
  const styles = generateStyles(website.components);
  const scripts = generateScripts(website.components);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${website.title}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        ${styles}
    </style>
</head>
<body class="bg-white">
    <div class="container mx-auto px-4 py-8">
        ${website.components.map(component => generateComponentHtml(component)).join('\n')}
    </div>
    <script>
        ${scripts}
    </script>
</body>
</html>`;
}

function generateStyles(components) {
  const styles = components.map(component => {
    const componentStyles = Object.entries(component.style || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    if (component.animation && component.animation.type !== 'none') {
      return `
        .component-${component.id} {
          ${componentStyles}
          animation: ${component.animation.type} ${component.animation.duration || '1s'} ${component.animation.timing || 'ease'};
        }`;
    }

    return `
      .component-${component.id} {
        ${componentStyles}
      }`;
  }).join('\n');

  return styles;
}

function generateScripts(components) {
  const scripts = components.map(component => {
    if (component.action?.type === 'scroll') {
      return `
        document.getElementById('${component.id}').addEventListener('click', () => {
          document.getElementById('${component.action.targetId}').scrollIntoView({ behavior: 'smooth' });
        });`;
    }
    return '';
  }).join('\n');

  return scripts;
}

function generateComponentHtml(component) {
  const commonProps = `class="component-${component.id}"`;
  
  switch (component.type) {
    case 'text':
      return `<p ${commonProps}>${component.content || ''}</p>`;
    case 'image':
      return `<img ${commonProps} src="${component.src || ''}" alt="${component.alt || ''}" />`;
    case 'button':
      return `<button ${commonProps}>${component.content || ''}</button>`;
    case 'input':
      return `<input ${commonProps} type="${component.inputType || 'text'}" placeholder="${component.placeholder || ''}" />`;
    default:
      return '';
  }
} 