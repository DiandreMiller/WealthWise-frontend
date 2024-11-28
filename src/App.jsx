/* eslint-disable no-unused-vars */

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Home from './Pages/Home'
import Navbar from './Commons/Navbar';
import Footer from './Commons/Footer';


function App() {
 

  return (
    
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route  element={<Home />} path="/"/>
        </Routes>
        <Footer />
      </BrowserRouter>
        
  )
}

export default App
