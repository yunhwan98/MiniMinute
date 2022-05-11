import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import url from "../api/axios";
import Log_card from "../components/Log_card";

export default function Favorite() {
    let searchResult=[];
    const [search, setSearch] = useState("");
    const [minutes,setMinutes] = useState([]);

    const result = minutes.filter(minutes => `${minutes}`); //즐겨찾기된 회의록만(추후 수정)

    console.log(result);

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

    return (
        <div>
            <Header setSearch={setSearch}/>
            <div className="main">
                <Sidebar/>
                <div className="article">
                    <div className="log-list fade-in">
                        <div className="directory-name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-star-fill" viewBox="0 -3 16 19">
                                <path
                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                            <p>즐겨찾기</p>
                        </div>
                        <div className="log-card">
                            {searchResult.map(minute =>
                                <Log_card key={minute.mn_id} dr_id={minute.dr_id} mn_id={minute.mn_id} mn_title={minute.mn_title} mn_date={minute.mn_date} mn_explanation={minute.mn_explanation}/>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}