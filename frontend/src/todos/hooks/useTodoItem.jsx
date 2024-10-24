import { useState, useMemo } from 'react'
import debounce from 'lodash/debounce'
import { autosaveTodoItem, toggleTodoItem } from '../api/todoService'

const useTodoItem = (initialItem, todoListId) => {
  const [todoItem, setTodoItem] = useState(initialItem)

  const { id, completed } = todoItem

  const debouncedAutosave = useMemo(
    () =>
      debounce(async (updatedText) => {
        autosaveTodoItem(todoListId, id, updatedText).catch((error) => console.error(error))
      }, 1000),
    [todoListId, id]
  )

  const handleTitleUpdate = (updatedText) => {
    setTodoItem((prevItemState) => ({
      ...prevItemState,
      itemTitle: updatedText,
    }))
    debouncedAutosave(updatedText)
  }

  const handleToggleDone = async () => {
    try {
      const updatedDoneStatus = !completed
      await toggleTodoItem(todoListId, id, updatedDoneStatus)
      setTodoItem((prevListState) => ({
        ...prevListState,
        completed: updatedDoneStatus,
      }))
    } catch (error) {
      console.error(error)
    }
  }

  return {
    todoItem,
    handleTitleUpdate,
    handleToggleDone,
  }
}

export default useTodoItem
