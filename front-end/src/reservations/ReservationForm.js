import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({ reservation, changeHandler, submitHandler }) {


    const history = useHistory();

    
    return (
        <div>
      <form onSubmit={submitHandler}>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">
            First Name
        </label>
          <div className="col-sm-8">
            <input
              type="text"
              name="first_name"
              className="form-control"
              id="first_name"
              placeholder="First Name"
              onChange={changeHandler}
              value={ `${reservation.first_name}` }
              required={true}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">
            Last Name
        </label>
          <div className="col-sm-8">
            <input
              type="text"
              name="last_name"
              className="form-control"
              id="last_name"
              placeholder="Last Name"
              onChange={changeHandler}
              value={`${reservation.last_name}`}
              required={true}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Mobile Number</label>
          <div className="col-sm-8">
            <input
              type="text"
              name="mobile_number"
              className="form-control"
              id="mobile_number"
              placeholder="(___)-___-____"
              onChange={changeHandler}
              value={`${reservation.mobile_number}`}
              required={true}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Date of Reservation</label>
          <div className="col-sm-8">
            <input
              type="text"
              name="reservation_date"
              className="form-control"
              id="reservation_date"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={changeHandler}
              value={`${reservation.reservation_date}`}
              required={true}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Time of Reservation</label>
          <div className="col-sm-8">
            <input
              type="text"
              name="reservation_time"
              className="form-control"
              id="reservation_time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={changeHandler}
              value={`${reservation.reservation_time}`}
              required={true}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Party Size</label>
          <div className="col-sm-8">
            <input
              type="number"
              name="people"
              className="form-control"
              id="people"
              placeholder="Party Size"
              onChange={changeHandler}
              value={`${reservation.people}`}
              min="1"
              required={true}
            />
            <br />
          </div>
        </div>
        <div>
            <button className="btn btn-info btn-lg btn-block" type="submit">
            Submit
            </button>
        </div>
        <br />
        <div>
            <Link to={"/"}>
                <button className="btn btn-danger btn-lg btn-block">
                    Cancel
                </button>
            </Link>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;