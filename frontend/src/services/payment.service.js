import api from "./api";

export const createRazorpayOrder = (orderId) => api.post("/payments/create-order", { orderId });

export const verifyPayment = (payload) => api.post("/payments/verify", payload);
export const markOrderSuccessForNow = (orderId) => api.post("/payments/mark-success", { orderId });
