import React, { useState } from "react";
import {Modal} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import url from '../api/axios';

function NewLog_modal(props) {
    const drId = props.dr_id ? props.dr_id : 1;   //home.js에서 만들면 1
    const drName = props.dr_name ? props.dr_name : "home";

    //const [logShow, setLogShow] = useState(false);
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(new Date()); //DB에 저장 형식 다름
    const [memo, setMemo] = useState("");
    const [place, setPlace] = useState("");
    const [dr_id,setDr_id] = useState("");   //디렉토리 지정 필요
    const [share_link , setShare_link] =useState("");
    const [errormsg, setErrormsg] = useState("");
    const navigate = useNavigate();
    const [speakermodal, setSpeakermodal] =useState(false);//화자 선택 모달
    const [speakerlist, setSpeakerlist] =useState([]);  //화자리스트 
    const [checked, setChecked] = useState(""); 
    
    //날짜를 DB에 저장할 형식으로 변경
    var year = startDate.getFullYear();
    var month = ('0' + (startDate.getMonth() + 1)).slice(-2);
    var day = ('0' + startDate.getDate()).slice(-2);
    var mn_date = year + '-' + month  + '-' + day;
   

    //클릭시 회의록 생성
    const onSubmit = async(event) => {
        console.log("실행");
        event.preventDefault();
        url.post(     
            "/minutes/lists",{    //현재 넣을 수 있는 정보만 넣음
                "mn_title" : title,             //회의록 제목
                "mn_explanation"  : memo,       //회의록 설명
                "mn_place"  : place,            //회의 장소
                "mn_date"  : mn_date,           //회의 시간
                "mn_sharelink" : share_link,    //공유 링크
                "dr_id"    : drId              //디렉토리 id
            })
            .then((response) => {
            console.log(response);
            props.setLogShow(false); 
            alert('회의록을 만들었습니다.'); //추후 삭제
            navigate(`/${drId}/${response.data.mn_id}/log`);/*클릭시 빈 회의록 페이지 이동*/
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            setErrormsg("회의 주제를 입력해주세요");
            alert("실패!")
            });       
    }

    const submitSharelink =(e)=>{
        console.log("실행");

        url.get(     
            `/minutes/create/with/share/link/${share_link}`,{})
            .then((response) => {
            console.log(response);
            setSpeakerlist(response.data);
            // props.setLogShow(false); 
            setSpeakermodal(true);
            alert('성공');
            
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });  
    }

    const handleChecked = (e) => {  //화자 체크
        console.log(e.target.value);
        setChecked(e.target.value);
    }


    const selectSpeaker =(e)=>{
        let speaker = parseInt(checked);

        url.post(     
            `/minutes/create/with/share/link/${share_link}`,{
                "dr_id": drId,
                "speaker_seq": speaker

            })
            .then((response) => {
            console.log(response);     
            setSpeakermodal(false);
            props.setLogShow(false); 
            alert('성공');
            
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            alert("실패!")
            });
    }

    console.log(checked);
    return (

        <>
            <Modal.Header closeButton>
                <Modal.Title>회의록 생성</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="Errormsg" style={{backgroundColor : 'red'}}/*오류메시지*/ >{errormsg} </div>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>주제</h6>
                    <input type="text" className="form-control" id="topic" value={title} onChange={(e)=>setTitle(e.target.value)}/>
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
                    <input type="text" className="form-control" id="speaker" value={place} onChange={(e)=>setPlace(e.target.value)}/>
                </div>
                <div className="body-form">
                    <h6 style={{fontWeight: "bold"}}>설명</h6>
                    <input type="text" className="form-control" id="memo" value={memo} onChange={(e)=>setMemo(e.target.value)}/>
                </div>
                <button type="button" id="btn-color" className="btn-override modal-btn" onClick={onSubmit} >
                    생성
                </button>
            </Modal.Body>
            <div id="modalFooter-override">
                <div style={{paddingBottom: '10px'}}>
                    <h6 style={{fontWeight: "bold"}}>공유 코드</h6>
                    <input type="text" className="form-control" id="memo" value={share_link} onChange={(e)=>setShare_link(e.target.value)}/>
                </div>
                <button type="button" id="btn-color" className="btn-override modal-btn" onClick={submitSharelink} >
                    생성
                </button>
                <Modal show={speakermodal} onHide={() => setSpeakermodal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>화자 선택하기</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5>화자 목록</h5>
                            <div className="radio-dr">
                            {speakerlist.map(result =>
                                <label className="radio-label" key={result.speaker_seq}>
                                    <input type="radio"
                                           value={result.speaker_seq}
                                           checked={checked === `${result.speaker_seq}`}
                                           onChange={handleChecked}
                                    />
                                    {result.speaker_name ? result.speaker_name : "참가자"+result.speaker_seq}</label>
                                )}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" id="btn-color" className="modal-btn"
                                    onClick={selectSpeaker}>
                                선택
                            </button>
                        </Modal.Footer>
                    </Modal>
            </div>
        </>
    );
};

export default NewLog_modal;