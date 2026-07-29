import { Routes,Route } from "react-router-dom";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail.tsx";
import TaskEdit from "./pages/TaskEdit.tsx";

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
        <Route
            path="/tasks/:id/edit"
            element={<TaskEdit/>}
        />
        </Routes>
    );
}

export default App;