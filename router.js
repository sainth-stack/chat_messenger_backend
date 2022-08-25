const { request } = require('express');
const express = require('express')
const router = express.Router();
const userModel = require('./models/user.models')

const successResponse = ({ message, data }) => ({ success: true, data: data ? data : null, message });
const failResponse = ({ message, data }) => ({ success: false, data: data ? data : null, message });

router.get('/', (req, res) => {
  res.send('server is running')
})
router.post('/create', async (req, res) => {
  const user = await userModel.find({ email: req.body.email });
  if (user.length < 1) {
    try {
      const message=`Name:${req.body.name}` + " " + `Email:${req.body.email}` + " " +`Type:${req.body.type}` + " " + `Message:${req.body.message}`
      let requestBody = {
        name: req.body.name,
        email: req.body.email,
        type: req.body.type,
        socketid: req.body.socketid,
        message: { message: message, msgid: req.body.email, type: 'other' }
      }
      const newCompany = new userModel(requestBody);
      await newCompany.save();
      res.status(200).send(
        successResponse({
          message: 'User Created Successfully!',
        })
      );
    } catch (err) {
      res.status(500).send(
        failResponse({
          message: err ? err.message : "User Not Created!"
        })
      );
    }
  }
  else {
    try {
      if (user.length > 0) {
        userModel.updateOne(
          { email: req.body.email },
          {
            $set: {
              name: req.body.name,
              email: req.body.email,
              type: req.body.type,
              socketid: req.body.socketid
            }
          },
          function (err, result) {
            if (err) throw err;
            else {
              res.send(result)
              console.log('update')
            }
          }
        );
      }
    } catch (err) {
      res.status(500).send(
        "Failed"
      );
    }

  }
})
router.get('/getusers', async (req, res) => {
  try {
    const users = await userModel.find({}).sort({ _id: -1 });
    res.status(200).send(
      successResponse({
        message: 'Users Retrieved Successfully!',
        data: users
      })
    )
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Users Not Fetched!"
      })
    );
  }
})
router.get('/getuserbyid/:id', async (req, res) => {
  try {
    const users = await userModel.find({ email: req.params.id });
    res.status(200).send(
      successResponse({
        message: 'Users Retrieved Successfully!',
        data: users
      })
    )
  } catch (err) {
    res.status(500).send(
      failResponse({
        message: err ? err.message : "Users Not Fetched!"
      })
    );
  }
})
router.put('/update', async (req, res) => {
  const user = await userModel.find({ email: req.body.email });
  let msg = user[0].message
  msg.push({ message: req.body.message, type: req.body.type, msgid: req.body.email,date:req.body.date })
  try {
    userModel.updateOne(
      { email: req.body.email },
      {
        $set: {
          message: msg
        }
      },
      function (err, result) {
        if (err) {
          res.send(error)
          console.log(error)
        }
        else {
          res.send(result)
          console.log('update')
        }
      }
    );

  } catch (err) {
    res.status(500).send(
      "Failed"
    );
  }


})

router.put('/updateStatus', async (req, res) => {
  try {
    userModel.updateOne(
      { email: req.body.email },
      {
        $set: {
          status: req.body.status
        }
      },
      function (err, result) {
        if (err) {
          res.send(error)
          console.log(error)
        }
        else {
          res.send(result)
          console.log('update')
        }
      }
    );

  } catch (err) {
    res.status(500).send(
      "Failed"
    );
  }


})


module.exports = router