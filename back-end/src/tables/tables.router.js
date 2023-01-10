const router = require("express").Router({ mergeParams:true });
const controller = require("./tables.controller");

router.route("/").get(controller.list).post(controller.create);

module.exports = router;