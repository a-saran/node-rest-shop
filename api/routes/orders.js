const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("./../models/order");
const Product = require("./../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id productId quantity")
    .populate('productId', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          console.log(doc.productId.id)
          return {
            ...doc._doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc.productId.id,
            },
          };
        }),
      });
    })
    .catch(err => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(500).json({
          error: "No Product found!",
        });
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        productId: req.body.productId,
      });

      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: "order created",
        orderCreated: {
          id: result.id,
          quantity: result.quantity,
          productId: result.productId,
        },
      });
    })
    .catch(err =>
      res.status(500).json({
        error: err,
      }),
    );
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  Order.findById(id)
    .select('id quantity productId')
    .populate('productId')
    .exec()
    .then(order => {
      if(!order) {
        return res.status(404).json({
          error: 'No Order Found!'
        })
      }

      res.status(200).json({
        order: order,
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })

});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  Order.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        mesage: "delete request to orders",
        id: id,
      });
    })
    .catch(err => {
      console.log(err);
      res.json(500).json({
        error: err,
      });
    });
});

module.exports = router;
