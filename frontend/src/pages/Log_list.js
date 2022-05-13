import React, {useState, useEffect} from "react";
import {Link, useParams} from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import NewLog_modal from "../components/NewLog_modal";
import Log_card from "../components/Log_card";
import {Modal} from "react-bootstrap";
import url from '../api/axios';

function Log_list(props) {
    let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;

    const [logShow, setLogShow] = useState(false);
    const [minutes,setMinutes] = useState([]);
    const [search, setSearch] = useState("");
    let searchResult=[];
    const [dr_name, setDr_Name] =useState("");

    const result = minutes.filter(minute => dr_id === `${minute.dr_id}`); //디렉토리 번호와 일치하는 회의록만 filter

    searchResult = result.filter(minute =>( //search 검색어가 포함되는 회의록만 filter(공백시에는 전부 보임)
            `${minute.mn_title}`.toLowerCase().includes(search) || `${minute.mn_date}`.toLowerCase().includes(search)
            || `${minute.mn_explanation}`.toLowerCase().includes(search)
    ))

   
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

    useEffect(() => { //디렉토리 이름 가져오기
        url.get(
            `/directorys/${dr_id}`
            )
            .then((response) => {
            console.log(response.data);
            setDr_Name(response.data.dr_name);
            console.log('디렉토리 정보 조회');
            })
            .catch((error) => {
            console.log('디렉토리 정보 조회 실패 ' + error);
            });
      }, [result]);

    return (
        <div>
            <Header setSearch={setSearch}/>
            <div className="main">
                <Sidebar dr_id={dr_id}/>
                <div className="article">
                    <div className="log-list fade-in">
                        <div className="directory-name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-star-fill" viewBox="0 -3 16 19">
                                <path
                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                            <p>{dr_name}</p>
                        </div>

                        <div className="log-card">
                            {/*회의록 추가 카드*/}
                            <div id="card-override" className="card" style={{width: "18rem"}}>
                                <button type="button" className="new-log-btn" onClick={() => setLogShow(true)}>
                                    <div className="card-body" style={{width: "100%"}}>
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
                                    <NewLog_modal dr_id={dr_id} setLogShow={setLogShow}/>
                                </Modal>
                            </div>
                            {searchResult.map(minute => //일단 회의참가자 말고 메모 보이게 만듦
                                <Log_card key={minute.mn_id} dr_id={dr_id} mn_id={minute.mn_id} mn_title={minute.mn_title} mn_date={minute.mn_date} mn_explanation={minute.mn_explanation}/>
                            )}
                            </div>
                        </div>  
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Log_list;