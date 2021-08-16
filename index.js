const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Contact = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('data', (req) => {
    return req.method === 'POST'
      ? JSON.stringify(req.body)
      : null
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :data'
    )
)

/*let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})*/

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
      res.json(contacts)
    })
})
  
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name && !body.number) {
      return res.status(400).json({ 
        error: 'name and number are missing' 
      })
    } else if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    } /*else if (persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }*/
  
    const contact = new Contact ({
      name: body.name,
      number: body.number,
    })
  
    contact.save().then(savedContact => {
        res.json(savedContact)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const amount = persons.length
    const date = new Date()
    
    res.send(`<p>Phonebook has info for ${amount} people</p><p>${date}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})