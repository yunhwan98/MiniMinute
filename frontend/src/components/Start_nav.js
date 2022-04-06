import React from "react";
import { Link, renderMatches } from 'react-router-dom';

const Start_nav = () => {
    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Mini Minute</a>     

          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav me-auto">          
            </ul>

            <form className="d-flex">
              <button className="btn btn-secondary my-2 my-sm-0" type="submit"><Link to="/login" className="login-link">로그인</Link></button>
              <ul></ul>
              <button className="btn btn-secondary my-2 my-sm-0" type="submit"><Link to="/signup" className="signup-link">회원가입</Link></button>
            </form>
            </div>
            </div>
        </nav>
    );
};

export default Start_nav;