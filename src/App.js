import { React } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GlobalContextProvider } from './context/globalContext'
import Home from './pages/home/Home'
import Settings from './pages/home/Settings'
import PageNotFound from './pages/home/PageNotFound'
import Login from './pages/login/Login'
import Patient from './pages/patient/Patient'
import PDFFile from './pages/home/PDFFile'

function App () {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/app/login' element={<Login/>}></Route>
          <Route path='/app/home' element={<Home/>}></Route>
          <Route path='/app/settings' element={<Settings/>}></Route>
          <Route path='/app/patients/:id' element={<Patient/>}></Route>
          <Route path='/' element={<Navigate to='/app/home'/>}></Route>
          <Route path='/app/pdf' element={<PDFFile/>}></Route>
          <Route path='*' element={<PageNotFound/>}></Route>
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  )
}

export default App
