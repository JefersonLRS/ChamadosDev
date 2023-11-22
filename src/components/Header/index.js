import avatarImg from '../../assets/avatar.png'
import './header.css'

import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import { useContext } from 'react'
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'


export default function Header() {

    const { user } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div className='image-avatar'>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
            </div>

            <div class="nav">
                <Link to='/dashboard'>
                    <FiHome color='white' size={24}/>
                    Chamados
                </Link>
                <Link to='/customers'>
                    <FiUser color='white' size={24}/>
                    Clientes
                </Link>
                
                <Link to='/profile'>
                    <FiSettings color='white' size={24}/>
                    Perfil
                </Link>
            </div>
        </div>
    )
}