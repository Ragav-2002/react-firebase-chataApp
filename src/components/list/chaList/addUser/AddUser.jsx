import React, { useState } from 'react'
import './addUser.css'
import { toast } from 'react-toastify'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../../library/firebase'
import { useUserStore } from '../../../library/userStore'
function AddUser() {
  const [user, setUser] = useState(null)
  const {currentUser} = useUserStore()
  const handleSearch = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get("username")
    try{
      const userRef = collection(db, "users")
      const q = query(userRef, where("username", "==", username))
      const querySnapShot = await getDocs(q)
      console.log(querySnapShot)
      if(!querySnapShot.empty){
        setUser(querySnapShot.docs[0].data())
        console.log(user)
      }
    }catch(err){
      toast.error(e.message)
    }
  }
  const handleAdd = async() => {
    const chatRef = collection(db, 'chats')
    const userChatsRef = collection(db, 'userChat')
    try{
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: []
      })
      console.log(newChatRef.id)
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: currentUser.id,
          updatedAt: Date.now()
        })
      })
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: user.id,
          updatedAt: Date.now()
        })
      })
    }catch(e){
    console.log(e);
    }
  }
  return (
    <div className='addUser'>
        <form onSubmit={handleSearch}>
            <input type="text" placeholder='Username' name='username'/>
            <button>Search</button>
        </form>
        {user && <div className="user">
            <div className="detail">
                <img src={user.avatar || "./avatar.png"} alt="avatar" />
                <span>{user.username}</span>
            </div>
            <button onClick={handleAdd}>Add User</button>
        </div>}
    </div>
  )
}

export default AddUser