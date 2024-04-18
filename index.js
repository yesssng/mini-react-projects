const express = require('express')
const app = express()

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.use(express.static('dist'))


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }


const cors = require('cors')

app.use(cors())


app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


const currentdate = new Date(); 


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

app.get('/', (request, response) => {
    response.send('<h1>Welcome page</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentdate.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
     
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    //TODO: Add morgan middleware
        
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    for(let i = 0; i<persons.length; i++) {
        if(body.name === persons[i].name){
            return response.status(400).json({
                error: 'this name is already exists'
            })
        }
    }

    const person = {
        id: getRandomInt(1000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
    console.log(request.body)
})


app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})