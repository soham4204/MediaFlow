import { BrowserRouter, Routes ,Route } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Home from './routes/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload-files" element={<FileUpload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
