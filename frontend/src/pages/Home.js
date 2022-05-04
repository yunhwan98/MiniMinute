import React, {useState, useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Log_card from "../components/Log_card";
import NotFound from "./NotFound";
import {alignPropType} from "react-bootstrap/types";
import button from "bootstrap/js/src/button";
import url from '../api/axios';

const Home = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setisAuthenticated] = useState(localStorage.getItem('token') ? true : false);   //인증여부 확인
    const [user, setUser] = useState(localStorage.getItem('token') ? JSON.parse( localStorage.getItem('user') ) : []); //유저 정보
    const [minutes,setMinutes] = useState([]);
    const [dr_info, setDr_info] = useState([]);
    const [search, setSearch] = useState("");
    let searchResult=[];

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(     
            "/minutes/lists"
            )
            .then((response) => {
            console.log(response.data);
            setMinutes(response.data);
            console.log('회의록을 불러왔습니다.');
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });       
      }, []);

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(
            "/directorys/lists"
            )
            .then((response) => {
            console.log(response.data);
            setDr_info(response.data);
            console.log('디렉토리 목록 조회');
            })
            .catch((error) => {
            console.log('디렉토리 목록 조회 실패 '+error);
            });
      }, []);

    const defaultMin = minutes.filter(minutes => `${minutes.dr_id}` === "1"); //디렉토리 번호 1(기본 디렉토리)
    const defaultDir = dr_info.filter(dr_info => `${dr_info.dr_id}` > 1); //디렉토리 번호 1 이상(기본 디렉토리 제외)
    
    searchResult = minutes.filter(minute => ( //search 검색어가 포함되는 회의록만 filter(search가 공백시에는 전부 보임)
        `${minute.mn_title}`.toLowerCase().includes(search) || `${minute.mn_date}`.toLowerCase().includes(search)
        || `${minute.mn_explanation}`.toLowerCase().includes(search)
    ))  

    if(isAuthenticated){ //권한이 있을 때만 표시
    return (
        <div>
            <Header setSearch={setSearch}/>
            <div className="main">
                <Sidebar dr_id={1}/>
                <div className="article">
                    <div className="log-list fade-in">
                        <div className="default">
                            <div className="directory-name">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-star-fill" viewBox="0 -3 16 19">
                                    <path
                                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                                <p>회의록</p>
                            </div>
                            <div className="log-card">
                                {defaultMin.map(result =>
                                    <Log_card key={result.mn_title} dr_id={result.dr_id} mn_id={result.mn_id} mn_title={result.mn_title} mn_date={result.mn_date} mn_explanation={result.mn_explanation}/>
                                )}
                            </div>
                        </div>

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
                                {searchResult.map(minute =>
                                    <Log_card key={minute.mn_id} dr_id={minute.dr_id} mn_id={minute.mn_id} mn_title={minute.mn_title} mn_date={minute.mn_date} mn_explanation={minute.mn_explanation}/>
                                )}
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
                                {defaultDir.map(dr_result =>
                                    <button key={dr_result.dr_id} type="button" id="btn-color" className="my-list" onClick={() => {
                                        navigate(`/${dr_result.dr_id}/loglist`)}}>
                                        {dr_result.dr_name}</button>
                                )}
                            </div>
                        </div>

                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
    }
    else{   //권한이 없을때
        return(
            <div>
                <NotFound />
            </div>
        );
    }
    
};

export default Home;