import Header from '../../components/Header'
import Title from '../../components/Title'

import { useState } from 'react'
import { FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify';

import { db } from '../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';

export default function Customers() {

    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');


    async function handleRegister(e) {
        e.preventDefault();

        if (name !== '' && cnpj !== '' && endereco !== '') {

            await addDoc(collection(db, "customers"), {
                nomeComercial: name,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(() => {
                toast.success("Cliente cadastrado com sucesso!")
                setName('')
                setCnpj('')
                setEndereco('')
            })
            .catch((error) => {
                console.log("Erro ao cadastrar cliente: " + error);
                toast.error("Não foi possível cadastrar o cliente!")
            })

        }else {
            toast.warn("Preencha todos os campos!")
        }


    }

    return (
        <div>
            <Header/>

            <div className='content'>
                <Title name="Clientes">
                    <FiUser color='black' size={25}/>
                </Title>

                <div className='container'>
                
                    <form className='form-profile' onSubmit={handleRegister}>

                        <label>Nome comercial</label>
                        <input 
                        type="text"
                        placeholder='Nome da empresa'
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                        />
                        <label>CNPJ</label>
                        <input 
                        type="text"
                        placeholder='Digite o CNPJ'
                        value={cnpj}
                        onChange={(e) => {setCnpj(e.target.value)}}
                        />
                        <label>Endereço</label>
                        <input 
                        type="text"
                        placeholder='Endereço da empresa'
                        value={endereco}
                        onChange={(e) => {setEndereco(e.target.value)}}
                        />

                        <button type='submit'>
                            Salvar
                        </button>

                    </form>
                </div>

            </div>

        </div>
    )
}