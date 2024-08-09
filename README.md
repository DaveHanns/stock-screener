# Stock Screener

## Overview

**Stock Screener** is an Actor designed to scrape market data and apply custom filters to help investors screen stocks based on their investing strategies. This tool allows users to specify different criteria, such as the stock exchange, dividend payouts, and PE ratios, to identify stocks that meet their desired conditions.

## Features

- **Custom Filtering:** Apply custom filters to screen stocks based on exchange, dividend payout, and PE ratio.
- **Exchange Selection:** Choose from supported exchanges like NYSE and NASDAQ.
- **Validator Functions:** Use pre-defined or custom JavaScript functions to validate stocks based on dividend payouts and PE ratios.

## Input Schema

### Parameters

| Parameter               | Type      | Description                                                                   | Default            | Required |
|-------------------------|-----------|-------------------------------------------------------------------------------|--------------------|----------|
| `exchanges`             | `array`   | Select the exchanges to be screened (e.g., NYSE, NASDAQ).                      | `["NYSE", "NASDAQ"]`| Yes      |
| `dividendPayoutValidator` | `string`  | A JavaScript function to validate each stock based on its dividend payout.    | See below example  | No       |
| `peValidator`           | `string`  | A JavaScript function to validate each stock based on its PE ratio.           | See below example  | No       |

### Example Input

```json
{
  "exchanges": ["NYSE", "NASDAQ"],
  "dividendPayoutValidator": "async (yieldPercent, ratioPercent, growthPercent) => yieldPercent >= 2.5 && ratioPercent <= 40 && growthPercent >= 7;",
  "peValidator": "async (current, forward) => current > 0 && current <= 15 && forward <= current;"
}
