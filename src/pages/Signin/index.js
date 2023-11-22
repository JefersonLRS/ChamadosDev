import './signin.css'
import logo from '../../assets/logo.png'

import { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify'
import { ring } from 'ldrs'

export default function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const { SignIn, loadingAuth } = useContext(AuthContext)

    async function handleSignIn(e) {
        e.preventDefault();

        if (email !== '' && password !== '') {
            await SignIn(email, password);
            setEmail('')
            setPassword('')
        }
        else {
            toast.warn("Preencha todos os campos para continuar")
        }

    }

    return (
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>
                    <input
                        type="text"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                    <input
                        type="password"
                        placeholder='Senha'
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                    />

                    <button type='submit'>
                        {ring.register()}
                        {loadingAuth ? <l-ring stroke={2} color='white' size={25}/> : 'Acessar'}
                    </button>
                </form>

                <Link to="/register">Não possui uma conta? Cadastre-se</Link>

            </div>
        </div>
    )
}