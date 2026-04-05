const db = require("../db");

exports.getEmployees = (req, res) => {
  db.query("SELECT * FROM employees", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
};

exports.addEmployee = (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).send("All fields required");
  }

  db.query(
    "INSERT INTO employees (name,email,role) VALUES (?,?,?)",
    [name, email, role],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Employee added");
    }
  );
};
