import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../Assets/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { LOGIN } from '../Redux/ActionType';


function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const token = useSelector(state => state.token)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(token)

    useEffect(()=>{
        if(token){
            console.log(token)
            navigate('/home')
        }else{
            navigate('/')
        }
    },[token,navigate])

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError(null)

            await fetch('http://127.0.0.1:8000/login/',{
                method : 'POST',
                headers : {
                    Accept : 'application/json',
                    'Content-Type' : 'application/json',
                },
                credentials : 'include',
                body : JSON.stringify({
                    email,password
                })
            }).then(async(res)=>{
                const data = await res.json();
                console.log(data)

                console.log(data.error)

                if(data.error === 'Incorrect Password'){
                    setError('Incorrect Password')
                }else if(data.error === 'Email and Password is required'){
                    setError('Email and Password is required')
                }else if(data.error === 'User is not found'){
                    setError('User is not found')
                }
                else{
                    dispatch({
                        type:LOGIN,
                        token:data,
                      
                    })
                    //Navigate to the desired location
                    navigate('/home')
                }
            })
    }
  return (
    <div
      style={{
        backgroundImage:
          "url(https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fshapes-background&psig=AOvVaw29BVgOlOI80zKqVSvF63Ur&ust=1703962040804000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKD_n72ntYMDFQAAAAAdAAAAABAE)",
      }}
    >
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
          {/* Logo at the top center */}
          <div className="flex items-center justify-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className="h-24 w-34 cursor-pointer"
              
            />
          </div>
          <div>
            {error && (
              <p className="mb-4 text-sm bg-red-400 py-3 w-full px-2 rounded-md font-semibold text-white">
                {error}
              </p>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Email
              </label>
              <input
                value={email}
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Login
              </button>
            </div>

            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign up here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
