import { useEffect, useState } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import type { Task } from "../types/Task";
import { getStatusInfo } from "../utils/taskStatus";
import { FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

import { useLocation } from "react-router-dom";
import Message from "../components/Message";
import { useNotice } from "../hooks/useNotice";


function TaskDetail() {
    const {id} = useParams<{ id: string }>();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const {notice, showSuccess, showError} = useNotice();


    //画面遷移で通知を受け取るための処理
    useEffect(() => {

        const receivedNotice = location.state?.notice;
        if (!receivedNotice) {
            return;
        }
        if (receivedNotice.type === "success") {
            showSuccess(receivedNotice.message);
        } else if (receivedNotice.type === "error") {
            showError(receivedNotice.message);
        }

        //受け取った通知をクリアするために、location.stateを更新
        navigate(location.pathname, {
            replace: true,
            state: null
        });
    }, []);

    useEffect(() => {
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
        return <LoadingSpinner />;
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

            navigate("/");

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

                {notice && (
                    <Message
                        type={notice.type}
                        message={notice.message}
                    />
                )}

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

                    <div className="flex items-center justify-center w-full gap-4">
                        <Link to="/"
                              className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100">
                            一覧に戻る
                        </Link>
                        <Link to={`/tasks/${task.id}/edit`}
                              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700">
                            編集
                        </Link>
                        <button onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700">
                            <FaTrash className="inline-block mr-2" />
                            削除
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TaskDetail;

