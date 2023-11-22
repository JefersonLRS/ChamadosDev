import Header from '../../components/Header'
import Title from '../../components/Title'
import avatar from '../../assets/avatar.png'
import './profile.css'

import { FiSettings, FiUpload } from 'react-icons/fi'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify'

import { db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


export default function Profile() {

    const { user, storageUser, setUser, logout } = useContext(AuthContext);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [name, setName] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e) {
        if (e.target.files[0]){
            const image = e.target.files[0]
        
            if (image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image))
            }
            else {
                toast.warn("Envie uma imagem do tipo PNG ou JPEG");
                setImageAvatar(null);
                return;
            }
        
        }
    }

    async function handleUpload() {

        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {

            getDownloadURL(snapshot.ref).then( async (downloadUrl) => {
                let urlFoto = downloadUrl;

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef, {
                    nome: name,
                    avatarUrl: urlFoto
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: name,
                        avatarUrl: urlFoto
                    }
    
                    setUser(data);
                    storageUser(data);
                    toast.dark("Configurações Atualizadas!")
                })
            })

        })
    }


    async function handleSubmit(e) {
        e.preventDefault();

        if (imageAvatar === null && name !== '') {
            //Atualizar apenas o nome do user

            const docRef = doc(db, "users", user.uid)
            await updateDoc(docRef, {
                nome: name
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: name
                }

                setUser(data);
                storageUser(data);
                toast.dark("Configurações Atualizadas!")
            })
        } else if (name !== '' && imageAvatar !== null) {
            // Atualizar foto e nome
            handleUpload()
        }

    }

    return (
        <div>
            <Header/>

            <div className='content'>
                <Title name="Minha conta">
                    <FiSettings size={25} />
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='white' size={30} />
                            </span>
                        

                        <input type="file" accept='image/*' onChange={handleFile}/>
                        {avatarUrl === null ? (
                            <img src={avatar} alt="Foto de perfil" width={250} height={250}/>
                        ) : (
                            <img src={avatarUrl} alt="Foto de perfil" width={250} height={250}/>
                        )}
                        </label>

                        
                        <label>Nome</label>
                        <input 
                         type="text" 
                         value={name}
                         onChange={(e) => {setName(e.target.value)}}
                        />
                        
                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type='submit' >Salvar</button>

                    </form>

                </div>

                <div className='container'>
                    <button onClick={logout} className='logout-btn'>Sair</button>
                </div>

            </div>

            
        </div>
    )
}