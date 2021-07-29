
var parentDomain = "https://iframe-demo.alexbill.dev",
    externalLinkUrl = "https://iframe-demo.alexbill.dev/#",
    urlEvent = "[UrlEvent]",
    pageLoaderEvent = '[PageLoaderEvent]',
    internalLinkAttr = 'data-internal-link';

window.addEventListener('message', receiveMessage, false);

initInternalLinks();

function initInternalLinks() {
    document.querySelectorAll('[' + internalLinkAttr + ']').forEach(function (link) {

        var path = link.getAttribute(internalLinkAttr);

        if (path) {
            return;
        }

        path = link.getAttribute('href');

        link.setAttribute(internalLinkAttr, path);
        link.setAttribute("href", externalLinkUrl + path);

        link.addEventListener('click', function (event) {
            event.preventDefault();

            var path = link.getAttribute(internalLinkAttr);

            window.location.href = path;

            showPageLoader();
        });
    });
}

function showPageLoader() {
    sendMessage(pageLoaderEvent + '1');
}

function receiveMessage(event) {
    if (event.origin && event.origin == parentDomain) {

        var data = event.data;

        if (typeof data === 'string') {
            if (tryHandleUrlEvent(data)) {
                return;
            }
        }
    }
}

function tryHandleUrlEvent(data) {
    if (data.startsWith(urlEvent)) {
        var path = data.replace(urlEvent, '');

        window.location.replace(path);
        return true;
    }

    return false;
}

function sendUrlEvent(pagePath) {
    sendMessage(urlEvent + pagePath);
}

function sendMessage(data) {
    window.parent.postMessage(data, parentDomain);
}