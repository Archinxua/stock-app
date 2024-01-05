<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use GuzzleHttp\Client;

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/StockUpdate.php';


// The Polygon api key used to verify your request with polygon server.
$polygonApiKey = 'w0RYLEnFJwKVbKFQsKRgqxnQ76QxvKmb';

/**
 * Function to fetch real-time prices for a given stock ticker.
 *
 * @param array  $tickers tickers to find data for ( company tickers ).
 * @param string $apiKey the api key of your polygon account.
 * */
function fetchRealTimePrices( $tickers, $apiKey ) {
	$client = new GuzzleHttp\Client( array( 'verify' => __DIR__ . '/cacert.pem' ) );  // SSL certificate path to validate your request with polygon server.
	$url     = 'https://api.polygon.io/v2/aggs/ticker/';

	$stocksData = array();

	foreach ( $tickers as $ticker ) {
		$queryParams = array( 'apiKey' => $apiKey );
		$fullUrl     = $url . $ticker . '/range/1/day/2023-01-09/2023-01-09';

		try {

			$response = $client->get( $fullUrl, array( 'query' => $queryParams ) );
			$data     = json_decode( $response->getBody(), true );
			$oValue   = $data['results'][0]['o']; // Storing Open price.

			$stocksData[ $ticker ] = array(
				'ticker'     => $ticker,
				'open_price' => $oValue,
			);
		} catch ( GuzzleHttp\Exception\ClientException $e ) {
			// @todo handle any errors if any.
		}
	}

	return $stocksData;
}



// Pre-defined stock symbols.
$predefinedStocks = array( 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'BA', 'IBM', 'NFLX', 'INTC', 'CSCO', 'PYPL', 'AMD', 'DIS', 'GS', 'WMT', 'GE', 'V', 'JPM' );

// Define stocks.
$stocks = array();

// Fetch real-time prices for all predefined stocks.
$realTimePrices = fetchRealTimePrices( $predefinedStocks, $polygonApiKey );

foreach ( $predefinedStocks as $stockSymbol ) {

	if ( isset( $realTimePrices[ $stockSymbol ] ) ) {
		$stocks[ $stockSymbol ] = array(
			'openPrice'       => $realTimePrices[ $stockSymbol ]['open_price'],
			'refreshInterval' => rand( 1, 5 ),
		);
	} else {
		// If fetching data failed, include the stock with default values.
		$stocks[ $stockSymbol ] = array(
			'openPrice'       => rand( 10000, 20000 ) / 100,
			'refreshInterval' => rand( 1, 5 ),
		);
	}
}

// Store stock data in a file.
file_put_contents( __DIR__ . '/stock_data.json', json_encode( $stocks ) );

