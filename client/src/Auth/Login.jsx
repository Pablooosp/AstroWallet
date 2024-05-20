import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {Divider} from "@nextui-org/divider";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  const moveRegister = async () => {
    navigate('/');
  };
  

  return (
    <section className="w-full h-full flex items-center justify-center">
      <form className="bg-[#09090b] h-[70%] w-[25%] border-[#161619] border-1 rounded-lg flex flex-col items-center" onSubmit={handleSubmit}>
        <h2 className="text-center text-6xl font-extrabold mt-8">Login</h2>
        <div className="w-[70%] gap-4 mt-[25%]">
          <Input className="" isRequired value={email} type="email" label="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input className="mt-8" isRequired value={password} type="password" label="Password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="mt-6" color="success" variant="bordered" type="submit">Iniciar sesión</Button>
        <div className="mt-10 flex flex-col items-center">
          
          <Divider className="w-60"/>
          <p className="text-center mt-4">No tienes cuenta?</p>
          <Button className="mt-6 text-lg w-52" color="primary" variant="bordered" onClick={moveRegister}>Crear una cuenta</Button>
        </div>
      </form>
    </section>
  );
};

export default Login;
