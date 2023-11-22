import logo from '../../assets/logo.png'

import { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify'
import { ring } from 'ldrs'

export default function SignUp(){
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const { SignUp, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        if (name !== '' && email !== '' && password !== '') {
            await SignUp(name, email, password);
            setName('')
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

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>
                    <input
                        type="text"
                        placeholder='Digite seu nome'
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                    />
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
                        {loadingAuth ? <l-ring stroke={2} color='white' size={25}/> : 'Cadastrar'}
                    </button>
                </form>

                <Link to="/">Já possui uma conta? Faça Login</Link>

            </div>
        </div>
    )
}