import { createPuppeteerRouter } from 'crawlee';
import { stockDetailRequestLabel, stockListRequestLabel } from '../request_labels.js';
import { scrapeStockList } from '../scrapers/stock_list.js';
import { scrapeStockDetail, ScrapeStockDetailOptions } from '../scrapers/stock_detail.js';

export type RouterOptions = ScrapeStockDetailOptions;

export const createRouter = (options?: RouterOptions) => {
    const router = createPuppeteerRouter();

    router.addHandler(stockListRequestLabel, async (ctx) => {
        await scrapeStockList(ctx);
        ctx.log.info('Stock list scraped', { url: ctx.request.loadedUrl });
    });

    router.addHandler(stockDetailRequestLabel, async (ctx) => {
        await scrapeStockDetail(ctx, options);
        ctx.log.info('Stock detail scraped', { url: ctx.request.loadedUrl });
    });

    return router;
};
