import React from 'react'
import {useUser} from '@clerk/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'

const App = () => {
  const {user,isLoaded }=useUser();
  if(!isLoaded){
    return <div>Loading...</div>
  }
  return (
    <Routes>
    <Route path='/' element={!user ?<Login/>:<Navigate to="/home"/>} />
    <Route path='/home' element={user ?<Home/>:<Navigate to="/"/>} />
    
    </Routes>
  )
}

export default App