import React from "react";
import { listReservations } from "../utils/api";

function ListReservations({ reservations }) {
    return (
        <div>
            <hr />
            {reservations.map((reservation, id) => (
                <div key={id}>
                    <h5>{reservation.last_name}, {reservation.first_name} {reservation.mobile_number}</h5>
                    <h6>{reservation.reservation_date} at {reservation.reservation_time} for {reservation.people} people</h6>
                    <hr />
                </div>
            ))}
        </div>
    )
}

export default ListReservations;