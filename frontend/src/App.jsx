import FlightTracker from './components/FlightTracker'
import LoginPage from './pages/LoginPage'
import SignupPages from './pages/SignupPages'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'
import TermsAndService from './pages/TermsAndService.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
function App() {
  const { data: authUser, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false,
  });

  // console.log(authUser);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className='h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center'>
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className='h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white'>
      <Routes>
        <Route 
          path='/' 
          element={authUser ? <FlightTracker /> : <Navigate to="/signup" replace />} 
        />
        
        <Route 
          path='/signup' 
          element={authUser ? <Navigate to="/" replace /> : <SignupPages />} 
        />
        <Route 
          path='/login' 
          element={authUser ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        
        <Route 
          path='*' 
          element={<Navigate to={authUser ? "/" : "/signup"} replace />} 
        />

        <Route path='/terms' element={<TermsAndService/>}></Route>

        <Route path="/privacy" element={<PrivacyPolicy />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App