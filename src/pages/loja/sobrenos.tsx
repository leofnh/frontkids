import { useEffect, useState } from "react";
import { useData } from "../../components/context";
import { FooterSite, NavSite } from "../../components/navsite";
import { ConfigSiteType } from "../../components/types";
import { api } from "../../services/api";
import { Main } from "../../components/main";

export function SobreNosSite() {
  const [content, setContent] = useState("");
  const { isConfigSite } = useData() as {
    isConfigSite: ConfigSiteType;
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
    <>
      <Main style={{ backgroundColor: isConfigSite.body }}>
        <NavSite />
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <FooterSite style={{ backgroundColor: isConfigSite.footer }} />
      </Main>
    </>
  );
}
