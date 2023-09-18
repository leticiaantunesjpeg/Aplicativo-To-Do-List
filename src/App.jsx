import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SingUpPage";
import TodoApp from "./components/ToDoApp";

function App() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Router basename="/todolist">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/todolist" element={<TodoApp />} />
          <Route path="/*" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
