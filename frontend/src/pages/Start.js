import React, {useState, useEffect} from 'react';
import Start_nav from "../components/Start_nav";
import Start_footer from "../components/Start_footer";
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../components/Login/LoginModal';
import SignupModal from '../components/Signup/SignupModal';
import miniminute_logo from '../images/logo.png';
import axios from 'axios';
import LogoutGoogle from '../components/Login/LogoutGoogle';
import start1 from '../images/start1.png';
import start2 from '../images/start2.png';
import start3 from '../images/start3.png';
import background from '../images/start_background.png';
import Carousel from 'react-bootstrap/Carousel'
import url from '../api/axios';

const Start_page = () => {
    const [user, setUser] = useState([]);  //유저 정보 저장
    const [isAuthenticated, setisAuthenticated] = useState(localStorage.getItem('token') ? true : false);//인증여부 확인

    //회원가입이나 로그인이 성공했을 때 토큰을 저장
    const userHasAuthenticated = (authenticated, userinfo, token) => {
        localStorage.setItem('token',  token);
        localStorage.setItem('user',JSON.stringify(userinfo));
        setisAuthenticated(authenticated);
        window.location.reload();   //새로고침
       
        
        /*setUser(username);*/
    }
    //로그아웃
    const userLogout = () => {
        setisAuthenticated(false);
        setUser([]);
        localStorage.clear();
    }

    useEffect(() => { // 유저 정보 받아옴
        if (isAuthenticated){
            url.get(
                "/users/profile"
            )
                .then((response) => {
                    localStorage.setItem('user',JSON.stringify(response.data));
                    setUser(response.data)
                    console.log(response.data.user_profile)
                })
                .catch((error) => { //오류메시지 보이게 함
                    console.log(error.response)
                });
        }
      },[isAuthenticated]);

    return (
        <div className = "Start" >
            <Start_nav  isAuthenticated ={isAuthenticated} userHasAuthenticated={userHasAuthenticated} userLogout={userLogout}/>
            <div style={{ padding: '50px 200px'}}>
            <Carousel variant="dark">
            <Carousel.Item >
                        <div className="start-div"
                            style={{
                                height: "500px", borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage:
                                    `url(${background})`, backgroundSize: '100%'
                            }}
                        >
                            <div></div>
                            <div style={{ height: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                                <div style={{ display: 'flex', width: '70%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ padding: '1rem', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>회의시간에는 회의에만 집중하세요!</p>
                                    <p style={{ padding: '1rem', fontSize: '1.3rem', color: 'white' }}>미니미닛이 회의 내용을 대신 기록해줄게요</p>
                                </div>
                                <div style={{ display: 'flex', width: '30%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={start1} style={{ height: "300px" }} />
                                </div>
                            </div>
                        </div>

                </Carousel.Item>
                <Carousel.Item>
                
                        <div className="start-div"
                            style={{
                                height: "500px", borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage:
                                    `url(${background})`, backgroundSize: '100%'
                            }}
                        >
                            <div style={{ height: "100%", display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'start' }}>
                                <div style={{ display: 'flex', width: '70%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ padding: '1rem', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>회의의 분위기를 떠올리고 싶나요?</p>
                                    <p style={{ padding: '1rem', fontSize: '1.3rem', color: 'white' }}>참가자들의 감정을 대화형식으로 한 눈에 볼 수 있어요</p>
                                </div>
                                <div style={{ display: 'flex', width: '30%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={start2} style={{ height: "300px" }} />
                                </div>
                            </div>
                        </div>
                </Carousel.Item>
                <Carousel.Item>
                        <div className="start-div"
                            style={{
                                height: "500px", borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage:
                                    `url(${background})`, backgroundSize: '100%'
                            }}
                        >
                            <div style={{ height: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                                <div style={{ display: 'flex', width: '70%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ padding: '1rem', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>회의에서 나는 어땠을까?</p>
                                    <p style={{ padding: '1rem', fontSize: '1.3rem', color: 'white' }}>감정분석을 기반하여 문제점을 파악해봐요</p>
                                </div>
                                <div style={{ display: 'flex', width: '30%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={start3} style={{ height: "300px" }} />
                                </div>
                            </div>
                        </div>
                </Carousel.Item>
            </Carousel>
            </div>
            <Start_footer/>
        </div>

    );

};

export default Start_page;