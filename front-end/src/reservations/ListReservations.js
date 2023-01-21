import React from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function ListReservations({ reservation}) {
    
    return (
        <div>
            <hr />
                <div key={reservation.reservation_id}>
                    <h6 data-reservation-id-status={`${reservation.reservation_id}`}>
                        {reservation.status}
                    </h6>
                    <h5>
                        {reservation.last_name}, {reservation.first_name}
                    </h5> 
                    <h6>{reservation.mobile_number}</h6>
                    <h6>{reservation.reservation_date} at {reservation.reservation_time} for {reservation.people}</h6>
                    {/* <ErrorAlert error={error} /> */}
                    {reservation.status === "booked" ? (
                        <button className="btn btn-dark">
                            <Link to={`/reservations/${reservation.reservation_id}/seat`} style={{ color: "white" }}>
                                Seat
                            </Link>
                        </button>
                    ) : null}
                    {/* <div>
                        <a href={`/reservations/${reservation.reservation_id}/seat`}>
                            {reservation.status="booked" ? <button className="btn btn-dark">Seat</button> : <div> </div>}
                        </a>
                    </div> */}
                    <hr />

                </div>

        </div>
    )
}

export default ListReservations;