import React, { useState } from "react";
import {Modal} from "react-bootstrap";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from '../api/axios';
import { Start } from "@mui/icons-material";

export default function New_Bookmark(props) {
    
    const [name, setName] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    //클릭시 회의록 생성
    const onSubmit = async(event) => {
        console.log("실행");
        event.preventDefault();
        url.post(     
            `/minutes/${props.mn_id}/bookmark/lists`,{  
                "bm_start" : start,
                "bm_end" : end,
                "bm_name" : name
            })
            .then((response) => {
            console.log(response);
            props.setShowBm(false); 
            alert('북마크를 만들었습니다.'); //추후 삭제

            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });       
    }

    return (

            <Modal show={props.showBm} onHide={() => props.setShowBm(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>북마크 정보 입력</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                 
                                        <h6>북마크 이름</h6>
                                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                        <h6>시작 시간</h6>
                                        <input type="text" className="form-control" id="start" value={start} onChange={(e) => setStart(e.target.value)} />
                                        <h6>종료 시간</h6>
                                        <input type="text" className="form-control" id="end" value={end} onChange={(e) => setEnd(e.target.value)} />
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <button type="button" id="btn-color" className="btn-override modal-btn" onClick={onSubmit} >
                                        생성
                                    </button>
                                      
                                    </Modal.Footer>
                </Modal>

    );
};

