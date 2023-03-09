export const url = 'https://www.surveymonkey.com/r/76T3SPN';
export const suveryAmount = '$25';

function updateQueryStringParameter(uri, key, value='') {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

export function getUrlWithParams(email, confcode)
{
    let newUrl = updateQueryStringParameter(url, 'email', email);
    newUrl = updateQueryStringParameter(newUrl, 'confcode', confcode);
    return newUrl;
}
