import React from 'react'
import './List.css'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chaList/ChatList'
function List() {
  return (
    <div className='list'>
      <UserInfo/>
      <ChatList/>
    </div>
  )
}

export default List