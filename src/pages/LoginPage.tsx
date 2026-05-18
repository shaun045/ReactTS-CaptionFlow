import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo/CaptionflowLogo.png";
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.log(error.message)
    } else {
      navigate("/editor");
    }
  }

  const handleGoogleLogin = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${import.meta.env.VITE_APP_URL}/editor`
      }
    })

    if (error) console.log(error.message);
  };


  return (

    <div className="flex items-center justify-center h-screen ">

      <div className="flex items-center flex-col bg-[#131212] p-6 rounded-lg w-96 text-white">
        <img src={logo} alt="Logo" className="w-15"/>

        <h1 className="flex justify-center font-bold text-xl w-full">
          Welcome to CaptionFlow
        </h1>
        <p className="text-gray-500 text-xs">
          Don't have an account? 
          <span className="underline ml-1 cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2 mt-3">
          <h2>Email</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="name@example.com"
            className="border border-gray-500 p-2 pl-3 rounded-md"
          />
          <h2>Password</h2>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className="border border-gray-500 p-2 pl-3 rounded-md mb-2"
          />
          <button
            type="submit"
            className="py-2 rounded-md bg-white text-black font-medium cursor-pointer hover:bg-gray-200"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-5 w-full max-w-md mx-auto">
          <span className="grow h-px bg-neutral-800"></span>
          <h1 className="px-4 text-sm font-medium text-neutral-500">Or</h1>
          <span className="grow h-px bg-neutral-800"></span>
        </div>

        <button className="
          border-[0.5px]
          border-gray-500
          w-full
          mb-3
          py-2
          rounded-md
          cursor-pointer
          bg-[#1f1d1d]
          flex
          items-center
          justify-center
          gap-2 hover:bg-gray-700
        "
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="text-2xl"/>
          Continue with Google
        </button>

        <p className="flex flex-col text-center text-xs text-gray-400 mt-4">
          By clicking continue, you agree with our 
          <span className="flex justify-center gap-1">
            <span className="underline cursor-pointer hover:text-gray-300">
              Terms of Service
            </span>  
            and 
            <span className="underline cursor-pointer hover:text-gray-300">
              Privacy Policy.
            </span>   
          </span> 
        </p>
      </div>

    </div>
  )
}