import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Start from './pages/Start';
import Log_list from './pages/Log_list';
import Search from './pages/Search';
import Recent from "./pages/Recent";
import Profile from './pages/Profile';
import Log from './pages/Log';
import NotFound from "./pages/NotFound";
import Emotion from "./pages/Emotion";
import Summary from "./pages/Summary";
import Favorite from "./pages/Favorite";

function App(){
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Start />} />    //초기화면 진입
                    <Route path="/home" element={<Home />} />
                    <Route path="/:dr_id/loglist" element={<Log_list />} />   {/*디렉토리별 회의록 목록*/}
                    {/*<Route path="/search" element={<Search />} />*/}
                    <Route path="/favorite" element={<Favorite />} />
                    <Route path="/recent" element={<Recent />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/:dr_id/:mn_id/log" element={<Log />} />
                    <Route path="/:dr_id/:mn_id/summary" element={<Summary />} />
                    <Route path="/:dr_id/:mn_id/emotion" element={<Emotion />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
