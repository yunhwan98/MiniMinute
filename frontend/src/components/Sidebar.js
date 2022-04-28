import React, { useEffect, useState, useRef } from "react";
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Modal} from "react-bootstrap";
import profile from '../images/profile2.png';
import setting from '../images/setting.png';
import NewLog_modal from "./NewLog_modal";
import url from '../api/axios';
import axios from "axios";

function Sidebar(props) {
    let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;
    const navigate = useNavigate();
    const dropDownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const [dirShow, setDirShow] = useState(false);
    const [logShow, setLogShow] = useState(false);

    const [dr_info, setDrInfo] = useState([]);
    const [drName, setDrName] = useState("");
    const [newDrName, setNewDrName] = useState("");
    const [editDr, setEditDr] = useState(false);
    const [delDr, setDelDr] = useState(false);
    const [preview,setPreview] = useState(localStorage.getItem('profile_img')? localStorage.getItem('profile_img') : profile);//미리보기 파일 
    //유저정보
    const [user, setUser] = useState(localStorage.getItem('token') ? JSON.parse( localStorage.getItem('user') ) : []);
    const [img, setImg] = useState('');
    
    
    //유저 로그아웃
    const userLogout =(e)=> {
        setUser([]);
        localStorage.clear();
    }

    const onDirNameHandler = (e) => {   //디렉토리 추가
        setDrName(e.currentTarget.value);
    }
    const onNewDirNameHandler = (e) => {    //디렉토리 수정
        setNewDrName(e.currentTarget.value);
    }

    
    useEffect(() => { // 파일정보를 blob으로 받아옴
        axios({
            method:'GET',
            url: `http://127.0.0.1:8000${user.user_profile}`,
            responseType:'blob',
            headers: {
                'Authorization': `jwt ${localStorage.getItem('token')}`
            },
        })
        .then((res) => {
            setImg( window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] } )));
            localStorage.setItem('img', window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] } )));
            console.log('성공!!!!')
        })
        .catch(e => {
            console.log(`error === ${e}`)
        })     
      },[user]);


    //디렉토리 목록 조회(처음, 디렉토리 변경될 때마다)
    useEffect(() => {
        url.get(
            "/directorys/lists")
            .then((response) => {
                console.log(response.data);
                setDrInfo(response.data);
            })
            .catch((error) => {
                console.log("디렉토리 목록 불러오기 실패 " + error);
            })
    }, [dirShow, editDr, delDr]);

    //디렉토리 추가
    const addDirectory = (e) => {
        e.preventDefault();
        console.log(localStorage);
        url.post(
            "/directorys/lists",
            {"dr_name": drName},)
            .then((response) => {
                console.log("디렉토리 추가 성공");
                setDrName("");
                setDirShow(false);
            })
            .catch((error) => {
                console.log("디렉토리 추가 실패 "+error);
                alert("이름을 입력해주세요!");
            });
    };

    //수정
    const editDirectory = (e, id) => {
        e.preventDefault();

        url.put(
            "/directorys/"+id,
            {"dr_name": newDrName},)
            .then((response) => {
                console.log(response);
                alert("디렉토리 이름이 변경되었습니다!");
                setNewDrName("");
                setEditDr(false);
            })
            .catch((error) => {
                console.log("디렉토리 이름 변경 실패 "+error);
            });
    }

    //삭제
    const delDirectory = (e, id) => {
        e.preventDefault();

        url.delete(
            "/directorys/"+id)
            .then((response) => {
                console.log("디렉토리 삭제 성공");
                alert("디렉토리가 삭제되었습니다!");
                setDelDr(true);
                navigate("/home");
            })
            .catch((error) => {
                console.log("디렉토리 삭제 실패 "+error);
            });
    }

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
                <div className="profile-box" style={{height: "140px" ,width:"140px"}}>
                    <img className="profile-image" src={img} />
                </div>

                {/* <img src={preview} style={{height: "140px"}}/> */}
                <h4>{user.username}</h4>
                <button type="button" id="btn-color" className="new-btn" onClick={() => setLogShow(true)}>새 회의록</button>
                <Modal show={logShow} onHide={() => setLogShow(false)}>
                    <NewLog_modal dr_id={dr_id} setLogShow={setLogShow}/*NewLog_modal에 setLogShow 전달하고 props로 바뀐 값 받아야 '생성'시 모달 사라짐  *//>
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
                    <Link to ="/recent" className="directory-link">최근 회의록</Link>
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
                    {dr_info.map(dr_info =>
                        <li className="myDir-li" key={dr_info.dr_id}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                                 className="bi bi-folder2" viewBox="0 2 18 18">
                                <path
                                    d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
                            </svg>
                            <Link to = {`/${dr_info.dr_id}/loglist`} className="directory-link">{dr_info.dr_name}</Link>

                            <ul className="dr-menu">
                                <li className="dr-li"><button type="button" className="none-btn dr-item" onClick={() => setEditDr(true)}>수정</button></li>
                                <Modal show={editDr} onHide={() => setEditDr(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>폴더 수정</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <h6>폴더 이름</h6>
                                        <input type="text" className="form-control" id="directory-name" value={newDrName} onChange={onNewDirNameHandler} />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button type="submit" id="btn-color" className="modal-btn"
                                        onClick={(e) => {editDirectory(e, dr_info.dr_id);}}
                                        >수정
                                        </button>
                                    </Modal.Footer>
                                </Modal>

                                <li className="dr-li"><button type="button" className="none-btn dr-item"
                                onClick={(e) => {delDirectory(e, dr_info.dr_id);}}
                                >삭제</button></li>
                            </ul>
                        </li>
                    )}

                    {/* add directory btn*/}
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
                                <input type="text" className="form-control" id="directory-name" value={drName} onChange={onDirNameHandler} />
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="submit" id="btn-color" className="modal-btn" onClick={addDirectory}>
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