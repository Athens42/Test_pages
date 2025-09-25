// Yahoo Finance API Module
console.log(‘📡 Loading Yahoo Finance module…’);

var isUpdatingPrices = false;

// Fetch all stock prices
function fetchAllPrices() {
if (isUpdatingPrices) {
alert(‘Price update already in progress. Please wait…’);
return;
}

```
if (portfolioData.holdings.length === 0) {
    alert('Please import portfolio data first');
    return;
}

var uniqueTickers = getUniqueTickers();
console.log('🔄 Starting price update for', uniqueTickers.length, 'tickers');

isUpdatingPrices = true;
document.getElementById('yahooStatus').textContent = 'Starting price update...';

// Reset prices object
portfolioData.prices = {};

// Fetch prices sequentially to avoid overwhelming the API
fetchPricesSequentially(uniqueTickers, 0);
```

}

// Fetch prices one by one with delays
function fetchPricesSequentially(tickers, index) {
if (index >= tickers.length) {
// Finished updating all prices
finishPriceUpdate();
return;
}

```
var ticker = tickers[index].ticker;
var progress = (index + 1) + '/' + tickers.length;

document.getElementById('yahooStatus').textContent = 
    'Fetching ' + progress + ': ' + ticker;

fetchSinglePrice(ticker, function(success) {
    // Small delay between requests to be respectful to the API
    setTimeout(function() {
        fetchPricesSequentially(tickers, index + 1);
    }, 1000);
});
```

}

// Fetch price for a single stock
function fetchSinglePrice(ticker, callback) {
var proxyUrl = ‘https://api.allorigins.win/raw?url=’;
var yahooUrl = ‘https://query1.finance.yahoo.com/v8/finance/chart/’ + ticker;
var url = proxyUrl + encodeURIComponent(yahooUrl);

```
console.log('🔍 Fetching price for:', ticker);

fetch(url)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        if (data.chart && data.chart.result && data.chart.result.length > 0) {
            var result = data.chart.result[0];
            var price = result.meta.regularMarketPrice;
            var currency = result.meta.currency || 'USD';
            
            // Store price data
            portfolioData.prices[ticker] = {
                price: price,
                currency: currency.toUpperCase(),
                lastUpdated: new Date().toISOString(),
                source: 'Yahoo Finance'
            };
            
            console.log('✅', ticker + ':', price, currency);
            
            if (callback) callback(true);
        } else {
            console.log('❌', ticker + ': No price data found');
            if (callback) callback(false);
        }
    })
    .catch(function(error) {
        console.log('❌', ticker + ':', error.message);
        if (callback) callback(false);
    });
```

}

// Finish price update process
function finishPriceUpdate() {
isUpdatingPrices = false;

```
var successCount = Object.keys(portfolioData.prices).length;
var totalCount = getUniqueTickers().length;
var failureCount = totalCount - successCount;

var statusText = 'Completed: ' + successCount + ' updated';
if (failureCount > 0) {
    statusText += ', ' + failureCount + ' failed';
}

document.getElementById('yahooStatus').textContent = statusText;

var alertMessage = 'Price update completed!\n\n' +
                  '✅ Successfully updated: ' + successCount + ' stocks\n';

if (failureCount > 0) {
    alertMessage += '❌ Failed to update: ' + failureCount + ' stocks\n';
}

alert(alertMessage);

// Update price table if it's visible
var priceTableDiv = document.getElementById('priceTable');
if (priceTableDiv && priceTableDiv.style.display !== 'none') {
    showPriceTable();
}

console.log('✅ Price update completed:', successCount, 'successful,', failureCount, 'failed');
```

}

// Show/hide price table
function showPriceTable() {
var tableDiv = document.getElementById(‘priceTable’);
var isVisible = tableDiv.style.display !== ‘none’;

```
if (isVisible) {
    tableDiv.style.display = 'none';
    return;
}

if (portfolioData.holdings.length === 0) {
    alert('Please import portfolio data first');
    return;
}

createPriceTable();
tableDiv.style.display = 'block';
```

}

// Create price table HTML
function createPriceTable() {
var uniqueTickers = getUniqueTickers();

```
var tableHtml = '<table><thead><tr>' +
    '<th>Ticker</th><th>Company</th><th>Current Price</th><th>Currency</th><th>Last Updated</th><th>Source</th>' +
    '</tr></thead><tbody>';
    
uniqueTickers.forEach(function(stock) {
    var priceData = portfolioData.prices[stock.ticker];
    
    var price = priceData ? priceData.price.toFixed(2) : 'N/A';
    var currency = priceData ? priceData.currency : 'N/A';
    var updated = priceData ? new Date(priceData.lastUpdated).toLocaleTimeString() : 'Never';
    var source = priceData ? priceData.source : 'N/A';
    
    // Color code based on data availability
    var rowStyle = priceData ? '' : 'style="background-color: #fff3cd;"';
    
    tableHtml += '<tr ' + rowStyle + '>' +
        '<td><strong>' + stock.ticker + '</strong></td>' +
        '<td>' + stock.name + '</td>' +
        '<td>' + price + '</td>' +
        '<td>' + currency + '</td>' +
        '<td>' + updated + '</td>' +
        '<td>' + source + '</td>' +
        '</tr>';
});

tableHtml += '</tbody></table>';

if (uniqueTickers.length === 0) {
    tableHtml = '<p>No stocks available. Please import portfolio data first.</p>';
}

document.getElementById('priceTable').innerHTML = tableHtml;
```

}

// Test a single ticker (useful for validation)
function testTicker(ticker, callback) {
console.log(‘🧪 Testing ticker:’, ticker);

```
fetchSinglePrice(ticker, function(success) {
    var result = {
        ticker: ticker,
        success: success,
        price: success ? portfolioData.prices[ticker].price : null,
        currency: success ? portfolioData.prices[ticker].currency : null
    };
    
    if (callback) {
        callback(result);
    }
});
```

}

console.log(‘✅ Yahoo Finance module loaded’);
