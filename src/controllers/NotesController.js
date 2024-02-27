const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { user_id } = request.params;
    const { title, description, rating, tags } = request.body;

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    console.log(tagsInsert);

    await knex("movie_tags").insert(tagsInsert);

    return response.json(`Dados criados com sucesso!`);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json(`Nota ${id} excluída com sucesso!`);
  }

  async show(request, response) {
    const { id } = request.params;
    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ note_id: id });

    return response.json({
      ...note,
      tags,
    });
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("movie_tags")
        .select(["movie_notes.id", "movie_notes.title", "movie_notes.user_id"])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .orderBy("movie_notes.title");
    } else {
      notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    response.json(notesWithTags);
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, description, rating } = request.body;
    let note = await knex("movie_notes").where({ id }).first();

    if (title !== undefined && title !== "") {
      note.title = title;
    }
    if (description !== undefined && description !== "") {
      note.description = description;
    }
    if (rating !== undefined && rating !== "") {
      note.rating = rating;
    }

    console.log(title);
    console.log(note.title);

    await knex("movie_notes").where({ id }).update({
      title: note.title,
      description: note.description,
      rating: note.rating,
    });

    return response.json(`Nota ${id} atualizada com sucesso`);
  }
}

module.exports = NotesController;
