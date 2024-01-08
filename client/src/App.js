import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/main/Home';
import MainPage from './components/main/MainPage';
import BookInfo from './components/bookpage/BookInfo';
import Login from './components/loginpage/Login';
import Mypage from './components/mypage/Mypage';

const App = () => {
  const [UpAnimation, setUpAnimation] = useState(false);
  const [Books, setBooks] = useState([]);
  const [BookData, setBookData] = useState({})
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/*" element={
          <Home 
            UpAnimation={UpAnimation}
            setUpAnimation={setUpAnimation}
            Books={Books}
            setBooks={setBooks}
            setBookData={setBookData}
          />}
        />
        <Route path="/add" element={<MainPage />}/>
        <Route path="/book" element={
          <BookInfo 
            BookData={BookData} 
            setUpAnimation={setUpAnimation}
          />}
        />
        <Route path="/login" element={<Login />}/>
        <Route path="/mypage" element={<Mypage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App