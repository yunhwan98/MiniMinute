import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginGoogle from '../Login/LoginGoogle';

const clientId = "1064677249953-799g6ker89ntqd3kfq2kpce60saut59u.apps.googleusercontent.com"
export default function SignupModal(props) {
  const [show, setShow] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [name, setname] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [color, setColor] = useState("red")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accessToken,setaccessToken] = useState('');
  const handleClose = () => {setShow(false); setErrormsg(''); setname(''); setEmail(''); setPassword(''); setConfirmPassword('');}
  const handleShow = () => setShow(true);

  const onNameHandler = (event) => {
    setname(event.currentTarget.value)
  }
  const onEmailHandler = (event) => {
      setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value)
  }
  const onConfirmPasswordHandler = (event) => {
      setConfirmPassword(event.currentTarget.value)
  }
  
  //회원가입 버튼 누르면 정보 전달
  const onSubmit = async(event) => {  

      event.preventDefault();
      axios.post(     
          "http://127.0.0.1:8000/rest-auth/signup",{
            "username" : name,
            "email" : email,
            "password1" : password,
            "password2" : confirmPassword
          }
        )
        .then((response) => {
          console.log(response);
          handleClose();
          alert('회원가입이 되었습니다.')
        })
        .catch((error) => { //오류메시지 보이게 함
          setColor("red");
          console.log(error.response);
          console.log(error.response.data.email);
          if(error.response.data.email == 'A user is already registered with this e-mail address.'){
            setErrormsg("※ 중복된 이메일 입니다 ※");
      
          }
          else if(password !== confirmPassword) {
            setErrormsg("※ 비밀번호를 확인해주세요 ※");
          }
          else if(password == 'This password is too common.', 'This password is entirely numeric.'){
            setErrormsg("※ 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요 ※");
          }
        });
    
  }
  //중복확인 버튼 누르면 중복이메일인지 체크
  const checkEmail = async(event) => {  

    event.preventDefault();
    axios.post(     
        "http://127.0.0.1:8000/rest-auth/signup",{
          "email" : email
        }
      )
      .then((response) => {
        
      })
      .catch((error) => { //오류메시지 보이게 함
        console.log(error.response);
        console.log(error.response.data.email);
        setColor("red");
        if(!error.response.data.email){
          setColor("rgb(65, 187, 81)");
          setErrormsg("사용가능한 이메일 입니다!");
        }
        else if(error.response.data.email == 'A user is already registered with this e-mail address.'){
          setErrormsg("※ 중복된 이메일 입니다 ※");
        }
        else{
          setErrormsg("※ 유효하지 않은 이메일 형식 입니다 ※");
        }
      });
  
}



  const {title} = props; 
  
  return (
    <>

      <Button className="nextButton" id="Signup-Button" onClick={handleShow}>
        {title}
      </Button>
      <Modal show={show} onHide={handleClose} centered>
      <div className="signup-form">    
        <Modal.Header closeButton>
          <Modal.Title>회원가입</Modal.Title>
        </Modal.Header>          
            <form  onSubmit={onSubmit}>
              <div className="Errormsg" style={{backgroundColor : color}}>{errormsg} </div>
              <div><label>이메일</label> <input name="email" type="email" placeholder="이메일" value={email} onChange={onEmailHandler} className="signup-text"/>
              <button type="button" onClick={checkEmail} className="submit-btn" id="email_check">중복 확인</button></div>
              <div><label>닉네임</label> <input name="name" type="text" placeholder="닉네임" value={name} onChange={onNameHandler} className="signup-text"/></div>                    
              <div><label>비밀번호</label> <input name="password" type="password" placeholder="비밀번호" value={password} onChange={onPasswordHandler} className="signup-text"/></div>
              <div><label>비밀번호 확인</label> <input name="confirmPassword" type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={onConfirmPasswordHandler} className="signup-text"/></div>
              <div><button type="submit" onSubmit={onSubmit} className="submit-btn">회원가입</button></div>
              <hr className="signup-hr"/>
              <div id="google-title">구글 아이디로 회원가입</div>
              <div className ="google-login">
                <LoginGoogle setaccessToken={setaccessToken} handleClose={handleClose} />
                </div>
            </form> 
        </div>
      </Modal>

    </>
    
  );
}

