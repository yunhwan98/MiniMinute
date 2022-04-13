import React from "react";
import Header from "../components/Header";
import SidebarLog from "../components/Sidebar_log";

function New_log(){
    return (
        <div>
            <Header/>
            <div className="main">
                <SidebarLog/>
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
                        <label id="btn-color" className="voice-btn" for="input-file">음성 파일 업로드</label>
                        <input type="file" id="input-file" style={{display:"none"}}
                               accept="audio/*"
                               onChange={null}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default New_log;