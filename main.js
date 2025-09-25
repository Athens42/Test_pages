// Main Application Logic
console.log(‘🚀 Loading main application module…’);

// Initialize the application when DOM is loaded
document.addEventListener(‘DOMContentLoaded’, function() {
console.log(‘🎯 DOM loaded, initializing application…’);
initializeApplication();
});

// Main initialization function
function initializeApplication() {
console.log(‘🔧 Initializing Portfolio Management System…’);

```
// Initialize file input handler
initializeFileInput();

// Set initial status
updateStatus('Ready - Import your portfolio CSV to begin');

// Show setup tab by default
showTab('setup');

console.log('✅ Application initialized successfully');
```

}

// Tab switching functionality
function showTab(tabName) {
console.log(‘📑 Switching to tab:’, tabName);

```
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
```

}

// Handle actions when switching tabs
function handleTabSwitch(tabName) {
switch(tabName) {
case ‘setup’:
// Nothing special needed for setup
break;

```
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
```

}

// Handle successful CSV import
function onImportComplete() {
console.log(‘📊 CSV import completed, updating application state…’);

```
// Update status
var totalHoldings = portfolioData.holdings.length;
updateStatus('Portfolio imported - ' + totalHoldings + ' holdings loaded');

// Enable other tabs
enableAllTabs();

console.log('✅ Import completion handled');
```

}

// Enable all navigation tabs
function enableAllTabs() {
var navTabs = document.getElementsByClassName(‘nav-tab’);
for (var i = 0; i < navTabs.length; i++) {
navTabs[i].style.opacity = ‘1’;
navTabs[i].style.pointerEvents = ‘auto’;
}
}

// Handle successful price update
function onPricesUpdated() {
console.log(‘💰 Prices updated, refreshing analytics…’);

```
// If we're on analytics tab, refresh it
var analyticsTab = document.getElementById('analytics');
if (analyticsTab && analyticsTab.classList.contains('active')) {
    generateAnalytics();
}

updateStatus('Prices updated - Analytics refreshed');
```

}

// Utility function to format currency
function formatCurrency(amount, currency) {
if (typeof amount !== ‘number’ || isNaN(amount)) {
return ‘N/A’;
}

```
var formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

return formatted + ' ' + (currency || '');
```

}

// Utility function to format percentage
function formatPercentage(value) {
if (typeof value !== ‘number’ || isNaN(value)) {
return ‘N/A’;
}
return value.toFixed(2) + ‘%’;
}

// Global error handler
window.addEventListener(‘error’, function(e) {
console.error(‘💥 Application error:’, e.error);
updateStatus(’Error: ’ + e.message);
});

// Simple ticker manager function
function showTickerManager() {
if (portfolioData.holdings.length === 0) {
alert(‘Please import portfolio data first’);
return;
}

```
alert('Ticker manager works! You have ' + portfolioData.holdings.length + ' holdings loaded.');
```

}

// Expose functions globally for HTML onclick handlers
window.showTab = showTab;
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.showTickerManager = showTickerManager;

console.log(‘✅ Main application module loaded’);
