import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";

function NewTable() {
    const initialFormState = {
        table_name: "",
        capacity: 0,
    };

    const [table, setTable] = useState({ ...initialFormState });
    const [tableError, setTableError] = useState(null);

    const history = useHistory();

    const changeHandler = ({ target }) => {
        setTable({ ...table, [target.name]: target.value });
    }

    async function submitHandler(event) {
        const abortController = new AbortController();
        event.preventDefault();

        setTableError(null);
        const newTable = {
            table_name: table.table_name,
            capacity: Number(table.capacity),
        };

        try {
            await createTable(newTable, abortController.signal);
            setTable(initialFormState);
            history.push(`/dashboard`)
        } catch (error) {
            if (error.name !== "AbortError") setTableError(error);
        }

        return () => {
            abortController.abort();
        };
    }

    return (
        <section>
            <div>
                <h2>Tables</h2>
                <ErrorAlert error={tableError} />
                <TableForm
                    table={table}
                    submitHandler={submitHandler}
                    changeHandler={changeHandler}
                />
            </div>
        </section>
    )
}

export default NewTable;