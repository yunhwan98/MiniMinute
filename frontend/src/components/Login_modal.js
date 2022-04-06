import React from "react";
import { Link } from 'react-router-dom';
import './Login_modal.css';



const Login_modal = () => {

    return (
        
        <div className="login-form">
            <div className="login-title">로그인</div>
        
            <form>
                <input type="text" name="email" className="login-text" placeholder="이메일"></input>
                <input type="password" name="password" className="login-text" placeholder="비밀번호"></input>

                <div className="remember-email">
                        <input type="checkbox" /> 이메일 기억하기</div>     
                <input type="submit" value="로그인" className="submit-btn"></input>
                <div className="links">
                                         
                        <a href="#" id="find-pw">비밀번호를 잊으셨나요?</a>
                         <Link to="/signup" className="signup-link">회원가입</Link>
                   </div>
                
                <hr className="login-hr"/>
                <div id="google-title">구글 아이디로 로그인</div>
            </form>
           
        </div>
    );
};

export default Login_modal;