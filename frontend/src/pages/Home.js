import React, {useState} from "react";
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const Home = (props) => {
   const {username} = useParams();

    return (
        <div>
            <Header username={username}/>
            <div className="main">
                <Sidebar username={username}/>
                <div className="article">
                    <div className="log-list">
                        <div className="fav">
                            <div className="directory-name">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-star-fill" viewBox="0 -3 16 19">
                                    <path
                                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                                <p>즐겨찾기</p>
                            </div>
                            <div className="log-card">
                                <div id="card-override" className="card" style={{width: "18rem"}}>
                                    <Link to="" className="card-link">
                                        <div className="card-body">
                                            <h5 className="card-title">회의주제</h5>
                                            <p className="card-text">Some quick example text</p>
                                            <h5 className="card-title">회의시간</h5>
                                            <p className="card-text">Some quick example text</p>
                                            <h5 className="card-title">참여자</h5>
                                            <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae dapibus purus. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="recent">
                            <div className="directory-name">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-star-fill" viewBox="0 -3 16 19">
                                    <path
                                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                                <p>최근 회의록</p>
                            </div>
                            <div className="log-card">
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

                        <div className="my">
                            <div className="directory-name">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-star-fill" viewBox="0 -3 16 19">
                                    <path
                                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                                <p>내 회의록</p>
                            </div>
                            <div>
                                <button type="button" id="btn-color" className="my-list">회사</button>
                                <button type="button" id="btn-color" className="my-list">학교</button>
                            </div>
                        </div>

                    </div>
                    <Footer username={username}/>
                </div>
            </div>
        </div>
    );
};

export default Home;