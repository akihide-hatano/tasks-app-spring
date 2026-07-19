import { useEffect, useState } from "react";
import type { Task } from "./types/Task";
import TaskStatus,{type TaskStatus as TaskStatusType }
    from "./types/TaskStatus";

import { FaTrash } from "react-icons/fa";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    //post用のstateを追加
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatusType>(TaskStatus.TODO);
    //delete用のstateを追加(ここはidで管理)
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

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

    //UPDATE
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

    //DELETE
    const handleDeleteTask = async (taskId: number) => {

        //削除確認のダイアログを表示する
        const confirmDelete = window.confirm("本当に削除しますか？");
        //キャンセルされた場合は処理を中断する
        if (!confirmDelete) {
            return;
        }

        //すでに別の削除処理が走っている場合は中断する
        if(deletingTaskId !== null) {
            return;
        }

        //削除処理中のタスクIDをセットする
        setDeletingTaskId(taskId);


        try {
        //まずはapiを叩く
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`,
                {method: "DELETE"});
            //早期リターンでエラーを投げる
            if (!response.ok){
                throw  new Error(`タスクの削除に失敗しました: ${response.status}`);
            }
        //削除したあとに一覧を再度取得する(await忘れない)
        await loadTasks();
        }catch (err) {
            //サーバーエラーなどで削除できない場合のエラー
            console.error("タスクの削除に失敗しました", err);
            alert("タスクの削除に失敗しました。時間をおいて再度お試しください。");
        }finally {
            //削除処理中のタスクIDをリセットする
            setDeletingTaskId(null);
        }
    }

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


                <form
                    onSubmit={handleSubmit}
                    className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900">
                            新規タスク登録
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            タスクのタイトル・説明・ステータスを入力してください。
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                タイトル
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="例：タスク削除機能を実装する"
                                className="
                    w-full rounded-lg border border-slate-300
                    px-4 py-3 text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-slate-500
                    focus:ring-2 focus:ring-slate-200
                "
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                説明
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required={true}
                                placeholder="タスクの内容を入力してください"
                                rows={4}
                                className="
                    w-full resize-none rounded-lg border border-slate-300
                    px-4 py-3 text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-slate-500
                    focus:ring-2 focus:ring-slate-200
                "
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                ステータス
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as TaskStatusType)
                                }
                                className="
                    w-full rounded-lg border border-slate-300
                    bg-white px-4 py-3 text-slate-900
                    outline-none transition
                    focus:border-slate-500
                    focus:ring-2 focus:ring-slate-200
                "
                            >
                                <option value={TaskStatus.TODO}>TODO</option>
                                <option value={TaskStatus.IN_PROGRESS}>
                                    IN_PROGRESS
                                </option>
                                <option value={TaskStatus.DONE}>DONE</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                rounded-lg bg-slate-900 px-6 py-3
                text-sm font-bold text-white
                transition hover:bg-slate-700
                disabled:cursor-not-allowed
                disabled:bg-slate-400
            "
                        >
                            {isSubmitting ? "登録中..." : "＋ タスクを登録"}
                        </button>
                    </div>
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
                                            <div className= "flex items-center gap-3">
                                            <select value={task.status}
                                                    onChange={(e) =>
                                                        handleUpdateTask(task.id,
                                                            task.title, task.description,
                                                        e.target.value as TaskStatusType)}>
                                                <option value="TODO">TODO</option>
                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                <option value="DONE">DONE</option>
                                            </select>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="
                                                            flex h-12 items-center gap-2
                                                            rounded-lg border border-red-200
                                                            bg-red-600 px-3
                                                            text-sm font-semibold text-white
                                                            transition
                                                            hover:bg-red-50">
                                                    <FaTrash />
                                                    削除
                                                </button>
                                            </div>
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