import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Find_pwModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [email, setEmail] = useState("");
  const [validNum, setValidNum] = useState(""); 
  
  
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onValidNumHandler = (event) => {
    setValidNum(event.currentTarget.value)
}


const onSubmit = (event) => {
  event.preventDefault();
}

  const {name} = props; 
  return (
    <>
      <Link to="" id="find_pw" onClick={handleShow}>
        {name}
      </Link>  

      <Modal show={show} onHide={handleClose} centered>
      <div className="signup-form">    
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 찾기</Modal.Title>
        </Modal.Header>          
            <form>
            <div><label>이메일</label> <input name="email" type="email" placeholder="이메일" value={email} onChange={onEmailHandler} className="signup-text"/>
            <button type="submit" onSubmit={onSubmit} className="submit-btn" id="email_check">전송</button></div>
            <div><label>인증번호</label> <input name="validNum" type="text" placeholder="인증번호" value={validNum} onChange={onValidNumHandler} className="signup-text"/>
            <button type="submit" onSubmit={onSubmit} className="submit-btn" id="email_check">확인</button></div>
                <div className="findpw">회원님의 비밀번호 : </div>
                          
            </form>
          
        </div>
      </Modal>
    </>
  );
}

