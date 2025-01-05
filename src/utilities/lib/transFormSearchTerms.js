import dayjs from "dayjs";

export const transformSearchParams = (search) => {
  let searchParams = "";
  if (typeof search === "string") {
    searchParams += `&keyword=${search}`;
  } else if (search) {
    Object.keys(search).forEach((key) => {
      if (search[key]) {
        if (
          key === "date" &&
          Array.isArray(search[key]) &&
          search[key].length === 2
        ) {
          const [startDate, endDate] = search[key];
          const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
          const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
          searchParams += `&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
        } else {
          const paramKey = key || "keyword";
          searchParams += `&${paramKey}=${search[key]}`;
        }
      }
    });
  }
  return searchParams;
};
