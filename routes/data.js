const express = require('express');
const router = express.Router();

router.queue = undefined;

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  const date = new Date();
  //add date if missing.
  if(Array.isArray(req.body)) {
    //array of data.
    for(let i = 0; i < req.body.length; i++) {
      if(!req.body[i].date) {
        req.body[i].date = date;
      }
    }
  } else {
    //single item
    if(!req.body.date) {
      req.body.date = date;
    }
  }
  //console.log('Time: ', date.toLocaleString());
  next();
});
// define the post
router.post('/', function (req, res) {
  if(router.queue) {
    if(Array.isArray(req.body)) {
      //array of data.
      for(let i = 0; i < req.body.length; i++) {
        router.queue.addItem(req.body[i]);
      }
    } else {
      //single item
      router.queue.addItem(req.body);
    }
  }
  res.json({
    'body': req.body
  });
  //console.log(req.body);
});

module.exports = router
