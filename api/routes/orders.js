const express= require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
  res.status(200).json({
    mesage: 'get request to orders'
  })
})

router.post('/',(req,res,next)=>{

  const order = {
    orderId: req.body.orderId,
    quantity: req.body.quantity,
  }
  res.status(201).json({
    mesage: 'post request to orders',
    order: order,
  })
})

router.get('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  res.status(200).json({
    mesage: 'post request to orders',
    id: id
  })
})

router.delete('/:orderId',(req,res,next)=>{
  const id = req.params.orderId;
  res.status(200).json({
    mesage: 'delete request to orders',
    id: id
  })
})

module.exports = router;