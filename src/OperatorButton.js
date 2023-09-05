import { ACTIONS } from "./App";

export default function OperatorButton({ dispatch, operator }) {
    return (
        <button
            onClick={() =>
                dispatch({
                    type: ACTIONS.CHOOSE_OPERATOR,
                    payload: { operator },
                })
            }
        >
            {operator}{" "}
        </button>
    );
}
