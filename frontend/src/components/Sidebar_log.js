import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {Modal} from "react-bootstrap";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import setting from "../images/setting.png";
import url from '../api/axios';

function Sidebar_log(props) {
    const navigate = useNavigate();
    const drId = props.dr_id;
    const mnId = props.mn_id;
    let toList = `${drId}/loglist`;

    const dropDownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const [share, setShare] = useState(false);
    const [move, setMove] = useState(false);
    const [checked, setChecked] = useState(""); //체크된 디렉토리 id

    const [mn_info, setMn_info] = useState([]);
    const [dr_info, setDr_info] = useState([]);

    



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

    //디렉토리 목록 조회(디렉토리 이동 모달)
    useEffect(() => {
        url.get(
            "/directorys/lists")
            .then((response) => {
                console.log(response.data);
                setDr_info(response.data);
            })
            .catch((error) => {
                console.log("디렉토리 목록 불러오기 실패 "+error)
            })
    },[move])

    

    const handleChecked = (e) => {
        console.log(e.target.value);
        setChecked(e.target.value);
    }

    //회의록 이동
    const moveDr = () => {

        url.put(
            `/minutes/${mnId}`,
            {"dr_id": checked})
            .then((response) =>{
                console.log(response);
                alert("회의록이 이동되었습니다!");
                navigate(`/${checked}/${mnId}/log`);
                setMove(false);
            })
    }

    //회의록 삭제
    const delMinute = (e) => {
        e.preventDefault();

        url.delete(
            `/minutes/${mnId}`)
            .then((response) => {
                console.log("회의록 삭제 성공");
                alert("회의록이 삭제되었습니다!");
                navigate("/home");
            })
            .catch((error) => {
                console.log("회의록 삭제 실패 "+ error);
            })
    }

    const onEditLogHandler =(event) => { //회의록수정
        event.preventDefault();
        url.put(
            `/minutes/${mnId}`,{
                "mn_memo" : props.memo        //우선 메모만 추가
            }
        )
            .then((response) => {
                console.log(response);
                alert('저장!');
            })
            .catch((error) => {
                console.log(error.response);
                alert('실패!'); 
            });

    }


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
                    <li><button className="dropdown-item none-btn" onClick={delMinute}>회의록 삭제</button></li>
                    <li><Link className="dropdown-item" to="" onClick={onEditLogHandler}>회의록 수정</Link></li>
                </ul>
            </div>

            <div className="sidebar-list">
                <ul>
                    <li><Link to={`/${drId}/${mnId}/log`}>회의록 열람</Link></li>
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

                <button type="button" className="none-btn" style={{marginBottom:"8px", color:"#B96BC6"}}
                onClick={() => setMove(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                         className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd"
                              d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                </button>
                <Modal show={move} onHide={() => setMove(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>회의록 이동하기</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>디렉토리 목록</h5>
                        <div className="radio-dr">
                            {dr_info.map(dr_info =>
                                <label className="radio-label" key={dr_info.dr_id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor"
                                         className="bi bi-folder2-open" viewBox="0 -2 16 17">
                                        <path
                                            d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
                                    </svg>
                                    <input type="radio"
                                           value={dr_info.dr_id}
                                           checked={checked === `${dr_info.dr_id}`}
                                           onChange={handleChecked}
                                    />
                                    {dr_info.dr_name}</label>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" id="btn-color" className="modal-btn"
                                onClick={moveDr}>
                            이동
                        </button>
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