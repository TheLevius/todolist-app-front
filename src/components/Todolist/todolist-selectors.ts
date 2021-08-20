import {TaskStatusesType} from "../../api/todolists-api";
import {AppStateType} from "../../redux/store";
import {FilterValuesType} from "../../redux/todolist-reducer";

export const selectTasks = (state: AppStateType, id: string, filter: FilterValuesType) => {
    if (!state.tasks[id]) {
        return null
    }
    if (filter === 'all') {
        return (state.tasks[id])
    } else {
        return (state.tasks[id].filter(t => {
            if (filter === 'active') {
                return t.status === TaskStatusesType.New
            } else if (filter === 'completed') {
                return t.status === TaskStatusesType.Completed
            }
            return true;
        }))
    }
}