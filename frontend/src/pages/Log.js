import React, {useState, useEffect,useRef} from "react";
import Bookmark from "../components/bookmark";
import Header_log from "../components/Header_log";
import SidebarLog from "../components/Sidebar_log";
import NewBm from "../components/New_Bookmark";
import {useParams} from "react-router-dom";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import url from '../api/axios';
import {Modal, Nav} from "react-bootstrap";
import chatProfile from '../images/profile.png';
import Add_bm from '../images/Add_bm2.png';
import { createRoot } from "react-dom/client";
import Highlighter from "react-highlight-words";
import Scroll from 'react-scroll';

function Log(){
    let Element = Scroll.Element;
    let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;
    const mnId = params.mn_id;
    const [minutes, setMinutes] = useState([]);
    const [memo,setMemo] = useState("");    //메모
    const [file, setFile] = useState("");   //file id
    const [isUpload, setIsUpload] = useState(false);
    const [path, setPath] = useState(""); //파일 url
    const [dialogue, setDialogue] = useState([]);   //대화
    const [bookmark, setBookmark] = useState([]);   //북마크 리스트
    const [showBm, setShowBm] = useState(false);    //북마크모달
    const [participant, setParticipant] = useState(false);  //참가자 모달
    const [pNum, setPNum] = useState("");   //참가자 수
    const [start,setStart] = useState("");
    const [end,setEnd] = useState("");
    const [nameModal, setNameModal] = useState(false);
    const [name, setName] = useState("");   //참가자 이름
    const [nameList, setNameList] = useState([]);
    const [spkSeq, setSpkSeq] = useState([]);
    const [dialModal, setDialModal] = useState(false);  //대화 수정
    const [dial, setDial] = useState("");
    const [vrSeq, setVrSeq] = useState("");
    const playerInput = useRef();
    const [search, setSearch] = useState('');   //검색어
    const [dial2, setDial2] = useState([]);
    
    const emotion = [
        {id: 0, title: '😡'},
        {id: 1, title: '😢'},
        {id: 2, title: '😶'},
        {id: 3, title: '😄'}
    ]

    const onEditLogHandler =(event) => {//메모 수정
        event.preventDefault();
        url.put(
            `/minutes/${mnId}`,{
                "mn_memo" : memo        //우선 메모만 추가
            }
        )
            .then((response) => {
                console.log(response);
                alert('저장!');
            })
            .catch((error) => {
                console.log(error.response);
                alert('실패!'); 
            });

    }

    useEffect(() => { // 회의록 정보 받아오기
        url.get(     
            `/minutes/${mnId}`
            )
            .then((response) => {
            console.log('회의록 정보 불러오기');
            console.log(response.data);
            setMinutes(response.data);
            setFile(response.data.file_id);
            setMemo(response.data.mn_memo);
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });       
      }, []);

    useEffect(() => {   //북마크 정보 받아오기
        url.get(
            `/minutes/${mnId}/bookmark/lists`)
            .then((response) => {
                console.log(response.data);
                setBookmark(response.data);
            })
            .catch((error) => {
                console.log("북마크 목록 불러오기 실패 "+error)
            })
    },[showBm])
    
    let bookmarkList =[]; 

    useEffect(() => {   //파일 불러오기
        url.get(
            `/files/${file}`)   //이상한 데이터 return
            .then((response) => {
                console.log(response);
                console.log("파일 조회 성공")
                setIsUpload(true);
                //setPath("https://storage.cloud.google.com/miniminute_voice_file/testquiz.wav?authuser=1");
            })
            .catch((error) => {
                setIsUpload(false);
                console.log("파일 조회 실패 " + error);
            })
    }, [file])

    const onAudioHandler = (e) => { //파일 업로드 & 오디오 보이기
        const file = e.target.files[0];
        let name = file.name.slice(0,file.name.indexOf('.'));
        let type = file.name.slice(file.name.indexOf('.')+1, undefined);
        console.log(name);
        console.log(type);
        setParticipant(false);
        const formdata =new FormData();     
        formdata.append('file',e.target.files[0]);
       
        // const reader = new FileReader();
        // reader.readAsDataURL(e.target.files[0]);
        // reader.onloadend = () => {
        //     setPath(reader.result);
        // }
        
        //파일 전송
        // const formData = new FormData();
        // formData.append("file", file);
        
        //setPath("https://miniminute-bucket.s3.ap-northeast-2.amazonaws.com/1_1_test0510.wav");

        url.post(`/minutes/${mnId}/file/upload`, formdata)
            .then((response) => {
                console.log(response.data);
                console.log("업로드 성공");
               
                voice_recog();
            })
            .catch((error) => {
                console.log("업로드 실패 "+ error);
            });
    }
    
    const voice_recog = () => {//stt 호출
        console.log("stt 호출");
        url.post(`/voice/recognition/lists/${mnId}`,
            {"speaker_cnt": parseInt(pNum)})
        .then((response) => {
            console.log("stt 성공");
            console.log(response);
            setIsUpload(true);
        })
        .catch((error) => {
            console.log("stt 실패 "+ error.response);
        })
    }

    useEffect(() => {
         url.get(
            `/voice/recognition/lists/${mnId}`)
            .then((response) => {
                console.log("stt 결과 조회 성공");
                console.log(response.data);
                setDialogue(response.data);
                setDial2(response.data);
                getSummary();
            })
            .catch((error) => {
                console.log("stt 조회 실패 "+ error);
            })
    }, [isUpload, dialModal, nameModal])

    //키워드, 요약 생성
    const getSummary = () => {
        url.post(`/summary/${mnId}`)
            .then((response)=> {
                console.log("요약문 생성");
            })
            .catch((error)=>{
                console.log("요약문 생성 실패: "+error);
            })

        url.post(`/keyword/${mnId}`)
            .then((response)=> {
                console.log("키워드 생성");
            })
            .catch((error)=>{
                console.log("키워드 생성 실패: "+error);
            })
    }

    const moveAudio = (current) => {//클릭시 시간으로 이동
        //playerInput.current.audio.current.currentTime = 3;    
        //let start = parseInt(current.slice(0,1))*3600 +  parseInt(current.slice(2,4)) * 60 + parseInt(current.slice(5,7)); //
        let start =current;
        playerInput.current.audio.current.currentTime = start;
        playerInput.current.audio.current.play();   //오디오객체에 접근해서 플레이 조작

    }

    const bookmarkOperate = (current,current2) => {//클릭시 시간으로 이동
        //playerInput.current.audio.current.currentTime = 3;    
        //let start = parseInt(current.slice(0,1))*3600 +  parseInt(current.slice(2,4)) * 60 + parseInt(current.slice(5,7)); //
        //let end = parseInt(current2.slice(0,1))*3600 +  parseInt(current2.slice(2,4)) * 60 + parseInt(current2.slice(5,7));
        let start = current;
        let end = current2;
        console.log(start);
        console.log(end);
        playerInput.current.audio.current.currentTime = start;
        playerInput.current.audio.current.play();   //오디오객체에 접근해서 플레이 조작

        console.log((end-start));
        setTimeout(() => { playerInput.current.audio.current.pause(); console.log('멈춤');}, (end-start+1)*1000);
    }

    const openCtxt = (e) => {   //우클릭 메뉴
        e.preventDefault();

        const menu = document.getElementById("chat-menu");
        const prof = document.getElementById("prof-menu");

        if (prof) prof.style.display = "none";

        menu.style.display = "block";
        menu.style.top = e.pageY+"px";
        menu.style.left = e.pageX+"px";
    }

    const openCtxtProf = (e) => {   //우클릭 메뉴
        e.preventDefault();

        const menu = document.getElementById("chat-menu");
        const prof = document.getElementById("prof-menu");

        if (menu) menu.style.display = "none";

        prof.style.display = "block";
        prof.style.top = e.pageY+"px";
        prof.style.left = e.pageX+"px";
    }

    const closeCtxt = (e) => {
      const menu = document.getElementById("chat-menu");
      const prof = document.getElementById("prof-menu");

      if (menu) menu.style.display = "none";
      if (prof) prof.style.display = "none";
    }

    //다른 곳 클릭 시 메뉴 닫힘
    document.addEventListener("click", closeCtxt, false);

    useEffect(() => {   //화자 불러오기
        url.get(`/minutes/${mnId}/speaker/lists`)
            .then((response) => {
                console.log("화자 list 조회");
                console.log(response.data);
                setNameList(response.data);
                getEmotion();
            })
            .catch((error) => {
                console.log("화자 list 조회 fail: "+error);
            })
    }, [nameModal,dialogue])

    const setSpeaker = (e) => {
        e.preventDefault();

        url.put( `/minutes/${mnId}`, {
            "speaker_seq": spkSeq
        })
            .then((response) => {
                console.log("화자 설정 성공");
                console.log(response);
                window.location.reload();
            })
            .catch((error) => {
                console.log("화자 설정 실패: "+error);
            })
    }

    const changeName = (e, speaker_seq) => { //참가자 이름 변경
        e.preventDefault();

        url.put(
            `/minutes/${mnId}/speaker/${speaker_seq}`, {
                "speaker_name": name
            })
            .then((response) => {
                console.log("참가자 이름 변경 성공");
                console.log(response);
                setNameModal(false);
            })
            .catch((error)=>{
                console.log("참가자 이름 변경 실패: "+error);
            })
    }

    const changeDial = (e, vr_seq) => {
        e.preventDefault();
        console.log(dialogue);

        url.put(
            `/voice/recognition/${mnId}/${vr_seq}`, {
                "vr_text": dial
            })
            .then((response) => {
                console.log("대화 내용 변경 성공");
                console.log(response);
                setDialModal(false);
            })
            .catch((error)=>{
                console.log("대화 내용 변경 실패: "+error);
            })
    }
    
    const changeTime =(time)=>{ //시간형식으로 변환
        
        let hour = Math.floor(parseInt(time)/3600);
        let minute = Math.floor(parseInt(time)%3600/60);
        let second =  Math.floor(parseInt(time)%60);

        let result=hour.toString().padStart(2,0) + ':' + minute.toString().padStart(2,0)+ ':' +second.toString().padStart(2,0);

        return result
    }

    const getEmotion = () => {
        url.post(`/voice/recognition/emotion/${mnId}`)
            .then((response) => {
                console.log("감정인식 성공");
                console.log(response);
            })
            .catch((error) => {
                console.log("감정인식 실패: "+error);
            })
    }

    const emotionFilter = (e, emo) => {
        if (emo === "all") {
            setDial2(dialogue.filter(dialogue => dialogue));
        }
        else if (emo === "happy") {
            setDial2(dialogue.filter(dialogue => dialogue.emotion_type === 3));
        }
        else if (emo === "sad") {
            setDial2(dialogue.filter(dialogue => dialogue.emotion_type === 1));
        }
        else if (emo === "anger") {
            setDial2(dialogue.filter(dialogue => dialogue.emotion_type === 0));
        }
    }

    return (
        <div>
            <Header_log setSearch={setSearch}/>
            <div className="main">
                <SidebarLog dr_id={dr_id} mn_id={mnId} memo={memo}/>
                <div className="article">
                    <div style={{display: "flex"}} className="fade-in">
                        <div>
                            <h5>회의 전문</h5>
                            <Nav justify id="nav-log" variant="tabs" defaultActiveKey="/home">
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-1" onClick={(e)=>emotionFilter(e, "all")}>전체</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-2" onClick={(e)=>emotionFilter(e, "happy")}>행복</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-3" onClick={(e)=>emotionFilter(e, "sad")}>슬픔</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-4" onClick={(e)=>emotionFilter(e, "anger")}>분노</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <div className="dialogue"/*채팅 대화 구현*/>
                            <Element className='chat-wrapper' id="chat">
                                <div className='display-container'>
                                    <ul className='chatting-list'>
                                        {dial2.map(dialogue =>
                                            <li className={dialogue.speaker_seq === minutes.speaker_seq ? "chat-mine" : "chat-other"} key={dialogue.vr_id}>
                                                {nameList && nameList.filter(data => data.speaker_seq===dialogue.speaker_seq).map(data =>
                                                <span className='chat-profile' key={data.speaker_seq} onContextMenu={(e)=>{openCtxtProf(e); setSpkSeq(dialogue.speaker_seq)}}>
                                                    <div id="prof-menu">
                                                        <ul>
                                                            <li className="dropdown-item" onClick={setSpeaker}>'나'로 지정하기</li>
                                                        </ul>
                                                    </div>
                                                    <span className='chat-user' onClick={() => {setNameModal(dialogue.vr_id); setSpkSeq(dialogue.speaker_seq);}}>
                                                        <Highlighter
                                                            highlightClassName="YourHighlightClass"
                                                            searchWords={[search]}
                                                            autoEscape={true}
                                                            textToHighlight={data.speaker_name ? data.speaker_name : "참가자"+data.speaker_seq}
                                                        />
                                                    </span>
                                                    <Modal show={nameModal===dialogue.vr_id} onHide={() => setNameModal()}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>참가자 이름 변경</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <h6>참가자 이름</h6>
                                                            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <button type="button" id="btn-color" className="btn-override modal-btn" onClick={(e)=>changeName(e,spkSeq)} >
                                                                변경
                                                            </button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                            {/* <img src={chatProfile} alt='any' /> */}
                                                            <span style={{fontSize: '2rem'}}>{emotion[dialogue.emotion_type].title}</span>
                                                </span>
                                                )}
                                      
                                                <Element name={dialogue.vr_start.split(".")[0]} className='chat-msg' onClick={()=>moveAudio(dialogue.vr_start.split(".")[0])}
                                                      onContextMenu={(e)=>{openCtxt(e); setStart(dialogue.vr_start.split(".")[0]); setEnd(dialogue.vr_end.split(".")[0]); setDial(dialogue.vr_text); setVrSeq(dialogue.vr_seq)}}>
                                                    <Highlighter
                                                    highlightClassName="YourHighlightClass"
                                                    searchWords={[search]}
                                                    autoEscape={true}
                                                    textToHighlight={dialogue.vr_text}
                                                />
                                                </Element>
                                                <span className='chat-time'><Highlighter
                                                    highlightClassName="YourHighlightClass"
                                                    searchWords={[search]}
                                                    autoEscape={true}
                                                    textToHighlight={changeTime(dialogue.vr_start.split(".")[0])}
                                                /></span>
                                                <div id="chat-menu">
                                                    <ul>
                                                        <li className="dropdown-item" onClick={()=>setShowBm(dialogue.vr_id)}>북마크</li>
                                                        <NewBm showBm={showBm===dialogue.vr_id} setShowBm ={setShowBm} mn_id={mnId} start={start} end={end}/>
                                                        <li className="dropdown-item" onClick={() => setDialModal(dialogue.vr_id)}>대화 수정</li>
                                                        <Modal show={dialModal===dialogue.vr_id} onHide={() => setDialModal()}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>대화 수정</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <h6>변경할 내용을 입력해주세요</h6>
                                                            <textarea className="chat-txtarea" placeholder="" cols="60" rows="10" value={dial ? dial : ""} onChange={(e)=>setDial(e.target.value)}></textarea>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <button type="button" id="btn-color" className="btn-override modal-btn" onClick={(e)=>changeDial(e, vrSeq)} >
                                                                저장
                                                            </button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                    </ul>
                                                </div>
                                            </li>
                                        )}
                                    </ul>                     
                                </div>
                            </Element>
                        </div>
                        </div>
                        <div className="side-func">
                            <div className="bookmark">
                                <div style={{ display: "flex"}}>
                                    <h5 style={{ flexGrow: 1}}>북마크</h5>
                                </div>
                                <hr id="log-hr" />
                                <div className="bookmark-detail">
                                    {bookmarkList= bookmark.map((bookmark) =>
                                        <Bookmark key={bookmark.bm_seq} bm_seq={bookmark.bm_seq} bm_name={bookmark.bm_name} bm_start={bookmark.bm_start} bm_end={bookmark.bm_end} mn_id={bookmark.mn_id} bookmarkOperate={bookmarkOperate}/>
                                    )}
                                </div>
                            </div>
                            <div className="memo">
                                <h5>메모</h5>
                                <hr id="log-hr" />
                                <textarea placeholder="여기에 메모하세요" cols="35" rows="10" value={memo ? memo : ""} onChange={(e)=>setMemo(e.currentTarget.value)}></textarea>
                                <button type="submit" id="btn-color" onClick={onEditLogHandler} className="memo-btn" >저장</button>
                            </div>
                        </div>

                    </div>
                    {!isUpload && <div className="voice-play">
                        <button type="button" id="btn-color" className="participant-btn" onClick={() => setParticipant(true)}>
                            음성 파일 업로드
                        </button>
                        <Modal show={participant} onHide={() => setParticipant(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>참가자 수를 입력해주세요</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6>참가자 수</h6>
                                <input type="number" className="form-control" id="directory-name" value={pNum} onChange={(e) => setPNum(e.target.value)} />
                            </Modal.Body>
                            <Modal.Footer>
                                <label id="btn-color" className="voice-btn" htmlFor="input-file">파일 업로드</label>
                                <input type="file" id="input-file" style={{display: "none"}}
                                       accept="audio/*"
                                       onChange={(e)=>{onAudioHandler(e); }}/>  
                                
                            </Modal.Footer>
                        </Modal>
                    </div>}
                    {isUpload && <AudioPlayer
                        src={path}   //test audio
                        ref={playerInput}
                        volume={0.5}
                        style={{marginBottom: "40px", width: "76%", border:"1px solid #E0BFE6", boxShadow: "none", borderRadius:"0"}}
                        customAdditionalControls={[]}  
                    />                  
                    }

                </div>
            </div>
        </div>
    );
}

export default Log;


