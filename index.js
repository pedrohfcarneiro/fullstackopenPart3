const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/phonebookapi/contacts', (request,response) => {
    response.json(contacts)
})

app.get('/phonebookapi/contacts/:id', (request,response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)

    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request,response) => {
    const numberOfContacts = contacts.length
    const date = new Date()
    response.send(
        `<div>
            <p>Phonebook has info for ${numberOfContacts} people</p>
            <p>${date}</p>
        </div>`
    )
})

app.delete('/phonebookapi/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
})

app.post('/phonebookapi/contacts', (request,response) => {
    const contactReceived = request.body
    console.log(contactReceived)

    if(!contactReceived.name && !contactReceived.phone) {
        return response.status(400).json({ 
            error: 'name and phone missing' 
        })
    }
    else if (!contactReceived.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
    else if(!contactReceived.phone) {
        return response.status(400).json({
            error: 'phone missing'
        })
    }

    const contactToSave = {
        name: contactReceived.name,
        phone: contactReceived.phone,
        id: generateId(),
    }

    contacts = contacts.concat(contactToSave)

    response.json(contactToSave)

})

const generateId = () => {
    console.log(contacts.length)
    const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => n.id))
    : 0
  return maxId + 1
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})