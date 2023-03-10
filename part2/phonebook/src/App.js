import { useEffect, useState } from 'react'
import PhonebookList from './components/PhonebookList'
import Filter from './components/Filter'
import AddPerson from './components/AddPerson'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    if(existingPerson === undefined) {
      const newPerson = {name: newName, number: newNumber}
      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification(`Added ${returnedPerson.name}`)
        }
        )

    }
    else {
      if (window.confirm(`${existingPerson.name} already exists. Replace the number?`)) {
        const personNewNumber = {...existingPerson, number: newNumber}
        personService
          .update(existingPerson.id, personNewNumber)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          })
          .catch(error => {
            setError(`${existingPerson.name} was already deleted.`)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
    }
  }
}

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)

  }

  const handleDelete = id => {
    const person = persons.find(person => person.id == id)
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter(person => person.id != id))
      })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification}/>
      <Error message={error}/>
      <Filter handleFilterChange={handleFilterChange}/>
      <h2>Add new number</h2>
      <AddPerson 
        addName={addName} 
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <PhonebookList 
        persons={persons} 
        filter={filter} 
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App