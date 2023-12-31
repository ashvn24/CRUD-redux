import React, {useEffect} from 'react'
import Navbar from './Navbar'
import Users from './Users'
import { useDispatch, useSelector} from 'react-redux'
import { ALLUSERS } from '../Redux/ActionType'
import { useNavigate } from 'react-router-dom'

function AdminHome() {
    const admintoken = useSelector(state=>state.admintoken)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(admintoken){
      console.log(admintoken)
      const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/cadmin/users/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
  
          const data = await response.json();
          console.log(data);
          dispatch({
            type:ALLUSERS,
            data:data
          })
          
        } catch (error) {
          console.error('Error while fetching user data:', error);
        }
      };
  
  
      fetchData();
    }else{
      navigate('/admin')
    }
    
    
  },[admintoken, dispatch, navigate]); 
  return (
    <div>
      <Navbar/>
      <Users/>
    </div>
  )
}

export default AdminHome
