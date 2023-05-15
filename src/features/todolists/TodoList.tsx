import React, {useCallback} from 'react';
import s from 'features/todolists/TodoList.module.css'
import {SuperButton} from "common/components/super-button/SuperButton";
import {InputBlock} from 'common/components/input-block/InputBlock';
import {EditableSpan} from "common/components/editable-span/EditableSpan";
import Task from "features/tasks/Task";
import {FilterValuesType} from "features/todolists/todolists-slice";
import {AppStatus} from "app/app-slice";
import {useTodolist} from "features/todolists/hooks/useTodolist";

export type TodoListPropsType = {
    todolistId: string
    title: string
    filter: FilterValuesType
    todolistStatus: AppStatus
}

export const TodoList: React.FC<TodoListPropsType> = React.memo((
    {
        todolistId,
        title,
        filter,
        todolistStatus
    }
) => {
    const {
        filteredTasks,
        removeTodolist,
        toggleFilterToCompleted,
        toggleFilterToAll,
        toggleFilterToActive,
        addTask,
        changeTodolistTitle
    } = useTodolist(todolistId, filter)

    let tasksList = filteredTasks().map(task => {
        return <Task key={task.id}
                     todolistId={todolistId}
                     task={task}
                     todolistStatus={todolistStatus}
        />
    })

    const addTaskHandler = useCallback((title: string) => {
        addTask(title)
    }, [addTask])

    const changeTodoListTitleHandler = useCallback((title: string) => {
        changeTodolistTitle(title)
    }, [changeTodolistTitle])

    return (
        <>
            <div className={`${s.todolist_wrapper} ${todolistStatus === 'loading' && s.todolist_disable}`}>
                <div>
                    <div className={s.todolist_header_wrapper}>
                        <EditableSpan callback={changeTodoListTitleHandler} title={title}/>
                        <SuperButton name={'Remove'} btnType={'delete'} callback={removeTodolist}/>
                    </div>
                </div>
                <div>
                    <InputBlock callback={addTaskHandler}/>
                </div>
                <div className={s.task_list_wrapper}>
                    <ul className={s.tasks_list}>
                        {tasksList.length > 0 ? tasksList : 'Tasks list is empty'}
                    </ul>
                </div>
                <div className={s.filter_button_wrapper}>
                    <SuperButton filter={filter} value={'all'}
                                 name={'All'} callback={toggleFilterToAll}/>
                    <SuperButton filter={filter} value={'active'}
                                 name={'Active'} callback={toggleFilterToActive}/>
                    <SuperButton filter={filter} value={'completed'}
                                 name={'Completed'} callback={toggleFilterToCompleted}/>
                </div>
            </div>
        </>
    );
});


