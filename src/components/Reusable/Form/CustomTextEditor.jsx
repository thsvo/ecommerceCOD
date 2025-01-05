import { useRef } from "react";
import JoditEditor from "jodit-react";

const CustomTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const config = {
    readonly: false,
    theme: "light",
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "fontsize",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "table",
      "link",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "copyformat",
      "|",
      "fullsize",
      "selectall",
      "print",
      "|",
      "video",
      "cut",
      "copy",
      "paste",
      "find",
    ],
    placeholder: "Start typing...",
  };

  return (
    <JoditEditor
      ref={editorRef}
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
};

export default CustomTextEditor;
