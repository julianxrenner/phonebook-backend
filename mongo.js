const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Dont forget to include your password when running');
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://renner_db_phonebook:${password}@cluster0.5yaf6vd.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery',false)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
    name: 'Test',
    number: '212-212-2121'
  })

  contact.save().then(result => {
    console.log('contact saved!')
    mongoose.connection.close()
  })