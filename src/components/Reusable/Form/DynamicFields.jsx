import { Form, Input, Button } from "antd";
import { GoPlusCircle, GoX } from "react-icons/go";

const DynamicFields = ({ name, placeholders, labels, fieldNames }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key}>
              <div className="three-grid mt-6">
                <Form.Item
                  {...restField}
                  name={[name, fieldNames.id || "id"]}
                  label={labels.id || "id"}
                  className="hidden"
                >
                  <Input
                    placeholder={placeholders.id || "Enter id"}
                    type="number"
                    size="large"
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, fieldNames.name || "contact_name"]}
                  label={labels.name || "Contact Name"}
                  rules={[
                    { required: true, message: `Contact Name is required` },
                  ]}
                >
                  <Input
                    placeholder={placeholders.name || "Enter Name"}
                    type="text"
                    size="large"
                    allowClear
                    required={true}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, fieldNames.phone || "phone_number"]}
                  label={labels.phone || "Phone Number"}
                  rules={[
                    { required: true, message: `Phone Number is required` },
                  ]}
                >
                  <Input
                    placeholder={placeholders.phone || "Enter Phone Number"}
                    type="number"
                    size="large"
                    allowClear
                    required={true}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, fieldNames.relation || "relation"]}
                  label={labels.relation || "Relation"}
                >
                  <Input
                    placeholder={placeholders.relation || "Enter Relation"}
                    type="text"
                    size="large"
                    allowClear
                  />
                </Form.Item>
              </div>
              <div className="flex justify-center items-center">
                <Button
                  onClick={() => remove(name)}
                  className="text-red-500 bg-light pt-1.5 pb-2 rounded"
                >
                  <GoX className="text-xl font-bold" />
                </Button>
              </div>
            </div>
          ))}

          <Form.Item>
            <div className="flex justify-center mt-10">
              <Button
                type="button"
                className="flex items-center bg-light px-10 py-2 font-bold rounded"
                onClick={() => add()}
              >
                Add Number
                <GoPlusCircle className="ml-2" />
              </Button>
            </div>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default DynamicFields;
