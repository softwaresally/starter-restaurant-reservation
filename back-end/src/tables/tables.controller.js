const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

async function list(req, res, next) {
    const data = await tablesService.list();
    res.json({ data });
}

async function create(req, res, next) {
    const { data } = req.body;
    const newTable = await tablesService.create(data);
    res.status(201).json({ data: newTable });
}

async function read(req, res, next) {
    // console.log("read", res.locals.table)
    res.json({ data: res.locals.table });
}

async function tableExists(req, res, next) {
    const { tableId } = req.params;
    // console.log(tableId)
    const table = await tablesService.read(tableId);
    if (table) {
        res.locals.table = table;
        // console.log("tableExists", table)
        return next();
    }
    next({
        status: 404,
        message: `Table not found for id: ${tableId ? tableId: ""}.`,
    })
}

async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;

    const reservation = await reservationsService.read(reservation_id);

    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    next({
        status: 404,
        message: `Reservation not found for id: ${reservation_id}`,
    });
}

async function finishTable(req, res, next) {
    const table = res.locals.table;
    // console.log("finishTable", table)
    const finishedTable = {
        ...table,
        reservation_id: null,
    };

    reservationsService.updateTableStatus(table.reservation_id, "finished");

    tablesService.update(finishedTable)
    .then((data) => res.json({ data }))
    .catch(next);
};

async function tableSeated(req, res, next) {
    const { reservation_id, status } = res.locals.reservation;

    if (status === "seated") {
        return next({
            status: 400,
            message: `Reservation ${reservation_id} has been seated.`
        });
    }
    next();
}

async function tableOpen(req, res, next) {
    const table = res.locals.table;
    // console.log("tableOpen", table)

    if (table.reservation_id === null) {
        return next({
            status: 400,
            message: `Table is open for seating.`
        });
    }
    next();
}

async function seatTable(req, res, next) {
    const table = res.locals.table;
    // console.log("seatTable", table)
    const reservation_id = res.locals.reservation.reservation_id;

    const updatedTable = {
        ...table,
        reservation_id: reservation_id,
    };

    reservationsService.updateTableStatus(reservation_id, "seated");

    tablesService.update(updatedTable)
    .then((data) => res.status(200).json({ data }))
    .catch(next);
}

async function overCapacity(req, res, next) {
    const reservation = res.locals.reservation;
    // console.log("reservation", reservation)
    const table = res.locals.table;
    // console.log("overCapacity", table.capacity)

    if (reservation.people > table.capacity) {
        // console.log("reservation.people", reservation.people)
        // console.log("table.capacity", table.capacity)
        return next({
            status: 400,
            message: `This table is not large enough for your party. Table capacity is ${table.capacity}`,
        });
    }

    if (table.reservation_id !== null) {
        return next({
            status: 400,
            message: `Table is currently occupied.`,
        });
    }
    next();
}

const validProperties = [
    "table_name",
    "capacity",
];

function hasValidProperties(req, res, next) {
    const { data = {} } = req.body;

    if (!data) {
        return next({
            status: 400,
            message: `You must enter request data in order for your request to be processed.`,
        });
    }

    validProperties.forEach((property) => {
        if (!data[property]) {
            return next({
                status: 400,
                message: `You must include a ${property} property.`,
            });
        }

        if (property === "table_name" && data.table_name.length <= 1) {
            return next({
                status: 400,
                message: `${property} must be 2 characters or longer.`,
            });
        }

        if (property === "capacity" && !Number.isInteger(data.capacity) ||
        (property === "capacity" && data.capacity < 1)) {
            return next({
                status: 400,
                message: `${property} must be an integer greater than or equal to 1.`,
            });
        }
    });

    next();
}

async function validRequest(req, res, next) {
    const { data = {} } = req.body;
    console.log(req.body);
    if (!data) {
        return next({
            status: 400,
            message: `You must submit request data in order for your request to be processed.`,
        });
    }
    // if (!data.reservation_id) {
    //     return next({
    //         status: 400,
    //         message: `You must include a reservation_id property.`,
    //     });
    // }
    next();
}

// function validRequest(req, res, next) {
//     if (req.body.data) {
//         return next();
//     }
//     next({
//         status: 400,
//         message: `Must have request data.`,
//     })
// }

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [hasValidProperties, asyncErrorBoundary(create)],
    read: [asyncErrorBoundary(tableExists), read],
    update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(reservationExists), validRequest, overCapacity, tableSeated, asyncErrorBoundary(seatTable)],
    finishTable: [asyncErrorBoundary(tableExists), tableOpen, asyncErrorBoundary(finishTable)],
}