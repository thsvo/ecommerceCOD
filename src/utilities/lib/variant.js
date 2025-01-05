/* eslint-disable no-undef */
import { formatImagePath } from "./formatImagePath";
import { generateRandomCode } from "./generateRandomCode";

export function formatProductData(data, sku) {
  return data?.map((item) => {
    const key = item?.attributeCombination?.map((item) => item?.name);
    const name = key || item.name;

    const skuValue = item.sku.includes(sku + "-")
      ? item.sku.split(sku + "-")[1]?.trim() || ""
      : item.sku;

    const variant_attribute_ids = item?.attributeCombination?.map(
      (option) => option?._id
    );

    return {
      key,
      id: item._id,
      name,
      sku: skuValue,
      images: item?.images?.map((image) => formatImagePath(image)),
      stock: item.stock || 0,
      sellingPrice: item.sellingPrice,
      buyingPrice: item.buyingPrice,
      attributeCombination: variant_attribute_ids,
    };
  });
}

export function formatVariantsData(variants) {
  const attributesMap = {};

  variants?.forEach((variant) => {
    variant?.attributeCombination?.forEach((option) => {
      const { attribute } = option;

      if (attribute && !attributesMap[attribute._id]) {
        attributesMap[attribute._id] = {
          key: attribute._id.toString(),
          id: attribute._id.toString(),
          name: attribute.name,
          options: attribute.options.map((opt) => ({
            _id: opt._id,
            name: opt.name,
            label: opt.label,
            type: opt.type,
          })),
        };
      }
    });
  });
  return Object.values(attributesMap);
}

export function extractAttributeValues(attributeData) {
  const attributeValues = {};
  const attributeIds = {};

  attributeData?.variants?.forEach((variant) => {
    variant?.attributeCombination?.forEach((option) => {
      const attributeId = option?.attribute?._id;
      const attributeName = option?.name;
      const optionId = option?._id;

      if (attributeId && attributeName) {
        if (!attributeValues[attributeId]) {
          attributeValues[attributeId] = [];
        }
        if (!attributeValues[attributeId].includes(attributeName)) {
          attributeValues[attributeId].push(attributeName);
        }

        if (!attributeIds[attributeId]) {
          attributeIds[attributeId] = [];
        }
        if (!attributeIds[attributeId].includes(optionId)) {
          attributeIds[attributeId].push(optionId);
        }
      }
    });
  });

  return { attributeValues, attributeIds };
}

export const updateVariantOptions = (
  dataSource,
  variantOptions,
  variantAttributesName
) => {
  const validIds = dataSource?.map((item) => item?.id?.toString());

  Object.keys(variantOptions)?.forEach((id) => {
    if (!validIds?.includes(id?.toString())) {
      variantOptions[id] = [];
      variantAttributesName[id] = [];
    }
  });
};

export function getUniqueAttributeIds(variants) {
  const attributeIds = new Set();

  variants?.forEach((variant) => {
    variant?.attributeCombination?.forEach((item) => {
      if (item?.attribute?._id) {
        attributeIds.add(item.attribute._id);
      }
    });
  });

  return Array.from(attributeIds);
}

export const generateCombinationsFromVariantAttributes = (
  dataSource,
  variantAttributesName,
  buyingPrice = 0,
  sellingPrice = 0
) => {
  if (
    !dataSource?.length ||
    Object.keys(variantAttributesName)?.length === 0 ||
    Object.values(variantAttributesName)?.every(
      (values) => values?.length === 0
    )
  ) {
    return [];
  }

  const orderedAttributeIds = dataSource?.map((item) => item?.id);
  const options = dataSource?.flatMap((item) => item?.options);

  const filterOptions = (options, filter) =>
    options?.filter((option) =>
      filter?.[option?.attribute]?.includes(option?.name)
    );

  const orderedAttributesOptions = filterOptions(
    options,
    variantAttributesName
  );

  const combinations = [];

  const combine = (index, current) => {
    if (index === orderedAttributeIds?.length) {
      const attributeCombination = current?.map((c) => c?._id || null);
      const key = current?.map((c) => c?.name).join("-");
      const uniqueKey = `${key}-${generateRandomCode(6)}`;

      const name = key;

      combinations.push({
        key: uniqueKey,
        name,
        sku: generateRandomCode(6),
        stock: 0,
        buyingPrice: buyingPrice,
        sellingPrice: sellingPrice,
        attributeCombination,
      });
      return;
    }

    const key = orderedAttributeIds?.[index];
    const attributeOptions = orderedAttributesOptions?.filter(
      (option) => option?.attribute === key
    );

    if (attributeOptions?.length > 0) {
      for (const option of attributeOptions) {
        current.push(option);
        combine(index + 1, current);
        current.pop();
      }
    } else {
      combine(index + 1, current);
    }
  };

  combine(0, []);
  return combinations;
};

export function findNonMatchingItems(data, combination) {
  const dataNames = new Set(data?.map((item) => item?.name));

  return combination?.filter(
    (combinationItem) => !dataNames?.has(combinationItem?.name)
  );
}

export const getIdsNotInSelectedRowData = (selectedRowData, data) => {
  const selectedIds = new Set(selectedRowData?.map((item) => item?.id));
  return data
    ?.filter((item) => !selectedIds?.has(item?.id))
    ?.map((item) => item?.id);
};
