import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { auth } from "../firebase";

export default function LoginPage() {
  const { email, password, setEmail, setPassword } = useContext(UserContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/todolist");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/todolist");
      }
    });
  }, [navigate]);

  return (
    <div className="shadow-md rounded-xl w-[400px] truncate">
      <h1 className="text-xl font-bold bg-[green] text-white text-center p-4">
        Login
      </h1>
      <form
        action=""
        className="p-4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 focus:outline-none bg-gray-100 w-full rounded-xl"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            className="px-4 py-2 focus:outline-none bg-gray-100 w-full rounded-xl"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          Não tem uma conta?{" "}
          <NavLink to="/signup" className="text-[green] font-semibold">
            Cadastre-se
          </NavLink>
        </div>
        <button className="w-full bg-[green] font-bold py-2 rounded-xl mt-4 text-white">
          Login
        </button>
      </form>
    </div>
  );
}
