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