import "../styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";
import { Inter } from "next/font/google";
import Nav from "./_components/Nav";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "UOP Study Buddy",
  description: "Author: Taylor McFarlane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <AuthProvider>
            <Nav />
            <div className={inter.className}>{children}</div>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
