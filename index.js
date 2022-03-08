const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const knex = require('knex')
const app = express()

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '123456',
    database: process.env.MYSQL_DB || 'e5_app',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
})

app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send({ ok: 1 })
})
app.post('/save', async (req, res) => {
  console.log('data=', req.body)
  try {
    let row = await db('user').insert({
      username: req.body.username,
      id: req.body.id,
      phone: req.body.phone,
      email: req.body.email,
      pass: req.body.pass,
    })
    res.send({
      status: 1,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})
app.get('/list', async (req, res) => {
  console.log('id=', req.query)
  let row = await db('SELECT * FROM `user`').where({id: req.query.id})
  res.send({
    datas: row[0],
    status: 1,
  })
})

app.get('/lists', async (req, res) => {
  let row = await db('user')
  res.send({
    datas: row,
    status: 1,
  })
})

app.get('/list_user', async (req, res) => {
  console.log(req.query.id)
  console.log(req.query.pass)
  try {
    let row = await db('user')
      .where({id: req.query.id, pass: req.query.pass || 0 })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('id/pass incorrect')
    }
    res.send({
      status: 1,
      data: row,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})

app.listen(7001, () => {
  console.log('ready:7001')
})
