import { useContext } from "react";
import { ObjectContext } from "../contexts/ObjectContext";

const useDnd = () => useContext(ObjectContext);

export default useDnd;
