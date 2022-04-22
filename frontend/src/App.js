import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Start from './pages/Start';
import Log_list from './pages/Log_list';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Log from './pages/Log';

function App(){
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Start />} />    //초기화면 진입
                    <Route path="/home" element={<Home />} />
                    <Route path="/:dr_id/:dr_name/loglist" element={<Log_list />} />   {/*디렉토리별 회의록 목록*/}
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/:dr_id/:dr_name/:mn_id/log" element={<Log />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
