import { useEffect } from "react";
import Header from "../../../components/header";
import { Alert } from "../components/alert";

export default function AlertPage() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.removeItem("token"); 
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <Header />
      <Alert />
    </>
  );
}
