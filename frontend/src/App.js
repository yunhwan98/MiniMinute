import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Start from './pages/Start';
import Log_list from './pages/Log_list';
import Search from './pages/Search';
import Profile from './pages/Profile';
import NewLog from './pages/New_log';


function App(){
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Start />} />    //초기화면 진입
                    <Route path="/home/:username" element={<Home />} />
                    <Route path="/loglist" element={<Log_list />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/newlog" element={<NewLog />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
