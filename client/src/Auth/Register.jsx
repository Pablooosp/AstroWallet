import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {Divider} from "@nextui-org/divider";


const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
    navigate('/dashboard');
  };

  const moveLogin = async () => {
    navigate('/login');
  };

  return (
    <section className="w-full h-full flex items-center justify-center">
      <form className="bg-[#09090b] h-[70%] w-[25%] border-[#161619] border-1 rounded-lg flex flex-col items-center" onSubmit={handleSubmit}>
        <h2 className="text-center text-6xl font-extrabold mt-8">Sign in</h2>
        <div className="w-[70%] gap-4 mt-[20%]">
          <Input isRequired value={name} type="text" label="Full name" onChange={(e) => setName(e.target.value)} />
          <Input className="mt-4" isRequired value={email} type="email" label="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input className="mt-4" isRequired value={password} type="password" label="Password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="mt-4" color="success" variant="bordered" type="submit" onClick={handleSubmit}>Registrarse</Button>
        <div className="mt-10 flex flex-col items-center">
          <Divider className="w-60"/>
          <p className="text-center mt-4">Ya tienes una cuenta?</p>
          <Button className="mt-6 text-lg w-52" color="primary" variant="bordered" onClick={moveLogin}>Iniciar sesion</Button>
        </div>
      </form>
    </section>
  );
};

export default Register;
