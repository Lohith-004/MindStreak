import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return alert("Please fill all fields");
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      console.log(err)
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/* Name */}
        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password with Eye */}
        <div className="relative">
          <input
            className="w-full p-2 border rounded"
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            👁️
          </span>
        </div>

        {/* Button */}
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white p-2 rounded mt-4"
          onClick={handleRegister}
        >
          Register
        </button>

        {/* Navigate to Login */}
        <p
          className="text-center text-sm text-gray-600 mt-4 cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default Register;
