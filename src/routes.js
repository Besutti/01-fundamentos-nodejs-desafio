import { randomUUID } from 'node:crypto'
import { DataBase} from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { json } from './middlewares/json.js'

const database = new DataBase()

export const routes = [

    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            
            const { search } = req.query            

            const tasks = database.select('tasks', search ? {
                title: search,
                description : search
            } :null)            
            

            return res.end( JSON.stringify(tasks) )    
        }    
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            //console.log(req.body)
            
            const { title, 
                    description } = req.body

            if (!title){
                return res.writeHead(400)
                    .end( JSON.stringify({"message" : "titulo não informado"}))
            }

            if (!description) {
                return res.writeHead(400
                    .end( JSON.stringify({"message" : "descrição não informada"})))
            }
    
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at : null,
                created_at : new Date(),
                updated_at : new Date()
            }            
    
            database.insert('tasks', task)
        
            return res.writeHead(201).end()
        }
    },
    {
        method : 'PUT',
        path : buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body            

            if (!title && !description) {
                return res.writeHead(400).end(JSON.stringify("Parâmetros de atualização não informado!"))
            }

            const [task] = database.select('tasks', { id })            
            if ( !task ) {
                return res.writeHead(404).end(JSON.stringify("Não encontrado"))
            }            
                                             
            database.update('tasks', id, {
                title: title ?? task.title , 
                description: description ?? task.description,
                updated_at: new Date()
            })

            return res.writeHead(204).end()
        }
    },
    {
        method : 'PATCH',
        path : buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            console.log("chegou ate aqui")
            
            const [task] = database.select('tasks', { id })            
            if ( !task ) {
                return res.writeHead(404).end(JSON.stringify("Não encontrado"))
            }            
                                            
            database.update('tasks', id, {
                completed_at: !task.completed_at ? new Date() : null
            })

            return res.writeHead(204).end()
        }
    },
    {
        method : 'DELETE',
        path : buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            const task = database.select('tasks', {
                id
            })
            
            if (task.length === 0 ) {
                return res.writeHead(401).end(JSON.stringify("Não encontrado"))
            } 

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    }

]