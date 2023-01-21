import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {
    const { reservation_id } = useParams();
    const initialFormState = {
        first_name: "", 
        last_name: "", 
        mobile_number: "", 
        reservation_date: "", 
        reservation_time: "", 
        people: 0,
    }
    const [reservation, setReservation] = useState({ ...initialFormState });
    const [error, setError] = useState(null);
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

    useEffect(() => {
        const abortController = new AbortController();
        const initialReservation = { 
            first_name: "", 
            last_name: "", 
            mobile_number: "", 
            reservation_date: "", 
            reservation_time: "", 
            people: 0,
            reservation_id: "",
            status: "",
         }

        async function getRes() {
            try {
                const response = await readReservation(reservation_id, abortController.signal);
                initialReservation.first_name = response.first_name;
                initialReservation.last_name = response.last_name;
                initialReservation.mobile_number = response.mobile_number;
                initialReservation.reservation_date = formatDate(response.reservation_date);
                initialReservation.reservation_time = formatTime(response.reservation_time);
                initialReservation.people = parseInt(response.people);
                initialReservation.reservation_id = parseInt(response.reservation_id);
                
                setReservation({ ...initialReservation });
            } catch (error) {
                if (error.name !== "AbortError") setError(error);
            }
        }
        getRes();
        return () => {
            abortController.abort();
        }
    }, [reservation_id]);

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
        event.preventDefault();
        const abortController = new AbortController();
        setError(null);

        const updatedReservation = {
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            mobile_number: reservation.mobile_number,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            people: Number(reservation.people),
            reservation_id: parseInt(reservation_id),
            status: "booked",
        };

        try {
            await updateReservation(updatedReservation, abortController.signal);
            history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
        } catch (error) {
            if (error.name !== "AbortError") setError(error);
        }

        return () => {
            abortController.abort();
        }
    }

    return (
        <div>
            <hr />
            <h5>Update Your Reservation</h5>
            <hr />
            <ErrorAlert error={error} />
            <ReservationForm 
                reservation={reservation}
                submitHandler={submitHandler}
                changeHandler={changeHandler}
            />
        </div>
    )
}

export default EditReservation;