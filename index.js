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

//get all the contacts from data
app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

//create a new person
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  /* this part was for the assignment 3.12 to define rules for parameters
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
  } else if (persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
      return res.status(400).json({
        error: 'name must be unique'
      })
  }*/

  const contact = new Contact ({
    name: body.name,
    number: body.number,
  })

  contact
    .save()
    .then(savedContact => savedContact.toJSON())
    .then(savedAndFormattedContact => {
      res.json(savedAndFormattedContact)
    })
    .catch(error => next(error))
})

//finds contacts individually
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//creates an info page
app.get('/info', (req, res) => {
  const date = new Date()

  Contact.find({}).then(contacts => {
    res.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${date}</p>`)
  })
})

//deletes a contact
app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
      console.log(result)
    })
    .catch(error => next(error))
})

//updates a contact
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedContact => {
      response.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//managing error messages
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})