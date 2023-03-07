import React from 'react';
import s from './App.module.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {InputBlock} from "./InputBlock";
import {
    addNewTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
} from "./redux/reducers/todoListsDataReducer";
import {
    addNewTodoListAC,
    changeFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
} from "./redux/reducers/todoListsReducer";
import ButtonAppBar from "./Appbar";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "./redux/store";

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
}
export type TodoListDataType = {
    [key: string]: TodoListType[]
}
export type TodoListType = {
    id: string
    taskName: string
    isDone: boolean
}

function AppWithRedux() {
    const dispatch = useDispatch()
    const todoLists = useSelector<RootStateType, Array<TodoListsType>>(state => state.todoLists)
    const tasks = useSelector<RootStateType, TodoListDataType>(state => state.tasks)

    const removeTodoList = (todoListID: string) => {
        dispatch(removeTodoListAC(todoListID))
    }
    const changeFilter = (todoListID: string, filter: FilterValuesType) => {
        dispatch(changeFilterAC(todoListID, filter))
    }
    const removeTask = (todoListID: string, taskID: string) => {
        dispatch(removeTaskAC(todoListID, taskID))
    }
    const changeTaskStatus = (todoListID: string, taskID: string, newStatus: boolean) => {
        dispatch(changeTaskStatusAC(todoListID, taskID, newStatus))
    }
    const addNewTask = (todoListID: string, title: string) => {
        dispatch(addNewTaskAC(todoListID, title))
    }
    const addNewTodoList = (title: string) => {
        const newTodolistId = v1()
        dispatch(addNewTodoListAC(title, newTodolistId))
    }

    const changeTodoListTitle = (todoListId: string, newTitle: string) => {
        dispatch(changeTodoListTitleAC(todoListId, newTitle))

    }
    const changeTaskTitle = (todoListId: string, taskId: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(todoListId, taskId, newTitle))

    }

    const mappedTodoList = todoLists.map(tl => {
        const filteredTodoList = (): TodoListType[] => {
            const todoData = tasks[tl.todoListId]
            return tl.filter === 'completed' ? todoData.filter(el => el.isDone)
                : tl.filter === 'active' ? todoData.filter(el => !el.isDone)
                    : todoData
        }
        const todoData = filteredTodoList()
        return (
            <TodoList
                key={tl.todoListId}
                todoListId={tl.todoListId}
                title={tl.title}
                filter={tl.filter}
                todoData={todoData}
                changeFilter={changeFilter}
                removeTodoList={removeTodoList}
                removeTask={removeTask}
                changeTaskStatus={changeTaskStatus}
                addNewTask={addNewTask}
                changeTodoListTitle={changeTodoListTitle}
                changeTaskTitle={changeTaskTitle}
            />
        )
    })

    return (
        <>
            <ButtonAppBar/>
            <div className={s.app}>
                <div className={s.add_todoList_block}>
                    <InputBlock callback={addNewTodoList}/>
                </div>
                <div className={s.todoLists_wrapper}>
                    {mappedTodoList}
                </div>
            </div>
        </>

    );
}

export default AppWithRedux;
