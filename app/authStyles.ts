import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const authStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FCF8",
  },

  scroll: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#F9FCF8",
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 24,
  },

  topImage: {
    width: width * 0.92,
    height: height * 0.34,
    alignSelf: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#145A1D",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.4,
  },

  subtitle: {
    fontSize: 16,
    color: "#5B6F5E",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: "500",
    paddingHorizontal: 12,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 30,
    padding: 24,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 5,
  },

  input: {
    height: 58,
    borderWidth: 1,
    borderColor: "#DDE8DF",
    borderRadius: 20,
    paddingHorizontal: 18,
    marginTop: 14,
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.96)",
    color: "#1E2B21",
  },

  inputWrapper: {
    position: "relative",
    marginTop: 14,
  },

  passwordInput: {
    height: 58,
    borderWidth: 1,
    borderColor: "#DDE8DF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingRight: 55,
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.96)",
    color: "#1E2B21",
  },

  eyeButton: {
    position: "absolute",
    right: 18,
    top: 18,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#2E7D32",
    height: 58,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",

    shadowColor: "#2E7D32",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  bottomText: {
    textAlign: "center",
    marginTop: 18,
    color: "#5E7261",
    fontSize: 15,
    fontWeight: "500",
  },

  link: {
    color: "#2E7D32",
    fontWeight: "800",
  },

  smallLink: {
    color: "#2E7D32",
    marginTop: 14,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
  },

  backText: {
    marginTop: 18,
    textAlign: "center",
    color: "#607164",
    fontSize: 15,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDE8DF",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#7B8C7E",
    fontSize: 14,
    fontWeight: "600",
  },

  glassButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#DDE8DF",
  },

  glassButtonText: {
    color: "#145A1D",
    fontSize: 16,
    fontWeight: "700",
  },

  errorText: {
    color: "#D32F2F",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
  },

  successText: {
    color: "#2E7D32",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
  },
});