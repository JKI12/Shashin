import puppeteer from 'puppeteer';

const screenshot = async (url: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      height: 720,
      width: 1280,
    },
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36');
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });

  const image: Buffer = await page.screenshot({
    type: 'png',
    encoding: 'binary'
  }) as Buffer;

  await browser.close();

  return image;
}

export default screenshot;
