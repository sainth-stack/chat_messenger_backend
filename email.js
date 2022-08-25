var express = require('express')
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/sendGmail',async(req,res,next)=>{
  console.log(req.body)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gurakasainathreddy@gmail.com',
          pass: 'uoctqghavfdffclu'
        }
      });
      
      var mailOptions = {
        from: req.body.data.email,
        to:'gurakasainathreddy@gmail.com',
        subject: req.body.data.name,
        text: req.body.data.message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.send(error)
          console.log(error);
        } else {
          res.send(info.response)
          console.log('Email sent: ' + info.response);
        }
      });
})
var port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('started', port)
})
