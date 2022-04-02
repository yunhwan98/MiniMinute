import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';
import Start from './pages/Start';
import Home from './pages/Home';

function App(){
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
