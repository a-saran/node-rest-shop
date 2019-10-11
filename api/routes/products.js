const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("./../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
      const responce = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            ...doc._doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc.id,
            },
          };
        }),
      };
      res.status(200).json(responce);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then(result => {
      console.log("result : ", result);
      res.status(201).json({
        message: "Created product Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result.id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result.id,
          },
        },
      });
    })
    .catch(err => {
      console.log("error : ", err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .select("name price id")
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "no valid Id found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.update({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "product updated",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        id: id,
        message: "Product deleted",
      });
    })
    .catch(err => {
      console.log(err);
      res.json({ error: err });
    });
});

module.exports = router;
