import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from './views/signin-view';
import SignUpPage from './views/signup-view';
import ChatView from './views/chat-view';
import HomeView from './views/home-view';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/chat/:id" element={<ChatView />} />
        <Route path="/log-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
