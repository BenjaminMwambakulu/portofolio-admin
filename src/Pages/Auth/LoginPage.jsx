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
    try {
      setLoading(true);
      const user = await signIn(email, password);
      console.log("Logged in user:", user);
      Navigate("/");
    } catch (error) {
      setError("Failed to sign in");
    }
    setLoading(false);
    setEmail("");
    setPassword("");
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
        <form onSubmit={() => handleLogin()}>
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
