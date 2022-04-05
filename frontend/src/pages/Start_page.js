import React from "react";
import Start_nav from "../components/Start_nav";
import Start_footer from "../components/Start_footer";

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
          <button class="btn btn-secondary my-2 my-sm-0" type="submit" id = "start_button">시작하기</button>
        </div>
        <Start_footer/>
      </div>
       
 
    );
};

export default Start_page;