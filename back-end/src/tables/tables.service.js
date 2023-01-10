const knex = require("../db/connection");

function list() {
    return knex("tables")
    .select("*");
}

function create(newTable) {
    return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((table) => table[0]);
}

module.exports = {
    list,
    create,
}