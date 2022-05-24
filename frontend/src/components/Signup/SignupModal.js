import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from '../../api/axios';

export default function SignupModal(props) {
  const [show, setShow] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("red");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessToken,setaccessToken] = useState('');
  const handleClose = () => {setShow(false); setErrormsg(''); setName(''); setEmail(''); setPassword(''); setConfirmPassword('');}
  const handleShow = () => setShow(true);
  
  //회원가입 버튼 누르면 정보 전달
  const onSubmit = async(event) => {  

      event.preventDefault();
      url.post(
          "/rest-auth/signup",{
            "username" : name,
            "email" : email,
            "password1" : password,
            "password2" : confirmPassword
          }
        )
        .then((response) => {
          console.log('회원가입' + response.data);
          setaccessToken(response.data.token);
          handleClose();
          alert('회원가입이 완료되었습니다.')
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
          else if(password == 'This password is entirely numeric.'){
            setErrormsg("※ 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요 ※");
          }
        });
  }
  //중복확인 버튼 누르면 중복이메일인지 체크
  const checkEmail = async(event) => {  
    event.preventDefault();
    url.post(
        "/rest-auth/signup",{
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
        else if(error.response.data.email == '이미 이 이메일 주소로 등록된 사용자가 있습니다.'){
          setErrormsg("※ 중복된 이메일 입니다 ※");
        }
        else{
          setErrormsg("※ 유효하지 않은 이메일 형식 입니다 ※");
        }
      });
  
  }
 //중복확인 버튼 누르면 중복이메일인지 체크
 const checkNickname = async(event) => {  
  event.preventDefault();
  url.post(
      "/rest-auth/signup",{
        "username" : name
      }
    )
    .then((response) => {
      
    })
    .catch((error) => { //오류메시지 보이게 함
      console.log(error.response);
      console.log(error.response.data.username);
      setColor("red");
      if(!error.response.data.username){
        setColor("rgb(65, 187, 81)");
        setErrormsg("사용가능한 닉네임 입니다!");
      }
      else if(error.response.data.username == 'User의 username은/는 이미 존재합니다.'){
        setErrormsg("※ 중복된 닉네임 입니다 ※");
      }
      else{
        setErrormsg("※ 유효하지 않은 닉네임 입니다 ※");
      }
    });

}
      useEffect(() => { //회원가입 시 자동으로 home 디렉토리 생성
          if (accessToken) {
              axios.post('http://127.0.0.1:8000/directorys/lists',{"dr_name": 'home'}, {
                  headers: {
                      "Authorization": `jwt ${accessToken}`
                  },})
                  .then((response) => {
                      console.log("디렉토리 추가 성공");
                      console.log(response.data);
                      //alert("디렉토리 추가 성공");
                  })
                  .catch((error) => {
                      console.log("디렉토리 추가 실패 "+error);
                      //alert("디렉토리 추가 실패");
                  });
          }
      }, [accessToken])

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
              <div><label>이메일</label> <input name="email" type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="signup-text"/>
              <button type="button" onClick={checkEmail} className="submit-btn" id="email_check">중복 확인</button></div>
              <div><label>닉네임</label> <input name="name" type="text" placeholder="닉네임" value={name} onChange={(e) => setName(e.target.value)} className="signup-text"/>
              <button type="button" onClick={checkNickname} className="submit-btn" id="nickname_check">중복 확인</button></div>                 
              <div><label>비밀번호</label> <input name="password" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} className="signup-text"/></div>
              <div><label>비밀번호 확인</label> <input name="confirmPassword" type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="signup-text"/></div>
              <div><button type="submit" onSubmit={onSubmit} className="submit-btn" style={{marginTop:'1rem'}}>회원가입</button></div>
            </form> 
        </div>
      </Modal>

    </>
    
  );
}

