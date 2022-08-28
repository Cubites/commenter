import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import List from './components/Detail';
import MainPage from './components/MainPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home/>}/>
        <Route path="/search" element={<MainPage/>}/>
        <Route path="/detail" element={<MainPage/>}/>
        <Route path="/login" element={<MainPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App