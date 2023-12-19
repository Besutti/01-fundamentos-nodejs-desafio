import fs from 'node:fs/promises'

const dataBasePath = new URL('../db.json', import.meta.url)

export class DataBase {
    #database = {}

    constructor() {
        fs.readFile(dataBasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            // caso de erro porque não existe o arquivo ele vai criar!
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(dataBasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        console.log(search)

        if (search) {
            console.log('chegou ate aqui')

            data = data.filter(row => {
                // a variave search é um objeto, entao vamos ter que percorer o mesmo 
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } 
        else {
            this.#database[table] = [data]
        }

        this.#persist();

        return data;
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {

            const row = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = { id, ...row, ...data }
            this.#persist()

            // this.#database[table][rowIndex] = { id, ...data }
            // this.#persist()
        }        
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }        
    }
}