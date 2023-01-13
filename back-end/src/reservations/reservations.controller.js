const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  
  if (date) {
  const data = await reservationsService.listReservationByDate(date)
  res.json({ data });
  } else {
    const data = await reservationsService.list();
    res.json({ data });
  }
}


// create handler for new reservation
async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  return res.status(201).json({ data });
}

// read function for reservations
async function read(req, res, next) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  const data = await reservationsService.update(updatedReservation);
  res.json({ data });
}

function reservationExists(req, res, next) {
  reservationsService.read(req.params.reservationId)
  .then((reservation) => {
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    next({
      status: 400,
      message: `Reservation cannot be found.`
    });
  })
}

// validation code below
const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
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

    if (property === "people" && !Number.isInteger(data.people)) {
      return next({
        status: 400,
        message: `Your party size ${property} must be an integer greater than or equal to 1.`,
      })
    }

    if (property === "reservation_date" && !formattedDate.test(data.reservation_date)) {
      return next({
        status: 400,
        message: `You must enter the date ${property} you would like to dine with us in YYYY-MM-DD format.`,
      })
    }

    if (property === "reservation_time" && !formattedTime.test(data.reservation_time)) {
      return next({
        status: 400,
        message: `You must enter the time ${property} you would like to dine with us in HH:MM format.`,
      })
    }
  });

  next();
}

const formattedDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const formattedTime = /[0-9]{2}:[0-9]{2}/;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const validTableStatuses = [
  "seated",
  "booked",
  "cancelled",
  "finished",
];

function isValidDate(req, res, next) {
  const { data = {} } = req.body;

  const resDateAndTime = new Date(`${data.reservation_date} ${data.reservation_time}`)

  const day = days[resDateAndTime.getDay()];

  if (resDateAndTime < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message: `You can only create on a future date, excluding Tuesday.`
    })
  }

  if (resDateAndTime < new Date()) {
    return next({
      status: 400,
      message: `You can only create on a future date.`
    })
  }

  if (day === "Tuesday") {
    return next({
      status: 400,
      message: `Our restaurant is closed on Tuesday.`
    })
  }

  if (data.reservation_time <= "10:30" || data.reservation_time >= "21:30") {
    return next({
      status: 400,
      message: `Reservations can only be made between 10:30 am and 9:30 pm.`
    })
  }
  next();
}

function validTableStatus(req, res, next) {
  const { status } = req.body.data;

  if (!validTableStatuses.includes(status)) {
    next({
      status: 400,
      message: `Table status not valid. Status must be "booked", "seated", "canceled", or "finished".`,
    })
  } else {
    res.locals.status = status;
    next();
  }
}

async function updateTableStatus(req, res, next) {
  const updatedStatus = {
    ...res.locals.reservation,
    status: res.locals.status,
  }

  const data = await reservationsService.update(updatedStatus);
  res.json({ data });
}

function tableBooked(req, res, next) {
  const { data } = req.body;

  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message: `A new reservation cannot be created while the status is seated or finished`,
    });
  }
  next();
}

function tableNotFinished(req, res, next) {
  const { reservation_id } = req.params;

  const status = res.locals.reservation.status;

  if (status === "finished") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} is finished.`,
    })
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidProperties, isValidDate, tableBooked, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(reservationExists), hasValidProperties, asyncErrorBoundary(update)],
  updateTableStatus: [asyncErrorBoundary(reservationExists), validTableStatus, tableNotFinished, asyncErrorBoundary(updateTableStatus)],
};
