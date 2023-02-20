import React, {useReducer} from 'react';
import s from './App.module.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {InputBlock} from "./InputBlock";
import {
    addNewTaskAC, addNewTasksListForNewTodoListAC,
    changeTaskStatusAC,
    changeTaskTitleAC, removeFullTasksListAC,
    removeTaskAC,
    todoListsDataReducer
} from "./reducers/todoListsDataReducer";
import {
    addNewTodoListAC,
    changeFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    todoListsReducer
} from "./reducers/todoListsReducer";
import ButtonAppBar from "./Appbar";

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

function App() {

    const todoListId1 = v1()
    const todoListId2 = v1()

    // const [todoLists, setTodoLists] = useState<TodoListsType[]>([
    //     {todoListId: todoListId1, title: 'What to do', filter: 'all'},
    //     {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    // ])

    // const [todoListsData, setTodoListsData] = useState<TodoListDataType>({
    //     [todoListId1]: [
    //         {id: v1(), taskName: 'React', isDone: false},
    //         {id: v1(), taskName: 'Redux', isDone: true},
    //         {id: v1(), taskName: 'Axios', isDone: false},
    //     ],
    //     [todoListId2]: [
    //         {id: v1(), taskName: 'HTML', isDone: true},
    //         {id: v1(), taskName: 'CSS', isDone: false},
    //         {id: v1(), taskName: 'Axios', isDone: true}
    //     ]
    // })

    const [todoLists, todoListsDispatch] = useReducer(todoListsReducer, [
        {todoListId: todoListId1, title: 'What to do', filter: 'all'},
        {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    ] )

    const [todoListsData, todoListsDataDispatch] = useReducer(todoListsDataReducer, {
        [todoListId1]: [
            {id: v1(), taskName: 'React', isDone: false},
            {id: v1(), taskName: 'Redux', isDone: true},
            {id: v1(), taskName: 'Axios', isDone: false},
        ],
        [todoListId2]: [
            {id: v1(), taskName: 'HTML', isDone: true},
            {id: v1(), taskName: 'CSS', isDone: false},
            {id: v1(), taskName: 'Axios', isDone: true}
        ]
    })

    const removeTodoList = (todoListID: string) => {
        todoListsDispatch(removeTodoListAC(todoListID))
        todoListsDataDispatch(removeFullTasksListAC(todoListID))
       // setTodoLists(todoLists.filter(tl => tl.todoListId !== todoListID))
        //delete (todoListsData[todoListID])
    }
    const changeFilter = (todoListID: string, filter: FilterValuesType) => {
        todoListsDispatch(changeFilterAC(todoListID, filter))
        //setTodoLists(todoLists.map(tl => tl.todoListId === todoListID ? {...tl, filter: filter} : tl))
    }
    const removeTask = (todoListID: string, taskID: string) => {
        todoListsDataDispatch(removeTaskAC(todoListID, taskID))
        // setTodoListsData({
        //     ...todoListsData, [todoListID]: todoListsData[todoListID].filter(task => task.id !== taskID)
        // })
    }
    const changeTaskStatus = (todoListID: string, taskID: string, newStatus: boolean) => {
        todoListsDataDispatch(changeTaskStatusAC(todoListID, taskID, newStatus))
        // setTodoListsData({
        //     ...todoListsData, [todoListID]:
        //         todoListsData[todoListID].map(task => task.id === taskID ?
        //             {...task, isDone: newStatus} : task)
        // })
    }
    const addNewTask = (todoListID: string, title: string) => {
        todoListsDataDispatch(addNewTaskAC(todoListID, title))
       // let newTask = {id: v1(), taskName: title, isDone: false}
        // setTodoListsData({
        //     ...todoListsData, [todoListID]: [newTask, ...todoListsData[todoListID]]
        // })
    }
    const addNewTodoList = (title: string) => {
        const newTodoListID = v1()
        todoListsDispatch(addNewTodoListAC(title, newTodoListID))
        todoListsDataDispatch(addNewTasksListForNewTodoListAC(newTodoListID))
        //const newTodoList: TodoListsType = {todoListId: newTodoListID, title: title, filter: 'all'}
        //setTodoLists([...todoLists, newTodoList])
        // setTodoListsData({...todoListsData, [newTodoListID]: []})
    }
    const changeTodoListTitle = (todoListId: string, newTitle: string) => {
        todoListsDispatch(changeTodoListTitleAC(todoListId, newTitle))
        //setTodoLists(todoLists.map(tl => tl.todoListId === todoListId ? {...tl, title: newTitle} : tl))
    }
    const changeTaskTitle = (todoListId: string, taskId: string, newTitle: string) => {
        todoListsDataDispatch(changeTaskTitleAC(todoListId, taskId, newTitle))
        // setTodoListsData({
        //     ...todoListsData, [todoListId]:
        //         todoListsData[todoListId].map(t => t.id === taskId ? {...t, taskName: newTitle} : t)
        // })
    }

    const mappedTodoList = todoLists.map(tl => {
        const filteredTodoList = (): TodoListType[] => {
            const todoData = todoListsData[tl.todoListId]
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

export default App;
