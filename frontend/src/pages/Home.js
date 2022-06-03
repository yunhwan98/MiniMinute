import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Log_card from "../components/Log_card";
import NotFound from "./NotFound";
import button from "bootstrap/js/src/button";
import url from '../api/axios';
import ApexChart from 'react-apexcharts'

const Home = () => {
    const [home, setHome] = useState(''); // 홈 디렉토리 번호 설정
    const navigate = useNavigate();
    const [isAuthenticated, setisAuthenticated] = useState(localStorage.getItem('token') ? true : false);   //인증여부 확인
    // const [user, setUser] = useState(localStorage.getItem('token') ? JSON.parse(localStorage.getItem('user')) : []); //유저 정보
    const [minutes, setMinutes] = useState([]);
    const [dr_info, setDr_info] = useState([]);
    const [search, setSearch] = useState("");
    const [minGraph, setMinGraph] = useState([]);
    const [recent, setRecent] = useState([]);
    const [comment,setComment] =useState("");//최근회의록 피드백

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(
            "/minutes/lists"
        )
            .then((response) => {
                setMinutes(response.data);
                setMinGraph(response.data);
                console.log('회의록을 불러왔습니다.');
            })
            .catch((error) => { //오류메시지 보이게 함
                console.log(error.response);
            });
    }, []);

    let byId = minGraph.sort((a, b) => { //회의 id 역순
        return new Date(b.mn_id) - new Date(a.mn_id);
    })

    byId = byId.filter(result => (result.speaker_seq != null)); //감정분석 결과 있는 회의록만

    useEffect(()=> {
        url.get(
            "/minutes/result/recent"
        )
            .then((response) => {
                setRecent(response.data.result);
                console.log(response.data.result.comment.text);
                setComment(response.data.result.comment.text);
                console.log(recent);
            })
            .catch((error) => {
                console.log("최근 5개 조회 실패: "+error);
            });
    },[]);

    const series = [{
        name: "공격&혐오 발언",
        data: [parseFloat(`${recent[4]?.hate_speech_rate}`).toFixed(1), parseFloat(`${recent[3]?.hate_speech_rate}`).toFixed(1), parseFloat(`${recent[2]?.hate_speech_rate}`).toFixed(1), parseFloat(`${recent[1]?.hate_speech_rate}`).toFixed(1), parseFloat(`${recent[0]?.hate_speech_rate}`).toFixed(1)]
    },
    {
        name: "발화 속도",
        data: [parseFloat(`${recent[4]?.speech_rate}`).toFixed(1), parseFloat(`${recent[3]?.speech_rate}`).toFixed(1), parseFloat(`${recent[2]?.speech_rate}`).toFixed(1), parseFloat(`${recent[1]?.speech_rate}`).toFixed(1), parseFloat(`${recent[0]?.speech_rate}`).toFixed(1)]
    }];

    const options = {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight',
                width: 8
            },
            title: {
                text: '',
                align: 'left'
            },
            grid: {

                row: {
                    colors: ['#B96BC6', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.1
                },

            },
            xaxis: {
                categories: [`${byId[4]?.mn_title}`, `${byId[3]?.mn_title}`, `${byId[2]?.mn_title}`, `${byId[1]?.mn_title}`, `${byId[0]?.mn_title}`],
            },
            yaxis: [
            {
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true,
                    color: "#0080D2"
                },
                labels: {
                    style: {
                        colors: "#0080D2"
                    }
                },
                title: {
                    text: "공격&혐오 발언",
                    style: {
                        color: "#0080D2"
                    }
                }
            },
            {
                opposite: true,
                axisTicks: {
                    show: true
                },
                axisBorder: {
                    show: true,
                    color: "#FFCF62"
                },
                labels: {
                    style: {
                        colors: "#FFCF62"
                    }
                },
                title: {
                    text: "발화 속도",
                    style: {
                        color: "#FFCF62"
                    }
                }
            }
        ],
            markers: {
                size: 7
            },
            colors: ['#0080D2', '#FFCF62']
        }

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(
            "/directorys/lists"
        )
            .then((response) => {
                setDr_info(response.data);
                setHome(response.data[0].dr_id);
                console.log('디렉토리 목록 조회');
            })
            .catch((error) => {
                console.log('디렉토리 목록 조회 실패 ' + error);
            });
    }, []);

    const defaultMin = minutes.filter(minutes => minutes.dr_id === parseInt(home)); //home 디렉토리
    const defaultDir = dr_info.filter(dr_info => dr_info.dr_id > home); //home 디렉토리 제외
    const favMin = minutes.filter(minutes => minutes.is_like === true); //즐겨찾기

    const minResult = defaultMin.filter(minute => ( //search 검색어가 포함되는 회의록만 filter(search가 공백시에는 전부 보임)
        `${minute.mn_title}`.toLowerCase().includes(search) || `${minute.mn_date}`.toLowerCase().includes(search)
        || `${minute.mn_explanation}`.toLowerCase().includes(search)
    ))

    const favResult = favMin.filter(minute => ( //search 검색어가 포함되는 회의록만 filter(search가 공백시에는 전부 보임)
        `${minute.mn_title}`.toLowerCase().includes(search) || `${minute.mn_date}`.toLowerCase().includes(search)
        || `${minute.mn_explanation}`.toLowerCase().includes(search)
    ))



    if (isAuthenticated) { //권한이 있을 때만 표시
        return (
            <div>
                <Header setSearch={setSearch} />
                <div className="main">
                    <Sidebar />
                    <div className="article">
                        <div className="home-chart">
                            <div style={{ display: "flex", alignItems: 'center' }}>

                                {/* <img src={emo_img} style={{width: '3.0rem'}}/> */}
                                <span style={{ fontSize: '1.5em', margin: '1rem', fontWeight: 'bold' }}>📊 회의태도 변화</span>
                            </div>
                            <div className='Speech-result' style={{ display: "flex", borderRadius: '10px', margin: '1em', boxShadow: '1px 1px 5px grey' }}>
                                <div>
                                    <ApexChart options={options} series={series} type="line" height={400} width={600} />
                                </div>
                                <div className='speech-analyse' /*style={{backgroundColor: 'rgba( 185, 107, 198, 0.1 )'}}*/ >
                                    <li style={{fontSize: '1.5em' ,lineHeight: '200%'}}><b>{comment}</b></li>
                                </div>
                            </div>
                        </div>

                        <div className="log-list fade-in">

                            <div className="default">
                                <div className="directory-name">
                                    <p>회의록</p>
                                </div>
                                <div className="log-card">
                                    {minResult.map(min =>
                                        <Log_card key={min.mn_title} dr_id={min.dr_id} mn_id={min.mn_id} mn_title={min.mn_title} mn_date={min.mn_date} mn_explanation={min.mn_explanation} like={min.is_like} />
                                    )}
                                </div>
                            </div>

                            <div className="fav">
                                <div className="directory-name">
                                    <p>즐겨찾기</p>
                                </div>
                                <div className="log-card">
                                    {favResult.map(result =>
                                        <Log_card key={result.mn_title} dr_id={result.dr_id} mn_id={result.mn_id} mn_title={result.mn_title} mn_date={result.mn_date} mn_explanation={result.mn_explanation} like={result.is_like} />
                                    )}
                                </div>
                            </div>

                            <div className="my">
                                <div className="directory-name">
                                    <p>내 회의록</p>
                                </div>
                                <div>
                                    {defaultDir.map(dr_result =>
                                        <button key={dr_result.dr_id} id="btn-color" type="button" className="my-list" onClick={() => {
                                            navigate(`/${dr_result.dr_id}/loglist`)
                                        }}>
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
    else {   //권한이 없을때
        return (
            <div>
                <NotFound />
            </div>
        );
    }

};

export default Home;