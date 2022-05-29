import * as React from "react";
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Home from './components/Home';
import Orders from './components/Orders';
import Order from './components/Order';
import Dashboard from './components/Dashboard';
import Menu from './components/Menu';
import Login from './components/Login';



function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/orders' element={<Orders />} />
      <Route path='/orders/:orderId' element={<Order />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/menu' element={<Menu />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;
