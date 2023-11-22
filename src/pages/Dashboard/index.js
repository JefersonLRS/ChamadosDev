import Header from "../../components/Header";
import Title from "../../components/Title";
import Modal from "../../components/Modal";
import './dashboard.css'

import { AuthContext } from "../../contexts/auth"
import { useContext, useEffect, useState } from "react"
import { FiMessageSquare, FiSearch, FiEdit2, FiTrash } from 'react-icons/fi'
import { BsPlusCircleFill } from "react-icons/bs"
import { Link } from "react-router-dom";
import { format } from 'date-fns'
import { squircle } from 'ldrs'

import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, orderBy, limit, startAfter, query, doc, deleteDoc } from "firebase/firestore";
const listRef = collection(db, "chamados");


export default function DashBoard() {

    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)

    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()
    const [loadingMore, setLoadingMore] = useState(false)

    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()

    useEffect(() => {
        async function loadChamados() {
            const q = query(listRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q)
            setChamados([]);
            await updateState(querySnapshot)

            setLoading(false)
        }

        loadChamados();

        return () => {}
    }, [])

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty) {
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] // pegando o ultimo chamado

            setChamados(chamados => [...chamados, ...lista])
            setLastDocs(lastDoc)

        }
        else {
            setIsEmpty(true)
        }

        setLoadingMore(false);
    }

    async function handleMore() {
        setLoadingMore(true);

        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));

        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }

    function toggleModal(item) {
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    async function deleteButton(item) {
        const docRef = doc(db, "chamados", item.id)
        deleteDoc(docRef)

        let chamadosAtualizados = chamados.filter((chamado) => (chamado.id !== item.id))
        setChamados(chamadosAtualizados);
    }

    if(loading) {
        return(
            <div>
                <Header/>

                <div className="content">
                    <Title name="Tickets">
                        <FiMessageSquare color="black" size={25} />
                    </Title>

                    <div className="container dashboard">
                    
                        {squircle.register()}
                        <l-squircle size="50" stroke="5" color="black"></l-squircle>
                        
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div>
            <Header/>
            
            <div className="content">

                <Title name="Tickets">
                    <FiMessageSquare color="black" size={25} />
                </Title>

                <>
                    {chamados.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum chamado encontrado...</span>
                            <Link to="/new" className="new">
                                <BsPlusCircleFill color="white" size={25}/>
                                Novo chamado
                            </Link>
                        </div>
                    ): (
                        <>
                            <Link to="/new" className="new novochamado-btn">
                                <BsPlusCircleFill color="white" size={25}/>
                                Novo chamado
                            </Link>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ background: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label="Data">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button className="action" onClick={() => toggleModal(item)} style={{ backgroundColor: '#181c2e' }}>
                                                        <FiSearch color="white" size={17}/>
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#3E92CC' }}>
                                                        <FiEdit2 color="white" size={17}/>
                                                    </Link>
                                                    <button onClick={() => deleteButton(item)} className="action" style={{ backgroundColor: '#f66' }}>
                                                        <FiTrash color="white" size={17}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {loadingMore && <div className="circle-loading"><l-squircle size="50" stroke="2" color="black"></l-squircle></div>}
                            {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}

                        </>
                    )}


                    
                </>

            </div>

            {showPostModal && (
                <Modal
                    conteudo={detail}
                    close={ () => setShowPostModal(!showPostModal) }
                />
            )}
            
        </div>
    )
}