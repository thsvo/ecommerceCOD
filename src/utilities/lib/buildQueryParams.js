export const buildQueryParams = ({
  page = 1,
  limit = 5,
  search = "",
  fields = [],
  startDate,
  endDate,
}) => {
  const fieldsParam = fields.length > 0 ? fields.join(",") : "";
  const startDateParam = startDate ? new Date(startDate).toISOString() : "";
  const endDateParam = endDate ? new Date(endDate).toISOString() : "";

  return {
    page,
    limit,
    search: search || "",
    fields: fieldsParam,
    startDate: startDateParam,
    endDate: endDateParam,
  };
};
