import { useCallback, useEffect, useMemo, useRef, useState, useReducer } from "react"
import tasksAPI from "@/shared/api/Tasks";

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALL': {
      return Array.isArray(action.tasks) ? action.tasks : state
    }
    case 'ADD': {
      return [...state, action.task]
    }
    case 'TOGGLE_COMPLETE': {
      const { id, isDone } = action

      return state.map((task) => {
        return task.id === id ? { ...task, isDone } : task
      })
    }
    case 'DELETE': {
      return state.filter((task) => task.id !== action.id)
    }
    case 'DELETE_ALL': {
      return []
    }
    default: {
      return state
    }
  }
}

export const useTasks = () => {
  const [tasks, dispatch] = useReducer(taskReducer, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [disappearingTaskId, setDisappearingTaskId] = useState(null)
  const [appearingTaskId, setAppearingTaskId] = useState(null)

  const newTaskInputRef = useRef(null)

  const deleteAllTasks = useCallback(() => {
    const isConfirmed = confirm('Are you sure you want to delete all?')

    if (isConfirmed)  {
      tasksAPI.deleteAll(tasks)
        .then(() => dispatch({ type: 'DELETE_ALL' }))
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
        setDisappearingTaskId(taskId)
        setTimeout(() => {
          dispatch({ type: 'DELETE', id: taskId })
          setDisappearingTaskId(null)
        }, 400)
        // setTasks(
        //   tasks.filter((task) => task.id !== taskId)
        // )
      })
  }, [])

  const toggleTaskComplete = useCallback((taskId, isDone) => {
    tasksAPI.toggleComplete(taskId, isDone)
      .then(() => {
        dispatch({ type: 'TOGGLE_COMPLETE', id: taskId, isDone })
        // setTasks(
        //   tasks.map((task) =>
        //     task.id === taskId ? { ...task, isDone } : task
        //   )
        //   // Тут навіть return не потрібен! Arrow function без {}
        //   // повертає значення автоматично
        // )
      })
  }, [])

  const addTask = useCallback((title, callbackAfterAdding) => {
    const newTask = {
      title,
      isDone: false,
    }

    tasksAPI.add(newTask)
      .then((addedTask) => {
        dispatch({ type: 'ADD', task: addedTask })
        callbackAfterAdding()
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

    tasksAPI.getAll().then((serverTasks) => {
      dispatch({ type: 'SET_ALL', tasks: serverTasks})
    })
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
    searchQuery,
    setSearchQuery,
    newTaskInputRef,
    addTask,
    disappearingTaskId,
    appearingTaskId,
  }
}

export default useTasks;