const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if(!name) {
      throw new AppError("O nome de usuário deve ser informado!")
    }

    if(!email) {
      throw new AppError("O e-mail deve ser informado!")
    }

    if(!password) {
      throw new AppError("A senha deve ser informada!")
    }

    const isEmailExists = await knex("users").where({email}).first();
    if(isEmailExists){
      throw new AppError("E-mail informado já está em uso!");
    }

    const hashedPassword = await hash(password, 8)

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return response.json(`Usuário criado com sucesso!`);
  }
}

module.exports = UsersController;
