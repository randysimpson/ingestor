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
      } else {
        req.body[i].date = new Date(req.body[i].date);
      }
    }
  } else {
    //single item
    if(!req.body.date) {
      req.body.date = date;
    } else {
      req.body.date = new Date(req.body.date);
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
    res.json({
      'body': req.body
    });
  } else {
    res.status(500).json({
      message: 'Queue not setup yet.'
    });
  }
});

router.get('/latest', (req, res) => {
  if(router.queue) {
    const latestData = router.queue.dataCache.getItems();
    res.json(latestData);
  } else {
    res.status(500).json({
      message: 'Queue not setup yet.'
    });
  }
})

module.exports = router
