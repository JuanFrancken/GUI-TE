import React, { useState } from "react";
import { manejoApi, User } from "../ManejoApi";
import { useNavigate } from 'react-router-dom';

const Usuario = {
    email:"",
    password:""
};

function Login(){
    const [usuario, setUsuario] = useState(Usuario);
    const {autenticar} = manejoApi();
    const navigate = useNavigate();

    async function loginCheck(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const login: User = {
            email: usuario.email,
            password: usuario.password
        }
        try{
            const token = await autenticar(login);
            if(token){
                navigate('/Home');
            }else{
                setUsuario(ant => ({...ant, password: ""}));
            }
        }catch{
            console.log("Error al obtener token");
        }   
    }

    return (
        
        <div>
            <h1 className="title fw-bold mb-5">App gui de prueba </h1>
            <div id="loginForm" className="card p-5 d-flex justify-content-center">
                <form className="form" onSubmit={ e => loginCheck(e)}>
                <label className="form-label">Correo</label>
                <input className="form-control" type="text" name="email" value={usuario.email} required onChange={(e) => setUsuario(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>
                <label className="form-label" >Contraseña</label>
                <input className="form-control" type="password" name ="password" value={usuario.password} required onChange={(e) => setUsuario(prev => ({ ...prev, [e.target.name]: e.target.value }))}></input>
                <button className = "btn btn-primary m-3 " type="submit">Iniciar Sesion</button>
            </form>         
            </div>
            
        </div>

    )
}

export default Login