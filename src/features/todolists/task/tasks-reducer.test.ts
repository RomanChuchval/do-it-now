import {
    addNewTaskAC,
    updateTaskAC,
    removeTaskAC, TodoListDataType,
    tasksReducer,
} from "features/todolists/task/tasks-reducer";
import {addNewTodoListAC, removeTodoListAC} from "features/todolists/todolist/todolist-reducer";
import {TaskStatuses, TaskType, TodolistType} from "api/todolist-api";

let todoListId1: string
let todoListId2: string
let startState: TodoListDataType

beforeEach( () => {
    todoListId1 = '1'
    todoListId2 = '2'
    startState = {
        [todoListId1]: [
            {id: '1', title: 'React', status: TaskStatuses.New, description: 'text', completed: false,
                priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId1,
                order: 2, addedDate: '11.11.2022' },
            {id: '2', title: 'Axios', status: TaskStatuses.New, description: 'text', completed: false,
                priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId1,
                order: 2, addedDate: '11.11.2022' },
            {id: '3', title: 'HTML', status: TaskStatuses.Completed, description: 'text', completed: false,
                priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId1,
                order: 2, addedDate: '11.11.2022' },
         ],
        [todoListId2]: [
            {id: '1', title: 'React', status: TaskStatuses.New, description: 'text', completed: false,
                priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId2,
                order: 2, addedDate: '11.11.2022' },
            {id: '2', title: 'Axios', status: TaskStatuses.New, description: 'text', completed: false,
                priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId2,
                order: 2, addedDate: '11.11.2022' },
            {id: '3', title: 'HTML', status: TaskStatuses.Completed, description: 'text', completed: false,
                priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId2,
                order: 2, addedDate: '11.11.2022' },
        ],
    }
})


test('correct task should be removed', () => {

    const resultState = tasksReducer(startState,removeTaskAC( todoListId1,'2' ))

    expect(resultState[todoListId1]).not.toBe(startState)
    expect(resultState[todoListId1][1].title).toBe('HTML')
    expect(resultState[todoListId1].length).toBe(2)
    expect(resultState[todoListId2].length).toBe(3)
})

test('correct task should be change taskStatus', ()=> {

    const todoListID = '1'
    const taskID = '2'
    const updatedTask: TaskType =  {id: '2', title: 'Axios', status: TaskStatuses.Completed, description: 'text', completed: false,
            priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId1,
            order: 2, addedDate: '11.11.2022' }

    const resultState = tasksReducer(startState, updateTaskAC(todoListID, taskID, updatedTask))

    expect(resultState).not.toBe(startState)
    expect(resultState[todoListID][1].status).toBe(TaskStatuses.Completed)
    expect(resultState[todoListID][0].status).toBe(TaskStatuses.New)
    expect(resultState[todoListID][2].status).toBe(TaskStatuses.Completed)
    expect(resultState[todoListID].length).toBe(3)
})

test('correct todolist array should be add provided new task', () => {

    const todoListID = todoListId2
    const updatedTask: TaskType =  {id: '4', title: 'New Task', status: TaskStatuses.New, description: 'text', completed: false,
        priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId1,
        order: 2, addedDate: '11.11.2022' }

    const resultState = tasksReducer(startState, addNewTaskAC(todoListID, updatedTask))

    expect(resultState).not.toBe(startState)
    expect(resultState[todoListID].length).toBe(4)
    expect(resultState[todoListID][0].title).toBe('New Task')
})

test('task title should be changed correctly', () => {

    const todoListID = todoListId2
    const taskId = '2'

    const updatedTask: TaskType = {id: '2', title: 'REST-API', status: TaskStatuses.New, description: 'text', completed: false,
        priority: 0, startDate: '12.12.2023', deadline: '12.02.2024', todoListId: todoListId2,
        order: 2, addedDate: '11.11.2022' }

    const resultState = tasksReducer(startState, updateTaskAC(todoListID, taskId, updatedTask ))

    expect(resultState).not.toBe(startState)
    expect(resultState[todoListID].length).toBe(3)
    expect(resultState[todoListID][1].title).toBe('REST-API')
})

test('should correct remove full tasksList', () => {

    const todoListID = todoListId2
    const resultState = tasksReducer(startState, removeTodoListAC(todoListID))

    expect(resultState[todoListID]).toBeUndefined()
    expect(resultState[todoListId1]).toBe(startState[todoListId1])

})

test('should correct add new empty array for  for new TodoList', () => {

    const newTodolist: TodolistType = {id: '5', title: 'What books need to read', order: '3', addedDate: '09.03.2020'}
    const resultState = tasksReducer(startState, addNewTodoListAC(newTodolist))

    expect(resultState['5'].length).toBe(0)
    expect(resultState['5']).not.toBeUndefined()
    expect(resultState).not.toBe(startState)
})



