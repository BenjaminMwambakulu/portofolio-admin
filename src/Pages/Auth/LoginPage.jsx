import React from "react";
import Logo from "../../Components/Logo";
import { signIn } from "../../Services/AuthService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const Navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    
    try {
      const user = await signIn(email, password);
      console.log("Logged in user:", user);
      Navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      // Extract a more user-friendly error message
      let errorMessage = "Failed to sign in";
      if (error.code) {
        switch(error.code) {
          case 'auth/user-not-found':
            errorMessage = "No account found with this email";
            break;
          case 'auth/wrong-password':
            errorMessage = "Incorrect password";
            break;
          case 'auth/invalid-email':
            errorMessage = "Invalid email address";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many failed attempts. Account temporarily disabled.";
            break;
          default:
            errorMessage = error.message || "Failed to sign in";
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-100 h-screen w-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <Logo />
        <p className="mb-6 text-gray-600">Please log in to continue</p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" Enter your email"
              disabled={loading}
            />
          </div>
          <div className="mb-6 text-left">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" Enter your password"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
