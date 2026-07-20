import { Routes,Route } from "react-router-dom";
import TaskList from "./pages/TaskList";

function App() {
    return (
        <Routes>
            <Route
            path="/"
            element={<TaskList />}
            />
        </Routes>
    );
}

export default App;