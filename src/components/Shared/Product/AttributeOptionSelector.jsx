import React from "react";
import Image from "next/image";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const AttributeOptionSelector = ({
  groupedAttributes,
  selectedAttributes,
  handleAttributeSelect,
  item,
}) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();

  return (
    <>
      {groupedAttributes &&
        Object.entries(groupedAttributes).map(([attributeName, options]) => (
          <div key={attributeName} className="flex flex-col gap-2 my-2">
            <span className="font-medium">{attributeName}:</span>
            <div className="flex flex-wrap items-center gap-2">
              {options.map((option) => {
                const variantWithImage = item?.variants.find((variant) =>
                  variant.attributeCombination.some(
                    (attr) =>
                      attr.attribute.name === attributeName &&
                      attr.name === option.name
                  )
                );

                const isSelected =
                  selectedAttributes[attributeName] === option.name;

                const borderColor =
                  attributeName.toLowerCase() === "color"
                    ? isSelected
                      ? option.label
                      : "#D1D5DB"
                    : isSelected
                    ? globalData?.results?.primaryColor
                    : "#D1D5DB";

                return (
                  <div
                    key={option._id}
                    title={option.name}
                    style={{
                      cursor: "pointer",
                      padding: "0.25rem",
                      border: `3px solid ${borderColor}`,
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() =>
                      handleAttributeSelect(attributeName, option.name)
                    }
                  >
                    {attributeName.toLowerCase() === "color" &&
                    variantWithImage?.image ? (
                      <Image
                        src={formatImagePath(variantWithImage.image || "")}
                        alt={option.name || "Color option"}
                        width={40}
                        height={40}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : attributeName.toLowerCase() === "color" ? (
                      <span
                        style={{
                          backgroundColor: option.label || "transparent",
                          display: "block",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      ></span>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {option.label || "N/A"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </>
  );
};

export default AttributeOptionSelector;
