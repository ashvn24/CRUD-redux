import React, { useState } from 'react'
import logo from '../Assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'


function Register() {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const[error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setError('')
        console.log(error)
        e.preventDefault();
        if (password === confirmPassword) {
            try {
                const response = await fetch('http://127.0.0.1:8000/register/', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        first_name: firstname,
                        last_name: lastname,
                        email,
                        phone,
                        password,
                    })
                    
                });
                const data = await response.json();
                
    
                if (response.ok) {
                    console.log('success');
                    navigate('/');
                } else {
                    setError(data.error)
                
                
              
                }
            } catch (error) {
            
                console.error('Error occurred during fetch request:', error);
                
            }
        } else {
            setError("password mismatch")
           
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white max-w-md w-full p-6 rounded-md shadow-md">
      <form onSubmit={(e) => handleSubmit(e)}>
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
        {/* First Name and Last Name */}
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 p-2 w-full border rounded-md"
              required
              value={firstname} onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 p-2 w-full border rounded-md"
              value={lastname} onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="mt-1 p-2 w-full border rounded-md"
            value={phone} onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 w-full border rounded-md"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password and Confirm Password */}
        <div className="flex mb-4">
          <div className="w-1/2 mr-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="********"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="********"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
        </form>
        <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
      </div>
    </div>
  )
}

export default Register
