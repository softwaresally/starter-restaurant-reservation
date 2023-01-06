import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { today, formatAsTime } from "../utils/date-time";
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

    const [reservationErr, setReservationErr] = useState(null);

return (
    <section>
        <div>
        <h2>Book your reservation today</h2>
            <ReservationForm 
                initialFormState={initialFormState} 
                createReservation={createReservation}
                setReservationErr={setReservationErr}
                method={"POST"}    
            />
        </div>
    </section>
)
}

export default NewReservation;