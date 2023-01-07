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

module.exports = {
    list,
    listReservationByDate,
    create,
}