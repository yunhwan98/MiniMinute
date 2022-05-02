import React, { useState } from "react";
import {Modal} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import AddParticipant from "./AddParticipant";
import axios from 'axios';
import url from '../api/axios';

export default function EditLog_modal(props) {
    const drId = props.dr_id ? props.dr_id : 1;   //home.js에서 만들면 1
    const drName = props.dr_name ? props.dr_name : "home";

    //const [logShow, setLogShow] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [startDate, setStartDate] = useState(new Date(props.date)); //DB에 저장 형식 다름
    const [memo, setMemo] = useState(props.explanation);
    const [place, setPlace] = useState(props.place);
    const [dr_id,setDr_id] = useState("");   //디렉토리 지정 필요
    const [share_link , setShare_link] =useState("");
    const [errormsg, setErrormsg] = useState("");
    const navigate = useNavigate();

    //날짜를 DB에 저장할 형식으로 변경
    var year = startDate.getFullYear();
    var month = ('0' + (startDate.getMonth() + 1)).slice(-2);
    var day = ('0' + startDate.getDate()).slice(-2);
    var mn_date = year + '-' + month  + '-' + day;
   

    //클릭시 회의록 생성
    const onSubmit = async(event) => {
        console.log("실행");
        event.preventDefault();
        url.put(     
            `/minutes/${props.mn_id}`,{    //현재 넣을 수 있는 정보만 넣음
                "mn_title" : title,             //회의록 제목
                "mn_explanation"  : memo,       //회의록 설명
                "mn_place"  : place,            //회의 장소
                "mn_date"  : mn_date,           //회의 시간
            })
            .then((response) => {
            console.log(response);
            props.setLogShow(false); 
            alert('회의록을 수정했습니다.'); //추후 삭제
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });       
    }

    return (

        <>
            <Modal.Header closeButton>
                <Modal.Title>회의록 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="Errormsg" style={{backgroundColor : 'red'}}/*오류메시지*/ >{errormsg} </div>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>주제</h6>
                    <input type="text" className="form-control"  placeholder={title}  id="topic" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>날짜</h6>
                    <DatePicker
                        className="part-input"
                        closeOnScroll={(e) => e.target === document}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                    />
                </div>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>장소</h6>
                    <input type="text" className="form-control" placeholder={place} id="place" value={place} onChange={(e)=>setPlace(e.target.value)}/>
                </div>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>메모</h6>
                    <input type="text" className="form-control"  placeholder={memo} id="memo" value={memo} onChange={(e)=>setMemo(e.target.value)}/>
                </div>
            </Modal.Body>
            <div id="modalFooter-override">
                <button type="button" id="btn-color" className="btn-override modal-btn" onClick={onSubmit} >
                    생성
                </button>
                
            </div>
        </>
    );
};

