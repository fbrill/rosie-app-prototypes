import "@/styles/globals.css";
import "dialkit/styles.css";
import { DialRoot } from "dialkit";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <DialRoot productionEnabled position="top-left" />
    </>
  );
}
