import { useEffect, useState } from "react";
import type { User } from "./types/User";
import type { Task } from "./types/Task";
import "./App.css";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="App">
        <main>
        <h1>Task API App</h1>
        </main>
    </div>
  )
}

export default App;