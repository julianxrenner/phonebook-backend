require("dotenv").config();
const Contact = require("./models/contact");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("reqBody", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody",
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

// contacts = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((person) => res.json(person));
});

app.get("/api/persons/:id", (req, res) => {
  Contact.findById(req.params.id).then((contact) => {
    res.json(contact);
  });
});

app.get("/info", (req, res) => {
  const length = Object.keys(contacts).length;
  const currentDate = new Date();
  const message = `Phonebook currently has ${length} people`;
  res.send(`${message} <br/> ${currentDate}`);
  console.log(res);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "content missing" });
  }

  const contact = new Contact({
    name: req.body.name,
    number: req.body.number,
  });

  contact.save().then((savedContact) => {
    res.json(savedContact);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
