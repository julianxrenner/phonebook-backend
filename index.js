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

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((person) => res.json(person));
});

app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
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

app.put("/api/persons/:id", (req, res) => {
  Contact.findByIdAndUpdate(
    req.params.id,
    { number: req.body.number },
    { new: true }
  ).then((result) => {
    res.json(result);
    console.log(result);
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
