import React from "react";
import Header from "../components/Header";
import {Link} from "react-router-dom";
import button from "bootstrap/js/src/button";
import Footer from "../components/Footer";

function NotFound() {
    return(
        <div>
            <Header />
            <div className="main">
                <h3>권한이 없습니다!</h3>
                <button type="button" id="btn-color">
                    <Link className="none-link" to="/">돌아가기</Link>
                </button>
            </div>
        </div>
    )
}

export default NotFound;