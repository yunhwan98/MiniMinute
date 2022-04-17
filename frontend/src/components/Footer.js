import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';

const Footer = (props) => {
    const  navigate = useNavigate();
    const [username, setName] = useState(props.username);

    const Logout = (e) => {   //로그아웃 실행
    console.log('로그아웃 실행');
    setName([]);
    localStorage.clear();
    navigate("/");
    }

    return (
        <div className="footer">
            <div className="footer-content">
                <ul style={{listStyle: 'none', marginBottom: 0}}>
                    <li className="footer-li"><Link to={`/home/${username}`} className="footer-link">Home</Link></li>
                    <li className="footer-li footer-link cursor" onClick={Logout}>로그아웃</li>
                </ul>
                <hr className="footer-hr"/>
                <p>© 2022 Sejong Capstone Project 종이새</p>
            </div>
        </div>
    );
};

export default Footer;