var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const mysql = require('mysql2');
var app = express()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var secret = 'SteveJobsHaha'



app.use(cors()) 

const connection = mysql.createConnection({   
    host: 'localhost',
    user: 'root',
    database: 'demo'
}); 

app.get('/test', jsonParser,function (req, res, next){
   res.send("Hello world")
})
app.post('/login', jsonParser,function (req, res, next){
  connection.execute(
      'SELECT * FROM user where username = ?',
      [req.body.username],
      function(err, users, fields) {
        if (err){ res.json({status:'error', message:err}); return }
        if (users.length == 0){ res.json({status:'error', message:"no user found"}); return }
        bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
          if (isLogin){
              var token = jwt.sign({ user_ID: users[0].ID }, secret);
              res.json({status:'ok',message:'login success',token})
          } else{
              res.json({status:'error',message:'login failed'})
          }
      });    
    
      }
  );
})

app.post('/auth', jsonParser,function (req, res, next){
 try{
      const token = req.headers.authorization.split(' ')[1]
      var decoded = jwt.verify(token, secret);
      res.json({status:'ok',decoded})
      res.json({decoded})

 } catch(err){
  res.json({status:'error',message:err.message})
 }
})

app.post('/register', jsonParser,function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      connection.execute(
          'INSERT INTO `user` (`ID`, `first_name`, `last_name`, `username`, `password`, `email`) VALUES (NULL,?,?,?,?,?)',
          [req.body.first_name,req.body.last_name,req.body.username,hash,req.body.email],
          function(err, results, fields) {
            if 
            (err){
              res.json({status:'error', message:err})
              return
            }
            res.json({status:'ok'})
            
          }
      );
  });
  
})


app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})
