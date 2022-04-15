import React, {useState, useEffect} from 'react';
import Start_nav from "../components/Start_nav";
import Start_footer from "../components/Start_footer";
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import miniminute_logo from '../images/logo.png';
import axios from 'axios';
import LogoutGoogle from '../components/LogoutGoogle';

const Start_page = () => {

  const [user, setUser] = useState([]);  //유저 정보 저장
  const [isAuthenticated, setisAuthenticated] = useState(localStorage.getItem('token') ? true : false);//인증여부 확인

  //회원가입이나 로그인이 성공했을 때 토큰을 저장
  const userHasAuthenticated = (authenticated, username, token) => { 
    localStorage.setItem('token', token);
    setisAuthenticated(authenticated); 
    setUser(username);
    
  }

  //로그아웃
  const userLogout = () => {
    setisAuthenticated(false);
    setUser([]);
    localStorage.clear(); 
  }

    return (
    
      <div className = "Start"> 
  
        <Start_nav  isAuthenticated ={isAuthenticated} userHasAuthenticated={userHasAuthenticated} userLogout={userLogout}/>
        <div id="main">
          <div className="hero-header">
            <div className="info">
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