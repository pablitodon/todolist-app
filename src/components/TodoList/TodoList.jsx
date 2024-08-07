import React from 'react';
import { useState } from 'react';
import { Fragment } from 'react';

const TodoList = ({ todos, setTodo, logAction }) => {
    const apiUrl = process.env.REACT_APP_API_URL_TODOS

    const [isEdit, setEdit] = useState(null);
    const changeTask = (id) => {
        setEdit(id)
    }

    const handleChange = (e, id) => {
        const value = e.target.value;

        setTodo(todos.map(item => {
            return item.id === id ? { ...item, title: value } : item;
        }))
    };

    const deleteTask = (id, title) => {
        const deleteFetch = async () => {
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('myToken')}`,
                    },
                })
                const data = await response.json()
            } catch (error) {
                console.error(error);
            }
        }

        deleteFetch()
        setTodo(todos.filter((task) => task.id !== id));
        logAction(`Задача удалена: ${title}`);
    };

    const handleSave = (title, id) => {
        setEdit(null);
        logAction(`Задача изменена: ${title}`);
        const fetchChange = async () => {
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('myToken')}`,
                    },
                    body: JSON.stringify({ title: title }),
                });
                const data = await response.json()
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchChange()
    };


    const handleSuccess = (id, title, success) => {

        const fetchSuccess = async () => {
            try {
                const response = await fetch(`${apiUrl}/${id}/isCompleted`, {
                    method: 'PATCH',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('myToken')}`,
                    },
                    body: JSON.stringify({ isCompleted: success })
                })
                const data = await response.json();
            } catch (error) {
                console.error(error);
            }
        }

        fetchSuccess();
        setTodo(todos.map(item => {
            return item.id === id ? { ...item, isCompleted: !item.isCompleted } : item;
        }))
        if (!success) {
            logAction(`Задача выполенена: ${title}`)
        }
    }

    return (
        <Fragment>
            {
                todos.map(task => {
                    return (
                        <div key={task.id}>
                            <div>
                                {
                                    isEdit === task.id ?
                                        <div>
                                            <input
                                                value={task.title}
                                                onChange={(e) => handleChange(e, task.id)}
                                            />
                                            <button onClick={() => handleSave(task.title, task.id)}>Save</button>
                                        </div>
                                        :
                                        <div>
                                            <div onClick={() => handleSuccess(task.id, task.title, task.isCompleted)}>
                                                {task.isCompleted ? <s className='text-gray-600/25'>{task.title}</s> : <p className='font-bold'>{task.title}</p>}
                                            </div>
                                            <button onClick={() => changeTask(task.id)} >
                                                <svg className="feather feather-edit w-5 h-5" fill="none" height="24" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button onClick={() => deleteTask(task.id, task.title)} >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </Fragment>
    );
};

export default TodoList