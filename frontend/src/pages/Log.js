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
import happy from '../images/happy.png';
import Add_bm from '../images/Add_bm2.png';
import { createRoot } from "react-dom/client";
import Highlighter from "react-highlight-words";
import Scroll from 'react-scroll';

function Log(){
    let Element = Scroll.Element;
    let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;
    const mnId = params.mn_id;
    const [memo,setMemo] = useState("");    //메모
    const [file, setFile] = useState("");   //file id
    const [isUpload, setIsUpload] = useState(false);
    const [path, setPath] = useState(""); //파일 url
    const [dialogue, setDialogue] = useState([]);   //대화
    const [bookmark, setBookmark] = useState([]);   //북마크 리스트
    const [showBm, setShowBm] = useState(false);    //북마크모달
    const [participant, setParticipant] = useState(false);  //참가자 모달
    const [pNum, setPNum] = useState("");   //참가자 수
    const [keyword, setKeyword] = useState([]);   //키워드 리스트
    const [chat, setChat] = useState([]);   //키워드 리스트
    const [start,setStart] = useState("");
    const [end,setEnd] = useState("");
    const [nameModal, setNameModal] = useState(false);
    const [name, setName] = useState("");
    const [dialModal, setDialModal] = useState(false);  //대화 수정
    const [dial, setDial] = useState("");
    const playerInput = useRef();
    const [search, setSearch] = useState('');   //검색어


    const onEditLogHandler =(event) => {
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

    useEffect(() => { // 처음에만 정보 받아옴
        url.get(     
            `/minutes/${mnId}`
            )
            .then((response) => {
            console.log('회의록 정보 불러오기');
            console.log(response.data);
            setFile(response.data.file_id);
            setMemo(response.data.mn_memo);
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });       
      }, []);

    useEffect(() => {
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
   //let bookmarkList = bookmark.map((bookmark) => (<li key={bookmark.bm_seq}>{bookmark.mn_id}</li>));
    let keywordList = [];

    useEffect(() => {   //파일 불러오기
        url.get(
            `/files/${file}`)   //이상한 데이터 return
            .then((response) => {
                console.log(response);
                console.log("파일 조회 성공")
                setIsUpload(true);
                setPath("https://storage.cloud.google.com/miniminute_voice_file/testquiz.wav?authuser=1");
                getDialogue();
            })
            .catch((error) => {
                setIsUpload(false);
                console.log("파일 조회 실패 " + error);
            })
    }, [file])

    const onAudioHandler = (e) => {
        const file = e.target.files[0];
        let type = file.name.slice(file.name.indexOf('.'), undefined);
        console.log(type);
        setParticipant(false);

        //파일 전송
        // const formData = new FormData();
        // formData.append("file", file);

        url.post(`/minutes/${mnId}/file/upload`, {
            "file_name": "testquiz",
            "file_extension": "wav",
            "file_path": "https://storage.cloud.google.com/miniminute_voice_file/testquiz.wav?authuser=1"
        })
            .then((response) => {
                console.log(response.data);
                console.log("업로드 성공");
                setIsUpload(true);
                voice_recog();
                setPath("https://storage.cloud.google.com/miniminute_voice_file/testquiz.wav?authuser=1");
            })
            .catch((error) => {
                console.log("업로드 실패 "+ error);
            });
    }

    const voice_recog = () => {
        //stt 호출
        url.post(`/voice/recognition/lists/${mnId}`)
        .then((response) => {
            console.log("stt 호출 성공");
            console.log(response);
            getDialogue();
        })
        .catch((error) => {
            console.log("stt 실패 "+ error);
        })
    }

    const getDialogue = (e) => {
        url.get(
            `/voice/recognition/lists/${mnId}`)
            .then((response) => {
                console.log("stt 결과 조회 성공");
                console.log(response.data);
                setDialogue(response.data);
            })
            .catch((error) => {
                console.log("stt 조회 실패 "+ error);
            })
    }

  
    const moveAudio = (current) => {//클릭시 시간으로 이동
        //playerInput.current.audio.current.currentTime = 3;    
        let start = parseInt(current.slice(0,1))*3600 +  parseInt(current.slice(2,4)) * 60 + parseInt(current.slice(5,7)); //

        playerInput.current.audio.current.currentTime = start;
        playerInput.current.audio.current.play();   //오디오객체에 접근해서 플레이 조작

    }

    const bookmarkOperate = (current,current2) => {//클릭시 시간으로 이동
        //playerInput.current.audio.current.currentTime = 3;    
        let start = parseInt(current.slice(0,1))*3600 +  parseInt(current.slice(2,4)) * 60 + parseInt(current.slice(5,7)); //
        let end = parseInt(current2.slice(0,1))*3600 +  parseInt(current2.slice(2,4)) * 60 + parseInt(current2.slice(5,7));
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

        menu.style.display = "block";
        menu.style.top = e.pageY+"px";
        menu.style.left = e.pageX+"px";
    }

    const closeCtxt = (e) => {
      const menu = document.getElementById("chat-menu");

      if (menu) menu.style.display = "none";
    }

    //다른 곳 클릭 시 메뉴 닫힘
    document.addEventListener("click", closeCtxt, false);

    const changeName = (e) => { //참가자 이름 변경
        e.preventDefault();
        console.log(name+" 으로 이름 변경");
    }

    const changeDial = (e) => {
        e.preventDefault();
        console.log(dial+" 으로 대화 내용 변경");
    }
    
    const addSpeaker=(e)=>{ //선택한 수만큼 화자 추가
        let num = parseInt(pNum);

        for(let i=0 ;i<num;i++){
            console.log(num);
            url.post(
                `/minutes/${mnId}/speaker/lists`,{})
                .then((response) => {
                    console.log('성공'+response.data);
                })
                .catch((error) => {
                    console.log("실패 "+ error);
                })
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
                                    <Nav.Link id="nav-link" eventKey="link-1">전체</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-2">행복</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-3">슬픔</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-4">분노</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <div className="dialogue"/*채팅 대화 구현*/>
                            <Element className='chat-wrapper' id="chat">
                                <div className='display-container'>
                                    <ul className='chatting-list'>
                                        {dialogue.map(dialogue =>
                                            <li className="chat-other" key={dialogue.vr_id}>
                                                <span className='chat-profile'>
                                                    <span className='chat-user' onClick={() => setNameModal(true)}>
                                                        <Highlighter
                                                        highlightClassName="YourHighlightClass"
                                                        searchWords={[search]}
                                                        autoEscape={true}
                                                        textToHighlight={'참가자' + dialogue.vr_id}
                                                    />
                                                    </span>
                                                    <Modal show={nameModal} onHide={() => setNameModal(false)}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>참가자 이름 변경</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <h6>참가자 이름</h6>
                                                            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <button type="button" id="btn-color" className="btn-override modal-btn" onClick={changeName} >
                                                                생성
                                                            </button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                    {/* <img src={chatProfile} alt='any' /> */}
                                                    <span style={{fontSize: '2rem'}}>😄</span>
                                                </span>
                                                <Element name={dialogue.vr_start.slice(undefined, 7)} className='chat-msg' onClick={()=>moveAudio(dialogue.vr_start.slice(undefined, 7))}
                                                      onContextMenu={(e)=>{openCtxt(e); setStart(dialogue.vr_start.slice(undefined, 7)); setEnd(dialogue.vr_end.slice(undefined, 7)); setDial(dialogue.vr_text);}}>
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
                                                    textToHighlight={dialogue.vr_start.slice(undefined, 7)}
                                                /></span>
                                                <div id="chat-menu">
                                                    <ul>
                                                        <li className="dropdown-item" onClick={()=>setShowBm(true)}>북마크</li>
                                                        <NewBm showBm={showBm} setShowBm ={setShowBm} mn_id={mnId} start={start} end={end}/>
                                                        <li className="dropdown-item" onClick={() => setDialModal(true)}>대화 수정</li>
                                                        <Modal show={dialModal} onHide={() => setDialModal(false)}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>대화 수정</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <h6>변경할 내용을 입력해주세요</h6>
                                                            <textarea className="chat-txtarea" placeholder="" cols="60" rows="10" value={dial ? dial : ""} onChange={(e)=>setDial(e.target.value)}></textarea>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <button type="button" id="btn-color" className="btn-override modal-btn" onClick={changeDial} >
                                                                저장
                                                            </button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                    </ul>
                                                </div>
                                            </li>
                                        )}

                                        <li className="chat-mine">
                                            <span className='chat-profile'>
                                                <span className='chat-user'>참가자1</span>
                                                <img src={chatProfile} alt='any' />
                                            </span>
                                            <span className='chat-msg'>안녕하십니까</span>
                                            <span className='chat-time'>03:10</span>
                                            <img src={happy} alt='any' className='chat-emo'/>
                                        </li>
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
                                       onChange={(e)=>{onAudioHandler(e); addSpeaker(e);}}/>  
                                
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