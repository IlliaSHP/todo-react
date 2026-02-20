import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const TasksContext = createContext({})

export const TasksProvider = (props) => {
  const { children } = props

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
  const firstIncompleteTaskId = tasks.find(({ isDone }) => !isDone)?.id

  const deleteAllTasks = useCallback(() => {
    const isConfirmed = confirm('Are you sure you want to delete all?')

    if (isConfirmed) {
      setTasks([])
    }
  }, [])

  // const deleteTask = useCallback((taskId) => {
  //   setTasks(
  //     tasks.filter((task) => task.id !== taskId)
  //   )
  // }, [tasks])

  const deleteTask = useCallback((taskId) => {
    // Передаємо функцію в setTasks замість значення.
    // React сам викликає цю функцію і передає туди
    // актуальний масив tasks як prevTasks.
    // Тому ми не читаємо tasks ззовні (немає замикання)
    // і не потрібно вказувати tasks в dependencies.
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }, []) // [] — функція створюється один раз і завжди працює зі свіжими даними

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

      setTasks((prevTasks) => [...prevTasks, newTask]);
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


  return (
    <TasksContext.Provider value={{
      tasks,
      filteredTasks,
      firstIncompleteTaskRef,
      firstIncompleteTaskId,
      deleteTask,
      deleteAllTasks,
      toggleTaskComplete,

      newTaskTitle,
      setNewTaskTitle,
      searchQuery,
      setSearchQuery,
      newTaskInputRef,
      addTask,
    }}>
      {children}
    </TasksContext.Provider>
  );
}
