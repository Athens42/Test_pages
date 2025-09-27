Full Code #portfoliomanager


<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Management System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }

```
    .container {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header {
        background: #28a745;
        color: white;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: bold;
    }

    .upload-area {
        border: 2px dashed #007AFF;
        border-radius: 10px;
        padding: 40px;
        text-align: center;
        margin: 20px 0;
        background-color: #f8f9ff;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .upload-area:hover {
        background-color: #e8f0ff;
    }

    button, .btn-primary, .btn-secondary {
        background-color: #007AFF;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        margin: 10px 5px;
        transition: background-color 0.3s;
    }

    button:hover, .btn-primary:hover {
        background-color: #0056CC;
    }

    .btn-secondary {
        background-color: #17a2b8;
    }

    .btn-secondary:hover {
        background-color: #138496;
    }

    .section {
        margin: 20px 0;
        padding: 15px;
        border-radius: 8px;
        background-color: #f8f9fa;
    }

    .status {
        background-color: #d1ecf1;
        border: 1px solid #bee5eb;
        border-radius: 5px;
        padding: 10px;
        margin: 10px 0;
    }

    .success {
        background-color: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
    }

    .yahoo-status {
        margin: 10px 0;
        padding: 10px;
        background: #f0f9ff;
        border-radius: 5px;
    }

    .nav-tabs {
        display: flex;
        border-bottom: 2px solid #ddd;
        margin: 20px 0;
    }

    .nav-tab {
        padding: 10px 15px;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-bottom: none;
        cursor: pointer;
        margin-right: 5px;
        border-radius: 5px 5px 0 0;
        transition: background-color 0.3s;
    }

    .nav-tab:hover {
        background: #e9ecef;
    }

    .nav-tab.active {
        background: white;
        border-bottom: 2px solid white;
        margin-bottom: -2px;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
    }

    th, td {
        padding: 8px;
        border: 1px solid #ddd;
        text-align: left;
    }

    th {
        background-color: #f8f9fa;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    input[type="text"], input[type="number"] {
        width: 90%;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    #fileInput {
        display: none;
    }
</style>
```

</head>
<body>
    <div class="container">
        <div class="header">
            Single File Portfolio Management System
        </div>

```
    <h1>Portfolio Management System</h1>
    <p>Complete system in one file</p>

    <div class="status">
        <strong>Status:</strong> <span id="status">Loading...</span>
    </div>

    <div class="nav-tabs">
        <div class="nav-tab active" onclick="showTab('setup')">Setup</div>
        <div class="nav-tab" onclick="showTab('prices')">Prices</div>
        <div class="nav-tab" onclick="showTab('analytics')">Analytics</div>
    </div>

    <!-- Setup Tab -->
    <div id="setup" class="tab-content active">
        <div class="section">
            <h3>CSV Import</h3>
            <div class="upload-area" onclick="document.getElementById('fileInput').click()">
                <h4>Upload CSV File</h4>
                <p>Click to browse for your broker CSV file</p>
                <input type="file" id="fileInput" accept=".csv">
            </div>
            
            <div id="importResults" style="display: none;">
                <div class="success">
                    <h4>Import Successful!</h4>
                    <p id="importSummary"></p>
                </div>
                <div id="holdingsTable"></div>
            </div>
        </div>
    </div>

    <!-- Prices Tab -->
    <div id="prices" class="tab-content">
        <div class="section">
            <h3>Price Management</h3>
            <button onclick="fetchAllPrices()" class="btn-primary">
                Fetch Prices from Yahoo Finance
            </button>
            <button onclick="showPriceTable()" class="btn-secondary">
                Toggle Price Table
            </button>
            <button onclick="showTickerManager()" class="btn-secondary">
                Manage Tickers
            </button>
            
            <div class="yahoo-status">
                <strong>Yahoo Status:</strong> <span id="yahooStatus">Ready</span>
            </div>
            
            <div id="priceTable" style="display: none; margin-top: 20px;"></div>
        </div>
    </div>

    <!-- Analytics Tab -->
    <div id="analytics" class="tab-content">
        <div class="section">
            <h3>Portfolio Analytics</h3>
            <div id="analyticsContent">
                <p>Import portfolio data and fetch prices to see analytics.</p>
            </div>
        </div>
    </div>
</div>

<script>
    // Global data storage
    var portfolioData = {
        holdings: [],
        prices: {},
        accounts: {}
    };

    var isUpdatingPrices = false;

    // Ticker mappings
    var tickerMappings = {
        'INVE B': 'INVE-B.ST',
        'AAK': 'AAK.ST',
        'SWED A': 'SWED-A.ST',
        'VOLV B': 'VOLV-B.ST',
        'SKF B': 'SKF-B.ST',
        'SEB A': 'SEB-A.ST',
        'SHB A': 'SHB-A.ST',
        'ESSITY B': 'ESSITY-B.ST',
        'HEXA B': 'HEXA-B.ST',
        'ALFA': 'ALFA.ST',
        'ABB': 'ABB.ST',
        'ATCO A': 'ATCO-A.ST',
        'ATCO B': 'ATCO-B.ST',
        'AZN': 'AZN.ST',
        'BOL': 'BOL.ST',
        'CAMX': 'CAMX.ST',
        'EPI B': 'EPI-B.ST',
        'INDU C': 'INDU-C.ST',
        'SECU B': 'SECU-B.ST',
        '8TRA': '8TRA.ST',
        'NDA SE': 'NDA-SE.ST',
        'DANSKE': 'DANSKE.CO',
        'ASMLa': 'ASML.AS',
        'RMSp': 'RMS.PA',
        'MCp': 'MC.PA',
        'IVGm': 'IVG.MI',
        'MSFT': 'MSFT',
        'V': 'V',
        'JPM': 'JPM',
        'ABBV': 'ABBV',
        'PG': 'PG'
    };

    // Initialize application
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('fileInput').addEventListener('change', handleFileSelect);
        updateStatus('Ready - Import your portfolio CSV to begin');
    });

    // Update status
    function updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    // Tab switching
    function showTab(tabName) {
        var tabContents = document.getElementsByClassName('tab-content');
        for (var i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }
        
        var navTabs = document.getElementsByClassName('nav-tab');
        for (var i = 0; i < navTabs.length; i++) {
            navTabs[i].classList.remove('active');
        }
        
        var selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        var navTabs = document.getElementsByClassName('nav-tab');
        for (var i = 0; i < navTabs.length; i++) {
            var tab = navTabs[i];
            if (tab.textContent.toLowerCase().includes(tabName.toLowerCase())) {
                tab.classList.add('active');
                break;
            }
        }
    }

    // File handling
    function handleFileSelect(event) {
        var file = event.target.files[0];
        if (!file) return;
        
        updateStatus('Reading CSV file...');
        
        var reader = new FileReader();
        reader.onload = function(e) {
            parseCSV(e.target.result);
        };
        reader.readAsText(file);
    }

    // CSV parsing
    function parseCSV(csvText) {
        var lines = csvText.split('\n').filter(function(line) { 
            return line.trim(); 
        });

        if (lines.length < 2) {
            alert('Invalid CSV file - no data rows found');
            return;
        }

        var headers = lines[0].split(';');
        var columnIndices = findColumnIndices(headers);

        if (!columnIndices.isValid) {
            alert('Required columns not found');
            return;
        }

        portfolioData.holdings = [];

        for (var i = 1; i < lines.length; i++) {
            var row = lines[i].split(';');
            var holding = parseHoldingRow(row, columnIndices);
            if (holding) {
                portfolioData.holdings.push(holding);
            }
        }

        if (portfolioData.holdings.length === 0) {
            alert('No valid holdings found');
            return;
        }

        displayImportResults();
    }

    // Find column indices
    function findColumnIndices(headers) {
        var indices = {
            account: -1,
            symbol: -1,
            name: -1,
            volume: -1,
            isin: -1,
            isValid: false
        };

        for (var i = 0; i < headers.length; i++) {
            var header = headers[i].toLowerCase().trim();
            
            if (header.includes('konto') || header.includes('account')) {
                indices.account = i;
            } else if (header.includes('kortnamn') || header.includes('symbol')) {
                indices.symbol = i;
            } else if (header.includes('namn') || header.includes('name') || header.includes('instrument')) {
                indices.name = i;
            } else if (header.includes('volym') || header.includes('antal') || header.includes('shares')) {
                indices.volume = i;
            } else if (header.includes('isin')) {
                indices.isin = i;
            }
        }

        indices.isValid = (indices.account !== -1 && indices.symbol !== -1 && indices.volume !== -1);
        return indices;
    }

    // Parse holding row
    function parseHoldingRow(row, indices) {
        var account = row[indices.account] ? row[indices.account].trim() : '';
        var symbol = row[indices.symbol] ? row[indices.symbol].trim() : '';
        var volumeText = row[indices.volume] ? row[indices.volume].trim().replace(',', '.') : '';
        var name = row[indices.name] ? row[indices.name].trim() : symbol;
        var isin = row[indices.isin] ? row[indices.isin].trim() : '';

        if (!account || !symbol || !volumeText) {
            return null;
        }

        var volume = parseFloat(volumeText);
        if (isNaN(volume) || volume <= 0) {
            return null;
        }

        var ticker = convertToYahooTicker(symbol);

        return {
            account: account,
            symbol: symbol,
            name: name,
            volume: Math.round(volume),
            isin: isin,
            ticker: ticker
        };
    }

    // Convert to Yahoo ticker
    function convertToYahooTicker(symbol) {
        return tickerMappings[symbol] || (symbol + '.ST');
    }

    // Display import results
    function displayImportResults() {
        var totalHoldings = portfolioData.holdings.length;
        var uniqueAccounts = new Set();
        var uniqueStocks = new Set();
        var totalShares = 0;

        portfolioData.holdings.forEach(function(holding) {
            uniqueAccounts.add(holding.account);
            uniqueStocks.add(holding.ticker);
            totalShares += holding.volume;
        });

        var summaryText = 'Imported ' + totalHoldings + ' holdings from ' + 
                         uniqueAccounts.size + ' accounts (' + uniqueStocks.size + ' unique stocks, ' +
                         totalShares.toLocaleString() + ' total shares)';

        document.getElementById('importSummary').innerHTML = summaryText;

        createHoldingsTable();
        document.getElementById('importResults').style.display = 'block';
        updateStatus('Portfolio imported successfully - ' + totalHoldings + ' holdings');
    }

    // Create holdings table
    function createHoldingsTable() {
        var tableHtml = '<table><thead><tr>' +
            '<th>Account</th><th>Symbol</th><th>Yahoo Ticker</th><th>Name</th><th>Shares</th>' +
            '</tr></thead><tbody>';

        portfolioData.holdings.forEach(function(holding) {
            tableHtml += '<tr>' +
                '<td>' + holding.account + '</td>' +
                '<td><strong>' + holding.symbol + '</strong></td>' +
                '<td><strong>' + holding.ticker + '</strong></td>' +
                '<td>' + holding.name + '</td>' +
                '<td>' + holding.volume.toLocaleString() + '</td>' +
                '</tr>';
        });

        tableHtml += '</tbody></table>';
        document.getElementById('holdingsTable').innerHTML = tableHtml;
    }

    // Get unique tickers
    function getUniqueTickers() {
        var unique = [];
        var seen = {};

        portfolioData.holdings.forEach(function(holding) {
            if (!seen[holding.ticker]) {
                seen[holding.ticker] = true;
                unique.push({
                    ticker: holding.ticker,
                    name: holding.name,
                    symbol: holding.symbol
                });
            }
        });

        return unique;
    }

    // Show ticker manager
    function showTickerManager() {
        if (portfolioData.holdings.length === 0) {
            alert('Please import portfolio data first');
            return;
        }
        
        var uniqueTickers = getUniqueTickers();
        var html = '<div id="tickerManager" class="section">';
        html += '<h3>Fix Incorrect Tickers</h3>';
        html += '<table><thead><tr><th>Symbol</th><th>Current Ticker</th><th>Correct Ticker</th><th>Action</th></tr></thead><tbody>';
        
        for (var i = 0; i < uniqueTickers.length; i++) {
            var stock = uniqueTickers[i];
            html += '<tr>';
            html += '<td><strong>' + stock.symbol + '</strong></td>';
            html += '<td>' + stock.ticker + '</td>';
            html += '<td><input type="text" id="fix_' + i + '" placeholder="Enter correct ticker" style="width:120px;"></td>';
            html += '<td><button onclick="fixTicker(' + i + ')" class="btn-primary" style="padding:5px 10px;">Fix</button></td>';
            html += '</tr>';
        }
        
        html += '</tbody></table>';
        html += '<button onclick="closeTickers()" class="btn-secondary">Close</button></div>';
        
        var container = document.querySelector('#prices .section');
        var existing = document.getElementById('tickerManager');
        if (existing) existing.remove();
        
        var div = document.createElement('div');
        div.innerHTML = html;
        container.appendChild(div);
    }

    // Fix ticker
    function fixTicker(index) {
        var input = document.getElementById('fix_' + index);
        var newTicker = input.value.trim().toUpperCase();
        var uniqueTickers = getUniqueTickers();
        var oldSymbol = uniqueTickers[index].symbol;
        
        if (newTicker) {
            for (var i = 0; i < portfolioData.holdings.length; i++) {
                if (portfolioData.holdings[i].symbol === oldSymbol) {
                    portfolioData.holdings[i].ticker = newTicker;
                }
            }
            alert('Fixed: ' + oldSymbol + ' -> ' + newTicker);
            showTickerManager();
        }
    }

    // Close ticker manager
    function closeTickers() {
        var manager = document.getElementById('tickerManager');
        if (manager) manager.remove();
    }

    // Fetch all prices
    function fetchAllPrices() {
        if (isUpdatingPrices) {
            alert('Price update already in progress');
            return;
        }

        if (portfolioData.holdings.length === 0) {
            alert('Please import portfolio data first');
            return;
        }

        var uniqueTickers = getUniqueTickers();
        isUpdatingPrices = true;
        document.getElementById('yahooStatus').textContent = 'Starting price update...';
        portfolioData.prices = {};
        fetchPricesSequentially(uniqueTickers, 0);
    }

    // Fetch prices sequentially
    function fetchPricesSequentially(tickers, index) {
        if (index >= tickers.length) {
            finishPriceUpdate();
            return;
        }

        var ticker = tickers[index].ticker;
        var progress = (index + 1) + '/' + tickers.length;

        document.getElementById('yahooStatus').textContent = 
            'Fetching ' + progress + ': ' + ticker;

        fetchSinglePrice(ticker, function(success) {
            setTimeout(function() {
                fetchPricesSequentially(tickers, index + 1);
            }, 1000);
        });
    }

    // Fetch single price
    function fetchSinglePrice(ticker, callback) {
        var proxyUrl = 'https://api.allorigins.win/raw?url=';
        var yahooUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/' + ticker;
        var url = proxyUrl + encodeURIComponent(yahooUrl);

        fetch(url)
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function(data) {
                if (data.chart && data.chart.result && data.chart.result.length > 0) {
                    var result = data.chart.result[0];
                    var price = result.meta.regularMarketPrice;
                    var currency = result.meta.currency || 'USD';
                    
                    portfolioData.prices[ticker] = {
                        price: price,
                        currency: currency.toUpperCase(),
                        lastUpdated: new Date().toISOString(),
                        source: 'Yahoo Finance'
                    };
                    
                    if (callback) callback(true);
                } else {
                    if (callback) callback(false);
                }
            })
            .catch(function(error) {
                if (callback) callback(false);
            });
    }

    // Finish price update
    function finishPriceUpdate() {
        isUpdatingPrices = false;
        
        var successCount = Object.keys(portfolioData.prices).length;
        var totalCount = getUniqueTickers().length;
        var failureCount = totalCount - successCount;

        var statusText = 'Completed: ' + successCount + ' updated';
        if (failureCount > 0) {
            statusText += ', ' + failureCount + ' failed';
        }

        document.getElementById('yahooStatus').textContent = statusText;
        alert('Price update completed!\nSuccessfully updated: ' + successCount + ' stocks');
    }

    // Show price table
    function showPriceTable() {
        var tableDiv = document.getElementById('priceTable');
        var isVisible = tableDiv.style.display !== 'none';

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
    }

    // Create price table
    function createPriceTable() {
        var uniqueTickers = getUniqueTickers();

        var tableHtml = '<table><thead><tr>' +
            '<th>Ticker</th><th>Company</th><th>Current Price</th><th>Currency</th><th>Last Updated</th>' +
            '</tr></thead><tbody>';
            
        uniqueTickers.forEach(function(stock) {
            var priceData = portfolioData.prices[stock.ticker];
            
            var price = priceData ? priceData.price.toFixed(2) : 'N/A';
            var currency = priceData ? priceData.currency : 'N/A';
            var updated = priceData ? new Date(priceData.lastUpdated).toLocaleTimeString() : 'Never';
            
            var rowStyle = priceData ? '' : 'style="background-color: #fff3cd;"';
            
            tableHtml += '<tr ' + rowStyle + '>' +
                '<td><strong>' + stock.ticker + '</strong></td>' +
                '<td>' + stock.name + '</td>' +
                '<td>' + price + '</td>' +
                '<td>' + currency + '</td>' +
                '<td>' + updated + '</td>' +
                '</tr>';
        });

        tableHtml += '</tbody></table>';
        document.getElementById('priceTable').innerHTML = tableHtml;
    }
</script>
```

</body>
</html>
