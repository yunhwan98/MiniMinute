import React from "react";
import Start_nav from "../components/Start_nav";
import Start_footer from "../components/Start_footer";
import { Link } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

const Start_page = () => {
    return (

      <div clssName = "Start"> 
        <Start_nav/>
        <div id="main">
          <div class="hero-header">
            <div class="info">
              <h1>Mini Minute</h1>
                <p>
                  당신의 감정을 파악해주는 회의록
                </p>
            </div>
          </div>
        </div>
        <div className = "bottom">
          <LoginModal name="시작하기" />
        </div>
        <Start_footer/>
      </div>
       
 
    );
};

export default Start_page;