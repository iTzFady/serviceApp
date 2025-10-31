import ConversationPopup from "@/components/ConversationPopup";
import RequestCard from "@/components/RequestCard";
import RequestModal from "@/components/RequestModal";
import Switch from "@/components/Switch";
import UserModal from "@/components/UserModal";
import { useRequestsHub } from "@/context/RequestsHubContext";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { useApi } from "@/hooks/useApi";
import { fonts } from "@/theme/fonts";
import { centerContainer, shadow } from "@/theme/styles";
import { formatTime } from "@/utility/formatTime";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Request() {
  const { user, updateUser } = useUser();
  const { token, setToken } = useToken();
  const { events } = useRequestsHub();
  const [online, setOnline] = useState(user?.isAvailable);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useContext(ThemeContext);
  const [disableSwitch, setDisableSwitch] = useState(false);
  const api = useApi();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        Toast.show({
          type: "error",
          text1: "انتهت الجلسة",
          text2: "يجب تسجيل الدخول مرة أخرى لأن الجلسة انتهت.",
        });
        router.replace("/login");
        return;
      }
      const trimmedToken = token.trim();
      if (token !== trimmedToken) {
        setToken(trimmedToken);
      }
    };
    checkToken();
  }, [router, token, setToken]);
  useEffect(() => {
    if (user?.isAvailable !== undefined && user?.role === "Worker") {
      setOnline(user.isAvailable);
    }
  }, [user?.isAvailable, user?.role]);
  useEffect(() => {
    if (!token || !user?.id || user?.role === "Client") return;
    const fetchRequests = async () => {
      setLoading(true);
      api
        .get("/api/requests/getWorkerRequests")
        .then((res) => setRequests(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
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

  const handleToggleState = (value) => {
    setDisableSwitch(true);
    api
      .put("/api/user/availability", value, {
        headers: {
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
      .catch((err) => console.log(err))
      .finally(() => setDisableSwitch(false));
  };

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
    setShowContactModal(true);
  }, []);
  const removeItem = useCallback((id) => {
    setRequests((prev) => prev.filter((work) => work.id !== id));
  }, []);
  return (
    <View style={styles.safeArea}>
      <View style={{ flex: 1 }}>
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
                  toggleState={(value) => handleToggleState(value)}
                  disabled={disableSwitch}
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
        {loading ? (
          <View style={centerContainer}>
            <ActivityIndicator size="small" />
          </View>
        ) : requests.length ? (
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
        ) : (
          <View style={centerContainer}>
            <Text style={{ fontFamily: fonts.light }}>
              لا يوجد طلبات في الوقت الحالي
            </Text>
          </View>
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
        setShowContactModal={setShowContactModal}
        requestType="worker"
      />
      {showContactModal && (
        <ConversationPopup
          show={showContactModal}
          setShow={setShowContactModal}
          phoneNumber={selectedRequest?.requestedBy.phoneNumber}
          requestedBy={selectedRequest?.requestedBy}
          requestedFor={selectedRequest?.requestedFor}
          router={router}
        />
      )}
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
    height: 100,
    ...shadow,
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
