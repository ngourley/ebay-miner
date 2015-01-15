var request = require('request'),
    _ = require('underscore'),
    moment = require('moment');

const findItemsByKeywords = 'findItemsByKeywords';
const findCompletedItems = 'findCompletedItems';

var operationName = findCompletedItems;

options = {
    url: 'http://svcs.ebay.com/services/search/FindingService/v1?',
    qs: {
        'RESPONSE-DATA-FORMAT': 'JSON',
        'SERVICE-VERSION': '1.13.0',
        'SECURITY-APPNAME': '',
        'OPERATION-NAME': operationName,
        'keywords': 'super smash bros n64',
        'REST-PAYLOAD': true
    }
}

request.get(options, function (err, response, body) {
    if (err) {
        console.log(err);
        return;
    }

    switch (operationName) {
        case findItemsByKeywords:
            parseFindItemsByKeyword(body);
            break;
        case findCompletedItems:
            parseFindCompletedItems(body);
            break;
        default:
            console.log('mew')
    }

});

function parseMetadata (response) {
    var meta = {};
    meta.ack = _.first(response.ack);
    meta.version = _.first(response.version);
    meta.timestamp = moment(_.first(response.timestamp)).toDate();
    meta.pagination = {};
    meta.pagination.pageNumber = _.first(_.first(response.paginationOutput).pageNumber);
    meta.pagination.entriesPerPage = _.first(_.first(response.paginationOutput).entriesPerPage);
    meta.pagination.totalPages = _.first(_.first(response.paginationOutput).totalPages);
    meta.pagination.totalEntries = _.first(_.first(response.paginationOutput).totalEntries);
    return meta;
}

function parseFindCompletedItems (body) {
    var body = JSON.parse(body);
    var response = _.first(body.findCompletedItemsResponse);
    var metadata = parseMetadata(response);
    // _.pluck(response, 'searchResult');
}

function parseFindItemsByKeyword (body) {
    var testing = JSON.parse(body);
    var count = testing.findItemsByKeywordsResponse[0].searchResult[0]['@count'];
    var results = testing.findItemsByKeywordsResponse[0].searchResult[0]['item'];

    _.each(results, function (result) {
        console.log(result.title[0]);
        console.log(result.viewItemURL[0]);

        var sellingStatus = result.sellingStatus[0];
        console.log(sellingStatus.currentPrice);
        console.log(moment.duration(sellingStatus.timeLeft).humanize() + ' remaining.');
        console.log('----')
    });
}