import React, { useEffect, useMemo, useState } from "react";
import { useGetCommissionsQuery } from "../features/payments/paymentApiSlice";

const usePaymentNotification = () => {
  const {
    currentData: data,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetCommissionsQuery(
    { currentPage: 1, itemsPerPage: 10 },
    {
      // pollingInterval: 15000,
      // refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  return (data?.balance || 0) >= 2000;
};

export default usePaymentNotification;
