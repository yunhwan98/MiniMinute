import React from "react";
import { Link, renderMatches, useNavigate } from 'react-router-dom';
import LoginModal from './Login/LoginModal';
import SignupModal from './Signup/SignupModal';
import miniminute_logo from '../images/logo.png';
import {Button} from 'react-bootstrap';

const Start_nav = (props) => {
  const  navigate = useNavigate();
  const onClick = (event) => {  //홈으로 이동
    navigate('/home');
  }
  const Logout = (e) => {   //로그아웃 실행
    console.log('로그아웃 실행')
    props.userLogout();
  }
    if(!props.isAuthenticated){ //토큰이 없을 때 화면(인증 X)
    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">  
          <img src={miniminute_logo} style={{height: "60px"}} />
          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav me-auto">          
            </ul>

            <form className="d-flex" style={{display:'flex'}}>
              <div style={{padding:'1rem'}}>
              <LoginModal title="로그인" userHasAuthenticated={props.userHasAuthenticated}/>
              </div>
              <div style={{padding:'1rem'}}>
              <SignupModal title="회원가입"/>
              </div>
            </form>
            </div>
            </div>
        </nav>
    );
    }
    else{ //토큰이 있을 때 화면(인증)
      return(
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">  
        <img src={miniminute_logo} style={{height: "60px"}} />
        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav me-auto">          
          </ul>

          <form className="d-flex" style={{display:'flex'}}>
              <div style={{padding:'1rem'}}>
              <Button className="nextButton" id="Login-Button" onClick={onClick}>내 회의록</Button>
              </div>
              <div style={{padding:'1rem'}}>
              <Button className="nextButton" id="Login-Button" onClick={Logout}>로그아웃</Button>
              </div>           
          </form>
          </div>
          </div>
      </nav>
      );

    }
};

export default Start_nav;