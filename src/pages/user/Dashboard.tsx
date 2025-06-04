import { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  useTheme,
  TextField,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  Tooltip,
  Snackbar,
  Fab,
  Collapse,
  Alert,
} from "@mui/material";
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
} from "@mui/lab";
import { motion } from "framer-motion";
import { ChevronRight, Close, Chat, ExpandMore, ExpandLess, ThumbUp } from "@mui/icons-material";
import {
  Calendar,
  Pill,
  Video,
  Activity,
  FileText,
  MessageCircle,
  Star,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  HeartPulse,
  MessageCircleCode as ChatIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useConsultation } from "../../contexts/ConsultationContext";
import UpcomingConsultation from "../../components/user/UpcomingConsultation";
import HealthStats from "../../components/user/HealthStats";

// Error Boundary
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fff", borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <AlertCircle size={48} color="#ff4d4f" />
          <Typography color="error" variant="h6" sx={{ mt: 2, mb: 3, fontWeight: 600 }}>
            Oops! Something went wrong: {this.state.error?.message || "Unknown error"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => this.setState({ hasError: false, error: null })}
            sx={{ bgcolor: "#ff4d4f", borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, "&:hover": { bgcolor: "#d9363e" } }}
          >
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

const UserDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { consultations, availableIssues } = useConsultation();
  const navigate = useNavigate();
  const [activeHealthTip, setActiveHealthTip] = useState(0);
  const [symptoms, setSymptoms] = useState("");
  const [symptomResult, setSymptomResult] = useState(null);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [showSymptomHistory, setShowSymptomHistory] = useState(false);
  const [healthGoal, setHealthGoal] = useState({ target: "Walk 10k steps", progress: 0, max: 10000 });
  const [journalInput, setJournalInput] = useState("");
  const [journalMood, setJournalMood] = useState("neutral");
  const [journalEntries, setJournalEntries] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Smith");
  const [openChatModal, setOpenChatModal] = useState(false);
  const [badges, setBadges] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [newBadgeModal, setNewBadgeModal] = useState({ open: false, badge: null });
  const [dailyStreak, setDailyStreak] = useState(1);
  const [likedTips, setLikedTips] = useState([]);
  const [chatOpened, setChatOpened] = useState(false);
  const totalBadges = 8;

  // Filter consultations
  const userConsultations = user?.id
    ? consultations.filter((c) => c.patientId === user.id)
    : [];
  const upcomingConsultation = userConsultations.find((c) => c.status === "scheduled");
  const completedConsultations = userConsultations.filter((c) => c.status === "completed");
  const recentPrescription = completedConsultations.length > 0
    ? completedConsultations[completedConsultations.length - 1]?.prescription
    : null;

  // Mock data
  const mockDoctors = [
    { id: 1, name: "Dr. Smith", specialty: "General Practitioner", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Dr. Patel", specialty: "Cardiologist", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "Dr. Lee", specialty: "Dermatologist", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  ];
  const mockSymptomsAdvice = [
    { symptom: "headache", advice: "Stay hydrated and rest. Consider ibuprofen if persistent. Consult if severe.", severity: "Low" },
    { symptom: "fever", advice: "Monitor temperature and hydrate. Seek medical attention if above 100.4°F for 24 hours.", severity: "Medium" },
    { symptom: "cough", advice: "Use a humidifier and stay hydrated. Persistent cough may require a doctor visit.", severity: "Medium" },
    { symptom: "fatigue", advice: "Ensure adequate sleep and balanced diet. Consult if fatigue persists for weeks.", severity: "Low" },
    { symptom: "chest pain", advice: "Seek immediate medical attention. This could indicate a serious condition.", severity: "High" },
  ];
  const mockBadges = [
    { id: 1, name: "Hydration Hero", icon: <Star />, earned: false },
    { id: 2, name: "Journal Keeper", icon: <FileText />, earned: false },
    { id: 3, name: "Health Seeker", icon: <Activity />, earned: false },
    { id: 4, name: "Goal Achiever", icon: <HeartPulse />, earned: false },
    { id: 5, name: "Health Tip Explorer", icon: <Star />, earned: false },
    { id: 6, name: "Tip Enthusiast", icon: <ThumbUp />, earned: false },
    { id: 7, name: "Chat Starter", icon: <ChatIcon />, earned: false },
    { id: 8, name: "Chat Master", icon: <MessageCircle />, earned: false },
  ];
  const quickActions = [
    { icon: <Video />, label: "New Consultation", action: () => navigate("/user/request-consultation") },
    { icon: <Calendar />, label: "My Appointments", action: () => navigate("/user/my-consultations") },
    { icon: <FileText />, label: "Health Records", action: () => navigate("/user/health-profile") },
    { icon: <MessageCircle />, label: "Message Doctor", action: () => setOpenChatModal(true) },
  ];
  const healthTips = [
    {
      id: 1,
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain optimal health.",
      image: "https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      title: "Mindful Breathing",
      description: "Practice deep breathing for 5 minutes daily to reduce stress.",
      image: "https://images.pexels.com/photos/3759659/pexels-photo-3759659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 3,
      title: "Healthy Sleep",
      description: "Aim for 7-8 hours of quality sleep each night.",
      image: "https://images.pexels.com/photos/5699397/pexels-photo-5699397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];
  const motivationalPrompts = [
    "You're killing it with your health goals!",
    "Amazing progress, keep shining!",
    "Your health journey is inspiring!",
    "Wow, you're unstoppable!",
  ];

  // Initialize badges with mockBadges
  useEffect(() => {
    setBadges(mockBadges);
  }, []);

  // Fallback icon component
  const FallbackIcon = () => <Star size={24} color="#3b82f6" />;

  // Badge rendering helper
  const renderBadgeIcon = (icon) => {
    if (!icon) {
      console.warn("Badge icon is undefined, using fallback");
      return <FallbackIcon />;
    }
    return icon;
  };

  // Auto-advance health tips, demo chat, and symptom check
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setActiveHealthTip((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    const chatTimer = setTimeout(() => {
      if (chatMessages.length === 0) {
        setChatMessages([
          { sender: "user", content: "I'm experiencing a mild headache." },
          { sender: "bot", content: "Dr. Smith: Headaches can be caused by dehydration or stress. Try drinking water and resting. If it persists, consider booking a consultation." },
        ]);
      }
    }, 2000);

    const symptomTimer = setTimeout(() => {
      if (symptomHistory.length === 0) {
        const demoResult = mockSymptomsAdvice[0];
        setSymptomHistory([{ ...demoResult, timestamp: new Date() }]);
        setSymptomResult(demoResult);
      }
    }, 10000);

    const progressTimer = setInterval(() => {
      setHealthGoal((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 500, prev.max),
      }));
    }, 10000);

    return () => {
      clearInterval(tipTimer);
      clearTimeout(chatTimer);
      clearTimeout(symptomTimer);
      clearInterval(progressTimer);
    };
  }, [healthTips.length, chatMessages.length, symptomHistory.length]);

  const handleNextTip = () => {
    try {
      setActiveHealthTip((prev) => (prev + 1) % healthTips.length);
      setBadges((prev) => {
        const updatedBadges = [...prev];
        const tipExplorerIndex = updatedBadges.findIndex((b) => b.name === "Health Tip Explorer");
        if (tipExplorerIndex !== -1 && !updatedBadges[tipExplorerIndex].earned) {
          updatedBadges[tipExplorerIndex] = { ...updatedBadges[tipExplorerIndex], earned: true };
          setNewBadgeModal({ open: true, badge: updatedBadges[tipExplorerIndex] });
        }
        return updatedBadges;
      });
      setSnackbar({
        open: true,
        message: motivationalPrompts[Math.floor(Math.random() * motivationalPrompts.length)],
        severity: "success",
      });
    } catch (err) {
      console.error("Error navigating health tips:", err);
    }
  };

  const handleLikeTip = (tipId) => {
    try {
      if (!likedTips.includes(tipId)) {
        setLikedTips((prev) => [...prev, tipId]);
        if (likedTips.length + 1 >= 3) {
          setBadges((prev) => {
            const updatedBadges = [...prev];
            const tipEnthusiastIndex = updatedBadges.findIndex((b) => b.name === "Tip Enthusiast");
            if (tipEnthusiastIndex !== -1 && !updatedBadges[tipEnthusiastIndex].earned) {
              updatedBadges[tipEnthusiastIndex] = { ...updatedBadges[tipEnthusiastIndex], earned: true };
              setNewBadgeModal({ open: true, badge: updatedBadges[tipEnthusiastIndex] });
              setSnackbar({ open: true, message: "Tip Enthusiast badge earned!", severity: "success" });
            }
            return updatedBadges;
          });
        } else {
          setSnackbar({ open: true, message: "Loved the tip! Like 3 to earn a badge!", severity: "success" });
        }
      }
    } catch (err) {
      console.error("Error liking tip:", err);
    }
  };

  const handleSymptomCheck = () => {
    try {
      const result = mockSymptomsAdvice.find((a) => symptoms.toLowerCase().includes(a.symptom)) || {
        symptom: symptoms,
        advice: "Please consult a healthcare professional for a detailed assessment.",
        severity: "Unknown",
      };
      setSymptomResult(result);
      setSymptomHistory((prev) => [{ ...result, timestamp: new Date() }, ...prev.slice(0, 4)]);
      setSymptoms("");
      setSnackbar({
        open: true,
        message: motivationalPrompts[Math.floor(Math.random() * motivationalPrompts.length)],
        severity: "success",
      });
    } catch (err) {
      console.error("Error checking symptoms:", err);
    }
  };

  const handleClearSymptom = () => {
    setSymptomResult(null);
    setSnackbar({ open: true, message: "Symptom result cleared!", severity: "success" });
  };

  const handleGoalUpdate = (progress) => {
    try {
      setHealthGoal((prev) => ({ ...prev, progress }));
      if (progress >= healthGoal.max) {
        setBadges((prev) => {
          const updatedBadges = [...prev];
          const goalAchieverIndex = updatedBadges.findIndex((b) => b.name === "Goal Achiever");
          if (goalAchieverIndex !== -1 && !updatedBadges[goalAchieverIndex].earned) {
            updatedBadges[goalAchieverIndex] = { ...updatedBadges[goalAchieverIndex], earned: true };
            setNewBadgeModal({ open: true, badge: updatedBadges[goalAchieverIndex] });
            setSnackbar({ open: true, message: "Goal Achiever badge earned!", severity: "success" });
          }
          return updatedBadges;
        });
      }
    } catch (err) {
      console.error("Error updating health goal:", err);
    }
  };

  const handleJournalEntry = () => {
    try {
      if (journalInput.trim()) {
        setJournalEntries((prev) => [
          ...prev,
          { date: new Date(), content: journalInput, mood: journalMood },
        ]);
        setJournalInput("");
        setJournalMood("neutral");
        setBadges((prev) => {
          const updatedBadges = [...prev];
          const journalKeeperIndex = updatedBadges.findIndex((b) => b.name === "Journal Keeper");
          if (journalKeeperIndex !== -1 && !updatedBadges[journalKeeperIndex].earned) {
            updatedBadges[journalKeeperIndex] = { ...updatedBadges[journalKeeperIndex], earned: true };
            setNewBadgeModal({ open: true, badge: updatedBadges[journalKeeperIndex] });
            setSnackbar({ open: true, message: "Journal Keeper badge earned!", severity: "success" });
          } else {
            setSnackbar({
              open: true,
              message: motivationalPrompts[Math.floor(Math.random() * motivationalPrompts.length)],
              severity: "success",
            });
          }
          return updatedBadges;
        });
      }
    } catch (err) {
      console.error("Error adding journal entry:", err);
    }
  };

  const handleSendMessage = () => {
    try {
      if (newMessage.trim()) {
        let reply = `Dr. ${selectedDoctor}: Thank you for your message. How can I assist you further?`;
        if (newMessage.toLowerCase().includes("medication") && recentPrescription) {
          reply = `Dr. ${selectedDoctor}: Please take ${recentPrescription.medicines?.[0]?.name || "your medication"} as prescribed: ${recentPrescription.medicines?.[0]?.instructions || "follow instructions"}. Follow up on ${recentPrescription.followUp ? new Date(recentPrescription.followUp).toLocaleDateString() : "as needed"}.`;
        } else if (newMessage.toLowerCase().includes("symptom") || newMessage.toLowerCase().includes("health issue")) {
          reply = `Dr. ${selectedDoctor}: Please describe your symptoms in detail or check your symptom history in the Symptom Analyzer.`;
        } else if (newMessage.toLowerCase().includes("prescription")) {
          reply = recentPrescription
            ? `Dr. ${selectedDoctor}: Your recent prescription includes ${recentPrescription.medicines?.[0]?.name || "medication"}. Instructions: ${recentPrescription.medicines?.[0]?.instructions || "as prescribed"}.`
            : `Dr. ${selectedDoctor}: No recent prescriptions found. Would you like to schedule a consultation?`;
        } else if (newMessage.toLowerCase().includes("appointment")) {
          reply = `Dr. ${selectedDoctor}: You can book an appointment directly from the dashboard. Would you like assistance with that?`;
        } else if (newMessage.toLowerCase().includes("sleep")) {
          reply = `Dr. ${selectedDoctor}: Aim for 7-8 hours of quality sleep. Avoid screens before bed and maintain a consistent sleep schedule. Need more tips?`;
        }
        setChatMessages((prev) => [
          ...prev,
          { sender: "user", content: newMessage },
          { sender: "bot", content: reply },
        ]);
        setNewMessage("");
        setBadges((prev) => {
          const updatedBadges = [...prev];
          const healthSeekerIndex = updatedBadges.findIndex((b) => b.name === "Health Seeker");
          if (healthSeekerIndex !== -1 && !updatedBadges[healthSeekerIndex].earned) {
            updatedBadges[healthSeekerIndex] = { ...updatedBadges[healthSeekerIndex], earned: true };
            setNewBadgeModal({ open: true, badge: updatedBadges[healthSeekerIndex] });
            setSnackbar({ open: true, message: "Health Seeker badge earned!", severity: "success" });
          } else {
            setSnackbar({
              open: true,
              message: motivationalPrompts[Math.floor(Math.random() * motivationalPrompts.length)],
              severity: "success",
            });
          }
          const userMessages = chatMessages.filter((m) => m.sender === "user").length + 1;
          if (userMessages >= 5) {
            const chatMasterIndex = updatedBadges.findIndex((b) => b.name === "Chat Master");
            if (chatMasterIndex !== -1 && !updatedBadges[chatMasterIndex].earned) {
              updatedBadges[chatMasterIndex] = { ...updatedBadges[chatMasterIndex], earned: true };
              setNewBadgeModal({ open: true, badge: updatedBadges[chatMasterIndex] });
              setSnackbar({ open: true, message: "Chat Master badge earned!", severity: "success" });
            }
          }
          return updatedBadges;
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setSnackbar({ open: true, message: "Failed to send message. Please try again.", severity: "error" });
    }
  };

  // Trigger Chat Starter badge
  useEffect(() => {
    if (openChatModal && !chatOpened) {
      setChatOpened(true);
      setBadges((prev) => {
        const updatedBadges = [...prev];
        const chatStarterIndex = updatedBadges.findIndex((b) => b.name === "Chat Starter");
        if (chatStarterIndex !== -1 && !updatedBadges[chatStarterIndex].earned) {
          updatedBadges[chatStarterIndex] = { ...updatedBadges[chatStarterIndex], earned: true };
          setNewBadgeModal({ open: true, badge: updatedBadges[chatStarterIndex] });
          setSnackbar({ open: true, message: "Chat Starter badge earned!", severity: "success" });
        }
        return updatedBadges;
      });
    }
  }, [openChatModal, chatOpened]);

  const getSeverityColor = (severity) => {
    const severityMap = {
      Low: "success",
      Medium: "warning",
      High: "error",
      Unknown: "default",
    };
    return severityMap[severity] || "default";
  };

  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  return (
    <ErrorBoundary>
      <Box sx={{ 
        background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)", 
        minHeight: "100vh", 
        px: { xs: 3, md: 6 }, 
        py: 4,
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography 
              variant="h3" 
              fontWeight={800} 
              color="#1e40af" 
              sx={{ mb: 1, letterSpacing: "-0.5px" }}
            >
              Hello, {user?.name?.split(" ")[0] || "User"}!
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight={400} 
              color="#4b5563" 
              sx={{ opacity: 0.8 }}
            >
              Your Personal Health Hub • Streak: {dailyStreak} 🔥
            </Typography>
          </Box>
        </motion.div>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          {quickActions.map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: "#ffffff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)" },
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box sx={{ mb: 2, color: "#3b82f6" }}>{action.icon}</Box>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight={600} 
                      color="#1f2937"
                    >
                      {action.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Section 1: Consultation and Prescription */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          {/* Upcoming Consultation */}
          <Grid item xs={12} md={12}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Calendar size={24} color="#3b82f6" />
                      <Typography variant="h5" fontWeight={700} color="#1e40af">
                        Upcoming Consultation
                      </Typography>
                    </Box>
                    <Button 
                      variant="text" 
                      endIcon={<ChevronRight />} 
                      onClick={() => navigate("/user/my-consultations")}
                      sx={{ color: "#3b82f6", fontWeight: 500 }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  {upcomingConsultation ? (
                    <UpcomingConsultation consultation={upcomingConsultation} />
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Calendar size={48} color="#6b7280" />
                      <Typography variant="subtitle1" color="#6b7280" sx={{ mt: 2, mb: 3 }}>
                        No upcoming consultations
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/user/request-consultation")}
                        sx={{ 
                          borderRadius: 2, 
                          bgcolor: "#3b82f6", 
                          px: 4, 
                          py: 1.5, 
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#2563eb" }
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Prescription */}
          <Grid item xs={12} md={6}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Pill size={24} color="#3b82f6" />
                      <Typography variant="h5" fontWeight={700} color="#1e40af">
                        Recent Prescription
                      </Typography>
                    </Box>
                    {recentPrescription && (
                      <Chip 
                        label="Active" 
                        color="success" 
                        size="small" 
                        sx={{ bgcolor: "#10b981", fontWeight: 600 }} 
                      />
                    )}
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  {recentPrescription ? (
                    <Box>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#3b82f6", width: 40, height: 40 }}>
                          <Pill size={20} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {completedConsultations[completedConsultations.length - 1]?.issueName || "Unknown Issue"}
                          </Typography>
                          <Typography variant="caption" color="#6b7280">
                            Prescribed by {completedConsultations[completedConsultations.length - 1]?.doctorName || "Unknown Doctor"}
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ my: 2, borderColor: "#e5e7eb" }} />
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                        Medications
                      </Typography>
                      {recentPrescription.medicines?.map((medicine, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" fontWeight={500}>
                              {medicine.name || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="#6b7280">
                              {medicine.dosage || "N/A"}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="#6b7280">
                            {medicine.instructions || "Follow doctor’s advice"} • {medicine.duration || "N/A"}
                          </Typography>
                        </Box>
                      )) || (
                        <Typography variant="body2" color="#6b7280">
                          No medications listed.
                        </Typography>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                          Doctor’s Advice
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                          {recentPrescription.advice || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <FileText size={48} color="#6b7280" />
                      <Typography variant="subtitle1" color="#6b7280" sx={{ mb: 3 }}>
                        No recent prescriptions.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
<Grid item xs={12} md={6}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card
                sx={{
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  backgroundImage: `url(${healthTips[activeHealthTip]?.image || ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
                  position: "relative",
                  minHeight: 485,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                }}
              >
                <Box sx={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  bgcolor: "rgba(0,0,0,0.5)", 
                  borderRadius: 2 
                }} />
                <IconButton
                  onClick={() => setActiveHealthTip((prev) => (prev - 1 + healthTips.length) % healthTips.length)}
                  sx={{ 
                    position: "absolute", 
                    left: 16, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" }
                  }}
                >
                  <ChevronRight sx={{ transform: "rotate(180deg)", color: "#1f2937" }} />
                </IconButton>
                <IconButton
                  onClick={handleNextTip}
                  sx={{ 
                    position: "absolute", 
                    right: 16, 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" }
                  }}
                >
                  <ChevronRight sx={{ color: "#1f2937" }} />
                </IconButton>
                <CardContent sx={{ textAlign: "center", py: 8, px: 4, position: "relative" }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                    {healthTips[activeHealthTip]?.title || "Health Tip"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    {healthTips[activeHealthTip]?.description || "Stay healthy!"}
                  </Typography>
                  <Button
                    variant="contained"
                    color={likedTips.includes(healthTips[activeHealthTip]?.id) ? "success" : "primary"}
                    onClick={() => handleLikeTip(healthTips[activeHealthTip]?.id)}
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: likedTips.includes(healthTips[activeHealthTip]?.id) ? "#10b981" : "#3b82f6",
                      py: 1.5,
                      fontWeight: 600,
                      "&:hover": { bgcolor: likedTips.includes(healthTips[activeHealthTip]?.id) ? "#059669" : "#2563eb" }
                    }}
                    startIcon={<ThumbUp />}
                  >
                    {likedTips.includes(healthTips[activeHealthTip]?.id) ? "Liked" : "Like Tip"}
                  </Button>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
                    {healthTips.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: index === activeHealthTip ? "white" : "rgba(255,255,255,0.5)",
                          transition: "background-color 0.3s ease",
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
         
        </Grid>

        <Divider sx={{ my: 6, borderColor: "#e5e7eb" }} />
 {/* Symptom Checker */}
          
        {/* Section 2: Health Tools */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          <Grid item xs={12} md={12}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Activity size={24} color="#3b82f6" />
                    <Typography variant="h5" fontWeight={700} color="#1e40af">
                      AI Symptom Checker
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  <TextField
                    fullWidth
                    label="Describe your symptoms"
                    variant="outlined"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    sx={{ mb: 3, borderRadius: 2, bgcolor: "#f9fafb" }}
                  />
                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleSymptomCheck}
                      disabled={!symptoms.trim()}
                      sx={{ 
                        borderRadius: 2, 
                        flex: 1, 
                        bgcolor: "#3b82f6", 
                        py: 1.5, 
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#2563eb" }
                      }}
                      startIcon={<Activity />}
                    >
                      Analyze
                    </Button>
                    {symptomResult && (
                      <Button
                        variant="outlined"
                        onClick={handleClearSymptom}
                        sx={{ 
                          borderRadius: 2, 
                          flex: 1, 
                          borderColor: "#6b7280", 
                          color: "#6b7280",
                          py: 1.5,
                          fontWeight: 600
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </Box>
                  {symptomResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Box sx={{ p: 3, borderRadius: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            Health Report
                          </Typography>
                          <Chip
                            label={symptomResult.severity}
                            size="small"
                            color={getSeverityColor(symptomResult.severity)}
                            sx={{ 
                              ml: 1, 
                              bgcolor: getSeverityColor(symptomResult.severity) === "success" ? "#10b981" : 
                                      getSeverityColor(symptomResult.severity) === "error" ? "#ff4d4f" : 
                                      getSeverityColor(symptomResult.severity) === "warning" ? "#f59e0b" : "#6b7280",
                              color: "white",
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                          Symptoms
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                          {symptomResult.symptom.split(",").map((symp, index) => (
                            <Chip
                              key={index}
                              label={symp.trim().charAt(0).toUpperCase() + symp.trim().slice(1)}
                              size="small"
                              sx={{ bgcolor: "#e5e7eb", color: "#1f2937", fontWeight: 500 }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                          Recommendation
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                          {symptomResult.advice}
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      onClick={() => setShowSymptomHistory(!showSymptomHistory)}
                      endIcon={showSymptomHistory ? <ExpandLess /> : <ExpandMore />}
                      sx={{ 
                        bgcolor: "#f9fafb", 
                        color: "#3b82f6",
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#e5e7eb" }
                      }}
                    >
                      {showSymptomHistory ? "Hide History" : "Show History"}
                    </Button>
                    <Collapse in={showSymptomHistory}>
                      <Box sx={{ mt: 2 }}>
                        {symptomHistory.length > 0 ? (
                          <Timeline sx={{ p: 0 }}>
                            {symptomHistory.slice(0, 3).map((entry, index) => (
                              <TimelineItem key={index}>
                                <TimelineSeparator>
                                  <TimelineDot sx={{ bgcolor: getSeverityColor(entry.severity) + ".main" }} />
                                  {index < symptomHistory.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                  <Typography variant="caption" color="#6b7280">
                                    {new Date(entry.timestamp).toLocaleString()}
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {entry.symptom}
                                  </Typography>
                                  <Typography variant="caption" color="#6b7280">
                                    {entry.advice}
                                  </Typography>
                                </TimelineContent>
                              </TimelineItem>
                            ))}
                          </Timeline>
                        ) : (
                          <Typography variant="subtitle1" color="#6b7280" sx={{ textAlign: "center" }}>
                            No symptom history yet.
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          {/* Health Goal Tracker */}
          <Grid item xs={12} md={6}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <HeartPulse size={24} color="#3b82f6" />
                    <Typography variant="h5" fontWeight={700} color="#1e40af">
                      Health Goal Tracker
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  <Tooltip title="Set a health goal">
                    <TextField
                      fullWidth
                      label="Set Your Goal"
                      variant="outlined"
                      value={healthGoal.target}
                      onChange={(e) => setHealthGoal({ ...healthGoal, target: e.target.value })}
                      sx={{ mb: 3, borderRadius: 2, bgcolor: "#f9fafb" }}
                    />
                  </Tooltip>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, textAlign: "center" }}>
                    Progress
                  </Typography>
                  <Slider
                    value={healthGoal.progress}
                    onChange={(e, newValue) => handleGoalUpdate(newValue)}
                    max={healthGoal.max}
                    step={100}
                    valueLabelDisplay="auto"
                    sx={{ color: "#10b981", mb: 2 }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((healthGoal.progress / (healthGoal.max || 1)) * 100, 100)}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": { bgcolor: "#10b981", borderRadius: 5 },
                      mb: 2,
                    }}
                  />
                  <Typography variant="caption" color="#6b7280" sx={{ textAlign: "center" }}>
                    {healthGoal.progress}/{healthGoal.max} {healthGoal.target.includes("step") ? "steps" : "units"}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Health Journal */}
          <Grid item xs={12} md={6}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <FileText size={24} color="#3b82f6" />
                    <Typography variant="h5" fontWeight={700} color="#1e40af">
                      Health Journal
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="How are you feeling today?"
                      variant="outlined"
                      value={journalInput}
                      onChange={(e) => setJournalInput(e.target.value)}
                      sx={{ borderRadius: 2, bgcolor: "#f9fafb" }}
                    />
                    <Select
                      value={journalMood}
                      onChange={(e) => setJournalMood(e.target.value)}
                      sx={{ minWidth: 120, borderRadius: 2, bgcolor: "#f9fafb" }}
                    >
                      <MenuItem value="happy"><Smile size={18} color="#10b981" /> Happy</MenuItem>
                      <MenuItem value="neutral"><Meh size={18} color="#3b82f6" /> Neutral</MenuItem>
                      <MenuItem value="sad"><Frown size={18} color="#ff4d4f" /> Sad</MenuItem>
                    </Select>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleJournalEntry}
                    disabled={!journalInput.trim()}
                    sx={{ 
                      borderRadius: 2, 
                      width: "100%", 
                      py: 1.5, 
                      bgcolor: "#3b82f6", 
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#2563eb" }
                    }}
                  >
                    Log Entry
                  </Button>
                  <Box sx={{ mt: 3 }}>
                    {journalEntries?.length > 0 ? (
                      <Timeline sx={{ p: 0 }}>
                        {journalEntries.slice(-3).reverse().map((entry, index) => (
                          <TimelineItem key={index}>
                            <TimelineSeparator>
                              <TimelineDot
                                sx={{
                                  bgcolor:
                                    entry.mood === "happy" ? "#10b981" :
                                    entry.mood === "sad" ? "#ff4d4f" : "#3b82f6",
                                }}
                              />
                              {index < journalEntries.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                {entry.mood === "happy" && <Smile size={16} color="#10b981" />}
                                {entry.mood === "neutral" && <Meh size={16} color="#3b82f6" />}
                                {entry.mood === "sad" && <Frown size={16} color="#ff4d4f" />}
                                <Typography variant="caption" color="#6b7280" sx={{ ml: 1 }}>
                                  {new Date(entry.date).toLocaleString()}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="#1f2937">
                                {entry.content}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    ) : (
                      <Typography variant="subtitle1" color="#6b7280" sx={{ textAlign: "center" }}>
                        Start logging your mood!
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: "#e5e7eb" }} />

        {/* Section 3: Health Tips and Achievements */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          {/* Health Tips Carousel */}
          

          {/* Achievements */}
          <Grid item xs={12} md={12}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Star size={24} color="#3b82f6" />
                    <Typography variant="h5" fontWeight={700} color="#1e40af">
                      Achievements ({earnedBadgesCount}/{totalBadges})
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  <LinearProgress
                    variant="determinate"
                    value={(earnedBadgesCount / totalBadges) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": { bgcolor: "#10b981", borderRadius: 5 },
                      mb: 3,
                    }}
                  />
                  <Grid container spacing={2}>
                    {badges.map((badge, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <motion.div
                          initial={{ scale: badge.earned ? 1.1 : 1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Card
                            sx={{
                              borderRadius: 2,
                              bgcolor: badge.earned ? "#10b981" : "#f9fafb",
                              color: badge.earned ? "white" : "#1f2937",
                              textAlign: "center",
                              p: 2,
                              boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                              transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                          >
                            <Box sx={{ fontSize: 28, mb: 1.5 }}>{renderBadgeIcon(badge.icon)}</Box>
                            <Typography variant="caption" fontWeight={600}>
                              {badge.name}
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.8 }}>
                              {badge.earned ? "Earned!" : "Unlock it!"}
                            </Typography>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: "#e5e7eb" }} />

        {/* Section 4: Health Statistics */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          <Grid item xs={12}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Activity size={24} color="#3b82f6" />
                    <Typography variant="h5" fontWeight={700} color="#1e40af">
                      Health Statistics
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  <HealthStats />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: "#e5e7eb" }} />

        {/* Section 5: Recommended Services */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: "#ffffff", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.12)", transform: "translateY(-4px)" },
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Video size={24} color="#3b82f6" />
                    <Typography variant="h5" fontWeight={700} color="#1e40af">
                      Recommended Services
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />
                  <Grid container spacing={3}>
                    {availableIssues?.slice(0, 3).map((issue, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Card
                            sx={{
                              borderRadius: 2,
                              bgcolor: "#f9fafb",
                              cursor: "pointer",
                              boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                              transition: "transform 0.3s ease, box-shadow 0.3s ease",
                              "&:hover": { boxShadow: "0 8px 25px rgba(0,0,0,0.1)" },
                            }}
                            onClick={() => navigate("/user/request-consultation")}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Chip
                                  label={issue.category || "General"}
                                  color={issue.category === "NHM" ? "primary" : "secondary"}
                                  size="small"
                                  sx={{ bgcolor: issue.category === "NHM" ? "#3b82f6" : "#8b5cf6", color: "white", fontWeight: 600 }}
                                />
                                {index === 0 && (
                                  <Chip
                                    label="Featured"
                                    color="warning"
                                    size="small"
                                    sx={{ bgcolor: "#f59e0b", color: "white", fontWeight: 600 }}
                                  />
                                )}
                              </Box>
                              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                {issue.name || "Service"}
                              </Typography>
                              <Typography variant="body2" color="#6b7280">
                                {issue.description || "Consult a specialist."}
                              </Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    )) || (
                      <Typography variant="subtitle1" color="#6b7280" sx={{ textAlign: "center", width: "100%", py: 4 }}>
                        No services available.
                      </Typography>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Floating Chat Button */}
        <Fab
          color="primary"
          onClick={() => setOpenChatModal(true)}
          sx={{ 
            position: "fixed", 
            bottom: 32, 
            right: 32, 
            zIndex: 1000, 
            bgcolor: "#3b82f6", 
            borderRadius: "50%",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "#2563eb" }
          }}
        >
          <ChatIcon size={24} />
        </Fab>

        {/* Chatbot Modal */}
        <Dialog
          open={openChatModal}
          onClose={() => setOpenChatModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: "#ffffff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#3b82f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3,
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <HeartPulse size={24} color="white" />
              <Typography variant="h6" fontWeight={700}>
                AI Health Assistant
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenChatModal(false)}>
              <Close sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
              <Select
                fullWidth
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: "#f9fafb", maxWidth: "70%" }}
              >
                {mockDoctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.name}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar src={doctor.avatar} sx={{ width: 28, height: 28, borderRadius: "50%" }} />
                      <Typography variant="body2">
                        {doctor.name} ({doctor.specialty})
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="outlined"
                onClick={() => setShowSymptomHistory(true)}
                sx={{ 
                  borderRadius: 2, 
                  borderColor: "#3b82f6", 
                  color: "#3b82f6",
                  py: 1,
                  fontWeight: 600
                }}
              >
                Symptom History
              </Button>
            </Box>
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography variant="caption" color="#6b7280">
                Messages sent: {chatMessages.filter((m) => m.sender === "user").length}/5 for a badge
              </Typography>
            </Box>
            <Box sx={{ maxHeight: 300, overflowY: "auto", bgcolor: "#f9fafb", p: 3, borderRadius: 2, mb: 3, border: "1px solid #e5e7eb" }}>
              {chatMessages.length > 0 ? (
                chatMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: msg.sender === "user" ? "#dbeafe" : "white",
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography variant="body2">
                      {msg.sender === "user" ? "You" : selectedDoctor}: {msg.content}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="subtitle1" color="#6b7280" sx={{ textAlign: "center" }}>
                  Ask {selectedDoctor} about your health or book a consultation!
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                fullWidth
                label="Ask about symptoms, medications, or appointments"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: "#f9fafb" }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{ 
                  borderRadius: 2, 
                  px: 4, 
                  py: 1.5, 
                  bgcolor: "#3b82f6", 
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#2563eb" }
                }}
              >
                Send
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              bgcolor:
                snackbar.severity === "success" ? "#10b981" :
                snackbar.severity === "error" ? "#ff4d4f" :
                snackbar.severity === "warning" ? "#f59e0b" : "#3b82f6",
              color: "white",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              fontWeight: 600,
              "& .MuiAlert-icon": { color: "white" },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* New Badge Modal */}
        <Dialog
          open={newBadgeModal.open}
          onClose={() => setNewBadgeModal({ open: false, badge: null })}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: "#ffffff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#3b82f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3,
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Star size={24} color="white" />
              <Typography variant="h6" fontWeight={700}>
                New Badge Earned!
              </Typography>
            </Box>
            <IconButton onClick={() => setNewBadgeModal({ open: false, badge: null })}>
              <Close sx={{ color: "white" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4, textAlign: "center" }}>
            {newBadgeModal.badge ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Box sx={{ fontSize: 56, color: "#10b981", mb: 3 }}>
                  {renderBadgeIcon(newBadgeModal.badge.icon)}
                </Box>
                <Typography variant="h5" fontWeight={700} color="#1f2937" sx={{ mb: 2 }}>
                  {newBadgeModal.badge.name}
                </Typography>
                <Typography variant="subtitle1" color="#6b7280" sx={{ mb: 3 }}>
                  Congratulations on your achievement!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setNewBadgeModal({ open: false, badge: null })}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#3b82f6",
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#2563eb" },
                  }}
                >
                  Awesome!
                </Button>
              </motion.div>
            ) : (
              <Typography variant="subtitle1" color="#6b7280">
                No badge details available.
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
};

export default UserDashboard;