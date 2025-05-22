import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentService = createApi({
  reducerPath: "payment",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const reducers = getState();
      const token = reducers?.authReducer?.userToken;
      headers.set("authorization", token ? `Bearer ${token}` : "");
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      sendPayment: builder.mutation({
        query: (cart) => {
          return {
            url: "/create-checkout-session",
            method: "POST",
            body: cart,
          };
        },
      }),
      verifyPayment: builder.mutation({
        query: (id) => ({
          url: `verify-payment/${id}`,
          method: "GET",
          credentials: "include"
        }),
      }),
      verifyPaymentStatus: builder.query({
        query: (id) => ({
          url: `verify-payment/${id}`,
          method: "GET",
          credentials: "include"
        }),
      }),
    };
  },
});
export const { 
  useSendPaymentMutation, 
  useVerifyPaymentMutation,
  useVerifyPaymentStatusQuery 
} = paymentService;
export default paymentService;
