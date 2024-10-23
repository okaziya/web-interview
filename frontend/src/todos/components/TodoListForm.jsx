import React, { useState, useEffect, useMemo } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Checkbox from '@mui/material/Checkbox'
import debounce from 'lodash/debounce'
import {
  fetchTodoByListId,
  autosaveTodoItem,
  addTodoItem,
  deleteTodoItem,
  toggleTodoItem,
} from '../../api/todoService'

export const TodoListForm = ({ todoListId }) => {
  const [todoList, setTodoList] = useState()

  useEffect(() => {
    const loadTodoList = async () => {
      try {
        const data = await fetchTodoByListId(todoListId)
        setTodoList(data)
      } catch (error) {
        console.error(error)
      }
    }
    loadTodoList()
  }, [todoListId])

  const debouncedAutosave = useMemo(
    () =>
      debounce(async (itemId, updatedText) => {
        autosaveTodoItem(todoListId, itemId, updatedText).catch((error) => console.error(error))
      }, 1000),
    [todoListId]
  )

  if (!todoList) return null

  const handleTitleUpdate = (itemId, updatedText) => {
    setTodoList((prevListState) => {
      return {
        ...prevListState,
        items: prevListState.items.map((item) =>
          item.id === itemId ? { ...item, itemTitle: updatedText } : item
        ),
      }
    })
    debouncedAutosave(itemId, updatedText)
  }

  const handleAddItem = async () => {
    try {
      const itemAdded = await addTodoItem(todoListId)
      setTodoList((prevListState) => {
        return {
          ...prevListState,
          items: [...prevListState.items, itemAdded],
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteTodoItem(todoListId, itemId)
      setTodoList((prevListState) => {
        return {
          ...prevListState,
          items: prevListState.items.filter((item) => item.id !== itemId),
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleDone = async (itemId, currentDoneStatus) => {
    try {
      const updatedDoneStatus = !currentDoneStatus
      await toggleTodoItem(todoListId, itemId, updatedDoneStatus)
      setTodoList((prevListState) => {
        return {
          ...prevListState,
          items: prevListState.items.map((item) =>
            item.id === itemId ? { ...item, completed: updatedDoneStatus } : item
          ),
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todoList.items.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={item.itemTitle}
                onChange={(event) => handleTitleUpdate(item.id, event.target.value)}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => handleDeleteItem(item.id)}
              >
                <DeleteIcon />
              </Button>
              <Checkbox
                checked={item.completed}
                onChange={() => handleToggleDone(item.id, item.completed)}
                inputProps={{ 'aria-label': 'Mark as done' }}
              />
            </div>
          ))}
          <CardActions>
            <Button type='button' color='primary' onClick={handleAddItem}>
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
