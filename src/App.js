import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUP from './files/SignUP';
import LoginSignUP from './files/LoginSignUP';
import Login from './files/Login';
import MainPage from './files/MainPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignUP />} />
          <Route path="/signup" element={<SignUP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mainpage" element={<MainPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;