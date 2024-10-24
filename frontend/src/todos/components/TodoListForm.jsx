import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import TodoItem from './TodoItem'
import AddIcon from '@mui/icons-material/Add'

import { fetchTodoByListId, addTodoItem, deleteTodoItem } from '../api/todoService'

export const TodoListForm = ({ todoListId }) => {
  const [todoListTitle, setTodoListTitle] = useState()
  const [todoListItems, setTodoListItems] = useState()

  useEffect(() => {
    const loadTodoList = async () => {
      try {
        const data = await fetchTodoByListId(todoListId)
        setTodoListTitle(data.title)
        setTodoListItems(data.items)
      } catch (error) {
        console.error(error)
      }
    }
    loadTodoList()
  }, [todoListId])

  if (!todoListItems || !todoListTitle) return null

  const handleAddItem = async () => {
    try {
      const itemAdded = await addTodoItem(todoListId)
      setTodoListItems((prevTodoItemsState) => [...prevTodoItemsState, itemAdded])
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteTodoItem(todoListId, itemId)

      setTodoListItems((prevTodoListState) =>
        prevTodoListState.filter((item) => item.id !== itemId)
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoListTitle}</Typography>
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todoListItems.map((item, index) => (
            <TodoItem
              key={item.id}
              item={item}
              index={index}
              todoListId={todoListId}
              handleDeleteItem={handleDeleteItem}
            />
          ))}
        </form>
      </CardContent>
      <CardActions>
        <Button type='button' color='primary' onClick={handleAddItem}>
          Add Todo <AddIcon />
        </Button>
      </CardActions>
    </Card>
  )
}
