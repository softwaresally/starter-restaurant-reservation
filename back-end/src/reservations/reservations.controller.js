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
  res.json({ data });
}

// validator for new reservations
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties, asyncErrorBoundary(create)],
};
