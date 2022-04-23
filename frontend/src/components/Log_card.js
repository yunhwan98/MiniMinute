import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import {Modal} from "react-bootstrap";
import axios from 'axios';
import url from '../api/axios';

export default function Log_card({dr_id, dr_name, mn_id, mn_title, mn_date, mn_explanation}) {
    const drId = dr_id ? dr_id : "1";
    const drName = dr_name ? dr_name : "home";

    return (
        <div>
            <div id="card-override" className="card" style={{width: "18rem"}}>
            <Link to={`/${drId}/${drName}/${mn_id}/log`} className="card-link">
                <div className="card-body">
                    <h5 className="card-title">회의주제</h5>
                    <p className="card-text">{mn_title}</p>
                    <h5 className="card-title">회의시간</h5>
                    <p className="card-text">{mn_date}</p>
                    <h5 className="card-title">메모</h5>
                    <p className="card-text">{mn_explanation}</p>
                </div>
            </Link> 
            </div>                       
        </div>
    );

}