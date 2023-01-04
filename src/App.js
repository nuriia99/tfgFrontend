import { React } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GlobalContextProvider } from './context/globalContext'
import Home from './pages/home/Home'
import Settings from './pages/home/Settings'
import PageNotFound from './pages/home/PageNotFound'
import Login from './pages/login/Login'
import Patient from './pages/patient/Patient'
import AddReport from './pages/patient/AddReport'
import Goals from './pages/statistics/Goals'
import Lists from './pages/statistics/Lists'

function App () {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/app/login' element={<Login/>}></Route>
          <Route path='/app/home' element={<Home/>}></Route>
          <Route path='/app/settings' element={<Settings/>}></Route>
          <Route path='/app/patients/:id' element={<Patient/>}></Route>
          <Route path='/app/patients/informe/:id' element={<AddReport/>}></Route>
          <Route path='/' element={<Navigate to='/app/home'/>}></Route>
          <Route path='/app/goals' element={<Goals/>}></Route>
          <Route path='/app/lists' element={<Lists/>}></Route>
          <Route path='*' element={<PageNotFound/>}></Route>
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  )
}

export default App
