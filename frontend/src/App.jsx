import './App.css'
import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './context/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRouteAdmin from './context/ProtectedRouteAdmin'

function App() {
    return(
        <main>
            <Routes>
                <Route path='/' element={<Login />} />

                <Route
                    path='/dashboard'
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path='/admindashboard'
                    element={
                        <ProtectedRouteAdmin>
                            <AdminDashboard />
                        </ProtectedRouteAdmin>
                    }
                />
            </Routes>
        </main>
    )
}

export default App
