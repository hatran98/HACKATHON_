const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql2 = require('mysql2')
let pool = mysql2.createPool({
  host: 'localhost',
  user: "root",
  password: '',
  database: "hackathon"
}).promise()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/users', async (req, res) => {
  const user = req.body
  try {
    await pool.execute("INSERT INTO users(name,email,age) VALUES (?,?,?)", [user.name, user.email, user.age])
    res.json({
      message: "Create User Successfully",
      user: user
    })
  } catch (error) {
    res.json({
      error: error
    })
  }
})
app.get('/users', async (req, res) => {
  let [rows] = await pool.execute("SELECT * FROM users");
  try {
    res.json({
      message: 'successfully',
      users: rows
    });
  } catch (error) {
    res.json({
      error: error
    });
  }
});
app.get('/users/:id', async (req, res) => {
  const { id } = req.params
  const user = await pool.execute(`SELECT * FROM users where id =?`, [id])
  try {
    res.json({
      user: user[0]
    })
  } catch (error) {
    res.json({
      error: error
    })
  }
})
app.patch('/users/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, age } = req.body
  let user = await pool.execute("SELECT * from users where id =?", [id])
  let row = user[0]
  try {
    if (row.length === 0) {
      res.send({
        message: "User not found"
      })
    }
    else {
      await pool.execute("UPDATE users set name =? , email =? , age =? where id =?", [name || row[0].name, email || row[0].email, age || row[0].age, id])
      res.json({ message: 'Update user successfully' })
    }
  } catch (error) {
    res.json({ error: error })
  }
})
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params
  try {
    const user = await pool.execute("SELECT * FROM users where id =?", [id])
    let row = user[0]
    if (row.length === 0) {
      res.json({ message: "user not found" })
    }
    else {
      await pool.execute(`DELETE FROM users WHERE id=?`, [id]);
      res.json({
        message: "User delete successfully",
      });
    }
  } catch (error) {
    res.json({ error: error })
  }
})
app.listen(3000, () => {
  console.log("http://localhost:3000")
})
