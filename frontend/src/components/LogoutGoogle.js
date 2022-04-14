import { GoogleLogout } from 'react-google-login';
import {gapi} from 'gapi-script';
const clientId = "1064677249953-799g6ker89ntqd3kfq2kpce60saut59u.apps.googleusercontent.com"
export default function LogoutGoogle(props){


    const onSuccess = () => {
      console.log('Logout');
    }
    return(
        <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
        >
        </GoogleLogout>
    );
    
}