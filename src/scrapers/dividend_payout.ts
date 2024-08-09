import { PuppeteerCrawlingContext } from 'crawlee';

type DividendPayoutData = {
    yieldPercent: number;
    ratioPercent: number;
    growthPercent: number;
}

const noDividendPaymentData = {
    yieldPercent: NaN,
    ratioPercent: NaN,
    growthPercent: NaN,
} as const satisfies DividendPayoutData;

export const scrapeDividendPayout = async ({ page }: PuppeteerCrawlingContext): Promise<DividendPayoutData> => {
    const dividendTabLink = await page.$('main[id=main] > div > nav > ul > li > a[data-title=Dividends]');

    if (!dividendTabLink) {
        return noDividendPaymentData;
    }

    await Promise.all([
        page.waitForNavigation(),
        dividendTabLink.click(),
    ]);

    const dataTable = await page.$('main[id=main] > div:nth-child(2) > div > div[data-test]');
    if (!dataTable) {
        throw new Error('failed to find dividend payout data table');
    }

    const yieldPercent = await dataTable.$eval(
        'div::-p-text(Dividend Yield) > div',
        (element) => Number.parseFloat(element.innerText),
    );

    const ratioPercent = await dataTable.$eval(
        'div::-p-text(Payout Ratio) > div',
        (element) => Number.parseFloat(element.innerText),
    );

    const growthPercent = await dataTable.$eval(
        'div::-p-text(Dividend Growth) > div',
        (element) => Number.parseFloat(element.innerText),
    );

    return {
        yieldPercent,
        ratioPercent,
        growthPercent,
    };
};
