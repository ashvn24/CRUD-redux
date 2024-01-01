import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SETUSER, LOGIN } from '../Redux/ActionType';
import { FaEdit } from 'react-icons/fa';


function Home() {
  const token = useSelector(state => state.token)
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState('')
  const [posts, setPosts] = useState('')
  useEffect(() => {
      (async () => {
          try {
              const response = await fetch('http://127.0.0.1:8000/user/', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token.jwt}`
                  },
                  credentials: 'include'
              });
  

              const data = await response.json();

              console.log(data);
              
              const payload = {
                firstname: data.user_data.first_name,
                lastname: data.user_data.last_name,
                email: data.user_data.email,
                phone: data.user_data.phone,
                id: data.id  // Include the user ID in your payload
            };
             
              dispatch({
                  type:SETUSER,
                  users:payload
              })
              // setUserData(data);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              let a = imagePost()

          } catch (error) {
              console.error('Error while fetching user data:', error);
          }
      })();
  }, [token, dispatch]);

    const imagePost =async()=>{
      try {
        const res = await fetch('http://127.0.0.1:8000/posts',{
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.jwt}`
        },
        credentials: 'include'
        })
        let posts=await res.json();
        setPosts([...posts])
        console.log('---'+posts);
      } catch (error) {
        console.log(error);
      }
    }
      
    
  
  



  const handleLogout = (e) => {
      console.log("sdsd")
      dispatch({
          type:LOGIN,
          token: '',

      })
      navigate('/')

  }

  

  const handleSubmit = async () => {
    console.log('---'+image.name);
    setEditMode(false);
    const formData = new FormData();
    formData.append('image', image,image.name);
    formData.append('user', users.id);

    try {
      const response = await fetch('http://localhost:8000/posts/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Image uploaded successfully');
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Logout Button */}
      <button className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={(e) => handleLogout(e)}>
        Logout
      </button>

      {/* Card */}
      <div className="bg-white max-w-md w-full p-6 rounded-md shadow-md relative">
      {/* Avatar */}
      <div className="flex items-center justify-center mb-4 relative">
        <img
          src={image ? URL.createObjectURL(image):"https://via.placeholder.com/80"}
          alt="Avatar"
          className="w-20 h-20 rounded-full"
        />
        
          <label htmlFor="fileInput" className="absolute bottom-0 right-0 cursor-pointer"onClick={()=>setEditMode(true)}>
            <FaEdit size={18} color="#4a5568" />
          </label>
        
        {editMode && (
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e)=>setImage(e.target.files[0])}
          />
        )}
      </div>

      {/* User Information */}
      <div>
        <p className="text-2xl font-semibold mb-2">
          {users.firstname} {users.lastname}
        </p>
        <p className="text-gray-600 mb-2">Email: {users.email}</p>
        <p className="text-gray-600 mb-2">Phone: {users.phone}</p>
      </div>

      {/* Optional: Add a button to exit edit mode */}
      {editMode && (
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          onClick={()=>handleSubmit()}
        >
          Save Changes
        </button>
      )}
    </div>
    </div>
    </div>
  )
}

export default Home
