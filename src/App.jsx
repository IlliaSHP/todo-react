import Todo from "./componets/Todo"
import { TasksProvider } from "./context/TaskContext"


const App = () => {
  return (
    <TasksProvider>
      <Todo />
    </TasksProvider>
  )
}

export default App
