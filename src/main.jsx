import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import NewRiveComp from './components/new/NewRiveComp.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/new-elem" element={<App />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/" element={<NewRiveComp />} />
        
      </Routes>
    </Router>
  </StrictMode>,
);
