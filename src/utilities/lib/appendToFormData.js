export const filterUndefined = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

export const appendToFormData = (
  data,
  formData = new FormData(),
  parentKey = ""
) => {
  const filteredData = filterUndefined(data);

  Object.entries(filteredData).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${formKey}[${index}]`, item);
        } else if (typeof item === "object" && item !== null) {
          appendToFormData(item, formData, `${formKey}[${index}]`);
        } else {
          formData.append(`${formKey}[${index}]`, item);
        }
      });
    } else if (value instanceof File) {
      formData.append(formKey, value);
    } else if (typeof value === "object" && value !== null) {
      appendToFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value);
    }
  });

  return formData;
};
