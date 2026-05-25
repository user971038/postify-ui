import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import Profile from './views/Profile.jsx'
import Post from './views/Post.jsx'

import { BrowserRouter, Route, Routes } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile/:userId" element={<Profile  />} />
        <Route path="/post/:postId" element={<Post />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

// Clicking a post must link to server/posts/postId
// Clicking a post must show details, likes, comments, and files

