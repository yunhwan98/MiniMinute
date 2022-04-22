import React from "react";
import Header from "../components/Header";
import SidebarLog from "../components/Sidebar_log";
import {useParams} from "react-router-dom";

function Log(){
    let params = useParams();  //url로 정보받아오기
    console.log(params);
    const dr_id = params.dr_id;
    const dr_name = params.dr_name;
    const mn_id = params.mn_id;

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
                                <textarea placeholder="여기에 메모하세요" cols="35" rows="10"></textarea>
                            </div>
                        </div>
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