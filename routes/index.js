const { Router } = require("express");
const { save } = require("../save_json");
let favouriteNumber = require("../number.json");
const add = require("../add");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const router = new Router();

router.get("/sum/:number1/:number2", async (req, res) => {
  let my_file = await s3.getObject({
    Bucket: "cyclic-dark-gray-armadillo-tie-eu-north-1",
    Key: "number.json",
  }).promise()
  const favNumber = JSON.parse(my_file.Body)?.favouriteNumber;
  const {number1, number2} = req.params;
  if(number1 == null || number2 == null) {
    res.status(400).send("Not provided numbers");
    return;
  }
  if(isNaN(parseInt(number1)) || isNaN(parseInt(number2))) {
    res.status(400).send("Numbers needs to be integer");
    return;
  }
  let result = add(parseInt(number1), parseInt(number2));
  if(favNumber != null) {
    result = add(result, favNumber )
  }
  res.json({
    status: "success",
    result: result,
  });
});

router.post("/favNumber", async (req, res) => {
  const {number} = req.body;
  if(number == null ) {
    res.status(400).send("Not provided number");
    return;
  }
  if(isNaN(parseInt(number))) {
    res.status(400).send("The number needs to be integer");
    return;
  }
  await save({
    favouriteNumber: number
  });
  res.json({
    status: "success",
    newFavouriteNumber: number,
  });
});

module.exports = router;