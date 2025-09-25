Analytics

// Portfolio Analytics Module
console.log(‘📈 Loading analytics module…’);

// Main analytics generation function
function generateAnalytics() {
console.log(‘📊 Generating portfolio analytics…’);

```
if (portfolioData.holdings.length === 0) {
    document.getElementById('analyticsContent').innerHTML = 
        '<p>Import portfolio data to see analytics.</p>';
    return;
}

var analytics = calculatePortfolioMetrics();
displayAnalytics(analytics);
```

}

// Calculate all portfolio metrics
function calculatePortfolioMetrics() {
var metrics = {
overview: calculateOverviewMetrics(),
accounts: calculateAccountMetrics(),
holdings: calculateHoldingMetrics(),
sectors: calculateSectorMetrics(),
countries: calculateCountryMetrics()
};

```
console.log('📈 Analytics calculated:', metrics);
return metrics;
```

}

// Calculate overview metrics
function calculateOverviewMetrics() {
var totalValue = 0;
var totalShares = 0;
var stocksWithPrices = 0;
var totalStocks = getUniqueTickers().length;
var currencies = {};

```
portfolioData.holdings.forEach(function(holding) {
    totalShares += holding.volume;
    
    var priceData = portfolioData.prices[holding.ticker];
    if (priceData && priceData.price) {
        var holdingValue = holding.volume * priceData.price;
        totalValue += holdingValue;
        stocksWithPrices++;
        
        var currency = priceData.currency;
        currencies[currency] = (currencies[currency] || 0) + holdingValue;
    }
});

return {
    totalValue: totalValue,
    totalShares: totalShares,
    totalStocks: totalStocks,
    stocksWithPrices: stocksWithPrices,
    pricesCoverage: totalStocks > 0 ? (stocksWithPrices / totalStocks * 100) : 0,
    currencies: currencies,
    totalAccounts: Object.keys(getUniqueAccounts()).length
};
```

}

// Calculate account-level metrics
function calculateAccountMetrics() {
var accounts = getUniqueAccounts();
var accountMetrics = {};

```
Object.keys(accounts).forEach(function(accountName) {
    var account = accounts[accountName];
    var accountValue = 0;
    var accountStocks = account.holdings.length;
    
    account.holdings.forEach(function(holding) {
        var priceData = portfolioData.prices[holding.ticker];
        if (priceData && priceData.price) {
            accountValue += holding.volume * priceData.price;
        }
    });
    
    accountMetrics[accountName] = {
        value: accountValue,
        stocks: accountStocks,
        shares: account.totalShares
    };
});

return accountMetrics;
```

}

// Calculate individual holding metrics
function calculateHoldingMetrics() {
var holdings = [];

```
portfolioData.holdings.forEach(function(holding) {
    var priceData = portfolioData.prices[holding.ticker];
    var value = 0;
    var price = 0;
    
    if (priceData && priceData.price) {
        price = priceData.price;
        value = holding.volume * price;
    }
    
    holdings.push({
        symbol: holding.symbol,
        name: holding.name,
        ticker: holding.ticker,
        account: holding.account,
        shares: holding.volume,
        price: price,
        value: value,
        currency: priceData ? priceData.currency : 'N/A'
    });
});

// Sort by value descending
holdings.sort(function(a, b) { return b.value - a.value; });

return holdings;
```

}

// Calculate sector allocation (basic version based on ticker patterns)
function calculateSectorMetrics() {
var sectors = {};

```
portfolioData.holdings.forEach(function(holding) {
    var sector = guessSector(holding.ticker, holding.name);
    var priceData = portfolioData.prices[holding.ticker];
    
    if (!sectors[sector]) {
        sectors[sector] = { value: 0, count: 0 };
    }
    
    sectors[sector].count++;
    
    if (priceData && priceData.price) {
        sectors[sector].value += holding.volume * priceData.price;
    }
});

return sectors;
```

}

// Calculate country allocation based on ticker suffixes
function calculateCountryMetrics() {
var countries = {};

```
portfolioData.holdings.forEach(function(holding) {
    var country = getCountryFromTicker(holding.ticker);
    var priceData = portfolioData.prices[holding.ticker];
    
    if (!countries[country]) {
        countries[country] = { value: 0, count: 0 };
    }
    
    countries[country].count++;
    
    if (priceData && priceData.price) {
        countries[country].value += holding.volume * priceData.price;
    }
});

return countries;
```

}

// Guess sector from ticker and name (basic implementation)
function guessSector(ticker, name) {
var nameLower = name.toLowerCase();

```
if (nameLower.includes('bank') || nameLower.includes('seb') || nameLower.includes('handelsbanken')) {
    return 'Banking';
} else if (nameLower.includes('tech') || nameLower.includes('microsoft') || ticker === 'MSFT') {
    return 'Technology';
} else if (nameLower.includes('pharma') || nameLower.includes('novo') || ticker.includes('AZN')) {
    return 'Healthcare';
} else if (nameLower.includes('oil') || nameLower.includes('energy')) {
    return 'Energy';
} else if (nameLower.includes('real estate') || nameLower.includes('fastighet')) {
    return 'Real Estate';
} else if (nameLower.includes('consumer') || nameLower.includes('essity')) {
    return 'Consumer Goods';
} else {
    return 'Other';
}
```

}

// Get country from ticker suffix
function getCountryFromTicker(ticker) {
if (ticker.endsWith(’.ST’)) return ‘Sweden’;
if (ticker.endsWith(’.CO’)) return ‘Denmark’;
if (ticker.endsWith(’.OL’)) return ‘Norway’;
if (ticker.endsWith(’.HE’)) return ‘Finland’;
if (ticker.endsWith(’.PA’)) return ‘France’;
if (ticker.endsWith(’.DE’)) return ‘Germany’;
if (ticker.endsWith(’.MI’)) return ‘Italy’;
if (ticker.endsWith(’.AS’)) return ‘Netherlands’;
if (ticker.endsWith(’.L’)) return ‘United Kingdom’;
if (!ticker.includes(’.’)) return ‘United States’;
return ‘Other’;
}

// Display analytics in the UI
function displayAnalytics(analytics) {
var html = ‘’;

```
// Overview KPIs
html += '<div class="kpi-grid">';
html += '<div class="kpi-card">';
html += '<div class="kpi-value">' + formatCurrency(analytics.overview.totalValue, 'Mixed') + '</div>';
html += '<div class="kpi-label">Total Portfolio Value</div>';
html += '</div>';

html += '<div class="kpi-card">';
html += '<div class="kpi-value">' + analytics.overview.totalStocks + '</div>';
html += '<div class="kpi-label">Unique Stocks</div>';
html += '</div>';

html += '<div class="kpi-card">';
html += '<div class="kpi-value">' + analytics.overview.totalShares.toLocaleString() + '</div>';
html += '<div class="kpi-label">Total Shares</div>';
html += '</div>';

html += '<div class="kpi-card">';
html += '<div class="kpi-value">' + formatPercentage(analytics.overview.pricesCoverage) + '</div>';
html += '<div class="kpi-label">Prices Available</div>';
html += '</div>';
html += '</div>';

// Account breakdown
html += '<div class="section">';
html += '<h3>Account Breakdown</h3>';
html += '<table><thead><tr><th>Account</th><th>Value</th><th>Stocks</th><th>Shares</th></tr></thead><tbody>';

Object.keys(analytics.accounts).forEach(function(accountName) {
    var account = analytics.accounts[accountName];
    html += '<tr>';
    html += '<td>' + accountName + '</td>';
    html += '<td>' + formatCurrency(account.value, 'Mixed') + '</td>';
    html += '<td>' + account.stocks + '</td>';
    html += '<td>' + account.shares.toLocaleString() + '</td>';
    html += '</tr>';
});

html += '</tbody></table></div>';

// Top holdings
html += '<div class="section">';
html += '<h3>Top Holdings</h3>';
html += '<table><thead><tr><th>Symbol</th><th>Name</th><th>Shares</th><th>Price</th><th>Value</th><th>Account</th></tr></thead><tbody>';

var topHoldings = analytics.holdings.slice(0, 10);
topHoldings.forEach(function(holding) {
    html += '<tr>';
    html += '<td><strong>' + holding.symbol + '</strong></td>';
    html += '<td>' + holding.name + '</td>';
    html += '<td>' + holding.shares.toLocaleString() + '</td>';
    html += '<td>' + (holding.price > 0 ? formatCurrency(holding.price, holding.currency) : 'N/A') + '</td>';
    html += '<td>' + (holding.value > 0 ? formatCurrency(holding.value, holding.currency) : 'N/A') + '</td>';
    html += '<td>' + holding.account + '</td>';
    html += '</tr>';
});

html += '</tbody></table></div>';

// Country allocation
html += '<div class="section">';
html += '<h3>Country Allocation</h3>';
html += '<table><thead><tr><th>Country</th><th>Stocks</th><th>Value</th></tr></thead><tbody>';

var countryEntries = Object.keys(analytics.countries).map(function(country) {
    return {
        name: country,
        data: analytics.countries[country]
    };
}).sort(function(a, b) {
    return b.data.value - a.data.value;
});

countryEntries.forEach(function(entry) {
    html += '<tr>';
    html += '<td>' + entry.name + '</td>';
    html += '<td>' + entry.data.count + '</td>';
    html += '<td>' + formatCurrency(entry.data.value, 'Mixed') + '</td>';
    html += '</tr>';
});

html += '</tbody></table></div>';

document.getElementById('analyticsContent').innerHTML = html;
console.log('✅ Analytics displayed');
```

}

console.log(‘✅ Analytics module loaded’);
