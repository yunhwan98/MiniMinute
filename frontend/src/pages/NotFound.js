import React from "react";
import {Link} from "react-router-dom";
import button from "bootstrap/js/src/button";
import error from '../images/error.png';

function NotFound() {
    return(
        <div className="not-found">
            <img src={error} style={{width: "410px"}}/>
            <h1>권한이 없습니다!</h1>
            <button type="button">
                <Link className="none-link" to="/">메인으로 돌아가기</Link>
            </button>
        </div>
    )
}

export default NotFound;