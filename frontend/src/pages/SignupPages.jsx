import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlaneTakeoff } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const SignupPages = () => {
  const [signupData, setSignupData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: signup, isPending, error } = useMutation({
    mutationFn: async (userData) => {
      const res = await axiosInstance.post('/auth/signup', userData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      queryClient.setQueryData(["authUser"], data);
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    }
  });

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (!signupData.email || !signupData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    signup(signupData);
  };
  
  return (
    <div className="h-screen flex items-center justify-center p-5 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-[800px] max-w-5xl mx-auto bg-gradient-to-r from-black via-blue-900 to-blue-950 rounded-xl shadow-lg overflow-hidden">
        {/* Signup form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <PlaneTakeoff className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-sky-600 tracking-wider">
              SkyRadar
            </span>
          </div>
          <div className="w-full ">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an account</h2>
                  <p className="text-sm opacity-70">
                    Check which planes are flying over your head
                  </p>
                </div>
                <div className="space-y-3">
                   {/* EMAIL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="imroz@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  {/* PASSWORD */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                         I agree to the {" "}
                         <Link to='/terms' className="text-primary hover:underline cursor-pointer">terms of service</Link> and {" "}
                         <Link to='/privacy' className="text-primary hover:underline cursor-pointer">privacy policy</Link>
                      </span>
                    </label>
                  </div>
                </div>
                
                {error && (
                  <div className="alert alert-error">
                    <span>{error.response?.data?.message || "Signup failed. Please try again."}</span>
                  </div>
                )}
                
                <button 
                  className="btn btn-primary w-full rounded-xl" 
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Signing up..." : "Create account"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                    Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/airplane2.webp" alt="Flight tracking illustration" className="w-full h-full"/>
            </div>
            <div className="text-center space-y-3 p-3">
              <h3 className="text-xl font-semibold px-7">Locate every plane flying over your head</h3>
              <p className="text-sm opacity-70 py-2 px-7">
                SkyRadar is a free and open-source web application that allows you to track planes flying over your head in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPages;