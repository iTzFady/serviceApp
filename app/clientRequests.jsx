import AlertMessage from "@/components/Alert";
import ConversationPopup from "@/components/ConversationPopup";
import RequestCard from "@/components/RequestCard";
import RequestModal from "@/components/RequestModal";
import UserModal from "@/components/UserModal";
import { useRequestsHub } from "@/context/RequestsHubContext";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { fonts } from "@/theme/fonts";
import { formatTime } from "@/utility/formatTime";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Request() {
  const { user } = useUser();
  const { token, setToken } = useToken();
  const { events } = useRequestsHub();
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
    if (!token || !user?.id || user?.role === "Client") return;
    const controller = new AbortController();
    const fetchRequests = async () => {
      try {
        axios
          .get(`${apiUrl}/api/requests/getClientRequests`, {
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
        AlertMessage("Error", "Faild to fetch requests");
      }
    };
    fetchRequests();
  }, [token, user?.id, user?.role]);
  useEffect(() => {
    if (!events.length) return;

    const latest = events[events.length - 1];
    setRequests((prevRequests) => {
      if (!prevRequests || prevRequests.length === 0) return prevRequests;

      switch (latest.type) {
        case "Accepted": {
          return prevRequests.map((req) =>
            req.id === latest.data.requestId
              ? { ...req, status: "Accepted" }
              : req
          );
        }
        case "Rejected":
        case "Cancelled":
        case "Completed": {
          return prevRequests.filter((req) => req.id !== latest.data.requestId);
        }

        default:
          return prevRequests;
      }
    });
  }, [events]);

  const renderItems = useCallback(({ item }) => {
    return (
      <RequestCard
        key={item.id}
        name={item.requestedFor.name || "Unknown"}
        rating={item.requestedFor.rating || 0}
        request={item.title || "No title"}
        dateTime={formatTime(item.dateTime)}
        status={item.status}
        onPress={() => {
          setShowModal(!showModal);
          setSelectedRequest(item);
        }}
      />
    );
  }, []);
  const handleContactModal = useCallback(() => {
    setShowModal(false);
    setShowContactModal(true);
  }, []);
  return (
    <View style={styles.safeArea}>
      <View>
        <View style={styles.topStyle}>
          <View style={styles.topElement}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios"
                size={20}
                color="rgba(0,0,0,1)"
              />
            </TouchableOpacity>
            <Text style={styles.topText}>الطلبات</Text>
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
        userType="Client"
        handleContact={handleContactModal}
      />
      {showContactModal && (
        <ConversationPopup
          show={showContactModal}
          setShow={setShowContactModal}
          phoneNumber={selectedRequest?.requestedFor.phoneNumber}
          requestedBy={selectedRequest?.requestedFor}
          requestedFor={selectedRequest?.requestedBy}
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
    backgroundColor: "rgba(127, 186, 78, 1)",
    height: 100,
    borderTopWidth: 1,
  },
  topElement: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  topText: {
    marginRight: 20,
    fontSize: 24,
    fontFamily: fonts.light,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },

  container: {
    padding: 15,
  },
});
