import { supportedExchanges } from './supported_exchanges.js';

export type Exchange = typeof supportedExchanges[number];
