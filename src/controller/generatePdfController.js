const { getBrowserInstance, getContext, closeBrowserInstances } = require("../utils/browser.js");

exports.createPdf = async (req, res) => {
  const { htmlContent, customTailwindConfig = '', customCSS = '', customFilename = '' } = req.body;

  let browser;
  let context;
  try {
    browser = await getBrowserInstance();
    context = await getContext(browser);

    const completeHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <script>${customTailwindConfig}</script>
          <style type="text/tailwindcss">
            @page {
              size: A4;
              margin: 20mm;
            }
            ${customCSS}
            .page-break {
              page-break-before: always;
            }
            h3 {
              page-break-after: avoid;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    const page = await context.newPage();
    await page.setContent(completeHtml, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForLoadState('networkidle');

    // Add the CSS class dynamically for page breaks
    await page.evaluate(() => {
      const pageBreakElements = document.body.innerHTML.split('PAGEBREAK');
      document.body.innerHTML = pageBreakElements
        .map((content, index) =>
          index === 0
            ? `<div>${content}</div>`
            : `<div class="page-break">${content}</div>`
        )
        .join('');
    });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await page.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${customFilename !== '' || null ? customFilename : "superdocx"}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (error.name === 'TimeoutError') {
      return res.status(408).json({ error: 'PDF generation timeout, please try again later.' });
    }
    res.status(500).json({ error: 'PDF generation failed' });
  } finally {
    await closeBrowserInstances();
  }
};