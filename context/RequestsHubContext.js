import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";

const RequestsHubContext = createContext();
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const RequestsHubProvider = ({ token, children }) => {
  const [connection, setConnection] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!token) return;
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/requests`, {
        accessTokenFactory: () => token.trim(),
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => console.log("Connected"))
      .catch((err) => console.log("Error Occured", err));

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
    setConnection(newConnection);
    return () => {
      newConnection.stop();
    };
  }, [token]);

  return (
    <RequestsHubContext.Provider value={{ connection, events }}>
      {children}
    </RequestsHubContext.Provider>
  );
};
export const useRequestsHub = () => useContext(RequestsHubContext);
