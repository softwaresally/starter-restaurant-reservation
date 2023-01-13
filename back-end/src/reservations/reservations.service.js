const knex = require("../db/connection");

function list() {
    return knex("reservations")
    .select("*")
}

function listReservationByDate(date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservations.reservation_time");
}

function create(reservation) {
    // console.log("BEFORE INSERT STATEMENT")
    const data = knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((newReservation) => {
        // console.log("IN INSERT STATEMENT")
        // console.log(newReservation)
        return newReservation[0]
    }
    );
    // console.log("AFTER INSERT STATEMENT")
    // console.log(data)
    return data;
}

function read(reservationId) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function update(updatedReservation) {
    return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRes) => updatedRes[0])
}

function updateTableStatus(reservationId, status) {
    return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status }, "*")
    .then((updatedRes) => updatedRes[0])
}

module.exports = {
    list,
    listReservationByDate,
    create,
    read,
    update,
    updateTableStatus,
}