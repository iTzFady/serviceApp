import { HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const RequestsHubContext = createContext();
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const RequestsHubProvider = ({ token, children }) => {
  const connectionRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/requests`, {
        accessTokenFactory: () => token.trim(),
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;

    newConnection.on("NewRequestCreated", (data) => {
      setEvents((prev) => [...prev, { type: "NewRequest", data }]);
    });
    newConnection.on("RequestAccepted", (data) => {
      setEvents((prev) => [...prev, { type: "Accepted", data }]);
    });

    newConnection.on("RequestCompleted", (data) => {
      setEvents((prev) => [...prev, { type: "Completed", data }]);
    });

    newConnection.on("RequestCancelled", (data) => {
      setEvents((prev) => [...prev, { type: "Cancelled", data }]);
    });

    newConnection.on("RequestRejected", (data) => {
      setEvents((prev) => [...prev, { type: "Rejected", data }]);
    });

    const startConnection = async () => {
      try {
        await newConnection.start();
        if (!isMounted) {
          await newConnection.stop();
          return;
        }
      } catch (err) {
        console.log(err);
      }
    };
    startConnection();
    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current
          .stop()
          .then(() => console.log("Disconnected"))
          .catch((err) => console.log(err));
      }
    };
  }, [token]);

  return (
    <RequestsHubContext.Provider
      value={{ connection: connectionRef.current, events }}
    >
      {children}
    </RequestsHubContext.Provider>
  );
};
export const useRequestsHub = () => useContext(RequestsHubContext);
