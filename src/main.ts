import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';
import { createRouter } from './routes/router.js';
import { Exchange } from './exchanges/types.js';
import { buildStockListRoute } from './routes/routes.js';
import { stockListRequestLabel } from './request_labels.js';

type Input = {
    exchanges: Exchange[];
    dividendPayoutValidator?: string;
    peValidator?: string;
}

await Actor.init();

const {
    exchanges,
    dividendPayoutValidator,
    peValidator,
} = await Actor.getInput<Input>() ?? {};

const proxyConfiguration = await Actor.createProxyConfiguration();

// eslint-disable-next-line no-eval
const evaluatedDividendPayoutValidator = dividendPayoutValidator && eval(dividendPayoutValidator);
if (evaluatedDividendPayoutValidator && typeof evaluatedDividendPayoutValidator !== 'function') {
    throw new Error('Incorrect input: if defined, dividendPayoutValidator must be a function');
}

// eslint-disable-next-line no-eval
const evaluatedPEValidator = peValidator && eval(peValidator);
if (evaluatedPEValidator && typeof evaluatedPEValidator !== 'function') {
    throw new Error('Incorrect input: if defined, peValidator must be a function');
}

const requestHandler = createRouter({
    dividendPayoutValidator: evaluatedDividendPayoutValidator,
    peValidator: evaluatedPEValidator,
});

const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    requestHandler,
});

await crawler.run(exchanges?.map((exchange) => ({
    url: buildStockListRoute(exchange),
    label: stockListRequestLabel,
})));

await Actor.exit();
