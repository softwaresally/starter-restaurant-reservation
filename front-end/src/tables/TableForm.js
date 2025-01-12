import React from "react";
import { useHistory } from "react-router";

function TableForm({ table, changeHandler, submitHandler }) {

    const history = useHistory();

    return (
        <div>
            <form onSubmit={submitHandler}>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                        Table Name
                    </label>
                    <div className="col-sm-8">
                        <input
                            type="text"
                            name="table_name"
                            className="form-control"
                            id="table_name"
                            placeholder="Table Name"
                            onChange={changeHandler}
                            value={ `${table.table_name}` }
                            required={true}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                        Capacity
                    </label>
                    <div className="col-sm-8">
                        <input
                            type="number"
                            name="capacity"
                            className="form-control"
                            id="capacity"
                            placeholder="Capacity"
                            onChange={changeHandler}
                            value={ `${table.capacity}` }
                            min="1"
                            required={true}
                        />
                        <br />
                    </div>
                </div>
                <div>
                    <button className="btn btn-dark btn-lg btn-block" type="submit">
                        Submit
                    </button>
                </div>
                <br />
                <div>
                    <button className="btn btn-danger btn-lg btn-block" onClick={() => history.goBack()}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TableForm;