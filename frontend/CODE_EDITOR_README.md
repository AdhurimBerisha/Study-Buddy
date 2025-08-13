# StudyBuddy Code Editor

## Overview

The StudyBuddy Code Editor is a standalone, in-browser code editor that allows users to practice coding in their free time. It's completely separate from the lesson system and provides a professional coding environment.

## Features

### 🎯 Core Functionality

- **Monaco Editor Integration**: Professional-grade code editor (same as VS Code)
- **Multiple Language Support**: JavaScript, TypeScript, Python, Java, C++, C#, PHP, HTML, CSS, JSON
- **Real-time Code Execution**: Run JavaScript code directly in the browser
- **Syntax Highlighting**: Full support for all supported languages

### 🛠️ Editor Features

- **Language Selection**: Switch between programming languages
- **Code Templates**: Quick-start templates for common patterns
- **Code Actions**: Copy, download, and reset code
- **Responsive Design**: Works on all screen sizes

### 📱 User Experience

- **Clean Interface**: Matches StudyBuddy's design theme
- **Intuitive Controls**: Easy-to-use buttons and controls
- **Output Panel**: Clear display of code execution results
- **Helpful Tips**: Built-in coding guidance

## Usage

### Accessing the Editor

1. Navigate to `/code-editor` in your browser
2. Or click "Code Editor" in the main navigation

### Writing Code

1. Select your preferred programming language
2. Write or paste your code in the editor
3. Use the templates to get started quickly
4. Click "Run Code" to execute JavaScript

### Available Actions

- **Run Code**: Execute your JavaScript code
- **Reset**: Clear the editor and start fresh
- **Copy**: Copy code to clipboard
- **Download**: Save code as a file
- **Clear Output**: Clear the output panel

## Technical Details

### Dependencies

- `@monaco-editor/react`: Monaco Editor React wrapper
- `react-icons`: Icon library for UI elements
- `tailwindcss`: Styling framework

### Browser Support

- Modern browsers with ES6+ support
- JavaScript execution requires browser compatibility
- Monaco Editor works in all modern browsers

### Security Notes

- JavaScript execution uses `Function` constructor (client-side only)
- Other languages show syntax highlighting but don't execute
- For production, consider backend code execution services

## Future Enhancements

### Planned Features

- **Backend Integration**: Support for Python, Java, C++ execution
- **Code Saving**: Save snippets to user profiles
- **Code Sharing**: Share code with other users
- **Collaborative Coding**: Real-time pair programming
- **Code History**: Track coding sessions and progress

### Backend Requirements

- Code execution service (e.g., Docker containers)
- Language-specific compilers and interpreters
- Security sandboxing for safe code execution
- Rate limiting and resource management

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── FreeCodeEditor.tsx      # Main editor component
│   └── pages/
│       └── CodeEditor/
│           └── CodeEditorPage.tsx  # Page wrapper
```

## Integration

- Added to main navigation (`/code-editor`)
- Follows StudyBuddy's design patterns
- Uses existing Button component
- Responsive design with Tailwind CSS
- No authentication required (public access)

## Development

### Running Locally

1. Ensure `@monaco-editor/react` is installed
2. Start the development server: `npm run dev`
3. Navigate to `/code-editor`

### Building

The code editor is included in the main build process and will be available in production builds.

## Support

For issues or questions about the code editor, refer to:

- Monaco Editor documentation: https://microsoft.github.io/monaco-editor/
- StudyBuddy development team
