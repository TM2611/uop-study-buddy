// login.tsx
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [error, setError] = useState(null);

  const handleSuccess = async (credentialResponse: any) => {
    const decodedToken = jwtDecode(credentialResponse.credential);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(decodedToken),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error('An error occurred while logging in:', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div>
      <div>Login Test</div>
      {error && <div className="error">{error}</div>}
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default LoginPage;