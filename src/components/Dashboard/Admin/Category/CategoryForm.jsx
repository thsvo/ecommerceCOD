import { useEffect } from "react";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { Form } from "antd";

const CategoryForm = ({ attachment }) => {
  const form = Form.useFormInstance();

  const { data: categoriesData, isFetching: isCategoryFetching } =
    useGetAllCategoriesQuery();

  const parentCategoryOptions = categoriesData?.results
    ?.filter(
      (item) => item?.status !== "Inactive" && item?.level === "parentCategory"
    )
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const categoryOptions = categoriesData?.results
    ?.filter(
      (item) => item?.status !== "Inactive" && item?.level === "category"
    )
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const subCategoryOptions = categoriesData?.results
    ?.filter(
      (item) => item?.status !== "Inactive" && item?.level === "subCategory"
    )
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const level = Form.useWatch("level", form);

  useEffect(() => {
    form.setFieldValue("level", "parentCategory");
  }, [form]);

  return (
    <>
      <CustomSelect
        name="level"
        label="Category Level"
        options={[
          { value: "parentCategory", label: "Parent Category" },
          { value: "category", label: "Category" },
          { value: "subCategory", label: "Sub Category" },
        ]}
        required={true}
      />

      <CustomInput label="Name" name="name" type="text" required={true} />

      {(level === "parentCategory" || level === "subCategory") && (
        <CustomSelect
          label={level === "subCategory" ? "Category" : "Categories"}
          name="categories"
          options={categoryOptions}
          required={level === "subCategory" ? true : false}
          loading={isCategoryFetching}
          disabled={isCategoryFetching}
          mode={level === "subCategory" ? undefined : "multiple"}
        />
      )}

      {level === "category" && (
        <>
          <CustomSelect
            label="Parent Category"
            name="parentCategory"
            options={parentCategoryOptions}
            required={true}
            loading={isCategoryFetching}
            disabled={isCategoryFetching}
          />
          <CustomSelect
            label="Sub Categories"
            name="subCategories"
            options={subCategoryOptions}
            required={false}
            loading={isCategoryFetching}
            disabled={isCategoryFetching}
            mode={"multiple"}
          />
        </>
      )}

      <FileUploader
        defaultValue={attachment}
        label="Category Image"
        name="attachment"
      />
    </>
  );
};

export default CategoryForm;
