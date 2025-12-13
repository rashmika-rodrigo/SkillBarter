import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateSkillPage from './pages/CreateSkillPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import InboxPage from './pages/InboxPage';
import api from './lib/axios';


function App() {

  // Initial Handshake: Ensures CSRF cookie is set by Django
  useEffect(() => {
    api.get("csrf/").catch(err => console.error("CSRF Init Failed", err));
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="profile" element={<ProfilePage />} /> 
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="create-skill" element={<CreateSkillPage />} />
            <Route path="inbox" element={<InboxPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;