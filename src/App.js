import { Routes, Route } from "react-router-dom";
import Albums from "./pages/albums/Albums";
import Photos from "./pages/photos/Photos";
import "./App.less";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Albums />}></Route>
        <Route path="/photos/:id" element={<Photos />}></Route>
      </Routes>
    </div>
  );
}

export default App;
