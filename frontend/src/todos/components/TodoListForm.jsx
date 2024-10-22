import React, { useState, useEffect, useMemo } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import debounce from 'lodash/debounce'

export const TodoListForm = ({ todoListId }) => {
  const [todoList, setTodoList] = useState()

  useEffect(() => {
    const fetchTodoByListId = async () => {
      try {
        const response = await axios.get(`/api/todo-list/${todoListId}`)
        setTodoList(response.data)
      } catch (error) {
        console.error('Error fetching todo lists:', error)
      }
    }
    fetchTodoByListId()
  }, [todoListId])

  const debouncedAutosave = useMemo(
    () =>
      debounce(async (itemId, updatedText) => {
        try {
          await axios.patch(`/api/todo-list/${todoListId}/item/${itemId}`, {
            itemTitle: updatedText,
          })
        } catch (error) {
          console.error('Error autosaving item:', error)
        }
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
      const response = await axios.post(`/api/todo-list/${todoListId}/item`, { itemTitle: '' })
      const itemAdded = response.data
      setTodoList((prevListState) => {
        return {
          ...prevListState,
          items: [...prevListState.items, itemAdded],
        }
      })
    } catch (error) {
      console.error('Error adding new todo item:', error)
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/todo-list/${todoListId}/item/${itemId}`)

      setTodoList((prevListState) => {
        return {
          ...prevListState,
          items: prevListState.items.filter((item) => item.id !== itemId),
        }
      })
    } catch (error) {
      console.error(`Error deleting item ${itemId}:`, error)
    }
  }

  const handleToggleDone = async (itemId, currentDoneStatus) => {
    try {
      const updatedDoneStatus = !currentDoneStatus

      await axios.patch(`/api/todo-list/${todoListId}/item/${itemId}`, {
        completed: updatedDoneStatus,
      })

      setTodoList((prevListState) => {
        return {
          ...prevListState,
          items: prevListState.items.map((item) =>
            item.id === itemId ? { ...item, completed: updatedDoneStatus } : item
          ),
        }
      })
    } catch (error) {
      console.error('Error updating todo item:', error)
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
