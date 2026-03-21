import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            className="w-full p-2 border rounded"
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            👁️
          </span>
        </div>

        <button
          className="w-full bg-indigo-600 text-white p-2 rounded mt-4"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
