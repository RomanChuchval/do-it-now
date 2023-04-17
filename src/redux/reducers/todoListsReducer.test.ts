import {v1} from "uuid";
import {
    addNewTodoListAC,
    changeFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    todoListsReducer
} from "./todoListsReducer";
import {FilterValuesType, TodoListsType} from "../../app/AppWithRedux";

let todoListId1: string
let todoListId2: string
let startState: Array<TodoListsType>

beforeEach( () => {
     todoListId1 = v1()
     todoListId2 = v1()

     startState = [
        {todoListId: todoListId1, title: 'What to do', filter: 'all'},
        {todoListId: todoListId2, title: 'What to buy', filter: 'all'},
    ]
} )


test('correct TodoList should be removed', () => {

    const resultState = todoListsReducer(startState, removeTodoListAC(todoListId1))

    expect(resultState.length).toBe(1)
    expect(resultState[0].todoListId).toBe(todoListId2)
    expect(resultState[0].title).toBe('What to buy')
    expect(resultState).not.toBe(startState)
})

test('correct todoList filter should be updated', () => {

    const newFilter: FilterValuesType = 'active'

    const resultState = todoListsReducer(startState, changeFilterAC(todoListId2, newFilter))

    expect(resultState).not.toBe(startState)
    expect(resultState[1].filter).toBe('active')
    expect(resultState[0].filter).toBe('all')

})

test('correctly add new todoList', () => {

    const newTodolistId = v1()
    const newTitle = 'What books need to read'

    const resultState = todoListsReducer(startState, addNewTodoListAC(newTitle, newTodolistId))

    expect(resultState).not.toBe(startState)
    expect(resultState[1].title).toBe('What to buy')
    expect(resultState.length).toBe(3)
    expect(resultState[2].filter).toBe('all')
})

test('correct todoList title should be changed', () => {

    const newTitle = 'Changed title'

    const resultState = todoListsReducer(startState, changeTodoListTitleAC(todoListId1, newTitle))

    expect(resultState).not.toBe(startState)
    expect(resultState[0].title).toBe(newTitle)
    expect(resultState.length).toBe(2)

})