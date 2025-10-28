import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";

export const useFetchUserData = () => {
  const { updateUser } = useUser();
  const api = useApi();
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/user/me"),
      api.get("/api/user/workers"),
      api.get("/api/requests/getClientRequests"),
    ])
      .then(([me, workers, requests]) => {
        updateUser(me.data);
        setWorkers(workers.data);
        setRequests(requests.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return { workers, requests, loading, setRequests };
};
