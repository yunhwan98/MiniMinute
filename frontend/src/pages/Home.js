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
import ApexChart from 'react-apexcharts'

const Home = () => {

    const series = [{
        name: "공격&혐오 발언",
        data: [10, 41, 35, 51, 49]
      },
      {
        name: "발화 속도",
        data: [1, 4, 15, 41, 69]
      }];

    const options= {
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
          curve: 'straight'
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
          categories: ['05-13', '05-14', '05-15', '05-16', '05-17'],
        }
      }
    

    const [home,setHome]= useState(''); // 홈 디렉토리 번호 설정
    const navigate = useNavigate();
    const [isAuthenticated, setisAuthenticated] = useState(localStorage.getItem('token') ? true : false);   //인증여부 확인
    const [user, setUser] = useState(localStorage.getItem('token') ? JSON.parse( localStorage.getItem('user') ) : []); //유저 정보
    const [minutes,setMinutes] = useState([]);
    const [dr_info, setDr_info] = useState([]);
    const [search, setSearch] = useState("");

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
            setHome(response.data[0].dr_id);
            console.log('디렉토리 목록 조회');
            })
            .catch((error) => {
            console.log('디렉토리 목록 조회 실패 '+error);
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

    if(isAuthenticated){ //권한이 있을 때만 표시
    return (
        <div>
            <Header setSearch={setSearch}/>
            <div className="main">
                <Sidebar />
                <div className="article">
                <div style={{marginBottom: '4em'}}>
                            <div style={{display:"flex" ,alignItems: 'center'}}>
                                    {/* <img src={emo_img} style={{width: '3.0rem'}}/> */}
                                    <span style={{fontSize:'1.5em' ,margin:'1rem',fontWeight:'bold'}}>📊 회의태도 변화</span>
                            </div>
                            <div className='Speech-result' style={{ display:"flex",borderRadius:'10px', margin: '1em',boxShadow: '1px 1px 5px grey'}}>
                                <div>
                                        <ApexChart options={options} series={series} type="line"  height={400} width={600} />                                
                                </div>
                                <div className='speech-analyse' /*style={{backgroundColor: 'rgba( 185, 107, 198, 0.1 )'}}*/ >
                                            <li><b>공격,차별 발언 비율이 매우 높습니다. 회의에 부적절한 태도입니다, 스스로를 돌아볼 필요가 있어요.</b></li>
                                            <li><b>말의 속도가 너무 빨라요, 전달력이 떨어질 수 있습니다. 조금 천천히 말해주세요.</b></li>
                                            <li style={{color: 'red'}}>"<b>공격, 혐오발언</b>","<b>발화 속도</b>"에 주의해주세요</li>                               
                                </div>   
                            </div> 
                            </div>                  
                        
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
                                {minResult.map(min =>
                                    <Log_card key={min.mn_title} dr_id={min.dr_id} mn_id={min.mn_id} mn_title={min.mn_title} mn_date={min.mn_date} mn_explanation={min.mn_explanation} like={min.is_like}/>
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
                                {favResult.map(result =>
                                    <Log_card key={result.mn_title} dr_id={result.dr_id} mn_id={result.mn_id} mn_title={result.mn_title} mn_date={result.mn_date} mn_explanation={result.mn_explanation} like={result.is_like}/>
                                )}
                            </div>
                        </div>

                        {/*<div className="recent">*/}
                        {/*    <div className="directory-name">*/}
                        {/*        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"*/}
                        {/*             className="bi bi-star-fill" viewBox="0 -3 16 19">*/}
                        {/*            <path*/}
                        {/*                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>*/}
                        {/*        </svg>*/}
                        {/*        <p>최근 회의록</p>*/}
                        {/*    </div>*/}
                        {/*    <div className="log-card">*/}
                        {/*        {searchResult.map(minute =>*/}
                        {/*            <Log_card key={minute.mn_id} dr_id={minute.dr_id} mn_id={minute.mn_id} mn_title={minute.mn_title} mn_date={minute.mn_date} mn_explanation={minute.mn_explanation}/>*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className="my">
                            <div className="directory-name">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-folder-fill" viewBox="0 -3 16 19">
                                    <path
                                        d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
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