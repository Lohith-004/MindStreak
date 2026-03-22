import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        password,
      });

      alert("Registered Successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Register
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="input mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register} className="btn-primary w-full">
          Register
        </button>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
