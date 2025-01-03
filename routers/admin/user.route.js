const express = require('express') 
const router = express.Router()

const controller = require("../../controllers/admin/user.controller")

router.get('/', controller.index)

router.get('/detail/:id', controller.detail);

router.delete("/delete/:id", controller.deleteItem);



module.exports = router;