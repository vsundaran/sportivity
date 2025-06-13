import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native"
import { useAuth } from "@/context/AuthContext"
import { Link, useRouter } from "expo-router";

export default function SettingsScreen() {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false)
    const { logout } = useAuth();
    const router = useRouter()

    const handleLogout = () => {
        logout();
        setLogoutModalVisible(false)
    }

    return (
        <View style={styles.container}>

            {/* Settings Items */}
            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingItem} onPress={()=> router.navigate('/profile')}>
                    <Text style={styles.settingText}>PROFILE</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.settingItem} onPress={()=> router.navigate('/pic-sport')}>
                    <Text style={styles.settingText}>PRIMARY SPORT</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.settingItem} onPress={()=> router.navigate('/skill-assessment')}>
                    <Text style={styles.settingText}>SKILL ASSESSMENT</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>TERMS OF SERVICES</Text>
                </TouchableOpacity>


                <View style={styles.divider} />

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>GIVE FEEDBACK</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>INVITE PEOPLE</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>RATE US ON APPSTORE</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>VERSION 1.00</Text>
                </View>

                <View style={styles.divider} />
                <TouchableOpacity style={styles.settingItem} onPress={() => setLogoutModalVisible(true)}>
                    <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={logoutModalVisible}
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Logout</Text>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>

                        <View style={styles.modalButtons}>
                            <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setLogoutModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>

                            <Pressable style={[styles.modalButton, styles.logoutModalButton]} onPress={handleLogout}>
                                <Text style={styles.logoutModalButtonText}>Logout</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 44,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#007AFF",
    },
    placeholder: {
        width: 44,
    },
    settingsContainer: {
        flex: 1,
    },
    settingItem: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    settingText: {
        fontSize: 15,
        color: "#333333",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
    },
    logoutContainer: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#F5F7FA",
    },
    logoutButton: {
        paddingVertical: 12,
    },
    logoutText: {
        fontSize: 15,
        color: "#007AFF",
        fontWeight: "500",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 13,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 15,
        marginBottom: 20,
        textAlign: "center",
        color: "#666",
    },
    modalButtons: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#F0F0F0",
    },
    cancelButtonText: {
        color: "#007AFF",
        fontWeight: "600",
    },
    logoutModalButton: {
        backgroundColor: "#007AFF",
    },
    logoutModalButtonText: {
        color: "white",
        fontWeight: "600",
    },
})
