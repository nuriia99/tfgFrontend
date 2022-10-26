import {React} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {GlobalContextProvider}  from './context/globalContext'
import Home from './pages/home/Home'
import Settings from './pages/home/Settings'
import Login from './pages/login/Login'

function App () {

  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/settings' element={<Settings/>}></Route>
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  )
}

export default App