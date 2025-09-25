// Main Application Logic
console.log('Loading main application module...');

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');
    initializeApplication();
});

// Main initialization function
function initializeApplication() {
    console.log('Initializing Portfolio Management System...');
    
    // Initialize file input handler
    initializeFileInput();
    
    // Set initial status
    updateStatus('Ready - Import your portfolio CSV to begin');
    
    // Show setup tab by default
    showTab('setup');
    
    console.log('Application initialized successfully');
}

// Tab switching functionality
function showTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tab contents
    var tabContents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove active class from all nav tabs
    var navTabs = document.getElementsByClassName('nav-tab');
    for (var i = 0; i < navTabs.length; i++) {
        navTabs[i].classList.remove('active');
    }
    
    // Show selected tab content
    var selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to corresponding nav tab
    var navTabs = document.getElementsByClassName('nav-tab');
    for (var i = 0; i < navTabs.length; i++) {
        var tab = navTabs[i];
        if (tab.textContent.toLowerCase().includes(tabName.toLowerCase())) {
            tab.classList.add('active');
            break;
        }
    }
    
    // Perform tab-specific actions
    handleTabSwitch(tabName);
}

// Handle actions when switching tabs
function handleTabSwitch(tabName) {
    switch(tabName) {
        case 'setup':
            // Nothing special needed for setup
            break;
            
        case 'prices':
            // Check if we have portfolio data
            if (portfolioData.holdings.length === 0) {
                updateStatus('Import portfolio data first to manage prices');
            } else {
                updateStatus('Portfolio loaded - ' + portfolioData.holdings.length + ' holdings ready for price updates');
            }
            break;
            
        case 'analytics':
            // Generate analytics if we have data
            if (portfolioData.holdings.length === 0) {
                document.getElementById('analyticsContent').innerHTML = 
                    '<p>Import portfolio data and fetch prices to see analytics.</p>';
            } else {
                generateAnalytics();
            }
            break;
    }
}

// Simple ticker manager function
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

function closeTickers() {
    var manager = document.getElementById('tickerManager');
    if (manager) manager.remove();
}

// Utility function to format currency
function formatCurrency(amount, currency) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return 'N/A';
    }
    
    var formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    return formatted + ' ' + (currency || '');
}

// Utility function to format percentage
function formatPercentage(value) {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'N/A';
    }
    return value.toFixed(2) + '%';
}

// Expose functions globally for HTML onclick handlers
window.showTab = showTab;
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.showTickerManager = showTickerManager;
window.fixTicker = fixTicker;
window.closeTickers = closeTickers;

console.log('Main application module loaded');
