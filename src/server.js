// link desafio 
// https://efficient-sloth-d85.notion.site/Desafio-01-2d48608f47644519a408b438b52d913f

import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from "./routes.js"
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer( async(req, res) => {
    const { method, url } = req;

    await json(req, res)

    
    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })


    if (route) {
        console.log('entrou aqui')

        const routeParams = req.url.match(route.path)

        const {query, ...params} = routeParams.groups

        req.params = params
        
        req.query = (query ? extractQueryParams(query) : {})

        
        return route.handler(req, res)
    }

    return res.writeHead(404).end('Not found');

})

server.listen(3333)