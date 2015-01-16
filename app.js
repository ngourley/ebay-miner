var request = require('request'),
    _ = require('underscore'),
    moment = require('moment'),
    config = require('./config');

const findItemsByKeywords = 'findItemsByKeywords';
const findCompletedItems = 'findCompletedItems';

var operationName = findCompletedItems;
var responseName = operationName + 'Response';

options = {
    url: 'http://svcs.ebay.com/services/search/FindingService/v1?',
    qs: {
        'RESPONSE-DATA-FORMAT': 'JSON',
        'SERVICE-VERSION': '1.13.0',
        'SECURITY-APPNAME': config.appName,
        'OPERATION-NAME': operationName,
        'keywords': 'super smash bros n64',
        'REST-PAYLOAD': true,
        'sortOrder': 'EndTimeSoonest'
    }
}

request.get(options, function (err, raw, body) {
    if (err) {
        console.log(err);
        return;
    }

    body = JSON.parse(body)
    var response = parseResponse(_.first(body[responseName]));

    switch (operationName) {
        case findItemsByKeywords:
            parseFindItemsByKeyword(response);
            break;
        case findCompletedItems:
            parseFindCompletedItems(response);
            break;
        default:
            console.log('mew')
    }

});

function parseResponse (response) {
    var meta = {};
    meta.ack = _.first(response.ack);
    meta.version = _.first(response.version);
    meta.timestamp = moment(_.first(response.timestamp)).toDate();
    meta.pagination = {};
    meta.pagination.pageNumber = _.first(_.first(response.paginationOutput).pageNumber);
    meta.pagination.entriesPerPage = _.first(_.first(response.paginationOutput).entriesPerPage);
    meta.pagination.totalPages = _.first(_.first(response.paginationOutput).totalPages);
    meta.pagination.totalEntries = _.first(_.first(response.paginationOutput).totalEntries);
    meta.count = _.first(response.searchResult)['@count'];
    var results = _.first(response.searchResult)['item'];
    return {metadata: meta, results: results};
}

function parseFindCompletedItems (response) {
    results = response.results
    _.each(results, function (result) {
        console.log(result.title[0]);
        console.log(result.viewItemURL[0]);
        console.log(moment(result.listingInfo[0].endTime[0], moment.ISO_8601).toDate())
        var sellingStatus = result.sellingStatus[0];
        console.log(sellingStatus.convertedCurrentPrice[0]['@currencyId'] + ': $' + sellingStatus.convertedCurrentPrice[0]['__value__']);
        console.log('----')
    });
}

function parseFindItemsByKeyword (response) {
    var count = testing.findItemsByKeywordsResponse[0].searchResult[0]['@count'];
    var results = testing.findItemsByKeywordsResponse[0].searchResult[0]['item'];

    _.each(results, function (result) {
        console.log(result.title[0]);
        console.log(result.viewItemURL[0]);
        var sellingStatus = result.sellingStatus[0];
        console.log(sellingStatus.convertedCurrentPrice);
        console.log(moment.duration(sellingStatus.timeLeft).humanize() + ' remaining.');
        console.log('----')
    });
}