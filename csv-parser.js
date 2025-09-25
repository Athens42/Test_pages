// CSV Parser Module
console.log(‘📄 Loading CSV parser module…’);

// Set up file input event listener
function initializeFileInput() {
var fileInput = document.getElementById(‘fileInput’);
if (fileInput) {
fileInput.addEventListener(‘change’, function(event) {
handleFileSelect(event);
});
}
}

// Handle file selection
function handleFileSelect(event) {
var file = event.target.files[0];
if (!file) {
return;
}

```
console.log('📁 File selected:', file.name);
updateStatus('Reading CSV file...');

var reader = new FileReader();
reader.onload = function(e) {
    parseCSV(e.target.result);
};
reader.onerror = function() {
    updateStatus('Error reading file');
    alert('Error reading file. Please try again.');
};

reader.readAsText(file);
```

}

// Parse CSV content
function parseCSV(csvText) {
console.log(‘📊 Starting CSV parsing…’);
updateStatus(‘Parsing CSV data…’);

```
var lines = csvText.split('\n').filter(function(line) { 
    return line.trim(); 
});

if (lines.length < 2) {
    alert('Invalid CSV file - no data rows found');
    updateStatus('CSV import failed');
    return;
}

var headers = lines[0].split(';');
console.log('CSV Headers:', headers);

// Find required columns with flexible matching
var columnIndices = findColumnIndices(headers);

if (!columnIndices.isValid) {
    alert('Required columns not found. Expected columns for: account, symbol, volume');
    console.log('Available headers:', headers);
    updateStatus('CSV import failed - missing columns');
    return;
}

console.log('Column indices:', columnIndices);

// Parse holdings data
portfolioData.holdings = [];
var parseErrors = 0;

for (var i = 1; i < lines.length; i++) {
    var row = lines[i].split(';');
    
    try {
        var holding = parseHoldingRow(row, columnIndices);
        if (holding) {
            portfolioData.holdings.push(holding);
        }
    } catch (error) {
        parseErrors++;
        console.log('Error parsing row', i, ':', error.message);
    }
}

if (portfolioData.holdings.length === 0) {
    alert('No valid holdings found in CSV file');
    updateStatus('CSV import failed - no valid data');
    return;
}

console.log('📊 Parsed', portfolioData.holdings.length, 'holdings with', parseErrors, 'errors');
displayImportResults();
```

}

// Find column indices in CSV headers
function findColumnIndices(headers) {
var indices = {
account: -1,
symbol: -1,
name: -1,
volume: -1,
isin: -1,
isValid: false
};

```
for (var i = 0; i < headers.length; i++) {
    var header = headers[i].toLowerCase().trim();
    
    // Account column
    if (header.includes('konto') || header.includes('account') || header.includes('depot')) {
        indices.account = i;
    }
    // Symbol column
    else if (header.includes('kortnamn') || header.includes('symbol') || header.includes('ticker')) {
        indices.symbol = i;
    }
    // Company name column
    else if (header.includes('namn') || header.includes('name') || header.includes('instrument')) {
        indices.name = i;
    }
    // Volume/quantity column
    else if (header.includes('volym') || header.includes('antal') || header.includes('shares') || header.includes('quantity')) {
        indices.volume = i;
    }
    // ISIN column
    else if (header.includes('isin')) {
        indices.isin = i;
    }
}

// Check if we have the required columns
indices.isValid = (indices.account !== -1 && indices.symbol !== -1 && indices.volume !== -1);

return indices;
```

}

// Parse a single holding row
function parseHoldingRow(row, indices) {
var account = row[indices.account] ? row[indices.account].trim() : ‘’;
var symbol = row[indices.symbol] ? row[indices.symbol].trim() : ‘’;
var volumeText = row[indices.volume] ? row[indices.volume].trim().replace(’,’, ‘.’) : ‘’;
var name = row[indices.name] ? row[indices.name].trim() : symbol;
var isin = row[indices.isin] ? row[indices.isin].trim() : ‘’;

```
// Validate required fields
if (!account || !symbol || !volumeText) {
    return null;
}

var volume = parseFloat(volumeText);
if (isNaN(volume) || volume <= 0) {
    return null;
}

// Convert to Yahoo Finance ticker
var tickerInfo = convertToYahooTicker(symbol, isin);

return {
    account: account,
    symbol: symbol,
    name: name,
    volume: Math.round(volume),
    isin: isin,
    ticker: tickerInfo.ticker,
    tickerConfidence: tickerInfo.confidence
};
```

}

// Display import results
function displayImportResults() {
var totalHoldings = portfolioData.holdings.length;
var uniqueAccounts = new Set();
var uniqueStocks = new Set();
var totalShares = 0;

```
// Calculate statistics
portfolioData.holdings.forEach(function(holding) {
    uniqueAccounts.add(holding.account);
    uniqueStocks.add(holding.ticker);
    totalShares += holding.volume;
});

// Update summary
var summaryText = 'Imported ' + totalHoldings + ' holdings from ' + 
                 uniqueAccounts.size + ' accounts (' + uniqueStocks.size + ' unique stocks, ' +
                 totalShares.toLocaleString() + ' total shares)';

document.getElementById('importSummary').innerHTML = summaryText;

// Create holdings table
createHoldingsTable();

// Show results
document.getElementById('importResults').style.display = 'block';

updateStatus('Portfolio imported successfully - ' + totalHoldings + ' holdings');
console.log('✅ CSV import completed successfully');
```

}

// Create HTML table of holdings
function createHoldingsTable() {
var tableHtml = ‘<table><thead><tr>’ +
‘<th>Account</th><th>Symbol</th><th>Yahoo Ticker</th><th>Name</th><th>Shares</th><th>Confidence</th>’ +
‘</tr></thead><tbody>’;

```
portfolioData.holdings.forEach(function(holding) {
    var confidenceIcon = holding.tickerConfidence === 'high' ? '✅' : 
                        holding.tickerConfidence === 'medium' ? '⚠️' : '❌';
    
    tableHtml += '<tr>' +
        '<td>' + holding.account + '</td>' +
        '<td><strong>' + holding.symbol + '</strong></td>' +
        '<td><strong>' + holding.ticker + '</strong></td>' +
        '<td>' + holding.name + '</td>' +
        '<td>' + holding.volume.toLocaleString() + '</td>' +
        '<td style="text-align: center;">' + confidenceIcon + '</td>' +
        '</tr>';
});

tableHtml += '</tbody></table>';
document.getElementById('holdingsTable').innerHTML = tableHtml;
```

}

console.log(‘✅ CSV parser module loaded’);
