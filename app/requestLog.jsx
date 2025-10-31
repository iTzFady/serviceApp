import LogCard from "@/components/LogCard";
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

export default function RequestLog() {
  const { user } = useUser();
  const { token, setToken } = useToken();
  const { events } = useRequestsHub();
  const { colorScheme } = useContext(ThemeContext);
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        Toast.show({
          type: "error",
          text1: "انتهت الجلسة",
          text2: "يجب تسجيل الدخول مرة أخرى لأن الجلسة انتهت.",
          text1Style: {
            textAlign: "right",
          },
          text2Style: {
            textAlign: "right",
          },
        });
        router.replace("/login");
        Toast.show({
          type: "error",
          text1: "انتهت الجلسة",
          text2: "يجب تسجيل الدخول مرة أخرى لأن الجلسة انتهت.",
          text1Style: {
            textAlign: "right",
          },
          text2Style: {
            textAlign: "right",
          },
        });
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
        .get("/api/requests/getClientRequests", { headers: { isLog: true } })
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
      <LogCard
        key={item.id}
        workerName={item.requestedFor.name || "Unknown"}
        clientName={item.requestedBy.name || "Unknown"}
        rating={item.requestedFor.rating || 0}
        request={item.title || "No title"}
        dateTime={formatTime(item.completedTime)}
        status={item.status}
        RatingDisabled={item.hasRated}
        ReportDisabled={item.hasReported}
        onRatingPress={() => {
          if (!item.hasRated) {
            setShowRatingModal(!showRatingModal);
            setSelectedRequest(item);
          } else {
            Toast.show({
              type: "info",
              text1: "تنبيه",
              text2: "تم تسجيل تقييمك لهذا المستخدم مسبقًا",
              text1Style: {
                textAlign: "right",
              },
              text2Style: {
                textAlign: "right",
              },
            });
          }
        }}
        onReportPress={() => {
          if (!item.hasReported) {
            setShowReportModal(!showReportModal);
            setSelectedRequest(item);
          } else {
            Toast.show({
              type: "info",
              text1: "تنبيه",
              text2: "لقد قمت بالإبلاغ عن هذا المستخدم من قبل",
              text1Style: {
                textAlign: "right",
              },
              text2Style: {
                textAlign: "right",
              },
            });
          }
        }}
      />
    );
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
          <Text style={styles.topText}>سجل الطلبات</Text>
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
      <RequestModal
        request={selectedRequest}
        show={showModal}
        setShow={setShowModal}
        url={apiUrl}
        token={token}
        userType="Client"
      />
      <RequestModal
        request={selectedRequest}
        show={showRatingModal}
        setShow={setShowRatingModal}
        url={apiUrl}
        token={token}
        userType="Client"
        type="rating"
        jobId={selectedRequest?.id}
        ratedUser={
          selectedRequest?.requestedFor?.id === user?.id
            ? selectedRequest?.requestedBy?.id
            : selectedRequest?.requestedFor?.id
        }
        setRequests={setRequests}
      />
      <RequestModal
        request={selectedRequest}
        show={showReportModal}
        setShow={setShowReportModal}
        url={apiUrl}
        token={token}
        userType="Client"
        type="report"
        jobId={selectedRequest?.id}
        ratedUser={
          selectedRequest?.requestedFor?.id === user?.id
            ? selectedRequest?.requestedBy?.id
            : selectedRequest?.requestedFor?.id
        }
        setRequests={setRequests}
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
