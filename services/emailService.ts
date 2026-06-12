import emailjs from "emailjs-com";

const SERVICE_ID = "service_jnkxei3";
const TEMPLATE_ID = "template_nl7e2pl";
const PUBLIC_KEY = "x3wIbTmDBFwXgGgPy";

export const sendOTPEmail = async (
  toEmail: string,
  otp: string
) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        otp: otp,
      },
      PUBLIC_KEY
    );

    return true;
  } catch (error) {
  console.log("FULL EMAIL ERROR:", JSON.stringify(error));
  return false;
}
};