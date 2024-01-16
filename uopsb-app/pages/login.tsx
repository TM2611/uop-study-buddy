import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const handleSuccess = (credentialResponse: any) => {
    console.log(credentialResponse);

    // Decode the ID token and extract the user's email
    const decodedToken = jwtDecode(credentialResponse.credential);
    // const userEmail = decodedToken.email;
    // console.log('User email:', userEmail);
    console.log(decodedToken);
    
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div>
      {/* Other login components */}
      <div>Login Test</div>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default LoginPage;