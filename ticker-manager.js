// Ticker Management Module
console.log(‘🔧 Loading ticker management module…’);

// Store manual ticker corrections in localStorage
var manualTickerCorrections = {};

// Initialize ticker corrections from localStorage
function initializeTickerCorrections() {
try {
var stored = localStorage.getItem(‘manualTickerCorrections’);
if (stored) {
manualTickerCorrections = JSON.parse(stored);
console.log(‘📋 Loaded’, Object.keys(manualTickerCorrections).length, ‘manual ticker corrections’);
}
} catch (error) {
console.error(‘Error loading ticker corrections:’, error);
manualTickerCorrections = {};
}
}

// Save ticker corrections to localStorage
function saveTickerCorrections() {
try {
localStorage.setItem(‘manualTickerCorrections’, JSON.stringify(manualTickerCorrections));
console.log(‘💾 Saved ticker corrections to localStorage’);
} catch (error) {
console.error(‘Error saving ticker corrections:’, error);
}
}

// Override the convertToYahooTicker function to use manual corrections
var originalConvertToYahooTicker = convertToYahooTicker;
convertToYahooTicker = function(symbol, isin) {
// Check manual corrections first
var key = symbol + (isin ? ‘_’ + isin : ‘’);
if (manualTickerCorrections[key]) {
return {
ticker: manualTickerCorrections[key],
confidence: ‘manual’
};
}

```
// Fall back to original logic
return originalConvertToYahooTicker(symbol, isin);
```

};

// Show ticker management interface
function showTickerManager() {
var uniqueTickers = getUniqueTickers();
if (uniqueTickers.length === 0) {
alert(‘Please import portfolio data first’);
return;
}

```
var html = '<div class="section">';
html += '<h3>📝 Manual Ticker Corrections</h3>';
html += '<p>Review and correct any incorrect ticker mappings below. Changes are saved automatically.</p>';

html += '<div style="margin: 20px 0;">';
html += '<button onclick="validateAllTickers()" class="btn-secondary">🔍 Test All Tickers</button>';
html += '<button onclick="resetTickerCorrections()" class="btn-secondary" style="background-color: #dc3545;">🔄 Reset All Corrections</button>';
html += '</div>';

html += '<table><thead><tr>';
html += '<th>Original Symbol</th>';
html += '<th>Current Ticker</th>';
html += '<th>Confidence</th>';
html += '<th>Manual Correction</th>';
html += '<th>Actions</th>';
html += '</tr></thead><tbody>';

uniqueTickers.forEach(function(stock, index) {
    var originalHolding = portfolioData.holdings.find(h => h.ticker === stock.ticker);
    var key = originalHolding.symbol + (originalHolding.isin ? '_' + originalHolding.isin : '');
    var hasManualCorrection = manualTickerCorrections[key];
    var currentTicker = hasManualCorrection ? manualTickerCorrections[key] : stock.ticker;
    
    // Determine confidence
    var confidence = 'high';
    if (hasManualCorrection) {
        confidence = 'manual';
    } else {
        var tickerInfo = originalConvertToYahooTicker(originalHolding.symbol, originalHolding.isin);
        confidence = tickerInfo.confidence;
    }
    
    var confidenceIcon = confidence === 'manual' ? '🔧' : 
                       confidence === 'high' ? '✅' : 
                       confidence === 'medium' ? '⚠️' : '❌';
    
    var rowStyle = confidence === 'low' ? 'style="background-color: #fff3cd;"' : '';
    
    html += '<tr ' + rowStyle + '>';
    html += '<td><strong>' + originalHolding.symbol + '</strong></td>';
    html += '<td><strong>' + currentTicker + '</strong></td>';
    html += '<td style="text-align: center;">' + confidenceIcon + ' ' + confidence + '</td>';
    html += '<td><input type="text" id="ticker_' + index + '" value="' + currentTicker + '" placeholder="Enter correct ticker" style="width: 150px;"></td>';
    html += '<td>';
    html += '<button onclick="saveTickerCorrection(\'' + key + '\', ' + index + ')" class="btn-primary" style="padding: 5px 10px; font-size: 12px;">Save</button> ';
    html += '<button onclick="testSingleTickerFromInput(' + index + ')" class="btn-secondary" style="padding: 5px 10px; font-size: 12px;">Test</button>';
    if (hasManualCorrection) {
        html += ' <button onclick="removeTickerCorrection(\'' + key + '\')" class="btn-secondary" style="padding: 5px 10px; font-size: 12px; background-color: #dc3545;">Remove</button>';
    }
    html += '</td>';
    html += '</tr>';
});

html += '</tbody></table>';
html += '</div>';

// Add this to the prices tab
var priceSection = document.querySelector('#prices .section');
var existingManager = document.getElementById('tickerManager');
if (existingManager) {
    existingManager.remove();
}

var managerDiv = document.createElement('div');
managerDiv.id = 'tickerManager';
managerDiv.innerHTML = html;
priceSection.appendChild(managerDiv);

console.log('🔧 Ticker manager displayed');
```

}

// Save a ticker correction
function saveTickerCorrection(key, index) {
var inputElement = document.getElementById(‘ticker_’ + index);
if (!inputElement) return;

```
var newTicker = inputElement.value.trim().toUpperCase();
if (!newTicker) {
    alert('Please enter a valid ticker');
    return;
}

manualTickerCorrections[key] = newTicker;
saveTickerCorrections();

// Update holdings data
updateHoldingsWithNewTickers();

// Refresh the ticker manager display
showTickerManager();

// Show success message
updateStatus('Ticker correction saved: ' + newTicker);

console.log('✅ Saved ticker correction:', key, '->', newTicker);
```

}

// Remove a ticker correction
function removeTickerCorrection(key) {
if (confirm(‘Remove this manual ticker correction?’)) {
delete manualTickerCorrections[key];
saveTickerCorrections();

```
    // Update holdings data
    updateHoldingsWithNewTickers();
    
    // Refresh the ticker manager display
    showTickerManager();
    
    updateStatus('Ticker correction removed');
    console.log('🗑️ Removed ticker correction:', key);
}
```

}

// Reset all ticker corrections
function resetTickerCorrections() {
if (confirm(‘Reset ALL manual ticker corrections? This cannot be undone.’)) {
manualTickerCorrections = {};
saveTickerCorrections();

```
    // Update holdings data
    updateHoldingsWithNewTickers();
    
    // Refresh the ticker manager display
    showTickerManager();
    
    updateStatus('All ticker corrections reset');
    console.log('🔄 Reset all ticker corrections');
}
```

}

// Update holdings data with corrected tickers
function updateHoldingsWithNewTickers() {
portfolioData.holdings.forEach(function(holding) {
var key = holding.symbol + (holding.isin ? ‘_’ + holding.isin : ‘’);
if (manualTickerCorrections[key]) {
holding.ticker = manualTickerCorrections[key];
holding.tickerConfidence = ‘manual’;
} else {
var tickerInfo = originalConvertToYahooTicker(holding.symbol, holding.isin);
holding.ticker = tickerInfo.ticker;
holding.tickerConfidence = tickerInfo.confidence;
}
});

```
console.log('🔄 Updated holdings with corrected tickers');
```

}

// Test a single ticker from input field
function testSingleTickerFromInput(index) {
var inputElement = document.getElementById(‘ticker_’ + index);
if (!inputElement) return;

```
var ticker = inputElement.value.trim().toUpperCase();
if (!ticker) {
    alert('Please enter a ticker to test');
    return;
}

updateStatus('Testing ticker: ' + ticker + '...');

fetchSinglePrice(ticker, function(success) {
    if (success) {
        var priceData = portfolioData.prices[ticker];
        alert('✅ Success!\n\nTicker: ' + ticker + '\nPrice: ' + priceData.price + ' ' + priceData.currency);
        updateStatus('Test successful for ' + ticker);
    } else {
        alert('❌ Failed to fetch price for: ' + ticker + '\n\nThis ticker may not exist on Yahoo Finance or may be temporarily unavailable.');
        updateStatus('Test failed for ' + ticker);
    }
});
```

}

// Validate all current tickers
function validateAllTickers() {
var uniqueTickers = getUniqueTickers();
if (uniqueTickers.length === 0) {
alert(‘No tickers to validate’);
return;
}

```
updateStatus('Validating ' + uniqueTickers.length + ' tickers...');
var results = [];
var completed = 0;

function checkNext(index) {
    if (index >= uniqueTickers.length) {
        showValidationResults(results);
        return;
    }
    
    var ticker = uniqueTickers[index].ticker;
    
    fetchSinglePrice(ticker, function(success) {
        results.push({
            ticker: ticker,
            success: success,
            name: uniqueTickers[index].name
        });
        
        completed++;
        updateStatus('Validating... ' + completed + '/' + uniqueTickers.length);
        
        setTimeout(function() {
            checkNext(index + 1);
        }, 500); // Small delay between requests
    });
}

checkNext(0);
```

}

// Show validation results
function showValidationResults(results) {
var successful = results.filter(r => r.success).length;
var failed = results.filter(r => !r.success);

```
var message = 'Ticker Validation Results:\n\n';
message += '✅ Successful: ' + successful + '\n';
message += '❌ Failed: ' + failed.length + '\n\n';

if (failed.length > 0) {
    message += 'Failed tickers that need correction:\n';
    failed.forEach(function(f) {
        message += '• ' + f.ticker + ' (' + f.name + ')\n';
    });
}

alert(message);
updateStatus('Validation complete: ' + successful + ' successful, ' + failed.length + ' failed');
```

}

// Initialize when page loads
document.addEventListener(‘DOMContentLoaded’, function() {
initializeTickerCorrections();
});

console.log(‘✅ Ticker management module loaded’);
