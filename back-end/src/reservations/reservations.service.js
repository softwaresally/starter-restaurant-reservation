const knex = require("../db/connection");

function list() {
    return knex("reservations")
    .select("*")
}

async function listReservationByDate(reservation_date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .whereNot({ status: "cancelled" })
    .orderBy("reservation_time");
}

function listReservationByNumber(mobile_number) {
    return knex("reservations")
    .whereRaw(
        "translate (mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date")
}

async function create(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((newReservation) => newReservation[0])
}

async function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({ "reservation_id": reservation_id })
    .first();
}

async function update(updatedReservation) {
    return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRes) => updatedRes[0])
}

async function updateTableStatus(reservation_id, status) {
    return knex("reservations")
    .where({ "reservation_id": reservation_id })
    .update({ status }, "*")
    .then((updatedRes) => updatedRes[0])
}

module.exports = {
    list,
    listReservationByDate,
    listReservationByNumber,
    create,
    read,
    update,
    updateTableStatus,
}