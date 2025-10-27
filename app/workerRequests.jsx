import { default as Alert } from "@/components/Alert";
import RequestCard from "@/components/RequestCard";
import RequestModal from "@/components/RequestModal";
import Switch from "@/components/Switch";
import UserModal from "@/components/UserModal";
import { useRequestsHub } from "@/context/RequestsHubContext";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { formatTime } from "@/utility/formatTime";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Request() {
  const { user, updateUser } = useUser();
  const { token, setToken } = useToken();
  const { events } = useRequestsHub();
  const [online, setOnline] = useState(user?.isAvailable);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const { colorScheme } = useContext(ThemeContext);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      if (!token) router.replace("/login");
      else setToken(token.trim());
    };
    checkToken();
  }, [router]);
  useEffect(() => {
    if (user?.isAvailable !== undefined && user?.role === "Worker") {
      setOnline(user.isAvailable);
    }
  }, [user?.isAvailable, user?.role]);
  useEffect(() => {
    if (!token || !user?.id || user?.role === "Client") return;
    const controller = new AbortController();
    const fetchRequests = async () => {
      try {
        axios
          .get(`${apiUrl}/api/requests/getWorkerRequests`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          })
          .then((res) => {
            if (Array.isArray(res.data)) {
              setRequests(res.data);
            }
          });
      } catch (err) {
        if (axios.isCancel(err)) return;

        if (err.response && err.response.data) {
          Alert(
            "Error",
            err.response.data?.message || JSON.stringify(err.response.data)
          );
        } else if (err.request) {
          Alert(
            "Network Error",
            "Unable to reach the server. Please check your connection."
          );
        } else {
          Alert("Error", "Something went wrong. Please try again later.");
        }
      }
    };
    fetchRequests();
  }, [token, user?.id, user?.role]);

  useEffect(() => {
    try {
      if (!events.length) return;
      const latest = events[events.length - 1];
      if (latest.type === "NewRequest") {
        setRequests((prev) => [...prev, latest?.data]);
      }
    } catch (err) {
      console.log(err);
    }
  }, [events]);

  const renderItems = useCallback(({ item }) => {
    return (
      <RequestCard
        key={item.id}
        name={item.requestedBy.name || "Unknown"}
        rating={item.requestedBy.rating || 0}
        request={item.title || "No title"}
        dateTime={formatTime(item.dateTime)}
        profilePicUrl={item.requestedBy.profilePictureUrl}
        status={item.status}
        onPress={() => {
          setShowModal(!showModal);
          setSelectedRequest(item);
        }}
      />
    );
  }, []);
  const AcceptRequest = useCallback((id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Accepted" } : request
      )
    );
  }, []);
  const removeItem = useCallback((id) => {
    setRequests((prev) => prev.filter((work) => work.id !== id));
  }, []);
  return (
    <View style={styles.safeArea}>
      <View style={{ backgroundColor: "#Bde3e4" }}>
        <View style={styles.topStyle}>
          <View style={styles.topElements}>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => router.back()}
            >
              <FontAwesome name="sliders" size={25} color="rgba(0,0,0,1" />
            </TouchableOpacity>
            {user?.role === "Worker" ? (
              <View style={styles.toggleOnline}>
                <Switch
                  state={online}
                  toggleState={(value) => {
                    axios({
                      method: "put",
                      url: `${apiUrl}/api/user/availability`,
                      data: value,
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    })
                      .then((res) => {
                        setOnline(res.data.isAvailable);
                        updateUser({
                          ...user,
                          isAvailable: res.data.isAvailable,
                        });
                      })
                      .catch((err) => {
                        if (err.response && err.response.data) {
                          Alert(
                            "Error",
                            err.response.data?.message ||
                              JSON.stringify(err.response.data)
                          );
                        } else if (err.request) {
                          Alert(
                            "Network Error",
                            "Unable to reach the server. Please check your connection."
                          );
                        } else {
                          Alert(
                            "Error",
                            "Something went wrong. Please try again later."
                          );
                        }
                      });
                  }}
                />
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.topButton}
              onPress={() => setShowUserModal(true)}
            >
              <MaterialIcons name="settings" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === "web" ? (
          <FlatList
            style={styles.container}
            data={requests}
            renderItem={renderItems}
            contentContainerStyle={{ height: "90vh" }}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            windowSize={5}
            removeClippedSubviews={true}
            ListFooterComponent={<View style={{ height: 50 }} />}
          />
        ) : (
          <FlatList
            style={styles.container}
            data={requests}
            renderItem={renderItems}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            windowSize={5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={100}
            ListFooterComponent={<View style={{ height: 50 }} />}
          />
        )}
      </View>
      <RequestModal
        request={selectedRequest}
        show={showModal}
        setShow={setShowModal}
        url={apiUrl}
        token={token}
        userType="Worker"
        acceptRequest={AcceptRequest}
        removeRequest={removeItem}
      />
      <UserModal show={showUserModal} setShow={setShowUserModal} />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topStyle: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 8,
  },
  topButton: {
    width: 25,
    height: 25,
  },
  topElements: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 15,
    alignContent: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  toggleOnline: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 15,
  },
});
