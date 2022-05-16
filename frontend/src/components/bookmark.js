import * as React from 'react';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import url from '../api/axios';
import Scroll from 'react-scroll';
import {Modal} from "react-bootstrap";
import {useState} from "react";

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));




export default function InteractiveList({bm_seq, mn_id, bm_name, bm_start, bm_end, bookmarkOperate}) {
    let scroller = Scroll.scroller;
    const [editModal, setEditModal] = useState(false);
    const [name, setName] = useState("");

    const delBm = (e) => {
        e.preventDefault();
        url.delete(
            `/minutes/${mn_id}/bookmark/${bm_seq}`)
            .then((response) => {
                console.log("북마크 삭제 성공");
                alert("북마크가 삭제되었습니다!");
                window.location.reload();   //새로고침
            })
            .catch((error) => {
                console.log("북마크 삭제 실패 "+ error);
            })
    }

    const bookmarkHandler =()=>{    //클릭시 북마크 시작
        bookmarkOperate(bm_start,bm_end);

        scroller.scrollTo(bm_start, {
            smooth: true,
            duration: 1500,
            delay: 100,
            containerId: "chat",
            offsetTop: 0
        })
    }

    const editBm = (e) => {
        e.preventDefault();

        url.put(`/minutes/${mn_id}/bookmark/${bm_seq}`, {
            "bm_name": name
        })
            .then((response)=>{
                console.log("bookmark edit success");
                setEditModal(false);
                window.location.reload();
            })
            .catch((error)=>{
                console.log("bookmark edit fail: "+error);
                alert("이름을 입력해주세요!")
            })
    }

    const changeTime =(time)=>{ //시간형식으로 변환
        
        let hour = Math.floor(parseInt(time)/3600);
        let minute = Math.floor(parseInt(time)%3600/60);
        let second =  Math.floor(parseInt(time)%60);
    
        let result=hour.toString().padStart(2,0) + ':' + minute.toString().padStart(2,0)+ ':' +second.toString().padStart(2,0);
    
        return result
    }

  return (
      <ListItem onClick={()=>bookmarkHandler()}

          secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={delBm}>
                  <DeleteIcon  />
              </IconButton>
          }
      >
          <ListItemText
              primary={bm_name}
              secondary={changeTime(bm_start) + ' - ' + changeTime(bm_end)}
          />
          <div id="bm-edit" onClick={() => setEditModal(true)}>
              <EditIcon sx={{color:"#737374"}}/>
          </div>
          <Modal show={editModal} onHide={() => setEditModal(false)}>
              <Modal.Header closeButton>
                  <Modal.Title>북마크 수정</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <h6>북마크 이름</h6>
                  <input type="text" className="form-control" id="name" onChange={(e) => setName(e.target.value)} />
              </Modal.Body>
              <Modal.Footer>
                  <button type="button" id="btn-color" className="btn-override modal-btn" onClick={editBm} >
                      저장
                  </button>

              </Modal.Footer>
          </Modal>
      </ListItem>
  );
}