import { PuppeteerCrawlingContext } from 'crawlee';
import { stockDetailRoutePattern } from '../routes/routes.js';
import { stockDetailRequestLabel } from '../request_labels.js';

export const scrapeStockList = async ({ page, enqueueLinks }: PuppeteerCrawlingContext) => {
    for (;;) {
        await enqueueLinks({
            globs: [stockDetailRoutePattern],
            label: stockDetailRequestLabel,
        });

        const hasNextPage = !!(await page.$('div[id=main-table-wrap] + nav > button:last-child:not([disabled])'));
        if (!hasNextPage) {
            break;
        }

        await page.click('div[id=main-table-wrap] + nav > button:last-child');
        await page.waitForSelector('div[id=main-table-wrap]:not([class*="opacity-"])');
    }
};
