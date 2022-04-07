import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function LoginModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {name} =props;
  return (
    <>
      <Button className="nextButton" id="Login-Button" onClick={handleShow}>
        {name}
      </Button>
      <Modal show={show} onHide={handleClose} centered>
      <div className="login-form">    
        <Modal.Header closeButton>
          <Modal.Title>로그인</Modal.Title>
        </Modal.Header>
           
            <form>
                <input type="text" name="email" className="login-text" placeholder="이메일"></input>
                <input type="password" name="password" className="login-text" placeholder="비밀번호"></input>

                <div className="remember-email">
                        <input type="checkbox" /> 이메일 기억하기</div>     
                <input type="submit" value="로그인" className="submit-btn"></input>
                <div className="links">
                                         
                        <a href="#" id="find-pw">비밀번호를 잊으셨나요?</a>
                         
                   </div>
                
                <hr className="login-hr"/>
                <div id="google-title">구글 아이디로 로그인</div>
            </form>
        </div>
      </Modal>
    </>
  );
}

