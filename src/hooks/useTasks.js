import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import tasksAPI from "../api/tasksAPI";

export const useTasks = () => {
  const [tasks, setTasks] = useState([])

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [disappearingTaskId, setdisappearingTaskId] = useState(null)
  const [appearingTaskId, setAppearingTaskId] = useState(null)

  const newTaskInputRef = useRef(null)

  const deleteAllTasks = useCallback(() => {
    const isConfirmed = confirm('Are you sure you want to delete all?')

    if (isConfirmed)  {
      tasksAPI.deleteAll(tasks)
        .then(() => setTasks([]))
    }
  }, [tasks])

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
    // setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

    tasksAPI.delete(taskId)
      .then(() => {
        setdisappearingTaskId(taskId)
        setTimeout(() => {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
          setdisappearingTaskId(null)
        }, 400)
        // setTasks(
        //   tasks.filter((task) => task.id !== taskId)
        // )
      })
  }, [])

  const toggleTaskComplete = useCallback((taskId, isDone) => {
    tasksAPI.toggleComplete(taskId, isDone)
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, isDone } : task
          )
          // Тут навіть return не потрібен! Arrow function без {}
          // повертає значення автоматично
        )
      })
  }, [tasks])

  const addTask = useCallback((title) => {
    const newTask = {
      title,
      isDone: false,
    }

    tasksAPI.add(newTask)
      .then((addedTask) => {
        setTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewTaskTitle('')
        setSearchQuery('')
        newTaskInputRef.current.focus()
        setAppearingTaskId(addedTask.id)
        setTimeout(() => {
          setAppearingTaskId(null)
        },400)
      })
  }, [])

  useEffect(() => {
    newTaskInputRef.current.focus()

    tasksAPI.getAll().then(setTasks)
  }, [])

  const filteredTasks = useMemo(() => {
    const clearSearchQuery = searchQuery.trim().toLowerCase();
    
    return searchQuery.length > 0
    ? tasks.filter(({title}) => title.toLowerCase().includes(clearSearchQuery))
    : null
  }, [searchQuery, tasks])

  return {
    tasks,
    filteredTasks,
    deleteTask,
    deleteAllTasks,
    toggleTaskComplete,
    newTaskTitle,
    setNewTaskTitle,
    searchQuery,
    setSearchQuery,
    newTaskInputRef,
    addTask,
    disappearingTaskId,
    appearingTaskId,
  }
}

export default useTasks;