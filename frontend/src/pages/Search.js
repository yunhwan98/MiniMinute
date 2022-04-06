import React from "react";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

function Search() {
    return (
        <div style={{height: "100%"}}>
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
                            <p>검색</p>
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

export default Search;