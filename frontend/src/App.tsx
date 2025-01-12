import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./features/authentication/pages/login";
import LandingPage from "./features/landing/pages/landing";
import CryptoPage from "./features/crypto/pages/crypto";
import CryptoDetailPage from "./features/crypto/pages/crypto-detail";
import { GitHubCallback } from "./features/authentication/components/github-redirect";
import AlertPage from "./features/alert/pages/alert";


function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/crypto" element={<CryptoPage />} />
          <Route path="/crypto/:coinId" element={<CryptoDetailPage />} />
          <Route path="/github/callback" element={<GitHubCallback />} />
          <Route path="/alerts" element={<AlertPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
