import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import NewLog_modal from "../components/NewLog_modal";
import {Modal} from "react-bootstrap";
import axios from 'axios';
import url from '../api/axios';

function Log_list() {
    const [logShow, setLogShow] = useState(false);

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(     
            "/minutes/lists/"
            )
            .then((response) => {
            console.log(response.data);
            alert('회의록을 불러왔습니다.')
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });       
      }, []);


    return (
        <div>
            <Header />
            <div className="main">
                <Sidebar/>
                <div className="article">
                    <div className="log-list">
                        <div className="directory-name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-star-fill" viewBox="0 -3 16 19">
                                <path
                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                            <p>회사</p>
                        </div>

                        <div className="log-card">
                            <div id="card-override" className="card" style={{width: "18rem"}}>
                                <button type="button" className="new-log-btn" onClick={() => setLogShow(true)}>
                                    <div className="card-body">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"
                                             fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                            <path
                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path
                                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                        </svg>
                                    </div>
                                </button>
                                <Modal show={logShow} onHide={() => setLogShow(false)}>
                                    <NewLog_modal setLogShow={setLogShow}/>
                                </Modal>
                            </div>
                            <div id="card-override" className="card" style={{width: "18rem"}}>
                                <Link to="" className="card-link">
                                    <div className="card-body">
                                        <h5 className="card-title">회의주제</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">회의시간</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">참여자</h5>
                                        <p className="card-text">Some, quick, example, text</p>
                                    </div>
                                </Link>
                            </div>
                            <div id="card-override" className="card" style={{width: "18rem"}}>
                                <Link to="" className="card-link">
                                    <div className="card-body">
                                        <h5 className="card-title">회의주제</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">회의시간</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">참여자</h5>
                                        <p className="card-text">Some, quick, example, text</p>
                                    </div>
                                </Link>
                            </div>
                            <div id="card-override" className="card" style={{width: "18rem"}}>
                                <Link to="" className="card-link">
                                    <div className="card-body">
                                        <h5 className="card-title">회의주제</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">회의시간</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">참여자</h5>
                                        <p className="card-text">Some, quick, example, text</p>
                                    </div>
                                </Link>
                            </div>
                            <div id="card-override" className="card" style={{width: "18rem"}}>
                                <Link to="" className="card-link">
                                    <div className="card-body">
                                        <h5 className="card-title">회의주제</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">회의시간</h5>
                                        <p className="card-text">Some quick example text</p>
                                        <h5 className="card-title">참여자</h5>
                                        <p className="card-text">Some, quick, example, text</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Log_list;