import Context from "./context";

export default function Provider({store,children}) {
    return (
        <Context.Provider value={store}>{children}</Context.Provider>
    )
}