import React, {useEffect, useRef, useState} from "react";
import { Link } from 'react-router-dom';
import {Modal} from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import setting from "../images/setting.png";
import url from '../api/axios';

function Sidebar_log(props) {
    const drId = props.dr_id;
    const drName = props.dr_name;
    const mnId = props.mn_id;
    let toList = `${drId}/${drName}/loglist`;
    if (drName === 'home') toList = "home";    //home에서 회의록 만들면 '목록으로' 클릭 시 home으로

    const dropDownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const [share, setShare] = useState(false);

    const [mn_info, setMn_info] = useState([]);

      //유저정보
    const [user, setUser] = useState(localStorage.getItem('token') ? JSON.parse( localStorage.getItem('user') ) : []);
    //유저 로그아웃
    const userLogout =(e)=> {
        localStorage.clear(); 
    }

    //개별 회의록 조회
    useEffect(() => {
        url.get(
            `minutes/${mnId}`)
            .then((response)=>{
                console.log(response.data);
                setMn_info(response.data);
            })
            .catch((error) => {
                console.log("회의록 정보 불러오기 실패 "+error);
            })
    }, [])

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
                    <li><Link className="dropdown-item" to="/" onClick={userLogout}>로그아웃</Link></li>
                    <li><Link className="dropdown-item" to="">회의록 삭제</Link></li>
                    <li><Link className="dropdown-item" to="">회의록 수정</Link></li>
                </ul>
            </div>

            <div className="sidebar-list">
                <ul>
                    <li><Link to="/newlog">회의록 열람</Link></li>
                    <li><Link to="">감정분석</Link></li>
                    <li><Link to={`/${toList}`}>목록으로</Link></li>
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
                        <li className="info-topic">{mn_info.mn_title}</li>
                        <li className="info-date">{mn_info.mn_date}</li>
                        <li className="info-participant">참석자</li>
                        <li className="info-memo">{mn_info.mn_explanation}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar_log;