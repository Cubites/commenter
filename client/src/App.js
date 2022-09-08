import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import dotenv from 'dotenv';

import Home from './components/Home';
import MainPage from './components/MainPage';

const App = () => {
  dotenv.config();
  const [UpAnimation, setUpAnimation] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/*" element={<Home UpAnimation={UpAnimation} setUpAnimation={setUpAnimation}/>}/>
        <Route path="/add" element={<MainPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App