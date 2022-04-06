import React, { useState } from "react";
import {Modal} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function NewLog_modal() {
    const [logShow, setLogShow] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    return (
        <>
            <button type="button" className="new-btn" onClick={() => setLogShow(true)}>새 회의록</button>
            <Modal show={logShow} onHide={() => setLogShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>회의록 생성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body-form">
                        <h6>주제</h6>
                        <input type="text" className="form-control" id="topic" />
                    </div>
                    <div className="body-form">
                        <h6>날짜</h6>
                        <DatePicker
                            className="part-input"
                            closeOnScroll={(e) => e.target === document}
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                    </div>
                    <div className="body-form">
                        <h6>참석자</h6>
                        <input type="text" className="part-input" id="participant" />
                        <button className="setting-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                             className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        </button>
                    </div>
                    <div className="body-form">
                        <h6>메모</h6>
                        <input type="text" className="form-control" id="memo" />
                    </div>
                    <button type="button" id="btn-override" className="btn btn-primary" onClick={() => setLogShow(false)}>
                        생성
                    </button>
                </Modal.Body>
                <div id="modalFooter-override">
                    <div style={{paddingBottom: '10px'}}>
                    <h6>공유 코드</h6>
                    <input type="text" className="form-control" id="memo" />
                    </div>
                    <button type="button" id="btn-override" class="btn btn-primary" onClick={() => setLogShow(false)}>
                        생성
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default NewLog_modal;