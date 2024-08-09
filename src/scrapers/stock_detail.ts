import { Dataset, PuppeteerCrawlingContext } from 'crawlee';
import { scrapeDividendPayout } from './dividend_payout.js';

export type ScrapeStockDetailOptions = {
    dividendPayoutValidator?:
        (yieldPercent: number, ratioPercent: number, growthPercent: number) => Promise<boolean> | boolean;
    peValidator?:
        (current: number, forward: number) => Promise<boolean> | boolean;
}

export const scrapeStockDetail = async (ctx: PuppeteerCrawlingContext, options?: ScrapeStockDetailOptions) => {
    const { page } = ctx;

    const header = await page.$('main[id=main] > div:first-child > div:first-child > div:first-child');
    if (!header) {
        return;
    }

    const name = await header.$eval('h1:first-child', (element) => element.innerText.split(' (')[0]);

    const [exchangeWithSymbol, , currency] = await header.$eval(
        'h1:first-child + div',
        (element) => element.innerText.split(' · '),
    );

    const [exchange, symbol] = exchangeWithSymbol.split(':').map((token) => token.trim());

    const priceAmount = await page.$eval(
        'main[id=main] > div:first-child > div:nth-child(2) > div:first-child > div:first-child',
        (element) => Number.parseFloat(element.innerText),
    );

    const currentPE = await page.$eval(
        'main[id=main] > div:nth-child(2) > div > table > tbody > tr > td::-p-text(PE Ratio) + td',
        (element) => Number.parseFloat(element.innerText),
    );

    const forwardPE = await page.$eval(
        'main[id=main] > div:nth-child(2) > div > table > tbody > tr > td::-p-text(Forward PE) + td',
        (element) => Number.parseFloat(element.innerText),
    );

    if (options?.peValidator && !(await options.peValidator(currentPE, forwardPE))) {
        return;
    }

    const dividendPayout = await scrapeDividendPayout(ctx);

    if (
        options?.dividendPayoutValidator
        && !(await options.dividendPayoutValidator(dividendPayout.yieldPercent, dividendPayout.ratioPercent, dividendPayout.growthPercent))
    ) {
        return;
    }

    await Dataset.pushData({
        name,
        symbol,
        exchange,

        price: {
            amount: priceAmount,
            currency,
        },

        pe: {
            current: currentPE,
            forward: forwardPE,
        },

        dividendPayout,
    });
};
