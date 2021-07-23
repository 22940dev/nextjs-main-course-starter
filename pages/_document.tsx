import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { createGenerateId, JssProvider, SheetsRegistry } from 'react-jss';

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const registry = new SheetsRegistry();
    const generateId = createGenerateId({ minify: true });
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props =>
          (
            <JssProvider registry={registry} generateId={generateId}>
              <App {...props} />
            </JssProvider>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id='mantine-ssr-styles'>{registry.toString()}</style>
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel='icon' href='link to favicon' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
