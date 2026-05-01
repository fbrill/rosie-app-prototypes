import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Rosie Onboarding" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rosie Onboarding" />
        <meta property="og:description" content="UI prototypes for Rosie onboarding flows." />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rosie Onboarding" />
        <meta name="twitter:description" content="UI prototypes for Rosie onboarding flows." />
        <meta name="twitter:image" content="/og-image.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased bg-gray-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
