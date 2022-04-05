import React from "react";
import { Link } from 'react-router-dom';

const Start_nav = () => {
    return (

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Mini Minute</a>     

          <div class="collapse navbar-collapse" id="navbarColor03">
            <ul class="navbar-nav me-auto">          
            </ul>

            <form class="d-flex">
              <button class="btn btn-secondary my-2 my-sm-0" type="submit">로그인</button>
              <ul></ul>
              <button class="btn btn-secondary my-2 my-sm-0" type="submit">회원가입</button>
            </form>
            </div>
            </div>
        </nav>
    );
};

export default Start_nav;