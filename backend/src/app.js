import express from 'express'
import cors from 'cors'
import { TodoList } from './todo-list.js'
import { TodoItem } from './todo-item.js'
import { getAppDataSource } from './data-source.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/ping', (req, res) => res.send('Pong!'))

app.get('/api/todo-lists', async (req, res) => {
  const AppDataSource = await getAppDataSource()
  const todoItems = await AppDataSource.getRepository(TodoList).find()
  res.json(todoItems)
})

app.get('/api/todo-list/:listId', async (req, res) => {
  const AppDataSource = await getAppDataSource()
  const todoList = await AppDataSource.getRepository(TodoList).findOne({
    where: { id: req.params.listId },
    relations: ['items'],
  })
  res.json(todoList)
})

app.post('/api/todo-list/:listId/item', async (req, res) => {
  const AppDataSource = await getAppDataSource()
  const todoList = await AppDataSource.getRepository(TodoList).findOneBy({ id: req.params.listId })
  const todoItem = AppDataSource.getRepository(TodoItem).create({ ...req.body, list: todoList })
  await AppDataSource.getRepository(TodoItem).save(todoItem)
  res.json(todoItem)
})

app.patch('/api/todo-list/:listId/item/:itemId', async (req, res) => {
  const AppDataSource = await getAppDataSource()
  const todoRepository = AppDataSource.getRepository(TodoItem)

  const todoItem = await todoRepository.findOne({
    where: { id: req.params.itemId, list: { id: req.params.listId } },
  })
  if (!todoItem) {
    return res.status(404).json({ message: `Todo item not found in list ${req.params.listId}` })
  } else {
    console.log(
      `Todo item ${req.params.itemId} found in list ${req.params.listId}: ${JSON.stringify(
        todoItem
      )}`
    )
  }
  const updatedTodoItem = todoRepository.merge(todoItem, req.body)
  await todoRepository.save(updatedTodoItem)
  console.log(`Todo item ${req.params.itemId} in list ${req.params.listId} updated`)
  res.json(updatedTodoItem)
})

app.delete('/api/todo-list/:listId/item/:itemId', async (req, res) => {
  const AppDataSource = await getAppDataSource()
  const todoRepository = AppDataSource.getRepository(TodoItem)

  const todoItem = await todoRepository.findOne({
    where: { id: req.params.itemId, list: { id: req.params.listId } },
  })
  if (!todoItem) {
    return res.status(404).json({ message: `Todo item not found in list ${req.params.listId}` })
  } else {
    console.log(
      `Todo item ${req.params.itemId} found in list ${req.params.listId}: ${JSON.stringify(
        todoItem
      )}`
    )
  }
  await todoRepository.delete(todoItem)
  console.log(`Todo item ${req.params.itemId} in list ${req.params.listId} deleted`)
  res.json(todoItem)
})

export default app
