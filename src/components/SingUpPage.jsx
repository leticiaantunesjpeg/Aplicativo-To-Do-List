import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { auth } from "../firebase";

export default function SignUpPage() {
  const { email, password, setEmail, setPassword } = useContext(UserContext);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      alert("As senhas não são iguais");
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="shadow-md rounded-xl w-[400px] truncate">
      <h1 className="text-xl font-bold bg-[green] text-white text-center p-4">
        Sign Up
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
          <input
            type="password"
            placeholder="Confirme a senha"
            className="px-4 py-2 focus:outline-none bg-gray-100 w-full rounded-xl"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <button className="w-full bg-[green] font-bold py-2 rounded-xl mt-4 text-white">
          Cadastro
        </button>
      </form>
    </div>
  );
}
