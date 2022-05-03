import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Header_log from "../components/Header_log";
import SidebarLog from "../components/Sidebar_log";
import {PieChart} from "react-minimal-pie-chart";
import url from "../api/axios";

function Emotion (){
    let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;
    const mn_id = params.mn_id;
    const [minutes,setMinutes] = useState([]);
    const data = [  //임시 데이터
        {title: "무감정", value: 56, color: "#E0BFE6"},
        {title: "행복", value: 27, color: "#B5E61D"},
        {title: "분노", value: 12, color: "#FFAEC9"},
        {title: "슬픔", value: 5, color: "#FFF200"},
    ]

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(
            `/minutes/${mn_id}`
            )
            .then((response) => {
            console.log("회의록 정보 불러오기");
            console.log(response.data);
            setMinutes(response.data);
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });
      }, []);

    return(
        <div>
            <Header_log/>
            <div className="main">
                <SidebarLog dr_id={dr_id} mn_id={mn_id} memo={minutes.mn_memo}/>
                <div className="article">
                    <div className="fade-in">
                        <div className="emotion">
                            <h5>회의내 감정 현황</h5>
                            <div className="chart">
                                <PieChart
                                    data={data}
                                    style={{width: "500px", margin: "0 100px 20px 10px"}}
                                    segmentsShift={0.5}
                                    viewBoxSize={[105, 105]}
                                    label={({dataEntry}) => dataEntry.value+"%"}
                                    labelStyle={{fontSize: "5px", fontWeight: "bold", opacity: "0.8"}}
                                    animate
                                />
                                <div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#E0BFE6"
                                             className="bi bi-square-fill" viewBox="0 0 16 16">
                                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>
                                        </svg>
                                        <text>무감정</text>
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B5E61D"
                                             className="bi bi-square-fill" viewBox="0 0 16 16">
                                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>
                                        </svg>
                                        <text>행복</text>
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFAEC9"
                                             className="bi bi-square-fill" viewBox="0 0 16 16">
                                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>
                                        </svg>
                                        <text>분노</text>
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFF200"
                                             className="bi bi-square-fill" viewBox="0 0 16 16">
                                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>
                                        </svg>
                                        <text>슬픔</text>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5>MINI MINUTE 감정분석</h5>
                                <div className="analyse">
                                    <div className="emotion-label">
                                        😶
                                        <h6>무감정</h6>
                                    </div>
                                    <p>일반적인 발언이 다수 발견되었습니다. (offensive: 5% hate: 5% default: 90%)
                                        <br/>OO님의 “일반” 구간 분당 음절 수는 약 “265음절/분” 입니다.
                                        <br/>말의 빠르기가 보통입니다. “잘하고 있어요!”
                                    </p>
                                </div>
                                <div className="analyse">
                                    <div className="emotion-label">
                                        😄
                                        <h6>행복</h6>
                                    </div>
                                    <p>일반적인 발언이 다수 발견되었습니다. (offensive: 5% hate: 5% default: 90%)
                                        <br/>OO님의 “일반” 구간 분당 음절 수는 약 “265음절/분” 입니다.
                                        <br/>말의 빠르기가 보통입니다. “잘하고 있어요!”
                                    </p>
                                </div>
                                <div className="analyse">
                                    <div className="emotion-label">
                                        😡
                                        <h6>분노</h6>
                                    </div>
                                    <p>일반적인 발언이 다수 발견되었습니다. (offensive: 5% hate: 5% default: 90%)
                                        <br/>OO님의 “일반” 구간 분당 음절 수는 약 “265음절/분” 입니다.
                                        <br/>말의 빠르기가 보통입니다. “잘하고 있어요!”
                                    </p>
                                </div>
                                <div className="analyse">
                                    <div className="emotion-label">
                                        😢
                                        <h6>슬픔</h6>
                                    </div>
                                    <p>일반적인 발언이 다수 발견되었습니다. (offensive: 5% hate: 5% default: 90%)
                                        <br/>OO님의 “일반” 구간 분당 음절 수는 약 “265음절/분” 입니다.
                                        <br/>말의 빠르기가 보통입니다. “잘하고 있어요!”
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Emotion;