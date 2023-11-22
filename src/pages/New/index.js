import './new.css'

import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiPlusCircle } from 'react-icons/fi'
import { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'


import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
const listRef = collection(db, "customers");

export default function New() {

    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoadCustomer] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(0)

    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [idCustumer, setIdCustomer] = useState(false)


    useEffect(() => {

        async function loadCustomers() {
            const querySnapshot = await getDocs(listRef)
            .then((snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeComercial: doc.data().nomeComercial
                    })
                })

                if (snapshot.docs.size === 0) {
                    console.log("NENHUMA EMPRESA ENCONTRADA");
                    setCustomers([ { id: '1', nomeComercial: 'FREELA' } ]);
                    setLoadCustomer(false)
                    return;
                }

                setCustomers(lista);
                setLoadCustomer(false);

                if (id) {
                    loadId(lista);
                }

            })
            .catch((error) => {
                console.log("Erro ao buscar os clientes: " + error);
                setLoadCustomer(false)
                setCustomers([ { id: '1', nomeComercial: 'FREELA' } ])
            })
        }

        loadCustomers();

    }, [id])

    async function loadId(lista) {
        const docRef = doc(db, "chamados", id);
        await getDoc(docRef)
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index)
            setIdCustomer(true)
        })
        .catch((error) => {
            console.log(error);
            setIdCustomer(false)
        })
    }

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value)
    }

    async function handleRegister(e) {
        e.preventDefault();

        if(idCustumer){
            //Atualizando chamado
            const docRef = doc(db, "chamados", id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeComercial,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            })
            .then(() => {
                toast.info("Chamado atualizado com sucesso!")
                setCustomerSelected(0)
                setComplemento('')
                navigate("/dashboard")
            })
            .catch((error) => {
                console.log(error);
                toast.error("Não foi possível editar o chamado.")
            })

            return;
        }

        //Registrar chamado
        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            cliente: customers[customerSelected].nomeComercial,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        })
        .then(() => {
            toast.success("Chamado registrado!")
            setComplemento('')
            setCustomerSelected(0)
        })
        .catch((error) => {
            console.log("Erro ao registrar chamado: " + error);
            toast.error("Ops, não foi possível registrar o chamado. Tente mais tarde!")
        })
    }

    return (
        <div>
            <Header/>

            <div className='content'>
                <Title name={id ? 'Editando chamado' : 'Novo chamado'}>
                    <FiPlusCircle color='black' size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="Carregando" />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                        return (
                                            <option value={index} key={index}>
                                                {item.nomeComercial}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }
                        
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Denuncia">Denúncia</option>
                        </select>
                    
                        <label>Status</label>
                        <div className='status'>
                            <input 
                             type="radio"
                             name='radio'
                             value="Aberto"
                             onChange={handleOptionChange}
                             checked={ status === 'Aberto' }
                            />
                            <span>Em aberto</span>

                            <input 
                             type="radio"
                             name='radio'
                             value="Andamento"
                             onChange={handleOptionChange}
                             checked={ status === 'Andamento' }
                            />
                            <span>Em andamento</span>

                            <input 
                             type="radio"
                             name='radio'
                             value="Atendido"
                             onChange={handleOptionChange}
                             checked={ status === 'Atendido' }
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder='Descreva seu problema (Opcional).'
                            value={complemento}
                            onChange={(e) => {setComplemento(e.target.value)}}
                        />

                        {id ? (
                            <button type='submit' style={{ background: '#1a52ff' }}>
                                Salvar
                            </button>
                        ): (
                            <button type='submit'>
                                Registrar
                            </button>
                        )}

                    </form>
                </div>

            </div>
        </div>
    )
}