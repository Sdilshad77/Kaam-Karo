import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header'
import { ToastContainer } from 'react-toastify'
import Dashboard from './pages/admin/Dashboard'
import Talents from './pages/Talents'
import FreelancerProfile from './pages/FreelancerProfile'
import UserProfile from './pages/Profile'
import AllWork from './pages/AllWork'
import Howitworks from './pages/Howitworks'
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/auth/profile' element={<UserProfile />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/work' element={<AllWork />} />
        <Route path='/how-it-works' element={<Howitworks />} />
        <Route path='/talents' element={<Talents />} />
        <Route path='/talent/:id' element={<FreelancerProfile />} />
        <Route path='/work/:id' element={<AllWork />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
