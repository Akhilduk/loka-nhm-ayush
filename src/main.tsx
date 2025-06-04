import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './theme/ThemeProvider';
import { VideoProvider } from './contexts/VideoContext';
import { ChatProvider } from './contexts/ChatContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <VideoProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </VideoProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);