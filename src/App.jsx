import { Routes, Route } from 'react'
import Home from './views/Home'
import Profile from './views/Profile'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile/:userId" element={<Profile />} />
    </Routes>
  )
}

export default App
