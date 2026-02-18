import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AddTaskForm from "./AddTaskForm";
import SearchTaskForm from "./SearchTaskForm";
import TodoInfo from "./todoInfo";
import TodoList from "./TodoList";
import Button from "./Button";

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')

    if (savedTasks) {
      return JSON.parse(savedTasks)
    }
    return [
      {id: 'task-1', title: 'Learn React', isDone: false},
      {id: 'task-2', title: 'Learn TP', isDone: true},
    ]
  })
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const newTaskInputRef = useRef(null)
  const firstIncompleteTaskRef = useRef(null)
  const firstIncompleteTaskId = tasks.fing(({ isDone }) => !isDone)?.id

  const deleteAllTasks = useCallback(() => {
    const isConfirmed = confirm('Are you sure you want to delete all?')

    if (isConfirmed) {
      setTasks([])
    }
  }, [])

  const deleteTask = useCallback((taskId) => {
    setTasks(
      tasks.filter((task) => task.id !== taskId)
    )
  }, [tasks])

  const toggleTaskComplete = useCallback((taskId, isDone) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isDone } : task
      )
      // Тут навіть return не потрібен! Arrow function без {} 
      // повертає значення автоматично
    )
  }, [tasks])

  const addTask = useCallback(() => {
    // const newTaskTitle = newTaskInputRef.current.value

    if (newTaskTitle.trim().length > 0) {
      const newTask = {
        id: crypto?.randomUUID() ?? Date.now().toString(),
        title: newTaskTitle,
        isDone: false,
      }

      setTasks([...tasks, newTask]);
      setNewTaskTitle('')
      setSearchQuery('')
      newTaskInputRef.current.focus()
    }

    console.log('newTaskInputRef', newTaskInputRef);
  }, [newTaskTitle])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    newTaskInputRef.current.focus()
  }, [])

  // const renderCount = useRef(0)
  // useEffect(() => {
  //   renderCount.current++
  //   console.log(`Компонент Todo відрендирився ${renderCount.current} разів`);
  // })
  

  const filteredTasks = useMemo(() => {
    const clearSearchQuery = searchQuery.trim().toLowerCase();
    
    return searchQuery.length > 0
    ? tasks.filter(({title}) => title.toLowerCase().includes(clearSearchQuery))
    : null
  }, [searchQuery, tasks])

  const doneTasks = useMemo(() => {
    return tasks.filter(({ isDone }) => isDone).length
  }, [tasks])
  

  return (
    <div className="todo">
      <h1 className="todo__title">To Do List</h1>
      <AddTaskForm 
        addTask={addTask}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskInputRef={newTaskInputRef}
      />
      <SearchTaskForm 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TodoInfo 
        total={tasks.length}
        done={doneTasks}
        onDeleteAllButtonClick={deleteAllTasks}
      />
      <Button onClick={() => firstIncompleteTaskRef.current?.scrollIntoView({ behavior: 'smooth' }) }>
        Show first incomplete task
      </Button>
      <TodoList 
        tasks={tasks}
        filteredTasks={filteredTasks}
        firstIncompleteTaskRef={firstIncompleteTaskRef}
        firstIncompleteTaskId={firstIncompleteTaskId}
        onDeleteTaskButtonClick={deleteTask}
        onTaskCompleteChange={toggleTaskComplete}
      />
    </div>
  );
};

export default Todo;