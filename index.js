const express = require('express')
const app = express()
const port = 3001

app.use(express.json())

contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
  res.send(contacts)
})
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = contacts.find(contact => contact.id === id)
    if(person){
        res.send(person)
    }else{
        res.status(404).send("Sorry can't find that!")
    }
  })

app.get('/info', (req, res) => {
    const length = Object.keys(contacts).length
    const currentDate = new Date()
    const message = `Phonebook currently has ${length} people`
    res.send(`${message} <br/> ${currentDate}`)
    console.log(res);
})

app.post('/api/persons', (req, res) => {
    console.log(req.body);
    contacts.concat(req.body)
    res.json(req.body)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    contacts = contacts.filter(contact => contact.id !== id)
    res.status(204).end()
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
