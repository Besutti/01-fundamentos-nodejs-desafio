import { randomUUID } from 'node:crypto'
import { DataBase} from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

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
             
            
            // database.update('tasks', id, {
            //     title,
            //     description,
            // })       
            
            const data = {
                title: title ? {title} : , 
                description
            }

            tenho que pensar aqui
            
            database.update('tasks', id, {
                ... data
            })

            return res.writeHead(204).end()
        }
    },

]