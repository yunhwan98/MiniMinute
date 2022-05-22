import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import url from "../api/axios";
import Log_card from "../components/Log_card";

function Recent () {
    let searchResult=[];
    const [search, setSearch] = useState("");
    const [minutes,setMinutes] = useState([]);

    const result = minutes.sort((a, b) => { //최근 만들어진 순
        return new Date(b.mn_make_date) - new Date(a.mn_make_date);
    })

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

    return(
        <div>
            <Header setSearch={setSearch}/>
            <div className="main">
                <Sidebar/>
                <div className="article">
                    <div className="log-list fade-in">
                        <div className="directory-name">
                            <p>최근 회의록</p>
                        </div>
                        <div className="log-card">
                            {searchResult.map(minute =>
                                <Log_card key={minute.mn_id} dr_id={minute.dr_id} mn_id={minute.mn_id} mn_title={minute.mn_title} mn_date={minute.mn_date} mn_explanation={minute.mn_explanation} like={minute.is_like}/>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Recent;