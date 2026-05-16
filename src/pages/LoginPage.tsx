
import logo from "../assets/logo/CaptionflowLogo.png";

interface LoginPageProps {
  onLogin: () => void;
 }

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (

    <div className="
      flex 
      items-center 
      justify-center 
      h-screen 
      ">

      <div 
        className="
          flex 
          items-center
          flex-col
          bg-[#131212] 
          p-6 
          rounded-lg 
          w-96
          text-white
        ">
        <img src={logo} alt="Logo" className="w-15"/>

        <h1 
          className="
            flex
            justify-center
            font-bold 
            text-xl  
            w-full
          ">
          Welcome to CaptionFlow
        </h1>
        <p className="text-gray-500 text-xs">
          Don't have an account? 
          <span className="underline ml-1 cursor-pointer hover:text-gray-300">
            Sign up
          </span>
        </p>

        <div className="
          flex
          flex-col
          w-full
          mt-5
          gap-2
        ">
          <h2>Email</h2>
          <input 
            className="
              border 
              border-gray-500 
              p-2
              pl-3
              rounded-md
              font-light
            " 
            type="text"
            placeholder="name@example.com"
          />
          <button 
            onClick={onLogin}
            className="
              py-2
              rounded-md
              bg-white
              text-black
              font-medium
              cursor-pointer
            "
          >
            Login
          </button>
        </div>

        <div className="flex items-center my-5 w-full max-w-md mx-auto">
          <span className="grow h-px bg-neutral-800"></span>
          <h1 className="px-4 text-sm font-medium text-neutral-500">Or</h1>
          <span className="grow h-px bg-neutral-800"></span>
        </div>

        <button className="
          border
          border-white
          w-full
          mb-3
          py-2
          rounded-md
          cursor-pointer
        ">
          Continue with Google
        </button>

        <p className="
          flex 
          flex-col
          text-center 
          text-xs
          text-gray-400
          mt-4
        ">
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