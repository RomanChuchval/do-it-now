import {
    addNewTodoListAC,
    changeFilterAC,
    changeTodoListTitleAC, FilterValuesType,
    removeTodoListAC, TodolistDomainType,
    todolistReducer
} from "./todolist-reducer";
import {TodolistType} from "../../api/todolist-api";

let todoListId1: string
let todoListId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todoListId1 = '1'
    todoListId2 = '2'

    startState = [
        {id: todoListId1, title: 'What to do', filter: 'all', addedDate: '11.12.2022', order: '1'},
        {id: todoListId2, title: 'What to buy', filter: 'all', addedDate: '09.02.2021', order: '2'}
    ]
})


test('correct TodoList should be removed', () => {
    let todoListId1 = '1'

    const resultState = todolistReducer(startState, removeTodoListAC(todoListId1))

    expect(resultState.length).toBe(1)
    expect(resultState[0].id).toBe(todoListId2)
    expect(resultState[0].title).toBe('What to buy')
    expect(resultState).not.toBe(startState)
})

test('correct todoList filter should be updated', () => {

    const newFilter: FilterValuesType = 'active'

    const resultState = todolistReducer(startState, changeFilterAC(todoListId2, newFilter))

    expect(resultState).not.toBe(startState)
    expect(resultState[1].filter).toBe('active')
    expect(resultState[0].filter).toBe('all')

})

test('correctly add new todoList', () => {

    const newTodolist: TodolistType = {id: '1', title: 'What books need to read', order: '3', addedDate: '09.03.2020'}

    const resultState = todolistReducer(startState, addNewTodoListAC(newTodolist))

    expect(resultState).not.toBe(startState)
    expect(resultState[2].title).toBe('What to buy')
    expect(resultState[0].title).toBe('What books need to read')
    expect(resultState.length).toBe(3)
    expect(resultState[2].filter).toBe('all')
})

test('correct todoList title should be changed', () => {

    const newTitle = 'Changed title'

    const resultState = todolistReducer(startState, changeTodoListTitleAC(todoListId1, newTitle))

    expect(resultState).not.toBe(startState)
    expect(resultState[0].title).toBe(newTitle)
    expect(resultState.length).toBe(2)

})