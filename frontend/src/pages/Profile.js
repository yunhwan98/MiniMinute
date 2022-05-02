import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import profile from '../images/profile.png';
import {Modal} from "react-bootstrap";
import url from '../api/axios';
import {useNavigate } from 'react-router-dom';

function Profile() {
    const [quit, setQuit] = useState(false);

    const [newname, setNewname] = useState("");             //새로운 닉네임
    const [newemail, setNewemail] = useState("");           //새로운 
    const [newpassword1,setNewpassword1] = useState("");    //새로운 비밀번호
    const [newpassword2,setNewpassword2] = useState("");    //새로운 비밀번호 확인

    const [imagefile,setImagefile] = useState("");     //이미지 파일 폼
    const [preview,setPreview] = useState(localStorage.getItem('img'));  //미리보기 파일 
    const navigate = useNavigate();

    const loadImage= (e) => {    //프로필 이미지 선택 시 화면 변경
        setImagefile(e.target.files);    
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = () => {
            setPreview(reader.result);
        }
    }
    
    const submitFileImage= () => {     //프로필 이미지 서버 전송
        const formdata =new FormData();
        
        formdata.append('user_profile',imagefile[0]);
        for (let key of formdata.keys()) {
            console.log(key);
          }
        url.post(     
            "/users/profile/upload", formdata)
            .then((response) => {
            localStorage.setItem('user',JSON.stringify(response.data)); //유저 정보 변경
            console.log(response.data.user_profile);
            alert('변경했습니다'); //추후 삭제
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });
            //localStorage.setItem('profile_img', preview);
            formdata.delete('user_profile');     
    }

    // const deleteFileImage = () =>{  //프로필 이미지 삭제
    //     localStorage.setItem('profile_img', "");
    //     setImagefile("");
    //     setPreview(profile);
        
    // };


    const changeName = async(event) => {    //이름변경
        console.log("실행");
        event.preventDefault();
        url.put(     
            "/users/name/change",{    
                "username" : newname 
            })
            .then((response) => {
            localStorage.setItem('user',JSON.stringify(response.data)); //유저 정보 변경
            alert('변경했습니다'); //추후 삭제
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });       
    }
    const changeEmail= async(event) => {    //이메일변경
        console.log("실행");
        event.preventDefault();
        url.put(     
            "/users/email/change",{    
                "email" : newemail
            })
            .then((response) => {
            console.log(response);
            alert('성공!다시 로그인해주세요'); //추후 삭제
            localStorage.clear();
            navigate(`/`); 
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });       
    }

    const changePassword= async(event) => {    //비밀번호 변경
        console.log("실행");
        event.preventDefault();
        url.post(     
            "/rest-auth/password/change",{    
                "new_password1" : newpassword1,
                "new_password2" : newpassword2
            })
            .then((response) => {
            console.log(response);
            localStorage.clear();
            navigate(`/`);
            alert('성공!다시 로그인해주세요'); //추후 삭제 
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });       
    }

    const processWithdraw= async(event) => {    //회원탈퇴
        console.log("실행");
        event.preventDefault();
        setQuit(false); //회원탈퇴 모달창 닫기
        url.delete(     
            "/users/withdraw",{
            })
            .then((response) => {
            console.log(response);
            localStorage.clear();
            navigate(`/`); 
            alert('탈퇴했습니다'); //추후 삭제
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("탈퇴실패!")
            });       
    }


    return (
        <div>
            <Header />
            <div className="main">
                <div className="prof-article">
                    <div className="img-edit">
                        <div className="profile-box">
                            <img className="profile-image" src={preview} />
                        </div>
                        {/* <img className="profile-image" src={preview} /> */}
                        <label id="btn-color" className="input-file img-btn" htmlFor="input-file">사진 업로드</label>
                        <input type="file" id="input-file" style={{ display: "none" }}
                            accept="image/*"
                            onChange={loadImage} />
                        <div style={{ margin: "auto"}} >

                                <button id="btn-color" className="change-btn" style={{ width: "70px", height: "30px", cursor: "pointer", margin: "10px"}} onClick={() =>  submitFileImage()}> 저장 </button>
            
                                {/* <button id="btn-color" className="change-btn" style={{ width: "70px", height: "30px", cursor: "pointer", margin: "10px"}} onClick={() => deleteFileImage()} > 삭제 </button>  */}

                        </div>
                    </div>

                
        

                    {/*<hr style={{width: "800px", color: "inherit", opacity: "0.7"}}/>*/}
                    <form style={{width: "430px"}}>
                        <div className="nickname">
                            <h5>닉네임 변경</h5>
                            <hr id="prof-hr" />
                            <input type="text" className="form-control prof-input" id="new-nickname" value={newname} onChange={(e)=>setNewname(e.target.value)}/>
                            <button type="submit" id="btn-color" className="change-btn" onClick={changeName}>변경</button>
                        </div>

                        <div className="email">
                            <h5>이메일 변경</h5>
                            <hr id="prof-hr"/>
                            <input type="email" className="form-control prof-input" id="new-email" value={newemail} onChange={(e)=>setNewemail(e.target.value)}/>
                            <button type="button" id="btn-color" className="change-btn" onClick={changeEmail}>변경</button>

                        </div>

                        <div className="password">
                            <h5>비밀번호 변경</h5>
                            <hr id="prof-hr"/>
                            <input type="password" className="form-control prof-input" id="new-pwd" value={newpassword1} onChange={(e)=>setNewpassword1(e.target.value)}/>
                            <label style={{fontSize:"15px", textAlign:"left", width:"30%"}}>비밀번호 확인</label>
                            <input type="password" className="form-control prof-input" id="new-pwd-check" value={newpassword2} onChange={(e)=>setNewpassword2(e.target.value)}/>
                            <button type="submit" id="btn-color" className="change-btn" onClick={changePassword}>변경</button>
                        </div>
                    </form>
                    <div>
                        <button type="submit" className="quit-btn" onClick={() => setQuit(true)}>회원탈퇴</button>
                        <Modal show={quit} onHide={() => setQuit(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>회원 탈퇴</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6>정말 탈퇴하시겠습니까?</h6>
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="button" id="btn-color" className="modal-btn" onClick={processWithdraw}>
                                    네
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Profile;