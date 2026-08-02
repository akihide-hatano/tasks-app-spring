import type { Task } from "../types/Task";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const getTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);

    if (!response.ok) {
        throw new Error("タスク一覧の取得に失敗しました");
    }

    return response.json();
};

export const getTaskById = async (id: number): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`);

    if (!response.ok) {
        throw new Error(`タスク取得に失敗しました。id=${id}`);
    }

    return response.json();
};

export const createTask = async (
    newTask: Omit<Task, "id">
): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });

    if (!response.ok) {
        throw new Error("タスク登録に失敗しました");
    }

    return response.json();
};

export const updateTask = async (
    id: number,
    task: Omit<Task, "id">
): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error(`タスク更新に失敗しました。id=${id}`);
    }

    return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`タスク削除に失敗しました。id=${id}`);
    }
};