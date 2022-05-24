import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import {Modal} from "react-bootstrap";
import url from '../api/axios';

export default function Log_card({dr_id, dr_name, mn_id, mn_title, mn_date, mn_explanation, like}) {
    const drId = dr_id ? dr_id : "1";
    const drName = dr_name ? dr_name : "home";
    const [move, setMove] = useState(false);
    const [dr_info, setDr_info] = useState([]);
    const [checked, setChecked] = useState(""); //체크된 디렉토리 id
    let fav=like;

    //회의록 삭제
    const delMn = (e) => {
        e.preventDefault();

        url.delete(
            `/minutes/${mn_id}`)
            .then((response) => {
                console.log("회의록 삭제 성공");
                alert("회의록이 삭제되었습니다!");
                window.location.reload();   //새로고침
            })
            .catch((error) => {
                console.log("회의록 삭제 실패 "+ error);
            })
    }

    //디렉토리 목록 조회(디렉토리 이동 모달)
    useEffect(() => {
        url.get(
            "/directorys/lists")
            .then((response) => {
                setDr_info(response.data);
            })
            .catch((error) => {
                console.log("디렉토리 목록 불러오기 실패 "+error)
            })
    },[move])

    const handleChecked = (e) => {
        console.log(e.target.value);
        setChecked(e.target.value);
    }

    //회의록 이동
    const moveMn = () => {

        url.put(
            `/minutes/${mn_id}`,
            {"dr_id": checked})
            .then((response) =>{
                console.log("회의록 이동");
                setMove(false);
                alert("회의록이 이동되었습니다!");
                window.location.reload();   //새로고침
            })
    }

    const favorite = () => {
        if (fav) {  //이미 즐겨찾기
            url.put(`/minutes/${mn_id}`, {
                "is_like": false
            }).then((response) => {
                fav=false;
                console.log("즐겨찾기에서 제외됐습니다!");
                window.location.reload();
                })
                .catch((error)=>{
                    console.log("즐겨찾기에서 제외 fail: "+error);
                })
        }
        else {
            url.put(`/minutes/${mn_id}`, {
                "is_like": true
            }).then((response) => {
                fav=true;
                console.log("즐겨찾기됐습니다!");
                window.location.reload();
                })
                .catch((error)=>{
                    console.log("즐겨찾기 추가 fail: "+error);
                })
        }
    }

    const defaultDir = dr_info.filter(dr_info => `${dr_info.dr_id}` > 1); //디렉토리 번호 1 이상(기본 디렉토리 제외)

    return (
        <div>
            <div id="card-override" className="card" style={{width: "18rem"}}>
                <div className="card-btn">
                    <button className="none-btn del-mn" onClick={delMn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                             className="bi bi-trash" viewBox="0 0 16 16">
                            <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                    <button className="none-btn move-mn" onClick={() => setMove(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                         className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd"
                              d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                    </button>
                    <Modal show={move} onHide={() => setMove(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>회의록 이동하기</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5>디렉토리 목록</h5>
                            <div className="radio-dr">
                                {defaultDir.map(result =>
                                <label className="radio-label" key={result.dr_id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor"
                                         className="bi bi-folder2-open" viewBox="0 -2 16 17">
                                        <path
                                            d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
                                    </svg>
                                    <input type="radio"
                                           value={result.dr_id}
                                           checked={checked === `${result.dr_id}`}
                                           onChange={handleChecked}
                                    />
                                    {result.dr_name}</label>
                                )}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" id="btn-color" className="modal-btn"
                                    onClick={moveMn}>
                                이동
                            </button>
                        </Modal.Footer>
                    </Modal>

                </div>
                <Link to={`/${drId}/${mn_id}/log`} className="card-link">
                    <div className="card-body">
                        <h5 className="card-title">📚&nbsp;회의주제</h5>
                        <p className="card-text">{mn_title}</p>
                        <h5 className="card-title">⏳&nbsp;회의시간</h5>
                        <p className="card-text">{mn_date}</p>
                        <h5 className="card-title">📝&nbsp;메모</h5>
                        <p className="card-text">{mn_explanation}</p>
                    </div>
                </Link>
                <div>
                    <button className="none-btn favorite" onClick={favorite}>
                        {!fav && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#F46EAF"
                                      className="bi bi-heart" viewBox="0 0 16 16">
                            <path
                                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                        </svg>}
                        {fav && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#F46EAF"
                                     className="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>}
                    </button>
                </div>
            </div>                       
        </div>
    );

}