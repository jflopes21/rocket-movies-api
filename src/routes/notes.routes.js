const { Router } = require("express");

const NotesController = require("../controllers/notesRoutesNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")


const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.use(ensureAuthenticated);

notesRoutes.get("/", notesController.index);
notesRoutes.get("/:id", notesController.show);
notesRoutes.post("/", notesController.create);
notesRoutes.put("/:id", notesController.update);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;