import { useEffect, useState } from "react";

import "react-quill/dist/quill.snow.css";
import { Main } from "../../components/main";
import { FooterSite, NavSite } from "../../components/navsite";
import { useData } from "../../components/context";
import { ConfigSiteType } from "../../components/types";
import { Button } from "../../components/ui/button";
import { api } from "../../services/api";
import { ToastContainer } from "react-toastify";

export function SobreNos() {
  const [content, setContent] = useState("");
  const [isEdit, setEdit] = useState(false);
  const { isConfigSite, notifySuccess, notifyError } = useData() as {
    isConfigSite: ConfigSiteType;
    notifySuccess: (text: string) => string;
    notifyError: (text: string) => string;
  };

  const handleChange = (value: string) => {
    setContent(value);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "color",
    "background",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "video",
  ];

  const handleSavePage = async () => {
    const data = new FormData();
    data.append("aboutus", content);
    try {
      const response = await api.post("api/config/aboutus/", data);
      const status = response.data.status;
      const msg = response.data.msg;
      if (status == "sucesso") {
        const dados = response.data.dados[0]["page"];
        notifySuccess(msg);
        setContent(dados);
      } else {
        notifyError(msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getPage = async () => {
      const response = await api.get("api/config/aboutus/");
      const status = response.data.status;
      if (status == "sucesso") {
        const dados = response.data.dados;
        setContent(dados[0]["page"]);
      }
    };
    getPage();
  }, []);

  return (
    <Main style={{ backgroundColor: isConfigSite.body }}>
      <ToastContainer />
      <NavSite />
      <div className="flex bg-white">
        <div className="ml-auto mt-2 mr-2 mb-2">
          <Button className="h-8" onClick={() => setEdit(!isEdit)}>
            Editar
          </Button>
        </div>
      </div>
      <div className="container flex flex-col">
        {isEdit ? (
          <>
            <h2>Edite o "Sobre Nós"</h2>
            <div className="editor-container">
              <ReactQuill
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
              />
            </div>
            <div className="ml-auto mt-2">
              <Button
                className="h-7 bg-green-600 hover:bg-green-700"
                onClick={handleSavePage}
              >
                Salvar
              </Button>
            </div>
          </>
        ) : (
          ""
        )}

        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <FooterSite style={{ backgroundColor: isConfigSite.footer }} />
    </Main>
  );
}
