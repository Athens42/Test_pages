Auto Update#portfoliomanager


// Automatic Price Update Module
console.log(‘⏰ Loading automatic update module…’);

var autoUpdateSettings = {
enabled: false,
time: ‘08:00’, // 8:00 AM Swedish time
lastUpdate: null,
retryCount: 0,
maxRetries: 3
};

// Initialize auto-update settings from localStorage
function initializeAutoUpdate() {
try {
var stored = localStorage.getItem(‘autoUpdateSettings’);
if (stored) {
var settings = JSON.parse(stored);
autoUpdateSettings = Object.assign(autoUpdateSettings, settings);
console.log(‘⚙️ Loaded auto-update settings:’, autoUpdateSettings);
}
} catch (error) {
console.error(‘Error loading auto-update settings:’, error);
}

```
// Start auto-update checker if enabled
if (autoUpdateSettings.enabled) {
    startAutoUpdateChecker();
}
```

}

// Save auto-update settings to localStorage
function saveAutoUpdateSettings() {
try {
localStorage.setItem(‘autoUpdateSettings’, JSON.stringify(autoUpdateSettings));
console.log(‘💾 Saved auto-update settings’);
} catch (error) {
console.error(‘Error saving auto-update settings:’, error);
}
}

// Show auto-update configuration interface
function showAutoUpdateConfig() {
var html = ‘<div class="section" id="autoUpdateConfig">’;
html += ‘<h3>⏰ Automatic Price Updates</h3>’;
html += ‘<p>Configure automatic daily price updates for your portfolio.</p>’;

```
// Settings form
html += '<div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">';
html += '<div style="margin-bottom: 15px;">';
html += '<label><input type="checkbox" id="autoUpdateEnabled" ' + (autoUpdateSettings.enabled ? 'checked' : '') + '> Enable automatic daily updates</label>';
html += '</div>';

html += '<div style="margin-bottom: 15px;">';
html += '<label>Update time (Swedish time): ';
html += '<input type="time" id="autoUpdateTime" value="' + autoUpdateSettings.time + '" style="margin-left: 10px;"></label>';
html += '</div>';

html += '<div style="margin-bottom: 15px;">';
html += '<button onclick="saveAutoUpdateConfig()" class="btn-primary">💾 Save Settings</button> ';
html += '<button onclick="testAutoUpdate()" class="btn-secondary">🧪 Test Update Now</button>';
html += '</div>';
html += '</div>';

// Status information
html += '<div style="margin: 20px 0; padding: 15px; background: #e7f3ff; border-radius: 8px;">';
html += '<h4>📊 Auto-Update Status</h4>';

html += '<p><strong>Status:</strong> ' + (autoUpdateSettings.enabled ? '✅ Enabled' : '❌ Disabled') + '</p>';
html += '<p><strong>Scheduled Time:</strong> ' + autoUpdateSettings.time + ' (Swedish time)</p>';

if (autoUpdateSettings.lastUpdate) {
    var lastUpdate = new Date(autoUpdateSettings.lastUpdate);
    html += '<p><strong>Last Update:</strong> ' + lastUpdate.toLocaleString('sv-SE') + '</p>';
} else {
    html += '<p><strong>Last Update:</strong> Never</p>';
}

var nextUpdate = getNextUpdateTime();
if (nextUpdate && autoUpdateSettings.enabled) {
    html += '<p><strong>Next Update:</strong> ' + nextUpdate.toLocaleString('sv-SE') + '</p>';
}

html += '<p><strong>Next Check:</strong> ' + getNextCheckTime() + '</p>';
html += '</div>';

// Instructions
html += '<div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 8px;">';
html += '<h4>ℹ️ How It Works</h4>';
html += '<ul>';
html += '<li>The system checks every 15 minutes if it\'s time for an update</li>';
html += '<li>Updates only occur once per day, even if you reload the page</li>';
html += '<li>If an update fails, it will retry up to 3 times with delays</li>';
html += '<li>You can manually trigger updates anytime using the "Fetch Prices" button</li>';
html += '<li>Keep this browser tab open for automatic updates to work</li>';
html += '</ul>';
html += '</div>';

html += '</div>';

// Add to prices tab
var priceSection = document.querySelector('#prices .section');
var existingConfig = document.getElementById('autoUpdateConfig');
if (existingConfig) {
    existingConfig.remove();
}

var configDiv = document.createElement('div');
configDiv.innerHTML = html;
priceSection.appendChild(configDiv);

console.log('⚙️ Auto-update config displayed');
```

}

// Save auto-update configuration
function saveAutoUpdateConfig() {
var enabledCheckbox = document.getElementById(‘autoUpdateEnabled’);
var timeInput = document.getElementById(‘autoUpdateTime’);

```
if (!enabledCheckbox || !timeInput) {
    alert('Configuration form not found');
    return;
}

var wasEnabled = autoUpdateSettings.enabled;
autoUpdateSettings.enabled = enabledCheckbox.checked;
autoUpdateSettings.time = timeInput.value;

saveAutoUpdateSettings();

// Start or stop the checker based on new setting
if (autoUpdateSettings.enabled && !wasEnabled) {
    startAutoUpdateChecker();
    updateStatus('Auto-update enabled for ' + autoUpdateSettings.time);
} else if (!autoUpdateSettings.enabled && wasEnabled) {
    stopAutoUpdateChecker();
    updateStatus('Auto-update disabled');
} else if (autoUpdateSettings.enabled) {
    updateStatus('Auto-update settings updated');
}

// Refresh the display
showAutoUpdateConfig();

console.log('⚙️ Auto-update settings saved:', autoUpdateSettings);
```

}

// Test automatic update now
function testAutoUpdate() {
if (portfolioData.holdings.length === 0) {
alert(‘Please import portfolio data first’);
return;
}

```
updateStatus('Testing automatic price update...');

performAutomaticUpdate(function(success) {
    if (success) {
        alert('✅ Automatic update test successful!\n\nPrices have been updated.');
        updateStatus('Auto-update test completed successfully');
    } else {
        alert('❌ Automatic update test failed.\n\nCheck console for details.');
        updateStatus('Auto-update test failed');
    }
});
```

}

// Start the auto-update checker
var autoUpdateInterval;
function startAutoUpdateChecker() {
if (autoUpdateInterval) {
clearInterval(autoUpdateInterval);
}

```
// Check every 15 minutes
autoUpdateInterval = setInterval(checkForAutoUpdate, 15 * 60 * 1000);
console.log('⏰ Auto-update checker started (15-minute intervals)');

// Also check immediately
setTimeout(checkForAutoUpdate, 5000); // Wait 5 seconds after page load
```

}

// Stop the auto-update checker
function stopAutoUpdateChecker() {
if (autoUpdateInterval) {
clearInterval(autoUpdateInterval);
autoUpdateInterval = null;
console.log(‘⏰ Auto-update checker stopped’);
}
}

// Check if it’s time for an automatic update
function checkForAutoUpdate() {
if (!autoUpdateSettings.enabled || portfolioData.holdings.length === 0) {
return;
}

```
var now = new Date();
var today = now.toDateString();

// Check if we already updated today
if (autoUpdateSettings.lastUpdate) {
    var lastUpdateDate = new Date(autoUpdateSettings.lastUpdate).toDateString();
    if (lastUpdateDate === today) {
        console.log('⏰ Auto-update: Already updated today');
        return;
    }
}

// Check if it's time to update
var targetTime = getNextUpdateTime();
if (now >= targetTime) {
    console.log('⏰ Auto-update triggered at', now.toLocaleTimeString('sv-SE'));
    performAutomaticUpdate();
}
```

}

// Get next update time
function getNextUpdateTime() {
var now = new Date();
var today = new Date();

```
// Parse the target time (HH:MM format)
var timeParts = autoUpdateSettings.time.split(':');
today.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

// If the time has passed today, schedule for tomorrow
if (today <= now) {
    today.setDate(today.getDate() + 1);
}

return today;
```

}

// Get next check time (for display)
function getNextCheckTime() {
if (!autoUpdateSettings.enabled) {
return ‘N/A (disabled)’;
}

```
var now = new Date();
var nextCheck = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now
return nextCheck.toLocaleTimeString('sv-SE');
```

}

// Perform automatic update
function performAutomaticUpdate(callback) {
console.log(‘🤖 Starting automatic price update…’);

```
// Store original yahoo status updater
var originalUpdateYahooStatus = function(text) {
    document.getElementById('yahooStatus').textContent = '[AUTO] ' + text;
};

// Override status updates during auto-update
var originalIsUpdatingPrices = isUpdatingPrices;

if (isUpdatingPrices) {
    console.log('⏰ Auto-update skipped: Manual update in progress');
    if (callback) callback(false);
    return;
}

// Set updating flag
isUpdatingPrices = true;
autoUpdateSettings.retryCount = 0;

var uniqueTickers = getUniqueTickers();
console.log('🤖 Auto-updating', uniqueTickers.length, 'tickers');

// Reset prices and start update
portfolioData.prices = {};

// Use modified finish function for auto-update
var originalFinishPriceUpdate = finishPriceUpdate;
finishPriceUpdate = function() {
    isUpdatingPrices = false;
    
    var successCount = Object.keys(portfolioData.prices).length;
    var totalCount = uniqueTickers.length;
    var failureCount = totalCount - successCount;
    
    // Update status
    originalUpdateYahooStatus('Auto-update completed: ' + successCount + ' updated' + 
                             (failureCount > 0 ? ', ' + failureCount + ' failed' : ''));
    
    // Record successful update
    autoUpdateSettings.lastUpdate = new Date().toISOString();
    autoUpdateSettings.retryCount = 0;
    saveAutoUpdateSettings();
    
    // Restore original function
    finishPriceUpdate = originalFinishPriceUpdate;
    
    // Refresh analytics if we're on that tab
    var analyticsTab = document.getElementById('analytics');
    if (analyticsTab && analyticsTab.classList.contains('active')) {
        generateAnalytics();
    }
    
    console.log('🤖 Auto-update completed:', successCount, 'successful,', failureCount, 'failed');
    
    if (callback) callback(successCount > 0);
};

// Start the update
fetchPricesSequentially(uniqueTickers, 0);
```

}

// Override the original fetchAllPrices to handle auto-update conflicts
var originalFetchAllPrices = fetchAllPrices;
fetchAllPrices = function() {
if (autoUpdateSettings.enabled) {
// Reset retry count when user manually updates
autoUpdateSettings.retryCount = 0;
}
originalFetchAllPrices();
};

// Initialize when page loads
document.addEventListener(‘DOMContentLoaded’, function() {
setTimeout(initializeAutoUpdate, 1000); // Wait for other modules to load
});

// Make functions available globally
window.showAutoUpdateConfig = showAutoUpdateConfig;
window.saveAutoUpdateConfig = saveAutoUpdateConfig;
window.testAutoUpdate = testAutoUpdate;

console.log(‘✅ Automatic update module loaded’);
