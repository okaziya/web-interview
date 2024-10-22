import { DataSource } from 'typeorm'
import { TodoList } from './todo-list.js'
import { TodoItem } from './todo-item.js'

let dataSource = null

export const getAppDataSource = async () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: 'sqljs',
      location: './todo.db',
      synchronize: true,
      entities: [TodoList, TodoItem],
      logging: true,
    })
    await dataSource.initialize()
    await dataSource.getRepository(TodoList).save({ name: 'First list' })
    await dataSource.getRepository(TodoList).save({ name: 'Second list' })
  }
  return dataSource
}
