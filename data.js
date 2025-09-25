// Portfolio Data Management
console.log('Loading data management module...');

// Global data storage
var portfolioData = {
    holdings: [],
    prices: {},
    accounts: {}
};

// Ticker mappings for converting broker symbols to Yahoo Finance tickers
var tickerMappings = {
    // Swedish stocks
    'INVE B': 'INVE-B.ST',
    'NOVO B': 'NOVO-B.CO',
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
    // Danish stocks
    'DANSKE': 'DANSKE.CO',
    // European stocks
    'ASMLa': 'ASML.AS',
    'RMSp': 'RMS.PA',
    'MCp': 'MC.PA',
    'IVGm': 'IVG.MI',
    // US stocks
    'MSFT': 'MSFT',
    'V': 'V',
    'JPM': 'JPM',
    'ABBV': 'ABBV',
    'PG': 'PG'
};

// Convert broker symbol to Yahoo Finance ticker
function convertToYahooTicker(symbol, isin) {
    // Check direct mappings first
    if (tickerMappings[symbol]) {
        return {
            ticker: tickerMappings[symbol],
            confidence: 'high'
        };
    }
    
    // Use ISIN to determine exchange
    if (isin && isin.length >= 2) {
        var country = isin.substring(0, 2);
        var ticker;
        
        switch (country) {
            case 'SE': ticker = symbol + '.ST'; break;  // Sweden
            case 'DK': ticker = symbol + '.CO'; break;  // Denmark
            case 'NO': ticker = symbol + '.OL'; break;  // Norway
            case 'FI': ticker = symbol + '.HE'; break;  // Finland
            case 'FR': ticker = symbol + '.PA'; break;  // France
            case 'DE': ticker = symbol + '.DE'; break;  // Germany
            case 'IT': ticker = symbol + '.MI'; break;  // Italy
            case 'NL': ticker = symbol + '.AS'; break;  // Netherlands
            case 'GB': ticker = symbol + '.L'; break;   // UK
            case 'US': ticker = symbol; break;          // US
            default: ticker = symbol + '.ST';           // Default to Swedish
        }
        
        return {
            ticker: ticker,
            confidence: 'medium'
        };
    }
    
    // Default fallback (assume Swedish exchange)
    return {
        ticker: symbol + '.ST',
        confidence: 'low'
    };
}

// Get unique tickers from holdings
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

// Get unique accounts from holdings
function getUniqueAccounts() {
    var accounts = {};
    
    portfolioData.holdings.forEach(function(holding) {
        if (!accounts[holding.account]) {
            accounts[holding.account] = {
                holdings: [],
                totalShares: 0,
                totalValue: 0
            };
        }
        
        accounts[holding.account].holdings.push(holding);
        accounts[holding.account].totalShares += holding.volume;
        
        // Add value if price is available
        var priceData = portfolioData.prices[holding.ticker];
        if (priceData && priceData.price) {
            accounts[holding.account].totalValue += holding.volume * priceData.price;
        }
    });
    
    return accounts;
}

// Update status display
function updateStatus(message) {
    var statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log('Status: ' + message);
}

console.log('Data management module loaded');
