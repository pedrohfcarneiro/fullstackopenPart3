const mongoose = require('mongoose')

//mongoose definitions
const url = process.env.MONGODB_URI

mongoose.connect(url)
  // eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => {
        return /^(\d{2}|\d{3})-?\d{8}$/.test(v)
      }
    },
  }
})
///\d{2}-^\d+$|\d{3}-^\d+$/
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)