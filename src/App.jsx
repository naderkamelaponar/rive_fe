import { useEffect } from "react";
import "./index.css";
import RiveComponent from "./components/RiveComponent";

export const V3mail = () => {
  // TODO: Load up Rive File

  return <RiveComponent />;
};

export default function App() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="RiveContainer">
        <RiveComponent />
      </div>
    </div>
  );
}
