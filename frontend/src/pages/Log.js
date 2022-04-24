import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import SidebarLog from "../components/Sidebar_log";
import {useParams} from "react-router-dom";
import url from '../api/axios';

function Log(){
    let params = useParams();  //url로 정보받아오기  
    console.log(params);
    const dr_id = params.dr_id;
    const dr_name = params.dr_name;
    const mn_id = params.mn_id;
    const [memo,setMemo] = useState("");    //메모

    const onMemodHandler = (event) => {
        setMemo(event.currentTarget.value);
    }
    const onClick =(event) => {
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
            console.log(response.data.mn_memo);
            setMemo(response.data.mn_memo);
            alert('회의록 정보 불러오기');
            })
            .catch((error) => { //오류메시지 보이게 함
            console.log(error.response);
            });       
      }, []);

    return (
        <div>
            <Header/>
            <div className="main">
                <SidebarLog dr_name={dr_name} dr_id={dr_id} mn_id={mn_id}/>
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
                            </div>
                            <div className="keyword">
                                <h5>주요 키워드</h5>
                                <hr id="log-hr" />
                            </div>
                            <div className="memo">
                                <h5>메모</h5>
                                <hr id="log-hr" />
                                <textarea placeholder="여기에 메모하세요" cols="35" rows="10" value={memo} onChange={onMemodHandler}></textarea>
                            </div>
                            
                        </div>
                        <div><button type="submit"  onClick={onClick} className="submit-btn" /*저장버튼*/>저장</button></div>   
                        
                    </div>
                    <div className="voice-play">
                        <label id="btn-color" className="voice-btn" htmlFor="input-file">음성 파일 업로드</label>
                        <input type="file" id="input-file" style={{display:"none"}}
                               accept="audio/*"
                               onChange={null}/>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Log;