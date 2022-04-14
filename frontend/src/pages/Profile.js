import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import profile from '../images/profile2.png';
import {Modal} from "react-bootstrap";

function Profile() {
    const [quit, setQuit] = useState(false);
    const [email, setEmail] = useState(false);

    return (
        <div>
            <Header />
            <div className="main">
                <div className="prof-article">
                    <div className="img-edit">
                        <img src={profile} style={{width: "12em"}}/>
                        <label id="btn-color" className="input-file img-btn" htmlFor="input-file">사진 업로드</label>
                        <input type="file" id="input-file" style={{display: "none"}}
                               accept="image/*"
                               onChange={null}/>
                    </div>
                    {/*<hr style={{width: "800px", color: "inherit", opacity: "0.7"}}/>*/}
                    <form style={{width: "430px"}}>
                        <div className="nickname">
                            <h5>닉네임 변경</h5>
                            <hr id="prof-hr" />
                            <input type="text" className="form-control prof-input" id="new-nickname" />
                            <button type="submit" id="btn-color" className="change-btn">변경</button>
                        </div>

                        <div className="email">
                            <h5>이메일 변경</h5>
                            <hr id="prof-hr"/>
                            <input type="text" className="form-control prof-input" id="new-email" />
                            <button type="button" id="btn-color" className="change-btn" onClick={() => setEmail(true)}>변경</button>
                            <Modal show={email} onHide={() => setEmail(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>이메일 변경</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6>새 이메일 입력</h6>
                                <input type="text" className="form-control" id="new-email" />
                                <h6 style={{paddingTop: "15px"}}>비밀번호 입력</h6>
                                <input type="text" className="form-control" id="pwd" />
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="button" id="btn-color" className="modal-btn" onClick={() => setEmail(false)}>
                                    변경
                                </button>
                            </Modal.Footer>
                        </Modal>
                        </div>

                        <div className="password">
                            <h5>비밀번호 변경</h5>
                            <hr id="prof-hr"/>
                            <input type="text" className="form-control prof-input" id="new-pwd" />
                            <label style={{fontSize:"15px", textAlign:"left", width:"30%"}}>비밀번호 확인</label>
                            <input type="text" className="form-control prof-input" id="new-pwd-check" />
                            <button type="submit" id="btn-color" className="change-btn">변경</button>
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
                                <button type="button" id="btn-color" className="modal-btn" onClick={() => setQuit(false)}>
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