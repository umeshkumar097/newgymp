import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";

// Mock font registration if needed, or use defaults
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    borderBottom: "2pt solid #f97316",
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  logoOrange: {
    color: "#f97316",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  gymName: {
    fontSize: 22,
    fontWeight: "black",
    color: "#09090b",
    marginBottom: 5,
  },
  location: {
    fontSize: 12,
    color: "#52525b",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    borderTop: "1pt solid #e4e4e7",
    borderBottom: "1pt solid #e4e4e7",
    paddingVertical: 20,
    marginBottom: 30,
  },
  gridItem: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#a1a1aa",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#18181b",
  },
  otpContainer: {
    backgroundColor: "#f4f4f5",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  otpLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#71717a",
    marginBottom: 5,
  },
  otpValue: {
    fontSize: 28,
    fontWeight: "black",
    letterSpacing: 5,
    color: "#f97316",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "1pt solid #e4e4e7",
    paddingTop: 20,
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#a1a1aa",
    lineHeight: 1.5,
  },
});

export const BookingVoucher = ({ booking }: { booking: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.logo}>Pass</Text>
          <Text style={[styles.logo, styles.logoOrange]}>Fit</Text>
        </View>
        <Text style={styles.title}>Booking Voucher</Text>
      </View>

      {/* Gym Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gym Details</Text>
        <Text style={styles.gymName}>{booking.gym.name}</Text>
        <Text style={styles.location}>{booking.gym.location}</Text>
      </View>

      {/* Booking Info Grid */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>#{booking.id.substring(0, 12).toUpperCase()}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Plan Type</Text>
          <Text style={styles.value}>{booking.plan.type} PASS</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(booking.bookingDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>To Pay</Text>
          <Text style={[styles.value, { color: "#f97316" }]}>₹{booking.totalAmount}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, { color: "#f97316" }]}>PENDING</Text>
        </View>
      </View>

      {/* Security Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Entry Credentials</Text>
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Your Secure Entry OTP</Text>
          <Text style={styles.otpValue}>{booking.otp}</Text>
        </View>
      </View>

      {/* Important Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Important Checklist</Text>
        <Text style={[styles.footerText, { color: "#18181b", marginBottom: 5 }]}>• Please carry a valid Photo ID for verification.</Text>
        <Text style={[styles.footerText, { color: "#18181b", marginBottom: 5 }]}>• Show the QR code or OTP to the gym receptionist.</Text>
        <Text style={[styles.footerText, { color: "#18181b", marginBottom: 5 }]}>• Bring your own workout gear and shoes.</Text>
        <Text style={[styles.footerText, { color: "#18181b" }]}>• Reach the gym within the operating hours.</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a computer-generated voucher and does not require a physical signature.
        </Text>
        <Text style={[styles.footerText, { fontWeight: "bold", marginTop: 5 }]}>
          Need help? Reach us at support@passfit.in | +91 99999 99999
        </Text>
      </View>
    </Page>
  </Document>
);
