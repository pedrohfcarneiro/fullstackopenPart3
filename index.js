require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const Contact = require('./models/contact')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))



let contacts = [
	{
      "name": "Arto Hellas",
      "phone": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "phone": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "phone": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "phone": "39-23-6423122",
      "id": 4
    }
]

morgan.token('dataToken', function(req,res){return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms' ))

app.get('/phonebookapi/contacts', (request,response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/phonebookapi/contacts/:id', (request,response) => {
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
    })
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
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/phonebookapi/contacts',morgan(':method :url :status :res[content-length] - :response-time ms :dataToken'), (request,response) => {
    const contactReceived = request.body
    //console.log(contactReceived)

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
    else if((contacts.map(contact => contact.name)).includes(contactReceived.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }


    const contact = new Contact({
        name: contactReceived.namme
        phone: contactReceived.phone
    })

    contact.save().then(savedContact => {
        response.json(savedContact)
    })

})

const generateId = () => {
    console.log(contacts.length)
    const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => n.id))
    : 0
  return maxId + 1
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})