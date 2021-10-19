export const RelatedResourcesSearchConfig = {
    "aggs": [],
    "appId": "deposit-search-custom",
    "initialQueryState": {
        "hiddenParams": null,
        "size": 10,
        "page": 1,
        "sortBy": "updated-desc"
    },
    "layoutOptions": {
        "gridView": false,
        "listView": true
    },
    "paginationOptions": {
        "defaultValue": 5,
        "resultsPerPage": [
            {
                "text": "5",
                "value": 5
            },
            {
                "text": "20",
                "value": 20
            },
            {
                "text": "50",
                "value": 50
            }
        ]
    },
    "searchApi": {
        "axios": {
            "headers": {
                "Accept": "application/vnd.inveniordm.v1+json"
            },
            "url": "/api/user/records",
            "withCredentials": true
        }
    },
    "sortOptions": [
        {
            "sortBy": "bestmatch",
            "text": "Best match"
        },
        {
            "sortBy": "newest",
            "text": "Newest"
        },
        {
            "sortBy": "updated-desc",
            "text": "Recently updated"
        },
        {
            "sortBy": "updated-asc",
            "text": "Least recently updated"
        },
        {
            "sortBy": "version",
            "text": "Version"
        }
    ]
};