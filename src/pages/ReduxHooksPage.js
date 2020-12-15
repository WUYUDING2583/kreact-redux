import { useCallback } from "react";
import { useDispatch, useSelector } from "../kreact-redux"

export default function ReduxHooksPage(props) {
    const count=useSelector(({count})=>count);
    const dispatch=useDispatch();
    const add=useCallback(()=>{
        dispatch({type:"ADD"});
    },[]);
    const minus=useCallback(()=>{
        dispatch({type:"MINUS"});
    },[]);
    return (
        <>
            <h3>ReduxHooksPage</h3>
            <div>{count}</div>
            <button onClick={add}>add</button>
            <button onClick={minus}>minus</button>
        </>
    )

}