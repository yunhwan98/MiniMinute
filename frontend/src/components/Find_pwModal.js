import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

//비밀번호 찾기 모달 
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
            <div><label>이메일</label> <input name="email" type="email" placeholder="이메일" value={email} onChange={onEmailHandler} className="signup-text"/></div>
            <div><label>질문</label> <input name="validNum" type="text" placeholder="질문" value={validNum} onChange={onValidNumHandler} className="signup-text"/></div>
            <button type="submit"  onSubmit={onSubmit} className="submit-btn" >비밀번호 재설정</button>
            </form>
          
        </div>
      </Modal>
    </>
  );
}

