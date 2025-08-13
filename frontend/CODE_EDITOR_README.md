# Code Editor Component

A powerful, customizable in-browser code editor built with Sandpack React that perfectly matches your StudyBuddy application's theme.

## Features

- 🎨 **Theme Integration**: Seamlessly matches your app's blue gradient theme
- 📁 **File Management**: Built-in file explorer with support for multiple file types
- 🔍 **Live Preview**: Real-time preview of your code changes
- 📝 **Console Output**: Built-in console for debugging and output
- 🖥️ **Fullscreen Mode**: Toggle between embedded and fullscreen editing
- 🎯 **Multiple Templates**: Support for React, TypeScript, Vanilla JS, and more
- 📱 **Responsive Design**: Works perfectly on all device sizes
- 🎭 **Customizable**: Easy to modify themes, layouts, and functionality

## Component

### CodeEditor

Full-featured code editor with all panels and features.

```tsx
import CodeEditor from "./components/CodeEditor";

<CodeEditor
  files={yourFiles}
  template="react"
  showFileExplorer={true}
  showConsole={true}
  showPreview={true}
  height="600px"
/>;
```

## Props

| Prop               | Type                     | Default        | Description                          |
| ------------------ | ------------------------ | -------------- | ------------------------------------ |
| `files`            | `Record<string, string>` | `defaultFiles` | Object mapping file paths to content |
| `template`         | `string`                 | `'react'`      | Sandpack template to use             |
| `showFileExplorer` | `boolean`                | `true`         | Show/hide file explorer panel        |
| `showConsole`      | `boolean`                | `true`         | Show/hide console panel              |
| `showPreview`      | `boolean`                | `true`         | Show/hide preview panel              |
| `height`           | `string`                 | `'600px'`      | Height of the editor container       |
| `className`        | `string`                 | `''`           | Additional CSS classes               |

## Available Templates

- `react` - React with JavaScript
- `react-ts` - React with TypeScript
- `vanilla` - Vanilla JavaScript
- `vanilla-ts` - Vanilla TypeScript
- `angular` - Angular
- `vue` - Vue.js
- `vue-ts` - Vue.js with TypeScript

## Custom Hook

Use the `useCodeEditor` hook for managing code editor state:

```tsx
import useCodeEditor from "./hooks/useCodeEditor";

const { files, activeFile, addFile, updateFile, removeFile } = useCodeEditor({
  "/App.js": 'console.log("Hello World!");',
  "/styles.css": "body { color: blue; }",
});

// Add a new file
addFile("/utils.js", "export const helper = () => {};");

// Update existing file
updateFile("/App.js", 'console.log("Updated!");');

// Remove file
removeFile("/styles.css");
```

## Theme Customization

The editor automatically uses your app's theme colors:

- **Primary**: Blue gradient (`from-blue-600 to-blue-700`)
- **Background**: White with rounded corners and shadows
- **Text**: Inter and Poppins fonts
- **Accents**: Blue-600 for highlights and interactions

## Example Usage

### Basic Implementation

```tsx
import CodeEditor from "./components/CodeEditor";

const MyComponent = () => {
  const files = {
    "/App.js": `
import React from 'react';

export default function App() {
  return <h1>Hello World!</h1>;
}
    `,
    "/styles.css": `
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}
    `,
  };

  return <CodeEditor files={files} template="react" height="500px" />;
};
```

### Advanced Implementation

```tsx
import CodeEditor from "./components/CodeEditor";
import useCodeEditor from "./hooks/useCodeEditor";

const AdvancedEditor = () => {
  const { files, addFile, updateFile } = useCodeEditor({
    "/App.js": 'console.log("Start coding!");',
  });

  const handleAddFile = () => {
    addFile("/new-file.js", "// New file content");
  };

  return (
    <div>
      <button onClick={handleAddFile}>Add File</button>
      <CodeEditor
        files={files}
        template="react"
        showFileExplorer={true}
        showConsole={true}
        showPreview={true}
        height="700px"
      />
    </div>
  );
};
```

## Demo Page

Visit `/code-editor` to see the editor in action with:

- Multiple template examples (React, TypeScript, Vanilla JS)
- Interactive controls for toggling panels
- Real-time code execution
- Responsive design showcase

## Integration Tips

1. **Performance**: The editor is optimized for smooth performance even with large files
2. **Accessibility**: Built with accessibility in mind, supporting keyboard navigation
3. **Mobile**: Responsive design works great on mobile devices
4. **Customization**: Easy to extend with additional features and themes

## Troubleshooting

### Common Issues

1. **Editor not loading**: Ensure Sandpack React is properly installed
2. **Theme not matching**: Check that Tailwind CSS is properly configured
3. **Files not updating**: Verify the files prop is being passed correctly

### Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Contributing

To extend the code editor:

1. Modify the theme in `CodeEditor.tsx`
2. Add new templates in the demo page
3. Extend the `useCodeEditor` hook for additional functionality
4. Update the documentation as needed

## License

This component is part of the StudyBuddy application and follows the same licensing terms.
