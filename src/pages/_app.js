import "@/styles/globals.css";
import "dialkit/styles.css";
import { DialRoot } from "dialkit";
import { VercelToolbar } from "@vercel/toolbar/next";

export default function App({ Component, pageProps }) {
  // Only load the Vercel Toolbar on deployments (not local dev) so reviewers
  // can leave feedback/comments on the prototype. It self-gates and only shows
  // for people logged into the Vercel team.
  const showToolbar = process.env.NODE_ENV === "production";

  return (
    <>
      <Component {...pageProps} />
      <DialRoot productionEnabled position="top-left" />
      {showToolbar && <VercelToolbar />}
    </>
  );
}
