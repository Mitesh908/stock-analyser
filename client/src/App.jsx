import { Route, Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import Stock from './components/Stock';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:name' element={<Stock />} />
      </Routes>
    </div>
  )
};

export default App;
