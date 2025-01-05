import dayjs from "dayjs";
import { formatImagePath } from "./formatImagePath";

const excludedKeys = [];

export const transformDefaultValues = (defaultValue, selectedData) => {
  if (!defaultValue) return [];

  const fields = [];

  const selectedDataMap = (
    Array.isArray(selectedData) ? selectedData : []
  ).reduce((acc, { name, value }) => {
    acc[name] = value || "";
    return acc;
  }, {});

  for (const key in defaultValue) {
    if (defaultValue.hasOwnProperty(key)) {
      let value = defaultValue[key];

      if (selectedDataMap[key] !== undefined) {
        value = selectedDataMap[key];
      } else {
        if (value === "true") {
          value = true;
        } else if (
          key.includes("expiredDate") ||
          key.includes("startDate") ||
          key.includes("endDate")
        ) {
          value = dayjs(value, "YYYY-MM-DD");
          if (!value.isValid()) {
            value = null;
          }
        } else if (value === "false") {
          value = false;
        } else if (Array.isArray(value) && typeof value[0] === "number") {
          fields.push({
            name: key,
            value: value,
            errors: "",
          });
          continue;
        } else if (Array.isArray(value)) {
          if (key === "images" && Array.isArray(value)) {
            value = value.map((url, index) => ({
              url: formatImagePath(url),
              uid: `__AUTO__${Date.now()}_${index}__`,
            }));
          } else {
            value = value.length > 0 ? value[0] : null;
          }
        } else if (
          typeof value === "string" &&
          value.startsWith("http") &&
          !excludedKeys.includes(key)
        ) {
          value = [{ url: value }];
        }
      }

      fields.push({
        name: key,
        value: value,
        errors: "",
      });
    }
  }

  // Add selected data fields that are not in the default value
  if (Array.isArray(selectedData)) {
    selectedData.forEach((data) => {
      if (!fields.some((field) => field.name === data.name)) {
        fields.push(data);
      }
    });
  }

  return fields;
};
