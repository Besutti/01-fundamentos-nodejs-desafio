import http from 'node:http'

import fs from 'fs'
import { parse } from 'csv-parse'

//const __dirname = new URL('planilha.csv',import.meta.url)



const processFile = async () => {
    console.log('chegou ate aqui')
    const records = [];
    const parser = fs
        .createReadStream('planilha.csv')
        .pipe(parse({
            delimiter: ',',
            skipEmptyLines : true,
            fromLine: 2            
        }))

    for await (const record of parser) {     
        // records.push(record)

        const [title, description] = record        

        // agora vai consumir o servidor 
        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            })
        })
        
          
    }
    return records
}

// const server = http.createServer(async(req, res) => {
//     const records = await processFile();
//     console.log(records)
//     return res.end(records)
// })
//server.listen(3333)

async function run() {

     await processFile();    

}


run()