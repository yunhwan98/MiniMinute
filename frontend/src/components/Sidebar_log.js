import React, {useRef, useState} from "react";
import { Link } from 'react-router-dom';
import {Modal} from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import setting from "../images/setting.png";

function Sidebar_log() {
    const dropDownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const [share, setShare] = useState(false);

    return(
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
                    <li><Link className="dropdown-item" to="/">로그아웃</Link></li>
                    <li><Link className="dropdown-item" to="">회의록 삭제</Link></li>
                    <li><Link className="dropdown-item" to="">회의록 수정</Link></li>
                </ul>
            </div>

            <div className="sidebar-list">
                <ul>
                    <li><Link to="/newlog">회의록 열람</Link></li>
                    <li><Link to="">감정분석</Link></li>
                    <li><Link to="/loglist">목록으로</Link></li>
                </ul>
            </div>

            <div className="log-info">
                <button type="button" className="none-btn" style={{marginBottom:"8px", color:"#B96BC6"}}
                        onClick={() => setShare(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                         className="bi bi-share-fill" viewBox="0 0 16 16" style={{borderRadius:"0"}}>
                        <path
                            d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                    </svg>
                </button>
                <Modal show={share} onHide={() => setShare(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>회의록 공유하기</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6>공유코드</h6>
                                <p className="code">random code</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <CopyToClipboard text={"random code"}>
                                    <button type="button" id="btn-color" className="modal-btn" onClick={null}>
                                        복사
                                    </button>
                                </CopyToClipboard>
                            </Modal.Footer>
                        </Modal>
                <div>
                    <ul>
                        <li className="info-topic">회의 주제</li>
                        <li className="info-date">2022/04/13</li>
                        <li className="info-participant">참석자</li>
                        <li className="info-memo">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nisi eu justo</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar_log;