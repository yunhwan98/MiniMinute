import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header_log from "../components/Header_log";
import SidebarLog from "../components/Sidebar_log";
import {PieChart} from "react-minimal-pie-chart";
import ApexChart from 'react-apexcharts'
import url from "../api/axios";
import emo_img from '../images/emotionpage.png';

function Emotion (){
    const [user, setUser] = useState(localStorage.getItem('token') ? JSON.parse( localStorage.getItem('user') ) : []);
    let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;
    const mn_id = params.mn_id;
    const [minutes,setMinutes] = useState([]);
    const [result,setResult] = useState([]); //분석 결과
    const [totaldata,setTotaldata]= useState([]);   //전체 감정비율 그래프
    const [userdata,setUserdata]= useState([]);     //유저 감정비율 그래프
    const [hatespeech,setHatespeech] =useState([]); //공격 발언비율 
    const [speed,setSpeed] = useState("");        //발화 속도
    const [loading,setLoading]= useState(false);
    const navigate = useNavigate();

    let data_total = [];    //전체 감정비율 데이터
    let data_user = [];     // 회원 감정비율 데이터
    let data_hate= [];      // 공격 발언 비율 데이터

    //발언 유형 그래프
    let series = [];
    const options = {
        chart: {
          height: 350,
          width:300,
          type: 'bar',
          events: {
            click: function(chart, w, e) {
              // console.log(chart, w, e)
            }
          }
        }, 
        plotOptions: {
          bar: {
            columnWidth: '50%',
            distributed: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        xaxis: {
          categories: [
            ['차별 발언'],
            ['공격 발언'],
            ['일반 발언'],
          ],
          labels: {
            style: {          
              fontSize: '12px'
            }
          }
        },
        colors: ['#88ADE1', '#FF4D4D', '#00AD6B']
      };

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(
            `/minutes/${mn_id}`
            )
            .then((response) => {
            console.log("회의록 정보 불러오기");
            console.log(response.data);
            setMinutes(response.data);
                if(!response.data.speaker_seq){ //speaker_seq 지정이 안되있을 때 이전페이지 이동
                    alert(`'나'를 지정해주세요`);
                    navigate(-1);
                }
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });
      }, []);

      useEffect(() => { // 감정인식 피드백 받아오기
        url.get(
            `/minutes/result/${mn_id}`
            )
            .then((response) => {
            console.log("감정인식 피드백");
            console.log(response.data.result);
            console.log(response.data.result.emotion);
            console.log(response.data.result.emotion[0].total);
            console.log(response.data.result.one_line_review);
            
            setResult(response.data.result);
            setTotaldata(response.data.result.emotion[0].total);
            setUserdata(response.data.result.emotion[1].user);
            setHatespeech(response.data.result.hate_speech_rate);
            setSpeed(response.data.result.speech.text);
            setLoading(true);
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            getSummary();
            });
      }, []);

      const getSummary = () => {
        url.post(`/summary/${mn_id}`)
            .then((response)=> {
                console.log("요약문 생성");
            })
            .catch((error)=>{
                console.log("요약문 생성 실패: "+error);
            })

        url.post(`/keyword/${mn_id}`)
            .then((response)=> {
                console.log("키워드 생성");
                window.location.reload();
            })
            .catch((error)=>{
                console.log("키워드 생성 실패: "+error);
            })
    }

    if(loading){
        data_total = [  //임시 데이터
            { title: "무감정", value: totaldata.neutral*100, color: "#E0BFE6" },
            { title: "행복", value: totaldata.happiness*100, color: "#FFF200" },
            { title: "분노", value: totaldata.angry*100, color: "#FFAEC9" },
            { title: "슬픔", value: totaldata.sadness*100, color: "#B5D2FF" }

        ]
        data_user = [  //임시 데이터
            { title: "무감정", value: userdata.neutral * 100, color: "#E0BFE6" },
            { title: "행복", value: userdata.happiness * 100, color: "#FFF200" },
            { title: "분노", value: userdata.angry * 100, color: "#FFAEC9" },
            { title: "슬픔", value: userdata.sadness * 100, color: "#B5D2FF" }
        ]
        data_hate= [hatespeech.hate_rate,hatespeech.offensive_rate,hatespeech.general_rate];
        //data_hate=[10,20,30];
        series = [{ data: data_hate}]

    }

    return(
        <div>
            <Header_log/>
            <div className="main">
                <SidebarLog dr_id={dr_id} mn_id={mn_id}/>
                <div className="article">
                    <div className="fade-in" >

                        <div style={{margin: '50px 0px'}}>
                            <div style={{display:"flex" ,padding: '0rem 4rem' , alignItems: 'center'}}>
                                    <img src={emo_img} style={{width: '3.0rem'}}/>
                                    <span style={{fontSize:'1.2rem' ,margin:'1rem',fontWeight:'bold'}}>MINI MINUTE 감정분석</span>
                            </div>
                            <div className='Speech-result' style={{fontSize:"1.4em", paddingLeft: "2.5em"}}>
                                    <b>{result.one_line_review}</b>
                            </div>
                        </div>


                        <div style={{margin: '50px 0'}}>
                            <div style={{display:"flex" ,padding: '0rem 4rem' , alignItems: 'center'}}>
                                <img src={emo_img} style={{width: '3.0rem'}}/>
                                <span style={{fontSize:'1.2rem' ,margin:'1rem',fontWeight:'bold'}}>감정분포</span>
                            </div>
                            <div className="emotion" style={{boxShadow: '1px 1px 5px grey',margin: '1em', padding: '4rem', display:"flex", borderRadius: '10px'}}>
                                <div style={{flex: 1}}>
                                    <h5>회의 전체 감정 현황</h5>
                                    <div className="chart">
                                        <PieChart
                                            data={data_total}
                                            style={{width: "300px", margin: "0 80px 20px 0"}}
                                            viewBoxSize={[100, 100]}
                                            label={({dataEntry}) => dataEntry.value === 0 ? "" : Math.round(dataEntry.value)+"%"}
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFF200"
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B5D2FF"
                                                    className="bi bi-square-fill" viewBox="0 0 16 16">
                                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>
                                                </svg>
                                                <text>슬픔</text>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div style={{width:'90%', whiteSpace: 'pre-wrap', marginTop: "25px"}}>
                                        {totaldata.text}
                                    </div>
                                </div>

                                <div style={{flex: 1}}>
                                    <h5>내 감정 현황</h5>
                                    <div className="chart">
                                        <PieChart
                                            data={data_user}
                                            style={{width: "300px", margin: "0 80px 20px 10px"}}
                                            viewBoxSize={[100, 100]}
                                            label={({dataEntry}) => dataEntry.value === 0 ? "" : Math.round(dataEntry.value)+"%"}
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFF200"
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B5D2FF"
                                                    className="bi bi-square-fill" viewBox="0 0 16 16">
                                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>
                                                </svg>
                                                <text>슬픔</text>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div style={{width:'90%',whiteSpace:'pre-wrap', marginTop: "25px"}}>
                                        {userdata.text}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{margin: '50px 0px'}}>
                            <div style={{display:"flex" ,padding: '0rem 4rem' , alignItems: 'center'}}>
                                    <img src={emo_img} style={{width: '3.0rem'}}/>
                                    <span style={{fontSize:'1.2rem' ,margin:'1rem',fontWeight:'bold'}}>발언유형감지</span>
                            </div>
                            <div className='Speech-result'>
                                <ApexChart options={options} series={series} type="bar" height={300} width={500} />                 
                                    <div className='speech-analyse'>
                                        <li><b>{hatespeech.text}</b></li>
                                    </div>            
                            </div>
                        </div>

                        <div style={{margin: '50px 0px'}}>
                            <div style={{display:"flex" ,padding: '0rem 4rem' , alignItems: 'center'}}>
                                    <img src={emo_img} style={{width: '3.0rem'}}/>
                                    <span style={{fontSize:'1.2rem' ,margin:'1rem',fontWeight:'bold'}}>말 빠르기</span>
                            </div>
                            <div className='Speech-result'>
                                           
                                    <div className='speech-analyse'>
                                        <li>
                                            <b>{speed}</b>
                                        </li>
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