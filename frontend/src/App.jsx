import FlightTracker from './components/FlightTracker'
import LoginPage from './pages/LoginPage'
import SignupPages from './pages/SignupPages'
import { Route,Routes } from 'react-router'
import {Toaster} from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'

function App() {
   const { data, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false,
  });
  console.log(data);
  
  // tansack query

  return (
      <div className='h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white '>
        <Routes>
          <Route path='/' element={<FlightTracker/>} />
          <Route path='/signup' element={<SignupPages/>} />
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
        <Toaster />
    </div>
  )
}

export default App
