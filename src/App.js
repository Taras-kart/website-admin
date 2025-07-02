import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Transaction from './pages/Transaction';
import Stocks from './pages/Stocks';
import Sales from './pages/Sales';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </Router>
  );
}

export default App;
