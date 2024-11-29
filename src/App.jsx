/* eslint-disable no-unused-vars */

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import About from './Pages/About';
import Contact from './Pages/Contact';
import Home from './Pages/Home'
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import FourOFour from './Pages/FourOFour';

//Commons
import Navbar from './Commons/Navbar';
import Footer from './Commons/Footer';


function App() {
 

  return (
    
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route  element={<About />} path="/about"/>
          <Route  element={<Contact />} path="/contact"/>
          <Route  element={<Home />} path="/"/>
          <Route  element={<Login />} path="/login"/>
          <Route  element={<SignUp />} path="/signup"/>
          <Route  element={<FourOFour />} path="*" />
        </Routes>
        <Footer />
      </BrowserRouter>
        
  )
}

export default App
