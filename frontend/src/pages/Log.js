import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {google} from "@google-cloud/speech/build/protos/protos";
import Header from "../components/Header";
import SidebarLog from "../components/Sidebar_log";
import url from '../api/axios';
import Table from 'react-bootstrap/Table'
import Bookmark from "../components/bookmark";

function Log(){
    let params = useParams();  //url로 정보받아오기
    const dr_id = params.dr_id;
    const mn_id = params.mn_id;
    const [memo,setMemo] = useState("");    //메모
    const [isUpload, setIsUpload] = useState(false);
    const [audio, setAudio] = useState(""); //파일 url
    const [dialogue, setDialogue] = useState("");   //대화
    const [bookmark, setBookmark] = useState([]);
    


    const onMemoHandler = (event) => {
        setMemo(event.currentTarget.value);
    }
    const onEditLogHandler =(event) => {
        event.preventDefault();
        url.put(
            `/minutes/${mn_id}`,{
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
            `/minutes/${mn_id}`
            )
            .then((response) => {
            console.log('회의록 정보 불러오기');
            console.log(response.data.mn_memo);
            setMemo(response.data.mn_memo);
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });       
      }, []);

    useEffect(() => {
        url.get(
            `/minutes/${mn_id}/bookmark/lists`)
            .then((response) => {
                console.log(response.data);
                setBookmark(response.data);
            })
            .catch((error) => {
                console.log("북마크 목록 불러오기 실패 "+error)
            })
    },[])
    
    let bookmarkList =[]; 
   //let bookmarkList = bookmark.map((bookmark) => (<li key={bookmark.bm_seq}>{bookmark.mn_id}</li>));

    const onAudioHandler = (e) => {
        const file = e.target.files[0];
        let type = file.name.slice(file.name.indexOf('.'), undefined);
        console.log(type);
        setIsUpload(true);
        setAudio("https://docs.google.com/uc?export=open&id=1glavx1db3_NMDUQgzmvPdP57UdaFXfVH");

        //파일 전송
        const formData = new FormData();
        formData.append("file", file);

        // url.post(`/minutes/${mn_id}/file/upload`, formData)
        //     .then((response) => {
        //         console.log(response.data);
        //         console.log(response.data.location);
        //         setAudio(response.data.location);
        //         console.log("업로드 성공");
        //     })
        //     .catch((error) => {
        //         console.log("업로드 실패 "+ error);
        //     });

    }

    //stt api 호출
    // useEffect(() => {
    //     axios.get("https://speech.googleapis.com/v1p1beta1/speech:recognize", {
    //         "audio": {
    //             "content": audio
    //         },
    //         "config": {
    //             "enableAutomaticPunctuation": false,
    //             "encoding": "LINEAR16",
    //             "languageCode": "ko-KR",
    //             "model": "default"
    //         }
    //     })
    //         .then((response) => {
    //             console.log(response.data);
    //             setDialogue(response.data);
    //         })
    //         .catch((error) => {
    //             console.log("api 호출 실패 "+error);
    //         })
    // }, [isUpload])

    return (
        <div>
            <Header/>
            <div className="main">
                <SidebarLog dr_id={dr_id} mn_id={mn_id} memo={memo}/>
                <div className="article">
                    <div style={{display: "flex"}}>
                        <div>
                            <h5>회의 전문</h5>
                            <div className="dialogue">

                            </div>
                        </div>
                        <div className="side-func">
                            <div className="bookmark">
                                <h5>북마크</h5>
                                <hr id="log-hr" />
                                {bookmarkList= bookmark.map((bookmark) =>

                                            <Bookmark key={bookmark.bm_seq} bm_seq={bookmark.bm_seq} bm_name={bookmark.bm_name} bm_start={bookmark.bm_start} bm_end={bookmark.bm_end} mn_id={bookmark.mn_id} />                                                   
                                )}
                            </div>
                            <div className="keyword">
                                <h5>주요 키워드</h5>
                                <hr id="log-hr" />
                            </div>
                            <div className="memo">
                                <h5>메모</h5>
                                <hr id="log-hr" />
                                <textarea placeholder="여기에 메모하세요" cols="35" rows="10" value={memo ? memo : ""} onChange={onMemoHandler}></textarea>
                            </div>
                            
                        </div>
                        <div><button type="submit"  onClick={onEditLogHandler} className="submit-btn" /*저장버튼*/>저장</button></div>   
                        
                    </div>
                    {!isUpload && <div className="voice-play">
                        <label id="btn-color" className="voice-btn" htmlFor="input-file">음성 파일 업로드</label>
                        <input type="file" id="input-file" style={{display: "none"}}
                               accept="audio/*"
                               onChange={onAudioHandler}/>
                    </div>}
                    {isUpload && <AudioPlayer
                        src={audio}   //test audio
                        style={{marginBottom: "40px", width: "74%", border:"1px solid #E0BFE6", boxShadow: "none", borderRadius:"0"}}
                        customAdditionalControls={[]}
                    />}
                </div>
            </div>
        </div>
    );
}

export default Log;