import hi from "./hi.json";
import bn from "./bn.json";
const langs = {
  hi,bn
};

export default function Dictionary(lang = "en") {
  if (lang === "en")
    return {
      type: "en"
    };
    //console.log(langs[lang],"hi")
  console.log(JSON.stringify(langs[lang]));
  return langs[lang];
}
