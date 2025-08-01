const http = require('http');
const express = require('express')
const app = express();
const cors = require('cors');

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end('<html>Hello World!</html>');
// });

// server.listen(8080, () => {
//     console.log('Server running at http://localhost:8080/');
// });

const router = require('./routes/routes')
const PORT = 8002
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // OR use a function if you want to allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', '*'],
  exposedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json())
app.use('/',router)
app.listen(PORT,()=>{
    console.log('server started in 8002')
})