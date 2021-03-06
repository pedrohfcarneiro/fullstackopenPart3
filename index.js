require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))



let contacts = [
  {
    'name': 'Arto Hellas',
    'phone': '040-123456',
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'phone': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'phone': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'phone': '39-23-6423122',
    'id': 4
  }
]

// eslint-disable-next-line no-unused-vars
morgan.token('dataToken', function(req,res){return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms' ))

app.get('/phonebookapi/contacts', (request,response,next) => {
  Contact.find({})
    .then(contacts => {
      if(contacts){
        response.json(contacts)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/phonebookapi/contacts/:id', (request,response,next) => {
  Contact.findById(request.params.id).
    then(contact => {
      if(contact){
        response.json(contact)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//app.get('/info', (request,response) => {
//    const numberOfContacts = contacts.length
//    const date = new Date()
//    response.send(
//        `<div>
//            <p>Phonebook has info for ${numberOfContacts} people</p>
//            <p>${date}</p>
//        </div>`
//    )
//})

app.delete('/phonebookapi/contacts/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end(result)
    })
    .catch(error => next(error))
})

app.post('/phonebookapi/contacts',morgan(':method :url :status :res[content-length] - :response-time ms :dataToken'), (request,response, next) => {
  const contactReceived = request.body
  console.log('entrou no post')
  console.log(contactReceived)

  if(!contactReceived.name && !contactReceived.phone) {
    return response.status(400).json({
      error: 'name and phone not inserted'
    })
  }
  else if (!contactReceived.name) {
    console.log('no name received')
    return response.status(400).json({
      error: 'name not inserted'
    })
  }
  else if(!contactReceived.phone) {
    return response.status(400).json({
      error: 'phone not inserted'
    })
  }
  else if((contacts.map(contact => contact.name)).includes(contactReceived.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }


  const contact = new Contact({
    name: contactReceived.name,
    phone: contactReceived.phone,
  })
  console.log(contact)
  contact.save()
    .then(savedContact => {
      console.log('promise fullfilled')
      response.json(savedContact)
    })
    .catch(error => next(error))

})

app.put('/phonebookapi/contacts/:id', (request, response, next) => {
  const contactReceived = request.body
  console.log(contactReceived)

  if(!contactReceived.name && !contactReceived.phone) {
    return response.status(400).json({
      error: 'name and phone not inserted'
    })
  }
  else if (!contactReceived.name) {
    return response.status(400).json({
      error: 'name not inserted'
    })
  }
  else if(!contactReceived.phone) {
    return response.status(400).json({
      error: 'phone not inserted'
    })
  }

  const contact = {
    name: contactReceived.name,
    phone: contactReceived.phone,
  }
  console.log(contact)

  Contact.findByIdAndUpdate(request.params.id, contact, { new:true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

/* const generateId = () => {
  console.log(contacts.length)
  const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => n.id))
    : 0
  return maxId + 1
} */

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint, declaration above ( not in it's own component for testing purposes )
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('ERROR HANDLER')
  console.log(error)
  console.error(typeof error.message)


  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if(error.name === 'ValidationError') {
    const Message = error.message
    return response.status(400).json({ error: Message })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})