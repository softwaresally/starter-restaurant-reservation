const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

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
  res.status(201).json({ data });
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

function hasAllRequiredProperties(req, res, next) {
  const { data = {} } = req.body;

  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `Data input must have a "${property} property.`
      })
    }
    next();
  })
}

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !validProperties.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

// const requiredProperties = [
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people",
// ];

const hasRequiredProperties = hasProperties(validProperties);

// function hasValidProperties(req, res, next) {
//   const { data = {} } = req.body;

//   if (!data) {
//     return next({
//       status: 400,
//       message: `You must enter request data in order for your request to be processed.`,
//     });
//   }

//   validProperties.forEach((property) => {
//     if (!data[property]) {
//       return next({
//         status: 400,
//         message: `You must include a ${property} property.`,
//       });
//     }

//     if (property === "people" && !Number.isInteger(data.people)) {
//       return next({
//         status: 400,
//         message: `Your party size must be an integer greater than or equal to 1.`,
//       })
//     }

//     if (property === "reservation_date" && !formattedDate.test(data.reservation_date)) {
//       return next({
//         status: 400,
//         message: `You must enter the date you would like to dine with us in YYYY-MM-DD format.`,
//       })
//     }

//     if (property === "reservation_time" && !formattedTime.test(data.reservation_time)) {
//       return next({
//         status: 400,
//         message: `You must enter the time you would like to dine with us in HH:MM format.`,
//       })
//     }
//   });

//   next();
// }

const formattedDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const formattedTime = /[0-9]{2}:[0-9]{2}/;

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties, hasAllRequiredProperties, asyncErrorBoundary(create)],
};
