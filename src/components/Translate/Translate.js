import React from "react";
// The function which returns you translated words based on a language.
import Dictionary from "./Dictionary";

class Translate extends React.PureComponent {
  translateWord(word) {
    try {
      const { lang } = this.props;
      // lang = "es"
      const languageDb = Dictionary(lang);
      console.log(languageDb+"-> LanguageDB");
      if (word in languageDb.words) {
       
        return languageDb.words[word];
      }

      return word;
    } catch (err) {
      console.error("Error while translating::translateWord", err);

      // If something goes wrong return the word as it is.
      return word;
    }
  }

  render() {
    const { lang, children } = this.props;

    if (typeof children === "string" && lang !== "en") {
      // pass the lowerCased word to get in the translated form.
      return this.translateWord(children.toLowerCase());
    }

    return children;
  }
}

export default Translate;
