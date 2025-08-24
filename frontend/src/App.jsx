import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import History from './pages/history';

import Home from "./pages/Home";
import BreachResult from "./pages/BreachResult";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import PasswordCheck from "./pages/PasswordCheck";
import Alerts from "./pages/Alerts";
import PasswordResult from "./pages/PasswordResult";
import About from "./pages/About";


import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      {/* Example of using an icon in header */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breach-result" element={<BreachResult />} />
         <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/password-check" element={<PasswordCheck />} />
        <Route path="/password-result" element={<PasswordResult />} />
        <Route path="/about" element={<About />} />
        
<Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
