[English](https://github.com/yuyi2583/kreact-redux) | **简体中文**

kreact-redux是模仿react-redux编写简易版组件，支持在类组件和函数组件中使用。实现了`connect`, `Provider`, `useSelector`, `useDispatch` 以及redux的`bindActionCreators`。

## 用法

### 创建store

```javascript
import { combineReducers, createStore } from "redux";

export const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case 'ADD':
            return state + 1;
        case 'MINUS':
            return state - 1;
        default:
            return state
    }
}

const store=createStore(combineReducers({count:counterReducer}));

export default store;
```

### 提供store

```javascript
//root\index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from './kreact-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```



### 类组件

```javascript
import React, { Component } from "react";
import { connect, bindActionCreators } from "../kreact-redux";


class ReduxPage extends Component {

    render() {
        const { count, add, minus } = this.props;
        console.log("this.props", this.props);
        return (
            <>
                <h3>ReduxPage</h3>
                <div>{count}</div>
                <button onClick={add}>add</button>
                <button onClick={minus}>minus</button>
                <button onClick={() => this.props.dispatch({ type: "ADD" })}>dispatch add</button>
            </>
        )
    }
}

const mapStateToProps = ({ count }) => ({ count });

// ! mapDispatch can be either a function or an object
// const mapDispatchToProps={
//     add:()=>({type:"ADD"}),
//     minus:()=>({type:"MINUS"}),
// }
const mapDispatchToProps = (dispatch) => {
    let creators = {
        add: () => ({ type: "ADD" }),
        minus: () => ({ type: "MINUS" }),
    }
    creators=bindActionCreators(creators,dispatch);
    return creators;
}
export default connect(mapStateToProps, mapDispatchToProps)(ReduxPage);
```

### 函数组件

```javascript
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
```

## 实现

### bindActionCreators

```javascript
export default function bindActionCreators(creators,dispatch) {
    let obj={};
    for(let key in creators){
        obj[key]=bindActionCreator(creators[key],dispatch);
    }
    return obj;
}

function bindActionCreator(creator,dispatch) {
    return (...args)=>dispatch(creator(...args));
}
```

### Provider

```javascript
import Context from "./context";

export default function Provider({store,children}) {
    return (
        <Context.Provider value={store}>{children}</Context.Provider>
    )
}
```

### connect

```javascript
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
```

### useSelector

```javascript
import { useStore } from "./connect";

export default function useSelector(selector) {
    const store=useStore();
    return selector(store.getState());
}
```

### useDispatch

```javascript
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
```

