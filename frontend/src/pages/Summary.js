import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header_log from "../components/Header_log";
import SidebarLog from "../components/Sidebar_log";
import url from '../api/axios';
import emo_img from '../images/emotionpage.png';

export default function Summary(){
     let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;
    const mn_id = params.mn_id;
    const [result, setResult] = useState([]);

    useEffect(() => {
        url.get(
            `/minutes/result/${mn_id}`
        )
            .then((response) => {
                console.log("keyword+summry 조회 성공");
                console.log(response.data.result);
                setResult(response.data.result);
            })
            .catch((error) => {
                console.log("keyword+summary 실패 "+error);
            })
    }, [])

    return(
        <div>
            <Header_log />
            <div className="main">
                <SidebarLog dr_id={dr_id} mn_id={mn_id}/>
                <div className="article">
                    <div className="fade-in">
                        <div className="key-summary">
                            <div className="key-title">
                                <img src={emo_img} style={{width: '3.0rem'}}/>
                                <h5>키워드 분석</h5>
                            </div>
                            <div className="key-content">
                                <ul>
                                    {result.keyword && <li>#{result.keyword.keyword1}</li>}
                                    {result.keyword && <li>#{result.keyword.keyword2}</li>}
                                    {result.keyword && <li>#{result.keyword.keyword3}</li>}
                                </ul>
                            </div>
                            <div className="sum-title">
                                <img src={emo_img} style={{width: '3.0rem'}}/>
                                <h5>요약</h5>
                            </div>
                            <div className="sum-content">
                                {result.summary}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}