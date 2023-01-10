import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

function NewReservation() {
    const initialFormState = {
        first_name: "", 
        last_name: "", 
        mobile_number: "", 
        reservation_date: today(), 
        reservation_time: "", 
        people: "",
    }

    const [reservation, setReservation] = useState({ ...initialFormState });
    const [reservationError, setReservationError] = useState(null);

    const history = useHistory();

    function formatDate(date) {
        let formatedDate = date.split("");
        formatedDate.splice(10);
        formatedDate = formatedDate.join("");
        return formatedDate;
      }
    
      function formatTime(time) {
        let formatedTime = time.split("");
        formatedTime.splice(5);
        formatedTime = formatedTime.join("");
        return formatedTime;
      }

    const changeHandler = ({ target }) => {
        const { name, value } = target;
        switch (name) {
          case "people":
            setReservation({ ...reservation, [name]: parseInt(value) });
            break;
          case "reservation_date":
            setReservation({ ...reservation, [name]: formatDate(value) });
            break;
          case "reservation_time":
            setReservation({ ...reservation, [name]: formatTime(value) });
            break;
          default:
            setReservation({ ...reservation, [name]: value });
            break;
        }
      }

    async function submitHandler(event) {
        const abortController = new AbortController()
        event.preventDefault();
    
        setReservationError(null);
        const newRes = {
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          mobile_number: reservation.mobile_number,
          people: Number(reservation.people),
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          status: "booked",
        };
        try {
          await createReservation(newRes, abortController.signal);
          setReservation(initialFormState);
          history.push(`/dashboard?date=${newRes.reservation_date}`);
        } catch (error) {
          if (error.name !== "AbortError") setReservationError(error);
        }
    
        return () => {
          abortController.abort();
        };
      }

return (
    <section>
        <div>
        <h2>Book your reservation today</h2>
            <ErrorAlert error={reservationError} />
            <ReservationForm 
                reservation={reservation}
                submitHandler={submitHandler}
                changeHandler={changeHandler}   
            />
        </div>
    </section>
)
}








export default NewReservation;