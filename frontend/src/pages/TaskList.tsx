import { useEffect, useState } from "react";
import type { Task } from "../types/Task";
import { useNavigate } from "react-router-dom";
import TaskStatus,{type TaskStatus as TaskStatusType }
    from "../types/TaskStatus";

import { FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

import { getStatusInfo } from "../utils/taskStatus";
import { useNotice } from "../hooks/useNotice";
import Message from "../components/Message";

import { createTask, updateTask, deleteTask, getTasks } from "../api/taskApi";

function TaskList() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);

    //post用のstateを追加
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatusType>(TaskStatus.TODO);
    //delete用のstateを追加(ここはidで管理)
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

    //送信ボタンの状態管理
    const [isSubmitting, setIsSubmitting] = useState(false);

    //loadingの管理
    const [loading, setLoading] = useState(true);

    //通知messageの管理
    const {notice,showSuccess,showError} = useNotice();

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
                            userId :1};

            //Spring BootへPOSTリクエストを送る
            await createTask(newTask);

            setTitle("");
            setDescription("");
            setStatus(TaskStatus.TODO);

            await loadTasks();

            showSuccess("タスクを登録しました");

        }catch(err){
            console.log("送信エラー", err);
            showError("タスクの作成に失敗しました。時間をおいて再度お試しください。");
        }finally {
            setIsSubmitting(false);
        }
    };

    //GET
    const loadTasks = async () => {
        try {

            setLoading(true);

            const data = await getTasks();

            setTasks(data);
        } catch (err) {
            console.error("タスク一覧の取得に失敗しました", err);
            showError("タスク一覧の取得に失敗しました。時間をおいて再度お試しください。");
        }
        finally {
            setLoading(false);
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
            await updateTask(taskId, updatedTask);
            //一覧を再取得
            await loadTasks();

            showSuccess("タスクを更新しました");
        } catch (err) {
            console.error("タスクの更新に失敗しました", err);
            showError("タスクの更新に失敗しました。時間をおいて再度お試しください。");
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);
    if(loading){
        return <LoadingSpinner />;
    }

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
            await deleteTask(taskId);
        //削除したあとに一覧を再度取得する(await忘れない)
        await loadTasks();
        showSuccess("タスクを削除しました");
        }catch (err) {
            //サーバーエラーなどで削除できない場合のエラー
            console.error("タスクの削除に失敗しました", err);
            showError("タスクの削除に失敗しました。時間をおいて再度お試しください。");
        }finally {
            //削除処理中のタスクIDをリセットする
            setDeletingTaskId(null);
        }
    }

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
                {notice && (
                    <Message
                        type={notice.type}
                        message={notice.message}
                    />
                )}
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
                                {tasks.map((task) => {

                                    const statusInfo = getStatusInfo(task.status);
                                    return (
                                        <tr
                                            key={task.id}
                                            onClick={()=> navigate(`/tasks/${task.id}`)}
                                        className="cursor-pointer transition duration-150 hover:bg-slate-50 hover:shadow-sm hover:scale-[1.01]"
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
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusInfo.className}`}
                                                >
                                                    {statusInfo.label}
                                                </span>
                                        </td>

                                        <td className={"px-6 py-5"}>
                                            <div className= "flex items-center gap-3">
                                            <select value={task.status}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) =>
                                                        handleUpdateTask(task.id,
                                                            task.title, task.description,
                                                        e.target.value as TaskStatusType)}>
                                                <option value={TaskStatus.TODO}>{getStatusInfo(TaskStatus.TODO).label}</option>
                                                <option value={TaskStatus.IN_PROGRESS}>{getStatusInfo(TaskStatus.IN_PROGRESS).label}</option>
                                                <option value={TaskStatus.DONE}>{getStatusInfo(TaskStatus.DONE).label}</option>
                                            </select>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        console.log(e);
                                                        e.stopPropagation();
                                                        handleDeleteTask(task.id);
                                                    }}
                                                    disabled={deletingTaskId !== null}
                                                    className="
                                                            flex h-12 items-center gap-2
                                                            rounded-lg border border-red-200
                                                            bg-red-600 px-3
                                                            text-sm font-semibold text-white
                                                            transition
                                                            hover:bg-red-50">
                                                    <FaTrash />
                                                    { deletingTaskId === task.id ? "削除中..." : "削除"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default TaskList;