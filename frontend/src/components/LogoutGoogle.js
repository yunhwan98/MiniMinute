import { GoogleLogout } from 'react-google-login';
import {gapi} from 'gapi-script';
const clientId = "1064677249953-799g6ker89ntqd3kfq2kpce60saut59u.apps.googleusercontent.com"

//구글 로그아웃  
export default function LogoutGoogle(props){

  const onLogout = () => {
    if (window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2 !== null) {
        auth2
          .signOut()
          .then(auth2.disconnect())
          .catch(e => console.log(e));
        props.setaccessToken('');
      }
    }
    }
    return(
      <button type="button" onClick={onLogout} />
    );
    
}