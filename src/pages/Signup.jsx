import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="text-red-600 text-3xl font-bold mb-8 block">
          NETFLIX
        </Link>

        {/* Signup Form */}
        <div className="bg-black/70 p-8 rounded-lg">
          <h1 className="text-3xl font-semibold mb-6">Sign Up</h1>
          
          <form className="space-y-4">
            <input 
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            
            <input 
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-[#333] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-gray-400 text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline">
                Sign in now
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;