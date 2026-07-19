import { useEffect, useState } from "react";
import type { Task } from "./types/Task";
import TaskStatus,{type TaskStatus as TaskStatusType }
    from "./types/TaskStatus";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    //post用のstateを追加
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatusType>(TaskStatus.TODO);

    //送信ボタンの状態管理
    const [isSubmitting, setIsSubmitting] = useState(false);

    //post処理
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        //画面リロードを防ぐ
        event.preventDefault();

        //送信中は二重送信を防ぐ
        if(isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        try{
            //送信するdataを作る
            const newTask = { title,
                            description,
                            status ,
                            userId :11};

            //Spring BootへPOSTリクエストを送る
            const response = await fetch("http://localhost:8080/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error(
                    `タスクの作成に失敗しました: ${response.statusText}`
                );
            }

            setTitle("");
            setDescription("");
            setStatus(TaskStatus.TODO);

            await loadTasks();
        }catch(err){
            console.log("送信エラー", err);
            alert("タスクの作成に失敗しました。時間をおいて再度お試しください。");
        }finally {
            setIsSubmitting(false);
        }
    };

    //GET
    const loadTasks = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tasks");

            if (!response.ok) {
                throw new Error(
                    `タスク一覧の取得に: ${response.status}`
                );
            }

            const data = await response.json();
            setTasks(data);
        } catch (err) {
            console.error("タスク一覧の取得に失敗しました", err);
            alert("タスク一覧の取得に失敗しました。時間をおいて再度お試しください。");
        }
    }

    //まとめてputする
    const handleUpdateTask = async (
        taskId:number,
        title:string,
        description:string,
        status:TaskStatusType,
    ) => {
        try {
            //更新するdataを作成
            const updatedTask = { title, description, status };
            //PUTリクエストを送信
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                throw new Error(
                    `タスクの更新に失敗しました: ${response.statusText}`
                );
            }

            //一覧を再取得
            await loadTasks();
        } catch (err) {
            console.error("タスクの更新に失敗しました", err);
            alert("タスクの更新に失敗しました." );
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    const getStatusClassName = (status: TaskStatusType) => {
        switch (status) {
            case TaskStatus.DONE:
                return "bg-emerald-100 text-emerald-700";
            case TaskStatus.IN_PROGRESS:
                return "bg-amber-100 text-amber-700";
            case TaskStatus.TODO:
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <p className="text-sm font-semibold tracking-widest text-slate-300">
                        TASK MANAGEMENT
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-white">
                        Task API App
                    </h1>

                    <p className="mt-3 text-slate-300">
                        ReactとSpring Bootで管理するタスク一覧
                    </p>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            タスク一覧
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            PostgreSQLに保存されているタスクを表示しています。
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500">
                            TOTAL TASKS
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {tasks.length}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">タスクタイトル</label>
                    <input id="title" type="text" value={title}
                           onChange={(e) => setTitle(e.target.value)} required />

                    <label htmlFor="description">タスク説明</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

                    <label htmlFor="status">ステータス</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatusType)} required>
                        <option value={TaskStatus.TODO}>TODO</option>
                        <option value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</option>
                        <option value={TaskStatus.DONE}>DONE</option>
                    </select>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? "登録中..." : "登録"}</button>
                </form>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                    {tasks.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <p className="text-lg font-semibold text-slate-700">
                                タスクがありません
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                新しいタスクを登録すると、ここに表示されます。
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                <tr className="border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500">
                                        ID
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500">
                                        タイトル
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500">
                                        説明
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500">
                                        操作
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                {tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="transition duration-150 hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                            #{task.id}
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-semibold text-slate-900">
                                                {task.title}
                                            </p>
                                        </td>

                                        <td className="max-w-md px-6 py-5 text-sm leading-6 text-slate-600">
                                            {task.description}
                                        </td>

                                        <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClassName(
                                                        task.status
                                                    )}`}
                                                >
                                                    {task.status}
                                                </span>
                                        </td>

                                        <td className={"px-6 py-5"}>
                                            <button type="button"
                                                    onClick={() => handleUpdateTask(
                                                        task.id,
                                                        task.title,
                                                        task.description,
                                                        TaskStatus.DONE
                                                    )}
                                            >
                                                DONEにする
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default App;