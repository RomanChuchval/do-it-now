import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {InputBlock} from "./InputBlock";

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
    const [todoLists, setTodoLists] = useState<TodoListsType[]>([
        {todoListId: todoListId1, title: 'What to do', filter: 'all'},
        {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    ])
    const [todoListsData, setTodoListsData] = useState<TodoListDataType>({
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
        setTodoLists(todoLists.filter(tl => tl.todoListId !== todoListID))
        delete (todoListsData[todoListID])
    }
    const changeFilter = (todoListID: string, filter: FilterValuesType) => {
        setTodoLists(todoLists.map(tl => tl.todoListId === todoListID ? {...tl, filter: filter} : tl))
    }
    const removeTask = (todoListID: string, taskID: string) => {
        setTodoListsData({
            ...todoListsData, [todoListID]: todoListsData[todoListID].filter(task => task.id !== taskID)
        })
    }
    const changeTaskStatus = (todoListID: string, taskID: string, newStatus: boolean) => {
        setTodoListsData({...todoListsData, [todoListID]:
                todoListsData[todoListID].map(task => task.id === taskID ?
                    {...task, isDone: newStatus} : task)
        })
    }
    const addNewTask = (todoListID: string, title: string) => {
        let newTask = {id: v1(), taskName: title, isDone: false}
        setTodoListsData({...todoListsData, [todoListID]
                : [newTask, ...todoListsData[todoListID]]})
    }
    const addNewTodoList = (title: string) => {
        const newTodoListID = v1()
        const newTodoList: TodoListsType = {todoListId: newTodoListID, title: title, filter: 'all'}
        setTodoLists([...todoLists, newTodoList])
        setTodoListsData({...todoListsData, [newTodoListID]: []})
    }
    const changeTodoListTitle = (todoListId: string, newTitle: string) => {
        setTodoLists(todoLists.map(tl => tl.todoListId === todoListId ? {...tl, title: newTitle}: tl))
    }
    const changeTaskTitle = (todoListId: string, taskId: string, newTitle: string) => {
        setTodoListsData({...todoListsData, [todoListId]:
                todoListsData[todoListId].map(t => t.id === taskId ? {...t, taskName: newTitle} : t) })
    }

    return (
        <div className="App">
            <div>
                <InputBlock callback={addNewTodoList}/>
            </div>
            {todoLists.map(tl => {
                const filteredTodoList = (): TodoListType[] => {
                    let todoData = todoListsData[tl.todoListId]
                    return tl.filter === 'completed' ? todoData.filter(el => el.isDone)
                        : tl.filter === 'active' ? todoData.filter(el => !el.isDone)
                            : todoData
                }
                let todoData = filteredTodoList()

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
            })}
        </div>
    );
}

export default App;
