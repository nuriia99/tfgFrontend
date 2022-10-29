import { React } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalContextProvider } from './context/globalContext'
import Home from './pages/home/Home'
import Settings from './pages/home/Settings'
import PageNotFound from './pages/home/PageNotFound'
import Login from './pages/login/Login'

function App () {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/settings' element={<Settings/>}></Route>
          <Route path='*' element={<PageNotFound/>}></Route>
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  )
}

export default App
