import { Routes,Route } from "react-router-dom";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail.tsx";

function App() {
    return (
        <Routes>
            <Route
            path="/"
            element={<TaskList />}
            />
        <Route
            path="/tasks/:id"
            element={<TaskDetail/>}
        />
        </Routes>
    );
}

export default App;