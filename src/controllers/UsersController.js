const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name) {
      throw new AppError("O nome de usuário deve ser informado!");
    }

    if (!email) {
      throw new AppError("O e-mail deve ser informado!");
    }

    if (!password) {
      throw new AppError("A senha deve ser informada!");
    }

    const isEmailExists = await knex("users").where({ email }).first();
    if (isEmailExists) {
      throw new AppError("E-mail informado já está em uso!");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return response.json(`Usuário criado com sucesso!`);
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where({ user_id }).first();
    const userWithUpdatedEmail = await knex("users").where({ email }).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso!");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir uma nova senha!"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").where({ user_id }).update(user);
    return response.json(`Usuário atualizado com sucesso!`);
  }

  async show(request, response) {
    const { name, email } = request.query;

    const user = await knex("users")
      .select("id", "name", "email", "avatar", "created_at", "updated_at")
      .whereLike("name", `%${name}%`)
      .whereLike("email", `%${email}%`)
      .first();

    return response.json(user);
  }
}

module.exports = UsersController;
