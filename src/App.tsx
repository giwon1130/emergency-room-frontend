import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home/HomePage";
import { EmergencyRoomPage } from "./pages/emergency-room/EmergencyRoomPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/emergency-room" element={<EmergencyRoomPage />} />
    </Routes>
  );
}

