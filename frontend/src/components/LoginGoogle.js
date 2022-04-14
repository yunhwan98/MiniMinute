import React, {useState} from "react";
import GoogleLogin from 'react-google-login';

const clientId = "1064677249953-799g6ker89ntqd3kfq2kpce60saut59u.apps.googleusercontent.com"

export default function LoginGoogle(props){
const onSuccess = (response) => {
  console.log(response);
  console.log(response.tokenId);
  props.setaccessToken(response.tokenId);
  props.handleClose();
}
const onFailure = (response) => {
    console.log(response);
  }

    return(
        <div id="GoogleLogin">
        <GoogleLogin 
            clientId={clientId}
            buttonText="구글 로그인"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
        />
        </div>
    );

}