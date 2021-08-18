//assignment 3.12.

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.bmp9s.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv[3] && process.argv[4]) {
  contact.save().then(response => {
    console.log(`added ${contact.name} ${contact.number} to phonebook`, response)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3 ) {
  Contact.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('give name and number to contact')
  process.exit(1)
}