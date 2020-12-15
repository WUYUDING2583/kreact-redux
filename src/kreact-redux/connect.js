import { useContext, useLayoutEffect, useReducer } from "react";
import bindActionCreators from "./bindActionCreators";
import Context from "./context";

export const useStore=()=>{
    const store = useContext(Context);
    return store;
}

const connect = (mapStateToProps, mapDispatchToProps) =>
    WrappedComponent => props => {
        const store=useStore();
        const { dispatch, subscribe, getState } = store;
        const stateProps = mapStateToProps(getState());
        const [, forceUpdate] = useReducer(x => x + 1, 0);
        useLayoutEffect(() => {
            const unsubscribe = subscribe(() => {
                forceUpdate();
            });
            return () => {
                unsubscribe();
            }
        }, [store]);

        let dispatchProps = { dispatch };
        if (typeof mapDispatchToProps === "object") {
            dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
        } else if (typeof mapDispatchToProps === "function") {
            dispatchProps=mapDispatchToProps(dispatch);
        }
        return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />
    }

export default connect;