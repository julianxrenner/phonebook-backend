const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Dont forget to include your password when running");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://renner_db_phonebook:${password}@cluster0.5yaf6vd.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv[3] && process.argv[4]) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
} else {
  Contact.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(person);
    });
  });
}
