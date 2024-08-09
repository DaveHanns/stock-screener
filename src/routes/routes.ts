import { Exchange } from '../exchanges/types.js';

const base = 'https://stockanalysis.com';

export const stockDetailRoutePattern = `${base}/stocks/*/`;

export const buildStockListRoute = (exchange: Exchange) => `${base}/list/${exchange}-stocks/`;
