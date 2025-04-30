import { Routes, Route } from "react-router-dom";
import Home from "../modules/Home";
import Feedback from "../modules/Feedback";
import TrashPickup from "../modules/TrashPickup";
import TrashEx from "../modules/TrashPickupEx";
import Root from "../modules/Root";

function Index() {
  return (
    <Routes>
      <Route path={"/trash-pickup"} element={<TrashPickup />} />
      <Route path={"/feedback"} element={<Feedback />} />
      <Route path={"/home"} element={<Home />} />
      <Route path={"*"} element={<Root />} />
    </Routes>
  );
}

export default Index;
