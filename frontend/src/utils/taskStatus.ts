import TaskStatus,{
    type TaskStatus as TaskStatusType,
} from '../types/TaskStatus';


export const getStatusInfo = (status: TaskStatusType) => {
    switch (status) {
        case  TaskStatus.DONE:
            return {
                label: "完了",
                className:"bg-emerald-100 text-emerald-700",
            };
        case TaskStatus.IN_PROGRESS:
            return {
                label: "進行中",
                className:"bg-amber-100 text-amber-700",
            };
        case TaskStatus.TODO:
            return {
                label: "未着手",
                className:"bg-slate-100 text-slate-700",
            };
    }
}