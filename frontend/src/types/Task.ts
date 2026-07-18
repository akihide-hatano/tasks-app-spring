import { TaskStatus } from "./TaskStatus";

export type Task ={
    id : number;
    title : string;
    description : string;
    status: TaskStatus
}