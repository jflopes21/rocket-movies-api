const { Router } = require("express");

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const userRoutes = Router();

const usersController = new UsersController();

userRoutes.post("/", usersController.create);
userRoutes.get("/", usersController.show);
userRoutes.put("/", ensureAuthenticated, usersController.update);

module.exports = userRoutes;