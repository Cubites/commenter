import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import List from './components/List';
import MainPage from './components/MainPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home/>}/>
        <Route path="/search" element={<MainPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App