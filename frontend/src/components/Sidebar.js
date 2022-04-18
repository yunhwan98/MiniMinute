import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import {Modal} from "react-bootstrap";
import profile from '../images/profile2.png';
import setting from '../images/setting.png';
import NewLog_modal from "./NewLog_modal";

function Sidebar() {
    const dropDownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const [dirShow, setDirShow] = useState(false);
    const [logShow, setLogShow] = useState(false);

    //유저정보
    const [user, setUser] = useState(localStorage.getItem('token') ? JSON.parse( localStorage.getItem('user') ) : []);
    //유저 로그아웃
    const userLogout =(e)=> {
        localStorage.clear(); 
    }
    console.log(user);
    return (
        <div className="sidebar">
            <div className="dropdown">
                <button className="none-btn"
                    onClick={() => setIsOpen(!isOpen)}>
                    <img src={setting} style={{height: "20px"}} />
                </button>
                <ul
                    ref={dropDownRef}
                    className={`menu ${isOpen ? 'active' : 'inactive'}`}>
                    <li><Link className="dropdown-item" to="/profile">프로필 수정</Link></li>
                    <li><Link className="dropdown-item" to="/" onClick={userLogout} >로그아웃</Link></li>
                </ul>
            </div>
            <div className="profile">
                <img src={profile} style={{height: "140px"}}/>
                <h4>{user.username}</h4>
                <button type="button" id="btn-color" className="new-btn" onClick={() => setLogShow(true)}>새 회의록</button>
                <Modal show={logShow} onHide={() => setLogShow(false)}>
                    <NewLog_modal />
                </Modal>
            </div>
            <ul className="directory">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                         className="bi bi-folder2" viewBox="0 2 18 18">
                        <path
                            d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
                    </svg>
                    <Link to ="/home" className="directory-link">모든 회의록</Link>
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                         className="bi bi-folder2" viewBox="0 2 18 18">
                        <path
                            d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
                    </svg>
                    <Link to ="" className="directory-link">즐겨찾기</Link>
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                         className="bi bi-folder2" viewBox="0 2 18 18">
                        <path
                            d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
                    </svg>
                    <Link to ="" className="directory-link">최근 회의록</Link>
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                         className="bi bi-folder2-open" viewBox="0 2 18 18">
                        <path
                            d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
                    </svg>
                    <Link to ="" className="directory-link">내 회의록</Link>
                </li>
                <ul className="myDirectory">
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                             className="bi bi-folder2" viewBox="0 2 18 18">
                            <path
                                d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
                        </svg>
                        <Link to ="/loglist" className="directory-link">회사</Link>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                             className="bi bi-folder2" viewBox="0 2 18 18">
                            <path
                                d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
                        </svg>
                        <Link to ="" className="directory-link">학교</Link>
                    </li>
                    <li>
                        <button type="button" className="none-btn" onClick={() => setDirShow(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                 className="bi bi-folder-plus" viewBox="0 2 18 18">
                                <path
                                    d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z"/>
                                <path
                                    d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </button>
                        <Modal show={dirShow} onHide={() => setDirShow(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>폴더 추가</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6>폴더 이름</h6>
                                <input type="text" className="form-control" id="directory-name" />
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="button" id="btn-color" className="modal-btn" onClick={() => setDirShow(false)}>
                                    추가
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </li>
                </ul>
            </ul>
        </div>
    );
};

export default Sidebar;