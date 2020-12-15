import { useStore } from "./connect";

export default function useSelector(selector) {
    const store=useStore();
    return selector(store.getState());
}