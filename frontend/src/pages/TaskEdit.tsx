import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task, TaskStatusType } from "../types/Task";
import LoadingSpinner from "../components/LoadingSpinner";

import { useNotice } from "../hooks/useNotice";
import Message from "../components/Message";

import { getTaskById, updateTask } from "../api/taskApi";


function TaskEdit() {
    const {id} = useParams<{id:string}>();
    const navigate= useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status,setStatus] = useState<TaskStatusType>("TODO");

    const [isSubmitting,setIsSubmitting] = useState(false);


    const[loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    const {notice, showSuccess, showError} = useNotice();

    useEffect(() => {
        const loadTask = async () => {

            if(!id){
                setError("タスクIDが指定されていません");
                setLoading(false);
                return;
            }

            try {
                const data = await getTaskById(Number(id));

                setTitle(data.title);
                setDescription("まだ説明を読み込んでいません");
                setLoading(false);

                // 動作確認用
                setDescription(data.description);
                setStatus(data.status);
            } catch (error) {
                setError((error as Error).message);
                showError("タスク詳細の取得に失敗しました。時間をおいて再度お試しください。");
            } finally {
                setLoading(false);
            }
        }
        loadTask();
    }, [id]);


    //updateの処理
    const handleUpdateTask = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        //ブラウザが本来やろうとする動作を止める
        event.preventDefault();

        if(!id){
            setError("タスクIDが指定されていません");
            return;
        }

        try{
            //Statue管理
            setIsSubmitting(true);
            setError(null);

            //APIにPUTリクエストを送信してタスクを更新する
            await updateTask(Number(id), { title, description, status });

            navigate(`/tasks/${id}`,{
                state:{
                    notice:{
                        type:"success",
                        message:"タスクを更新しました。"
                    },
                },
            });

        } catch (error) {
            setError((error as Error).message);
            showError("タスクの更新に失敗しました。時間をおいて再度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <LoadingSpinner />;
    }



    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="mb-6 text-2xl font-bold text-slate-800">
                        タスク編集
                    </h1>

                    {notice && (
                        <Message
                            type={notice.type}
                            message={notice.message}
                        />
                    )}

                    <form
                        onSubmit={handleUpdateTask}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                タイトル
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                placeholder="タイトルを入力してください"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                説明
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                className="min-h-40 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                placeholder="タスクの説明を入力してください"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                ステータス
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value as TaskStatusType
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="TODO">
                                    未着手
                                </option>
                                <option value="IN_PROGRESS">
                                    進行中
                                </option>
                                <option value="DONE">
                                    完了
                                </option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/tasks/${id}`)
                                }
                                disabled={isSubmitting}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                キャンセル
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "更新中..."
                                    : "更新する"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TaskEdit;