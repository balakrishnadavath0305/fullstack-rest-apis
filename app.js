const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "data", "storage.json");

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Route to render form page
app.get("/", (req, res) => {
  res.render("forms");
});

// Get all entries
app.get("/api/entries", (req, res) => {
  const entries = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  res.json(entries);
});

// Post new entry
app.post("/api/entries", (req, res) => {
  const newEntry = req.body;
  newEntry.id = Date.now().toString();

  const entries = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  entries.push(newEntry);
  fs.writeFileSync(dataFile, JSON.stringify(entries, null, 2));

  res.status(201).json({ message: "Entry saved", entry: newEntry });
});

// Update entry
app.put("/api/entries/:id", (req, res) => {
  const id = req.params.id;
  const updatedEntry = req.body;

  let entries = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  const index = entries.findIndex(entry => entry.id === id);

  if (index !== -1) {
    entries[index] = { ...entries[index], ...updatedEntry };
    fs.writeFileSync(dataFile, JSON.stringify(entries, null, 2));
    res.json({ message: "Entry updated", entry: entries[index] });
  } else {
    res.status(404).json({ message: "Entry not found" });
  }
});

// Delete entry
app.delete("/api/entries/:id", (req, res) => {
  const id = req.params.id;
  let entries = JSON.parse(fs.readFileSync(dataFile, "utf8"));

  const newEntries = entries.filter(entry => entry.id !== id);
  if (newEntries.length === entries.length) {
    return res.status(404).json({ message: "Entry not found" });
  }

  fs.writeFileSync(dataFile, JSON.stringify(newEntries, null, 2));
  res.json({ message: "Entry deleted" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
