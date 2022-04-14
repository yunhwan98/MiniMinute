import React, { useState } from "react";
import {Modal} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddParticipant from "./AddParticipant";

function NewLog_modal() {
    const [logShow, setLogShow] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    return (


        <>
            <Modal.Header closeButton>
                <Modal.Title>회의록 생성</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>주제</h6>
                    <input type="text" className="form-control" id="topic"/>
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
                    <h6 style={{fontWeight: "bold"}}>참석자</h6>
                    <AddParticipant />
                </div>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>메모</h6>
                    <input type="text" className="form-control" id="memo"/>
                </div>
                <button type="button" id="btn-color" className="btn-override modal-btn"
                        onClick={() => setLogShow(false)}>
                    생성
                </button>
            </Modal.Body>
            <div id="modalFooter-override">
                <div style={{paddingBottom: '10px'}}>
                    <h6 style={{fontWeight: "bold"}}>공유 코드</h6>
                    <input type="text" className="form-control" id="memo"/>
                </div>
                <button type="button" id="btn-color" className="btn-override modal-btn"
                        onClick={() => setLogShow(false)}>
                    생성
                </button>
            </div>
        </>
    );
};

export default NewLog_modal;