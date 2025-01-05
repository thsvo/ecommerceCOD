import React, { useState } from "react";
import CustomDatePicker from "@/components/Reusable/Form/CustomDatePicker";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { Radio } from "antd";

const OfferForm = ({ attachment }) => {
  const { data: productData } = useGetAllProductsQuery();
  const { data: categoryData } = useGetAllCategoriesQuery();

  const [selection, setSelection] = useState("product");

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const activeCategories = categoryData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  return (
    <>
      <CustomInput label={"Name"} name={"name"} type={"text"} required={true} />
      <CustomInput
        label={"Description"}
        name={"description"}
        type={"textarea"}
      />

      <Radio.Group
        onChange={(e) => setSelection(e.target.value)}
        value={selection}
        style={{ marginBottom: "1rem" }}
      >
        <Radio value="product">Product</Radio>
        <Radio value="category">Category</Radio>
      </Radio.Group>

      {selection === "product" ? (
        <CustomSelect
          name={"product"}
          label={"Product"}
          options={activeProducts}
          mode={"multiple"}
          required={true}
        />
      ) : (
        <CustomSelect
          name={"category"}
          label={"Category"}
          options={activeCategories}
          mode={"multiple"}
          required={true}
        />
      )}

      <div className="two-grid">
        <CustomDatePicker
          name={"startDate"}
          label={"Start Date"}
          required={true}
        />
        <CustomDatePicker name={"endDate"} label={"End Date"} required={true} />
      </div>
      <CustomSelect
        name={"type"}
        label={"Offer Type"}
        options={[
          { value: "flash deal", label: "Flash Deal" },
          { value: "hot deal", label: "Hot Deal" },
          { value: "special offer", label: "Special Offer" },
        ]}
        required={true}
      />
      <div className="two-grid">
        <CustomSelect
          name={"discountType"}
          label={"Discount Type"}
          options={[
            { value: "percentage", label: "Percentage" },
            { value: "fixed", label: "Fixed" },
          ]}
          required={true}
        />
        <CustomInput
          name={"discount"}
          label={"Discount Amount"}
          required={true}
        />
      </div>
      <FileUploader
        defaultValue={attachment}
        label="Offer Image"
        name="attachment"
        required={true}
      />
    </>
  );
};

export default OfferForm;
