import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, seatReservation, updateStatus } from "../utils/api";

function SeatReservation() {
    const [tables, setTables] = useState([]);
    const [reservation, setReservation] = useState({});
    const { reservation_id } = useParams();
    const initialTable = { table_id: "" };
    const [table, setTable] = useState(initialTable);
    const [resError, setResError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();
        const initialTableForRes = { table_id: "" };
        setTable(initialTableForRes);
        setResError(null);

        async function getTables() {
            try {
                const getTablesFromApi = await listTables(abortController.signal);
                setTables(getTablesFromApi);
            } catch (error) {
                if (error.name !== "AbortEror") setResError(error);
            }
        }

        async function getRes() {
            try {
                const getResFromApi = await readReservation(reservation_id, abortController.signal);
                setReservation(getResFromApi);
            } catch (error) {
                if (error.name !== "AbortError") setResError(error);
            }
        }

        getTables();
        getRes();

        return () => {
            abortController.abort();
        }
    }, [reservation_id]);

    const handleChange = (event) => {
        setTable({ ...table, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const table_id = Number(table.table_id);
        const reservation = parseInt(reservation_id);
        setResError(null);
        setTable(initialTable);

        try {
            await seatReservation(reservation, table_id, abortController.signal);
            history.push("/dashboard");
        } catch (error) {
            if (error.name !== "AbortError") setResError(error);
        }

        return () => abortController.abort();
    }

    const withinCapacity = tables.map((table) => {
        const overCapacity = Number(table.capacity) < Number(reservation.people);
        return (
            <option key={table.table_id} value={table.table_id} overCapacity={overCapacity}>
                Table: {table.table_name} - Capacity: {table.capacity}
            </option>
        )
    })

    return (
        <div>
            <ErrorAlert error={resError} />
            <hr />
            <form onSubmit={handleSubmit}>
                <h4>Choose a table for your reservation</h4>
                <hr />
                <select 
                    name="table_id"
                    value="table_id"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>
                        Choose A Table:
                    </option>
                    {withinCapacity}
                </select>
                <hr />
                <div>
                    <button className="btn btn-dark" type="submit">
                        Submit
                    </button>
                </div>
                <br />
                <div>
                    <button className="btn btn-danger" onClick={() => history.go(-1)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SeatReservation;