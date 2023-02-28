import {v1} from "uuid";
import {FilterValuesType, TodoListsType} from "../App";
import {
    addNewTodoListAC,
    changeFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    todoListsReducer
} from "./todoListsReducer";


test('correct TodoList should be removed', () => {

    const todoListId1 = v1()
    const todoListId2 = v1()

    const startState: TodoListsType[] = [
        {todoListId: todoListId1, title: 'What to do', filter: 'all'},
        {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    ]

    const resultState = todoListsReducer(startState, removeTodoListAC(todoListId1))

    expect(resultState.length).toBe(1)
    expect(resultState[0].todoListId).toBe(todoListId2)
    expect(resultState[0].title).toBe('What to buy')
    expect(resultState).not.toBe(startState)
})

test('correct todoList filter should be updated', () => {

    const todoListId1 = v1()
    const todoListId2 = v1()
    const newFilter: FilterValuesType = 'active'

    const startState: TodoListsType[] = [
        {todoListId: todoListId1, title: 'What to do', filter: 'all'},
        {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    ]

    const resultState = todoListsReducer(startState, changeFilterAC(todoListId2, newFilter))

    expect(resultState).not.toBe(startState)
    expect(resultState[1].filter).toBe('active')
    expect(resultState[0].filter).toBe('all')

})

test('correctly add new todoList', () => {
    const todoListId1 = v1()
    const todoListId2 = v1()
    const newTitle = 'What books need to read'

    const startState: TodoListsType[] = [
        {todoListId: todoListId1, title: 'What to do', filter: 'all'},
        {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    ]

    const resultState = todoListsReducer(startState, addNewTodoListAC(todoListId2, newTitle))

    expect(resultState).not.toBe(startState)
    expect(resultState[1].title).toBe('What to buy')
    expect(resultState.length).toBe(3)
    expect(resultState[2].filter).toBe('all')
})

test('correct todoList title should be changed', () => {

    const todoListId1 = v1()
    const todoListId2 = v1()
    const newTitle = 'Changed title'

    const startState: TodoListsType[] = [
        {todoListId: todoListId1, title: 'What to do', filter: 'all'},
        {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    ]

    const resultState = todoListsReducer(startState, changeTodoListTitleAC(todoListId1, newTitle))

    expect(resultState).not.toBe(startState)
    expect(resultState[0].title).toBe(newTitle)
    expect(resultState.length).toBe(2)

})