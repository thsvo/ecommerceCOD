import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/services/product/productApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProductForm from "./ProductForm";
import { getUniqueAttributeIds } from "@/utilities/lib/variant";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { base_url_image } from "@/utilities/configs/base_api";

const ProductEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);
  const [content, setContent] = useState("");
  const [video, setVideo] = useState(null);

  const variantProductRef = useRef(null);

  const handleVariantProduct = useCallback((submitFunction) => {
    variantProductRef.current = submitFunction;
  }, []);

  const onChange = (fileList) => {
    setVideo(fileList);
  };

  const { data: productData, isFetching: isProductFetching } =
    useGetSingleProductQuery(itemId, {
      skip: !itemId,
    });

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const onSubmit = async (values) => {
    const variantData = variantProductRef.current
      ? variantProductRef.current()
      : null;

    const toastId = toast.loading("Updating Product...");
    try {
      const submittedData = {
        ...values,
        ...(variantData?.selectedRowData && {
          variants: variantData.selectedRowData.map((variant) => {
            const { images, ...rest } = variant;

            const processedImages = images.map((image) => {
              if (
                typeof image === "string" &&
                image.startsWith(base_url_image)
              ) {
                return image.replace(base_url_image, "");
              }
              return image;
            });

            return {
              ...rest,
              images: processedImages.filter(Boolean),
            };
          }),
        }),
        ...(content && { description: content }),
        ...(video && { video: video?.[0]?.originFileObj }),
      };

      if (values?.images?.length > 0) {
        const existingImages = values.images
          .filter((image) => image.url && image.url.startsWith(base_url_image))
          .map((image) => image.url.replace(base_url_image, ""));

        const newImages = values.images
          .filter((image) => image.originFileObj)
          .map((image) => image.originFileObj);

        submittedData.images = [...existingImages, ...newImages];
      }
      if (
        values?.mainImage &&
        Array.isArray(values.mainImage) &&
        !values.mainImage[0]?.url
      ) {
        submittedData.mainImage = await compressImage(
          values.mainImage[0].originFileObj
        );
      } else {
        delete submittedData.mainImage;
      }

      const updatedProductData = new FormData();
      appendToFormData(submittedData, updatedProductData);

      const updatedData = {
        id: itemId,
        data: updatedProductData,
      };

      const res = await updateProduct(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Product:", error);
      toast.error("An error occurred while updating the Product.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(productData, [
        {
          name: "brand",
          value: productData?.brand?._id,
          errors: "",
        },
        {
          name: "category",
          value: productData?.category?._id,
          errors: "",
        },
        {
          name: "tags",
          value: productData?.tags,
          errors: "",
        },
        {
          name: "attribute_ids",
          value: getUniqueAttributeIds(productData?.variants),
          errors: "",
        },
      ])
    );

    setContent(productData?.description);
    setVideo(productData?.video);
  }, [productData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Product"
      placement={"left"}
      loading={isProductFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <ProductForm
          attachment={formatImagePath(productData?.mainImage)}
          handleVariantProduct={handleVariantProduct}
          data={productData}
          videoData={formatImagePath(productData?.video)}
          content={content}
          setContent={setContent}
          onChange={onChange}
        />

        <CustomSelect
          name={"status"}
          label={"Status"}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default ProductEdit;
