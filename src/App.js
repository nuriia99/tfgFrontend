import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Settings from './pages/home/Settings'
import Login from './pages/login/Login'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/settings' element={<Settings/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App