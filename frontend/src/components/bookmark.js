import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import url from '../api/axios';


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));


export default function InteractiveList({bm_seq, mn_id, bm_name, bm_start, bm_end}) {

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

  return (
      <ListItem

          secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={delBm}>
                  <DeleteIcon  />
              </IconButton>
          }
      >
          <ListItemText
              primary={bm_name}
              secondary={bm_start + ' - ' + bm_end}
          />
      </ListItem>
  );
}