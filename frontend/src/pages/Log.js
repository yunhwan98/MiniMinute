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
import Highlighter from "react-highlight-words";
import Scroll from 'react-scroll';
import Spinner from 'react-bootstrap/Spinner'
import axios from "axios";
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
    const [addnameModal, setAddNameModal] = useState(false);
    const [name, setName] = useState("");   //참가자 이름
    const [nameList, setNameList] = useState([]);
    const [spkSeq, setSpkSeq] = useState([]);
    const [dialModal, setDialModal] = useState(false);  //대화 수정
    const [dial, setDial] = useState("");
    const [vrSeq, setVrSeq] = useState("");
    const playerInput = useRef();
    const [search, setSearch] = useState('');   //검색어
    const [dial2, setDial2] = useState([]);
    const [spinner,setSpinner] =useState(false);    //스피너 보여주기
    const [speakerModal, setSpeakerModal] =useState(false);//화자 선택 모달
    const [checked, setChecked] = useState("");

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
            `/files/${file}`)
            .then((response) => {
                console.log(response.data);
                console.log("파일 조회 성공")
                setIsUpload(true);
                setPath(`http://127.0.0.1:8000/profile/audio_file/${response.data.file_id}_${response.data.file_name}.${response.data.file_extension}`);
                // axios({
                //     method: 'GET',
                //     url: `http://127.0.0.1:8000/profile/audio_file/${response.data.file_id}_${response.data.file_name}.${response.data.file_extension}`,
                //     headers: {
                //         'Authorization': `jwt ${localStorage.getItem('token')}`
                //     },
                // })
                //     .then((res) => {
                //         const reader = new FileReader();
                //         reader.readAsDataURL(new Blob([res.data], { type: res.headers['content-type'] } ));
                //         reader.onloadend = () => {
                //             setPath(reader.result);
                //         }
                //         // console.log(res);
                //         // setPath(URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] })));
                //         // console.log(URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] })));
                //         console.log('음성파일 불러오기 성공');
                //     })
                //     .catch(e => {
                //         console.log('음성파일 불러오기 실패');
                //         console.log(e.res);
                //     })

            })
            .catch((error) => {
                setIsUpload(false);
                console.log("파일 조회 실패 " + error);
            })
    }, [file])

    const onAudioHandler = (e) => { //파일 업로드 & 오디오 보이기
        const file = e.target.files[0];
        setParticipant(false);
        const formdata =new FormData();     
        formdata.append('file',e.target.files[0]);
       
        // const reader = new FileReader();
        // reader.readAsDataURL(e.target.files[0]);
        // reader.onloadend = () => {
        //     //setPath(reader.result);
        //     //console.log(reader.result);
        // }
        console.log(file);
        
        setPath(URL.createObjectURL(new Blob([file],{ type: 'audio/wav'})));
        console.log(URL.createObjectURL(new Blob([file],{ type: 'audio/wav'})));


        setSpinner(true);
      
        url.post(`/minutes/${mnId}/file/upload`, formdata)
            .then((response) => {
                console.log(response.data);
                alert("업로드 성공!\n텍스트 변환까지 시간이 걸릴 수 있습니다.");
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
            getEmotion();
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
            })
            .catch((error) => {
                console.log("stt 조회 실패 "+ error);
            })
    }, [isUpload, dialModal, nameModal, speakerModal])

    const moveAudio = (current) => {//클릭시 시간으로 이동
        let start =current;
        playerInput.current.audio.current.currentTime = start;
        playerInput.current.audio.current.play();   //오디오객체에 접근해서 플레이 조작

    }

    const bookmarkOperate = (current,current2) => {//클릭시 시간으로 이동
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
            })
            .catch((error) => {
                console.log("화자 list 조회 fail: "+error);
            })
    }, [nameModal,dialogue])

    const setSpeaker = (e) => { //회의록 화자 설정
        e.preventDefault();

        url.put( `/minutes/${mnId}`, {
            "speaker_seq": spkSeq
        })
            .then((response) => {
                console.log("화자 설정 성공");
                console.log(response);
                getSummary();
            })
            .catch((error) => {
                console.log("화자 설정 실패: "+error);
            })
    }

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
                window.location.reload();
            })
            .catch((error)=>{
                console.log("키워드 생성 실패: "+error);
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
                setAddNameModal(false);
            })
            .catch((error)=>{
                console.log("참가자 이름 변경 실패: "+error);
            })
    }

    const changeSpeaker = (e, vr_seq) => {  //이 대화의 화자만 변경
        e.preventDefault();
        let spk = parseInt(checked);
        console.log(vr_seq);

        url.put(
            `/voice/recognition/${mnId}/${vr_seq}`, {
                "speaker_seq": spk
            })
            .then((response) => {
                console.log("화자 변경 성공");
                console.log(response);
                setSpeakerModal(false);

            })
            .catch((error)=>{
                console.log("화자 변경 실패: "+error);
            })
    }

    const addSpeaker = (e) => { //화자 추가
        url.post(
            `/minutes/${mnId}/speaker/lists`, {

            })
            .then((response) => {
                console.log(response.data);
                
                alert('화자가 추가되었습니다.');
                changeName(e, response.data.speaker_seq);//참가자 이름변경
            
            })
            .catch((error) => {
                console.log("실패 " + error);
                alert('화자 추가실패')
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
                setIsUpload(true);
                setSpinner(false);
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
            <Header_log setSearch={setSearch} />
            <div className="main">
                <SidebarLog dr_id={dr_id} mn_id={mnId} memo={memo} />
                <div className="article">
                    <div style={{ display: "flex" }} className="fade-in">
                        <div style={{ flex: 2 }}>
                            <div style={{ display: "flex", alignItems: "flex-start"}}>
                                <h5><b>회의 전문</b></h5>
                                <button type="button" className="none-btn" onClick={()=>{setSpinner(true); getEmotion()}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
                                    </svg>
                                </button>
                            </div>
                            <Nav justify id="nav-log" variant="tabs" defaultActiveKey="/home">
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-1" onClick={(e) => emotionFilter(e, "all")}>전체</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-2" onClick={(e) => emotionFilter(e, "happy")}>행복</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-3" onClick={(e) => emotionFilter(e, "sad")}>슬픔</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link id="nav-link" eventKey="link-4" onClick={(e) => emotionFilter(e, "anger")}>분노</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <div className="dialogue"/*채팅 대화 구현*/>
                                <Element className='chat-wrapper' id="chat">
                                    {spinner ?
                                        (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%" }}>
                                            <Spinner animation="border" size="m" />
                                        </div>) :
                                        (<div className='display-container'>
                                            <ul className='chatting-list'>
                                                {dial2.map(dialogue =>
                                                    <li className={dialogue.speaker_seq === minutes.speaker_seq ? "chat-mine" : "chat-other"} key={dialogue.vr_id}>
                                                        {nameList && nameList.filter(data => data.speaker_seq === dialogue.speaker_seq).map(data =>
                                                            <span className='chat-profile' key={data.speaker_seq} onContextMenu={(e) => { openCtxtProf(e); setSpkSeq(dialogue.speaker_seq); setVrSeq(dialogue.vr_seq) }}>
                                                                <div id="prof-menu">
                                                                    <ul>
                                                                        <li className="dropdown-item" onClick={setSpeaker}>'나'로 지정하기</li>
                                                                        <li className="dropdown-item" onClick={()=>setSpeakerModal(dialogue.vr_seq)}>화자 변경</li>        
                                                                        <li className="dropdown-item" onClick={()=>setAddNameModal(dialogue.vr_id)}>화자 추가</li>
                                                                        <Modal show={speakerModal === dialogue.vr_seq} onHide={() => setSpeakerModal(false)}>
                                                                            <Modal.Header closeButton>
                                                                                <Modal.Title>화자 선택하기</Modal.Title>
                                                                            </Modal.Header>
                                                                            <Modal.Body>
                                                                            <h5>화자 목록</h5>
                                                                                <div className="radio-dr">
                                                                                    {nameList.map(result =>
                                                                                        <label className="radio-label" key={result.speaker_seq}>
                                                                                            <input type="radio"
                                                                                                   value={result.speaker_seq}
                                                                                                   checked={checked === `${result.speaker_seq}`}
                                                                                                   onChange={(e)=>setChecked(e.target.value)}
                                                                                            />
                                                                                        {result.speaker_name}</label>
                                                                                    )}
                                                                                </div>
                                                                            </Modal.Body>
                                                                            <Modal.Footer>
                                                                                <button type="button" id="btn-color" className="modal-btn"
                                                                                        onClick={(e)=>changeSpeaker(e, vrSeq)}>
                                                                                    변경
                                                                                </button>
                                                                        </Modal.Footer>
                                                                    </Modal>
                                                                    </ul>
                                                                </div>
                                                                <span className='chat-user' onClick={() => { setNameModal(dialogue.vr_id); setSpkSeq(dialogue.speaker_seq); }}>
                                                                    <Highlighter
                                                                        highlightClassName="YourHighlightClass"
                                                                        searchWords={[search]}
                                                                        autoEscape={true}
                                                                        textToHighlight={data.speaker_name ? data.speaker_name : "참가자" + data.speaker_seq}
                                                                    />
                                                                </span>
                                                                <Modal show={nameModal === dialogue.vr_id} onHide={() => setNameModal()}>
                                                                    <Modal.Header closeButton>
                                                                        <Modal.Title>참가자 이름 변경</Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body>
                                                                        <h6>참가자 이름</h6>
                                                                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                                                    </Modal.Body>
                                                                    <Modal.Footer>
                                                                        <button type="button" id="btn-color" className="btn-override modal-btn" onClick={(e) => changeName(e, spkSeq)} >
                                                                            변경
                                                                        </button>
                                                                    </Modal.Footer>
                                                                </Modal>
                                                                <Modal show={addnameModal === dialogue.vr_id} onHide={() => setAddNameModal()}> 
                                                                    <Modal.Header closeButton>
                                                                        <Modal.Title>참가자 이름 추가</Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body>
                                                                        <h6>참가자 이름</h6>
                                                                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                                                    </Modal.Body>
                                                                    <Modal.Footer>
                                                                        <button type="button" id="btn-color" className="btn-override modal-btn" onClick={(e) => addSpeaker(e)} >
                                                                            변경
                                                                        </button>
                                                                    </Modal.Footer>
                                                                </Modal>
                                                                {/* <img src={chatProfile} alt='any' /> */}
                                                                <span style={{ fontSize: '2rem' }}>{emotion[dialogue.emotion_type] && emotion[dialogue.emotion_type].title}</span>
                                                            </span>
                                                        )}

                                                        <Element name={dialogue.vr_start.split(".")[0]} className='chat-msg' onClick={() => moveAudio(dialogue.vr_start.split(".")[0])}
                                                            onContextMenu={(e) => { openCtxt(e); setStart(dialogue.vr_start.split(".")[0]); setEnd(dialogue.vr_end.split(".")[0]); setDial(dialogue.vr_text); setVrSeq(dialogue.vr_seq) }}>
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
                                                                <li className="dropdown-item" onClick={() => setShowBm(dialogue.vr_id)}>북마크</li>
                                                                <NewBm showBm={showBm === dialogue.vr_id} setShowBm={setShowBm} mn_id={mnId} start={start} end={end} />
                                                                <li className="dropdown-item" onClick={() => setDialModal(dialogue.vr_id)}>대화 수정</li>
                                                                <Modal show={dialModal === dialogue.vr_id} onHide={() => setDialModal()}>
                                                                    <Modal.Header closeButton>
                                                                        <Modal.Title>대화 수정</Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body>
                                                                        <h6>변경할 내용을 입력해주세요</h6>
                                                                        <textarea className="chat-txtarea" placeholder="" cols="60" rows="10" value={dial ? dial : ""} onChange={(e) => setDial(e.target.value)}></textarea>
                                                                    </Modal.Body>
                                                                    <Modal.Footer>
                                                                        <button type="button" id="btn-color" className="btn-override modal-btn" onClick={(e) => changeDial(e, vrSeq)} >
                                                                            저장
                                                                        </button>
                                                                    </Modal.Footer>
                                                                </Modal>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>)}
                                </Element>
                            </div>
                            {!isUpload && <div className="voice-play">
                                <button type="button" id="btn-color" className="participant-btn" onClick={() => setParticipant(true)}>
                                    음성 파일 업로드
                                </button>
                                <Modal show={participant} onHide={() => setParticipant(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>참가자 수</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <h6>회의 참가자 수를 입력해주세요</h6>
                                        <input type="number" className="form-control" id="directory-name" value={pNum} onChange={(e) => setPNum(e.target.value)} />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <label id="btn-color" className="voice-btn" htmlFor="input-file">파일 업로드</label>
                                        <input type="file" id="input-file" style={{ display: "none" }}
                                            accept="audio/*"
                                            onChange={(e) => { onAudioHandler(e); }} />

                                    </Modal.Footer>
                                </Modal>
                            </div>}
                            {isUpload && <AudioPlayer
                                src={path}
                                ref={playerInput}
                                volume={0.5}
                                style={{ marginBottom: "40px", width: "100%", boxShadow: "0px 1px 4px 0.5px rgb(0 0 0 / 8%)", borderRadius: "5px" }}
                                customAdditionalControls={[]}
                            />              
                            }
                        </div>
                        <div className="side-func">
                            <div className="bookmark">
                                <div style={{ display: "flex" }}>
                                    <h5 style={{ flexGrow: 1 }}>북마크</h5>
                                </div>
                                <hr id="log-hr" />
                                <div className="bookmark-result" style={{height: '80%'}}>
                                <div className="bookmark-detail">
                                    {bookmarkList = bookmark.map((bookmark) =>
                                        <Bookmark key={bookmark.bm_seq} bm_seq={bookmark.bm_seq} bm_name={bookmark.bm_name} bm_start={bookmark.bm_start} bm_end={bookmark.bm_end} mn_id={bookmark.mn_id} bookmarkOperate={bookmarkOperate} />
                                    )}
                                </div>
                                </div>
                            </div>
                            <div className="memo">
                                <h5>메모</h5>
                                <hr id="log-hr" />
                                <textarea className="memo-result" placeholder="여기에 메모하세요" cols="35" rows="10" value={memo ? memo : ""} onChange={(e) => setMemo(e.currentTarget.value)}></textarea>
                                <button type="submit" id="btn-color" onClick={onEditLogHandler} className="memo-btn" >저장</button>
                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    );
}

export default Log;


