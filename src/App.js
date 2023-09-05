import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperatorButton from "./OperatorButton";
import "./App.css";

export const ACTIONS = {
    CHOOSE_DIGIT: "choose-digit",
    CLEAR_SCREEN: "clear",
    DELETE_LAST: "delete",
    EVALUATE: "evaluate",
    CHOOSE_OPERATOR: "choose-operator",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
});

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.CHOOSE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    curOperand: payload.digit,
                    overwrite: false,
                    prevOperand: null,
                    operator: null,
                };
            }

            if (payload.digit === "0" && state.curOperand === "0") {
                return state;
            }
            if (payload.digit === ".") {
                if (state.curOperand == null) {
                    return {
                        ...state,
                        curOperand: "0.",
                    };
                } else if (state.curOperand.includes(".")) {
                    return state;
                }
            }

            return {
                ...state,
                curOperand: `${state.curOperand || ""}${payload.digit}`,
            };

        case ACTIONS.CLEAR_SCREEN:
            return {
                ...state,
                curOperand: null,
                prevOperand: null,
                operator: null,
            };

        case ACTIONS.DELETE_LAST:
            if (state.overwrite) {
                return {
                    ...state,
                    curOperand: null,
                    overwrite: false,
                };
            }

            if (state.curOperand == null) {
                return state;
            }
            if (state.curOperand.length === 1) {
                return {
                    ...state,
                    curOperand: null,
                };
            }

            return {
                ...state,
                curOperand: state.curOperand.slice(0, -1),
            };

        case ACTIONS.CHOOSE_OPERATOR:
            if (state.curOperand == null && state.prevOperand == null) {
                return state;
            }

            if (state.curOperand == null) {
                return {
                    ...state,
                    operator: payload.operator,
                };
            }

            if (state.prevOperand == null) {
                return {
                    ...state,
                    overwrite: false,
                    operator: payload.operator,
                    prevOperand: state.curOperand,
                    curOperand: null,
                };
            }

            return {
                ...state,
                prevOperand: evaluate(state),
                curOperand: null,
                operator: payload.operator,
            };

        default:
            if (
                state.operator == null ||
                state.curOperand == null ||
                state.prevOperand == null
            ) {
                return state;
            }

            return {
                ...state,
                overwrite: true,
                curOperand: evaluate(state),
                prevOperand: null,
                operator: null,
            };
    }
}

function formatOperand(operand) {
    if (operand == null) {
        return;
    }

    const [integer, decimal] = operand.split(".");
    if (decimal == null) {
        return INTEGER_FORMATTER.format(integer);
    }

    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({ curOperand, prevOperand, operator }) {
    const prev = parseFloat(prevOperand);
    const cur = parseFloat(curOperand);
    let computation = 0.0;

    if (isNaN(prev) || isNaN(cur)) {
        return "NaN";
    }

    switch (operator) {
        case "+":
            computation = prev + cur;
            break;
        case "-":
            computation = prev - cur;
            break;
        case "*":
            computation = prev * cur;
            break;
        default:
            if (cur === 0) return "NaN";
            computation = prev / cur;
            break;
    }

    return computation.toString();
}

function App() {
    const [{ curOperand, prevOperand, operator }, dispatch] = useReducer(
        reducer,
        {}
    );

    return (
        <div className="calc-grid">
            <div className="output">
                <div className="previous-operand">
                    {" "}
                    {formatOperand(prevOperand)} {operator}{" "}
                </div>{" "}
                <div className="current-operand">
                    {" "}
                    {formatOperand(curOperand)}{" "}
                </div>{" "}
            </div>{" "}
            <button
                className="span-two"
                onClick={() => dispatch({ type: ACTIONS.CLEAR_SCREEN })}
            >
                AC{" "}
            </button>{" "}
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_LAST })}>
                {" "}
                DEL{" "}
            </button>{" "}
            <OperatorButton operator="/" dispatch={dispatch} />{" "}
            <DigitButton digit="1" dispatch={dispatch} />{" "}
            <DigitButton digit="2" dispatch={dispatch} />{" "}
            <DigitButton digit="3" dispatch={dispatch} />{" "}
            <OperatorButton operator="*" dispatch={dispatch} />{" "}
            <DigitButton digit="4" dispatch={dispatch} />{" "}
            <DigitButton digit="5" dispatch={dispatch} />{" "}
            <DigitButton digit="6" dispatch={dispatch} />{" "}
            <OperatorButton operator="+" dispatch={dispatch} />{" "}
            <DigitButton digit="7" dispatch={dispatch} />{" "}
            <DigitButton digit="8" dispatch={dispatch} />{" "}
            <DigitButton digit="9" dispatch={dispatch} />{" "}
            <OperatorButton operator="-" dispatch={dispatch} />{" "}
            <DigitButton digit="." dispatch={dispatch} />{" "}
            <DigitButton digit="0" dispatch={dispatch} />{" "}
            <button
                className="span-two"
                onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
            >
                ={" "}
            </button>{" "}
        </div>
    );
}

export default App;
