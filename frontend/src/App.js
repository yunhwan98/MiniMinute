import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Start from './pages/Start';
import Home from './pages/Home';
import Start_page from './pages/Start_page';
import Log_list from './pages/Log_list'
import Search from './pages/Search'


function App(){
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/start" element={<Start_page />} />    //초기화면 진입
                    <Route path="/loglist" element={<Log_list />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
