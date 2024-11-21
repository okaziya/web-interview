import React from 'react'
import { TextField, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import useTodoItem from '../hooks/useTodoItem'

const TodoItem = ({ item, index, todoListId, handleDeleteItem }) => {
  const { todoItem, handleTitleUpdate, handleToggleDone } = useTodoItem(item, todoListId)

  const { itemTitle, id, completed } = todoItem

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ margin: '8px' }} variant='h6'>
        {index + 1}
      </Typography>
      <TextField
        sx={{ flexGrow: 1, marginTop: '1rem' }}
        label='What to do?'
        value={itemTitle}
        onChange={(event) => handleTitleUpdate(event.target.value)}
      />
      <Button
        sx={{ margin: '8px' }}
        size='small'
        color='secondary'
        onClick={() => handleDeleteItem(id)}
      >
        <DeleteIcon />
      </Button>
      <Checkbox
        checked={completed}
        onChange={() => handleToggleDone()}
        inputProps={{ 'aria-label': 'Mark as done' }}
      />
    </div>
  )
}

export default TodoItem
