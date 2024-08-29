import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is ready");
});

const port = process.env.PORT || 3000;

// get a list of vegetable with id and name and price

app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "Carrot",
      price: "$3",
    },
    {
      id: 2,
      title: "potato",
      price: "$75",
    },
    {
      id: 3,
      title: "Chilly",
      price: "$34",
    },
    {
      id: 4,
      title: "Tomato",
      price: "$4",
    },
    {
      id: 5,
      title: "brinjal",
      price: "$9",
    },
  ];
  res.send(jokes)
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
