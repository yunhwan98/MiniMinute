import React, {useState, useEffect} from 'react';
import Start_nav from "../components/Start_nav";
import Start_footer from "../components/Start_footer";
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../components/Login/LoginModal';
import SignupModal from '../components/Signup/SignupModal';
import miniminute_logo from '../images/logo.png';
import axios from 'axios';
import LogoutGoogle from '../components/Login/LogoutGoogle';
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
      },[isAuthenticated]);
      
      


    return (
        <div className = "Start">
           
            <Start_nav  isAuthenticated ={isAuthenticated} userHasAuthenticated={userHasAuthenticated} userLogout={userLogout}/>
            <div id="main">
                <div className="hero-header">
                    <div className="info fade-in">
                        <img src={miniminute_logo} style={{height: "200px"}} />
                        <h1></h1>
                        <p>
                            당신의 감정을 파악해주는 회의록
                        </p>
                    </div>
                </div>
            </div>
            <div className = "bottom">

            </div>
            <Start_footer/>
        </div>

    );

};

export default Start_page;