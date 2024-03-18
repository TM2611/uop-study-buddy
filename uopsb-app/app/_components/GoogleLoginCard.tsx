import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginCard = () => {
  const { isLoggedIn, googleLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (credentialResponse: any) => {
    await googleLogin(credentialResponse);
    if (isLoggedIn) {
      router.push("/");
    }
  };

  const errorMessage = () => {
    console.log("Error");
  };

  return (
    <div className="py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            React Google Login
          </h2>
          <p className="text-center mb-6">
            Sign in with your UOP Google account to access all features of the
            application.
          </p>
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleLogin} onError={errorMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginCard;
