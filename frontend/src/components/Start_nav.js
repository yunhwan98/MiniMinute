import React from "react";
import { Link, renderMatches } from 'react-router-dom';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';



const Start_nav = () => {
    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Mini Minute</a>     

          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav me-auto">          
            </ul>

            <form className="d-flex">

              <LoginModal name="로그인"/>
              <ul></ul>
              <SignupModal name="회원가입"/>

            </form>
            </div>
            </div>
        </nav>
    );
};

export default Start_nav;