import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Saved from "./routes/Saved";
import { SavedRecipesContextProvider } from "./context/Context";

function App() {
  return (
    <>
      <SavedRecipesContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
        </Router>
      </SavedRecipesContextProvider>
    </>
  );
}

export default App;
