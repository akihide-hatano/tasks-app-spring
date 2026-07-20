import { useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import type { Task } from "../types/Task";
import { getStatusInfo } from "../utils/taskStatus";

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

    const statusInfo = getStatusInfo(task.status);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("本当に削除しますか？");

        if(!confirmDelete) {
            return;
        }

        try {
            const response = await fetch
                    (`http://localhost:8080/api/tasks/${task.id}`,
                        {
                            method: "DELETE",
                        });

            if(!response.ok) {
                throw new Error(`タスクの削除に失敗しました: ${response.status}`);
            }

        } catch (error) {
            const message = error instanceof Error ? error.message : "タスクの削除に失敗しました";
            setError(message);
        }
    }

    return (
        <main className="max-w-xl mx-auto mt-10">
            <div className="rounded-xl border bg-white shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    タスク詳細
                </h1>

                <div className="space-y-4">
                    <div>
                        <p className="text-gray-500 text-sm">ID</p>
                        <p>{task.id}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">タイトル</p>
                        <p className="font-semibold">{task.title}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">内容</p>
                        <p>{task.description}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">ステータス</p>
                        <span className={`rounded-full ${statusInfo.className} px-3 py-1 text-sm font-bold`}>
                            {statusInfo.label}
                        </span>
                    </div>

                    <div>
                        <Link to="/">
                            一覧に戻る
                        </Link>
                        <Link to={`/tasks/${task.id}/edit`} className="text-blue-500 hover:underline">
                            編集
                        </Link>
                        <button onClick={handleDelete}>
                            削除
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TaskDetail;

