import React from "react";
import { Link } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";

function DateChange({ date }) {

    return (
        <div className="btn-group" role="group">
            <div>
                <Link to={`/dashboard?date=${previous(date)}`} className="btn btn-dark">
                    Previous Day
                </Link>
                </div>
            <br />
            <div>
                <Link to={`dashboard?date=${today()}`} className="btn btn-dark">
                    Today
                </Link>
            </div>
            <br />
            <div>
                <Link to={`dashboard?date=${next(date)}`} className="btn btn-dark">
                    Next Date
                </Link>
            </div>
        </div>
    );
}


export default DateChange;