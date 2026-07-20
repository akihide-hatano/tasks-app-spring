import { useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import type { Task } from "../types/Task";

function TaskDetail() {
    const { id } = useParams<{ id: string }>();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(()  => {
        const loadTask = async () => {
            if(!id) {
                setError("タスクIDが指定されていません");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`http://localhost:8080/api/tasks/${id}`);

                if(!response.ok) {
                    throw new Error(`タスク詳細の取得に失敗しました: ${response.status}`);
                }
                const data:Task = await response.json();
                setTask(data);
            }catch (error) {
                const message = error instanceof Error ? error.message : "タスク詳細の取得に失敗しました";
                setError(message);
            } finally {
                setLoading(false);
            }
        };
    loadTask();
}, [id]);

    if(loading) {
        return <div>Loading...</div>;
    }

    if(error) {
        return <div>Error: {error}</div>;
    }

    if(!task) {
        return <div>タスクが見つかりません</div>;
    }

    return (
        <main>
            <h1>タスク詳細</h1>
            <p>ID: {task.id}</p>
            <p>タイトル: {task.title}</p>
            <p>内容: {task.description}</p>
            <p>ステータス: {task.status}</p>

            <Link to="/">一覧へ戻る</Link>
            <Link to={`/tasks/${task.id}/edit`}>編集</Link>
        </main>
    );
}

export default TaskDetail;

