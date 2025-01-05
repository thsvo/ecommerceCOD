import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { useGetAllAttributesQuery } from "@/redux/services/attribute/attributeApi";
import {
  extractAttributeValues,
  formatVariantsData,
  generateCombinationsFromVariantAttributes,
} from "@/utilities/lib/variant";
import { Form } from "antd";
import { useEffect, useState } from "react";
import ProductVariantOption from "./ProductVariantOption";
import { VariantAttributeTable } from "./VariantAttributeTable";

const VariantAttributes = ({ onCustomSubmit, data: editData }) => {
  const form = Form.useFormInstance();

  const { data, isLoading } = useGetAllAttributesQuery();

  const options =
    data?.results?.map((item) => ({
      value: item._id,
      label: item.name,
      attribute_options: item.options,
    })) ?? [];

  const [dataSource, setDataSource] = useState([]);

  const [variantOptions, setVariantOptions] = useState({});
  const [variantAttributesName, setVariantAttributesName] = useState({});

  const onSelect = (value, option) => {
    const selected =
      option.map((item) => {
        return {
          key: item.value,
          id: item.value,
          name: item.label,
          options: item.attribute_options,
        };
      }) ?? [];

    setDataSource(selected);
  };

  useEffect(() => {
    if (editData) {
      const options = formatVariantsData(editData?.variants);

      const variantAttributes = form.getFieldValue("attribute_ids");

      const sortedDataSource = options?.sort((a, b) => {
        return (
          variantAttributes?.indexOf(a.id) - variantAttributes?.indexOf(b.id)
        );
      });

      setDataSource(sortedDataSource);

      const result = extractAttributeValues(editData);

      setVariantOptions(result.attributeIds);

      setVariantAttributesName(result.attributeValues);
    }
  }, [editData, form]);

  const mainForm = Form.useFormInstance();

  const { buyingPrice, sellingPrice } = mainForm.getFieldsValue([
    "buyingPrice",
    "sellingPrice",
  ]);

  const combination = generateCombinationsFromVariantAttributes(
    dataSource,
    variantAttributesName,
    buyingPrice,
    sellingPrice
  );

  const [reset, setReset] = useState(false);

  return (
    <>
      <CustomSelect
        label={"Variant Attributes"}
        options={options}
        isLoading={isLoading}
        name={"attribute_ids"}
        mode="multiple"
        onChange={(value, option) => onSelect(value, option)}
        required={true}
      />

      <VariantAttributeTable
        dataSource={dataSource}
        setDataSource={setDataSource}
        variantOptions={variantOptions}
        setVariantOptions={setVariantOptions}
        variantAttributesName={variantAttributesName}
        setVariantAttributesName={setVariantAttributesName}
        setReset={setReset}
      />

      <ProductVariantOption
        combination={combination}
        onCustomSubmit={onCustomSubmit}
        data={editData}
        reset={reset}
      />
    </>
  );
};

export const VariantComponent = ({ onCustomSubmit, data }) => {
  return <VariantAttributes onCustomSubmit={onCustomSubmit} data={data} />;
};
