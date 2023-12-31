import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ADMINLOGOUT,ALLUSERS } from '../Redux/ActionType'


function Navbar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [search, setSearch] = useState("");

    const handleLogout = () =>{
        dispatch({
            type:ADMINLOGOUT,
            admintoken:'',
            allUsers:[],
            

        })
        navigate('/admin')
    }

    const handleSearchUser = async (e) => {
        e.preventDefault();
        console.log(search);
        console.log(`http://localhost:8000/cadmin/user-search/?name=${search}`);
        const response = await fetch(
          `http://localhost:8000/cadmin/user-search/?name=${search}`,
          {
            method: "GET",
            headers: { 
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        dispatch({
          type: ALLUSERS,
          data: data,
        });
      };
  return (
    <div className="bg-gray-800 p-2 flex justify-between items-center">
      {/* Admin Logo */}
      <div className="text-white font-bold text-xl">
        {/* <img
          src=""  // Replace with your actual admin logo source
          alt="Admin Logo"
          className="w-8 h-8 mr-2"
        /> */}
        Admin Dashboard
      </div>

      {/* Search Bar */}
      <div className="flex items-center">
      <form onSubmit={(e) => handleSearchUser(e)}>
        <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search..."
          className="px-2 py-1 mr-2 border rounded-md"
        />
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Search
        </button>
        </form>
      <button className="text-white ml-8 hover:underline" onClick={(e)=>handleLogout(e)}>Logout</button>
      </div>

      {/* Logout Button */}
    </div>
  )
}

export default Navbar
