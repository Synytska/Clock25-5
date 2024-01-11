
import React, { useState, useEffect, useReducer } from "react";
import ButtonsComp from "./ButtonsComp";
import States from "./States";

const reducer = (state, action) => {
    switch (action.type) {
        case "increment":
            if (action.isBreak) {
                return { ...state, br: state.br + 1 };
            } else {
                return { ...state, sess: state.sess + 1 };
            }

        case "decrement":
            if (action.isBreak) {
                return { ...state, br: state.br - 1 };
            } else {
                return { ...state, sess: state.sess - 1 };
            }
        case "reset":
            return { ...state, br: 5, sess: 25 };
        case "toggle":
            return { ...state, isBreak: !state.isBreak };

        default:
            return state;
    }
};

const init = {
    br: 5,
    sess: 25,
    isBreak: true,
    isReset: false
};


const Timer = () => {
    const [state, dispatch] = useReducer(reducer, init);
    const [[m, s], setTime] = useState([state.sess, 0]);
    const [isPaused, setIsPaused] = useState(true);
    const [over, setOver] = useState(false);



    const onIncrement = (isBreak) => {
        if (isBreak && state.br < 60) {
            dispatch({ type: "increment", isBreak });
        } else if (!isBreak && state.sess < 60) {
            dispatch({ type: "increment", isBreak });
        }
    };

    const onDecrement = (isBreak) => {
        if (isBreak && state.br > 1) {
            dispatch({ type: "decrement", isBreak });
        } else if (!isBreak && state.sess > 1) {
            dispatch({ type: "decrement", isBreak });
        }
    };

    const onReset = () => {
        dispatch({ type: 'reset' })
        setTime([25, 0])
        setIsPaused(true);
        setOver(false);

        // const audioElement = document.getElementById('beep');
        // audioElement.pause();
        // audioElement.currentTime = 0;



    }

    const onTimer = () => {
        if (isPaused) return;
        if (m === 0 && s === 0) {
            beeper();
            if (over) {
                setTime([state.br, 0]);
                dispatch({ type: "toggle" });
                setOver(false);
            } else {
                setTime([state.sess, 0]);
                setOver(true);
            }
        } else if (s === 0) {
            setTime([m - 1, 59])
        } else {
            setTime([m, s - 1])
        }


    };

    useEffect(() => {
        let intervalId;
        intervalId = setInterval(() => {
            onTimer()
        }, 10);
        return () => clearInterval(intervalId);
    });

    useEffect(() => {
        if (over) {
            setTime([state.br, 0])
        } else {
            setTime([state.sess, 0])
        }
    }, [state.sess, over, state.br]);

    const beeper = () => {
        const audioEl = document.getElementById('beep');
        audioEl.currentTime = 0;
        audioEl.play();

    }

    return (
        <>
            <div id="wrap">
                <h1>25+5 clock</h1>
                <div id='length'>
                    <div id="test">

                        <p id="break-label">Break Length</p>
                        <div className='br-des'>
                            <ButtonsComp
                                id='break-decrement'
                                onClick={() => onDecrement(true)}
                                text='br-'
                            />

                            <States
                                id='break-length'
                                state={state.br}
                            />

                            <ButtonsComp
                                id='break-increment'
                                onClick={() => onIncrement(true)}
                                text='br+'
                            />
                        </div>
                    </div>

                    <div id="test">
                        <p id="session-label">Session Length</p>
                        <div className='br-des'>
                            <ButtonsComp
                                id='session-decrement'
                                onClick={() => onDecrement(false)}
                                text='ses-'
                            />

                            <States
                                id='session-length'
                                state={state.sess}
                            />

                            <ButtonsComp
                                id='session-increment'
                                onClick={() => onIncrement(false)}
                                text='ses+'
                            />
                        </div>
                    </div>
                </div>
                <div id="test">
                    <div id='timer'>
                        <p id="timer-label">{over ? 'Break' : 'Session'}</p>
                        <p id="time-left">{`${m
                            .toString()
                            .padStart(2, "0")}:${s
                                .toString()
                                .padStart(2, "0")}`}</p>
                    </div>

                    <ButtonsComp
                        id='start_stop'
                        onClick={() => setIsPaused(!isPaused)}
                        text={isPaused ? 'start' : 'pause'}
                    />

                    <ButtonsComp
                        id='reset'
                        onClick={onReset}
                        text='reset'
                    />
                </div>
            </div >
        </>
    );
};

export default Timer;
