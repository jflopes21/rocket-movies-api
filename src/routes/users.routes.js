const { Router } = require("express");

const UsersController = require("../controllers/UsersController");

const userRoutes = Router();

const usersController = new UsersController();

userRoutes.post("/", usersController.create);
userRoutes.get("/", usersController.show);
userRoutes.put("/:id", usersController.update);

module.exports = userRoutes;