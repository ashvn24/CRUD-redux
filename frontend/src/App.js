import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './User/Login';
import Home from './User/Home';
import Register from './User/Register';
import AdminLogin from './Admin/AdminLogin';
import AdminHome from './Admin/AdminHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Login/>}/>
        <Route path='/home'  element={<Home/>}/>
        <Route path='/register' element={<Register/>} />

        <Route path='/admin' element={<AdminLogin/>} />
        <Route path='/admin-home' element={<AdminHome/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
