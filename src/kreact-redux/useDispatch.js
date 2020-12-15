import { useStore } from "./connect";
import { useLayoutEffect, useReducer } from "react";


export default function useDispatch(){
    const [,forceUpdate]=useReducer(x=>x+1,0);
    const store=useStore();
    useLayoutEffect(()=>{
        const unsubscribe=store.subscribe(()=>{
            forceUpdate();
        });
        return ()=>{
            unsubscribe();
        }
    })
    return store.dispatch;
}