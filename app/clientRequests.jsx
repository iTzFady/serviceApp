import ConversationPopup from "@/components/ConversationPopup";
import RequestCard from "@/components/RequestCard";
import RequestModal from "@/components/RequestModal";
import UserModal from "@/components/UserModal";
import { useRequestsHub } from "@/context/RequestsHubContext";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { useApi } from "@/hooks/useApi";
import { fonts } from "@/theme/fonts";
import { centerContainer } from "@/theme/styles";
import { formatTime } from "@/utility/formatTime";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Request() {
  const { user } = useUser();
  const { token, setToken } = useToken();
  const { events } = useRequestsHub();
  const { colorScheme } = useContext(ThemeContext);
  const api = useApi();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
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
    if (!token || !user?.id) return;
    const fetchRequests = async () => {
      setLoading(true);
      api
        .get("/api/requests/getClientRequests")
        .then((res) => setRequests(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
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
      {loading ? (
        <View style={centerContainer}>
          <ActivityIndicator />
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
        />
      ) : (
        <View style={centerContainer}>
          <Text style={{ fontFamily: fonts.light }}>
            لا توجد طلبات في الوقت الحالي
          </Text>
        </View>
      )}
      {showModal && (
        <RequestModal
          request={selectedRequest}
          show={showModal}
          setShow={setShowModal}
          url={apiUrl}
          token={token}
          userType="Client"
          handleContact={handleContactModal}
        />
      )}
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
