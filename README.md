# The Quantum Observer

An interactive science fiction story about Steve Bissell, a 72-year-old man who experiences quantum timeline convergence and discovers that his inner peace can heal reality itself.

**Live Demo:** https://quantum-observer.pages.dev (coming soon)

## Security Architecture

The API key is kept secure on a local Node.js server, never exposed to the browser.

## Setup Instructions

### 1. Install Node.js (if not already installed)
- Download from: https://nodejs.org/
- Install the LTS version

### 2. Add Your API Key
Edit `server.js` and replace this line:
```javascript
const MINIMAX_API_KEY = 'your-minimax-api-key-here';
```

With your actual MiniMax API key:
```javascript
const MINIMAX_API_KEY = 'sk-your-actual-key-here';
```

### 3. Start the Proxy Server
Open a terminal/command prompt in this folder and run:
```bash
node server.js
```

You should see:
```
🔒 Secure proxy server running on http://localhost:3000
📖 Open interactive-story.html in your browser to start the story
```

### 4. Open the Story
Simply double-click `interactive-story.html` or open it in your browser.

The HTML file will connect to your local server (localhost:3000), which securely handles the API key.

## How It Works

```
Browser (HTML/JS)  →  Local Server (server.js)  →  MiniMax API
   ↓                         ↓                          ↓
No API key          Has API key secure         Validates key
exposed here        (server-side only)
```

## Features

- **Secure**: API key never leaves your computer
- **Interactive**: Ask questions, make choices, or just read
- **Auto-advancing**: Story continues if you prefer passive reading
- **Persistent**: Progress saved automatically in browser
- **Revival system**: Can continue even after "death" scenarios

## Deployment Options

### For Personal Use (Current Setup)
Keep both files together and run the Node.js server when needed.

### For Sharing as a Gift
You have a few options:

1. **Share Both Files + Instructions**
   - Give recipient both `interactive-story.html` and `server.js`
   - Include the API key in server.js
   - Recipient needs Node.js installed and runs `node server.js`

2. **Deploy to a Cloud Service** (keeps key secure)
   - Deploy `server.js` to Heroku, Vercel, Railway, etc.
   - Update `API_ENDPOINT` in HTML to point to your deployed server
   - Share just the HTML file

3. **Simple Version** (less secure but easier)
   - Put API key directly in HTML (original version)
   - Single file, works immediately
   - Acceptable for personal gifts where source won't be shared

## Troubleshooting

**"Failed to fetch" error:**
- Make sure `server.js` is running (`node server.js`)
- Check that the server says "running on http://localhost:3000"
- Make sure no other program is using port 3000

**Story doesn't start:**
- Check browser console (F12) for errors
- Verify API key is correct in server.js
- Test MiniMax API key separately to ensure it's valid

**Server won't start:**
- Make sure Node.js is installed: run `node --version`
- Check if port 3000 is already in use
- Try changing PORT in server.js to 3001 (and update HTML accordingly)

## File Structure

```
interactive-story.html  - The story interface (run in browser)
server.js              - Secure API proxy (run with Node.js)
README.md             - This file
```

## Next Steps

1. Add your MiniMax API key to `server.js`
2. Start the server: `node server.js`
3. Open `interactive-story.html` in your browser
4. Develop the story content (currently placeholder)
