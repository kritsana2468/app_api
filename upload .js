// call all the required packages
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const knex = require('knex')
// CREATE EXPRESS APP
const app = express()
const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'project_smart63',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
})
app.use(bodyParser.urlencoded({extended: true}))
// SET STORAGE
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    cb(null, 'e1-' + Date.now() + ext)
  },
})

let upload = multer({ storage: storage })

app.use((req, res, next) => {
  let header = { 'Access-Control-Allow-Origin': '*'}
  for (let i in req.headers) {
    if (i.toLowerCase().substr(0, 15) === 'access-control-') {
      header[i.replace(/-request-/g, '-allow-')] = req.headers[i]
    }
  }
  // res.header(header)  // แบบเก่า
  res.set(header) // แบบใหม่
  next()
})

// let result=substring(test.indexOf('.',test.length))
// console.log('oak')

// ROUTES WILL GO HERE
// app.post('/list', upload.single('myFile'), (req, res, next) => {
app.post('/list', upload.any(), async (req, res) => {
  console.log(req.files[0].filename)
  console.log('คุณสมบัติของfile:', req.files)

  res.send({ status: true, filesname: req.files[0].filename })
})
// uploading multiple images together
app.post('/multi', upload.any(), (req, res) => {
  console.log('multi')
  const files = req.files
  console.log('file:', files)
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }

  res.send({
    'files=>': files,
    status: 'ok',
  })
})
app.get('/listg', async (req, res) => {
  try {
    let rows = await req.db('group').select('*').orderBy('group.g_code', 'desc')
      .innerJoin('department', 'group.d_code', 'department.d_code')
      .where('group.t_status', '!=', 0)
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  console.log('คุณสมบัติของfile:', req.file)

  //  let ext = req.file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
  console.log('req.file.originalname=', req.file.originalname)
  console.log('req.file.originalname.lastIndexOf(.)', req.file.originalname.lastIndexOf('.'))
  console.log('file.originalname.length=', req.file.originalname.length)

  if (!req.file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(req.file)
})
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.listen(7000, () => {
  console.log('Server started on port 7000')
})
