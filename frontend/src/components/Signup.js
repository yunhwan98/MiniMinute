import React from "react";
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    return (
       
        <div class="signup-form">
            <div class="signup-title">회원가입</div>
        
            <form>

                <li>
                    <label>닉네임</label> <input type="text" name="nickname" class="signup-text" placeholder="닉네임"></input>
                    <button class="submit-btn" id="nickname_check">중복확인</button>
                </li>              
                <li>
                    <label>이메일</label> <input type="text" name="email" class="signup-text" placeholder="이메일"></input>
                </li>
                <li>
                    <label>비밀번호</label> <input type="password" name="password" class="signup-text" placeholder="비밀번호"></input>
                </li>
                <li>
                    <label>비밀번호 확인</label> <input type="password" name="password_check" class="signup-text" placeholder="비밀번호 확인"></input>
                    
                </li>

                <input type="submit" value="회원가입" class="submit-btn"></input>
                <hr className="signup-hr"/>
                <div id="google-title">구글 아이디로 회원가입</div>
            </form>
           
        </div>

    );
};

export default Signup;