import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";

function ViewTables({ table }) {
    
    function tableStatus(table) {
        if (table.reservation_id) {
            return (
                <div>
                    <button className="btn btn-outline-dark">
                        Occupied
                    </button>
                </div>
            )
        } else {
            return (
                <div>
                    <button className="btn btn-dark">
                        Free
                    </button>
                </div>
            )
        }
    };

    return (
        <div>
            <h5>
                {table.table_name}
                {tableStatus}
            </h5>
        </div>
    )
}

export default ViewTables;