const mongoose = require('mongoose')

if(process.argv.length < 3) {
	console.log('please provide the password as an argument')
	process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://FullstackOpenCourse:${password}@cluster0.zlo13.mongodb.net/PhonebookDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
	name: String,
	phone: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length === 3) {
	console.log(process.argv.length)
	Contact.find({}).then(result => {
		//result.forEach(contact => {
		//	console.log(contact)
		//})
		console.log("phonebook:\n" + result.map(contact => {
			return(
				`${contact.name} ${contact.phone} \n`
			)
		}))
		mongoose.connection.close()
	})
}
if(process.argv.length === 5) {
	console.log(process.argv.length)
	console.log(name)
	const contact = new Contact({
		name: name,
		phone: phone,
	})
	contact.save().then(result => {
		console.log(`added ${name} number ${phone} to phonebook`)
		mongoose.connection.close()
	})
}