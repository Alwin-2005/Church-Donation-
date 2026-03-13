import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Backgrounds
    content = content.replace(/\bbg-white\b/g, 'bg-card');
    content = content.replace(/\bbg-gray-50\b/g, 'bg-background');
    content = content.replace(/\bbg-gray-100\b/g, 'bg-muted');
    content = content.replace(/\bbg-gray-800\b/g, 'bg-secondary');
    content = content.replace(/\bbg-gray-900\b/g, 'bg-foreground');
    content = content.replace(/\bbg-blue-(500|600|700|800)\b/g, 'bg-primary');
    content = content.replace(/\bbg-indigo-(500|600|700|800)\b/g, 'bg-primary');
    content = content.replace(/\bbg-red-(500|600)\b/g, 'bg-destructive');

    // Text colors
    content = content.replace(/\btext-black\b/g, 'text-foreground');
    content = content.replace(/\btext-gray-900\b/g, 'text-foreground');
    content = content.replace(/\btext-gray-800\b/g, 'text-foreground');
    content = content.replace(/\btext-gray-700\b/g, 'text-foreground');
    content = content.replace(/\btext-gray-600\b/g, 'text-muted-foreground');
    content = content.replace(/\btext-gray-500\b/g, 'text-muted-foreground');
    content = content.replace(/\btext-blue-(500|600|700|800)\b/g, 'text-primary');
    content = content.replace(/\btext-indigo-(500|600|700|800)\b/g, 'text-primary');
    content = content.replace(/\btext-white\b/g, 'text-primary-foreground');

    // Hover Backgrounds
    content = content.replace(/\bhover:bg-blue-(600|700|800)\b/g, 'hover:bg-primary/90');
    content = content.replace(/\bhover:bg-indigo-(600|700|800)\b/g, 'hover:bg-primary/90');
    content = content.replace(/\bhover:bg-gray-50\b/g, 'hover:bg-muted/50');
    content = content.replace(/\bhover:bg-gray-100\b/g, 'hover:bg-muted');
    content = content.replace(/\bhover:bg-gray-800\b/g, 'hover:bg-secondary/90');

    // Hover Text
    content = content.replace(/\bhover:text-blue-(600|700)\b/g, 'hover:text-primary');
    content = content.replace(/\bhover:text-gray-900\b/g, 'hover:text-foreground');

    // Borders
    content = content.replace(/\bborder-gray-200\b/g, 'border-border');
    content = content.replace(/\bborder-gray-300\b/g, 'border-border');
    content = content.replace(/\bborder-blue-(500|600)\b/g, 'border-primary');

    // Focus rings
    content = content.replace(/\bfocus:border-blue-500\b/g, 'focus:border-ring');
    content = content.replace(/\bfocus:ring-blue-500\b/g, 'focus:ring-ring');
    content = content.replace(/\bfocus:border-indigo-500\b/g, 'focus:border-ring');
    content = content.replace(/\bfocus:ring-indigo-500\b/g, 'focus:ring-ring');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

const dir = process.argv[2] || './src/components';
walkDir(dir, processFile);

// Process App.jsx
processFile('./src/App.jsx');
