import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { FcGoogle } from 'react-icons/fc'


export default function RegisterPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) {
      console.log(error.message)
    } else {
      navigate('/')
    }
  }


  return (
    <div className="flex items-center justify-center h-screen ">

      <div className="flex items-center flex-col bg-[#131212] p-6 rounded-lg w-96 text-white">

        <h1 className="flex justify-center font-bold text-xl w-full">
          Create your account
        </h1>
        <p className="text-gray-400 text-xs mt-2">
          Fill in the form below to create your account
        </p>

        <form className="flex flex-col w-full gap-2 mt-3" onSubmit={handleRegister}>
          <h2>Full name</h2>
          <input
            type="text"
            placeholder="John Doe"
            className="border border-gray-500 p-2 pl-3 rounded-md"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <h2>Email</h2>
          <input
            type="email"
            placeholder="name@example.com"
            className="border border-gray-500 p-2 pl-3 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-gray-400 text-sm mt-1 mb-5">
            We'll use this to contact you. We will not share your email with anoyone else.
          </p>

          <h2>Password</h2>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-500 p-2 pl-3 rounded-md mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <h2>Confirm Password</h2>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-500 p-2 pl-3 rounded-md mb-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="py-2 rounded-md bg-white text-black font-medium cursor-pointer hover:bg-gray-200"
          >
            Create Account
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
          gap-2
        ">
          <FcGoogle className="text-2xl"/>
          Continue with Google
        </button>
        <p className="text-gray-500 text-xs">
          Already have an account? 
          <span className="underline ml-1 cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}