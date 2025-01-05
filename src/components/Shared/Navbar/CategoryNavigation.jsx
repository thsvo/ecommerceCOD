import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { Menu, Dropdown } from "antd";
import Link from "next/link";

const CategoryNavigation = ({ onClose }) => {
  const { data: categories } = useGetAllCategoriesQuery();
  const renderSubcategories = (category) => {
    if (category?.subcategories && category?.subcategories.length > 0) {
      return (
        <Menu>
          {category.subcategories.map((subCategory) => (
            <Menu.Item key={subCategory?._id}>
              <Link href={`/products?filter=${subCategory?.name}`}>
                {subCategory?.name}
                {subCategory?.subcategories &&
                  subCategory?.subcategories.length > 0 && (
                    <RightOutlined className="ml-2" />
                  )}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      );
    }
    return null;
  };

  const renderCategories = (parentCategory) => {
    return (
      <Menu>
        {parentCategory?.categories?.map((category) => (
          <Menu.SubMenu
            key={category?._id}
            title={
              <Link
                href={`/products?filter=${category?.name}`}
                className="flex items-center"
              >
                {category?.name}
              </Link>
            }
          >
            {renderSubcategories(category)}
          </Menu.SubMenu>
        ))}
      </Menu>
    );
  };

  const renderParentCategories = () => {
    return categories?.results
      ?.filter((item) => item?.level === "parentCategory")
      .map((parentCategory) => (
        <Dropdown
          key={parentCategory?._id}
          overlay={renderCategories(parentCategory)}
          trigger={["hover"]}
        >
          <Link
            href={`/products?filter=${parentCategory?.name}`}
            className="flex items-center cursor-pointer"
          >
            <span>{parentCategory?.name}</span>
            {parentCategory?.categories &&
              parentCategory?.categories.length > 0 && (
                <DownOutlined className="!text-sm ml-1 mt-1" />
              )}
          </Link>
        </Dropdown>
      ));
  };

  const routes = (
    <div className="flex flex-col text-base md:flex-row md:items-center gap-5">
      {[
        {
          name: "All Products",
          link: "/products",
        },
        {
          name: "Offers",
          link: "/offers",
        },
      ].map((item, index) => (
        <Link
          key={index}
          href={item.link}
          onClick={onClose}
          className={`flex flex-col lg:items-center duration-300 `}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="md:bg-primary py-3 md:text-white lg:border-y">
      <div className="container lg:px-5 mx-auto flex flex-col md:flex-row flex-wrap gap-5 items-start md:items-center justify-center">
        {renderParentCategories()}
        <span className="rotate-90 md:rotate-0">|</span>
        {routes}
      </div>
    </div>
  );
};

export default CategoryNavigation;
