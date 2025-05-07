import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google Analytics (GA4) */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=G-B87G43NDYF`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-B87G43NDYF', {
                  'page_path': window.location.pathname,
                  'page_location': window.location.href,
                  'page_title': document.title,
                  'send_page_view': true,
                  'cookie_domain': 'main.dz75xu0t4b888.amplifyapp.com',
                  'cookie_flags': 'SameSite=None;Secure'
                });
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 