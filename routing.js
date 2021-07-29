
var iframeDomain = "https://iframe-demo.alexbill.dev",
    iframeId = "iframe",
    urlEvent = "[UrlEvent]",
    pageLoaderEvent = '[PageLoaderEvent]',
    pageLoaderId = 'pageLoader',
    pageLoaderTimer,
    currentHash;

function init() {
    window.addEventListener('message', receiveMessage, false);
    window.addEventListener("hashchange", hashChanged, false);

    if (window.location.hash && window.location.hash.length > 0) {
        var iframe = document.getElementById(iframeId);
        var path = window.location.hash.substr(1);
        iframe.src = iframeDomain + path;
    }
    else {
        var iframe = document.getElementById(iframeId);
        iframe.src = iframeDomain + "/page1";
    }

    pageLoaderShow();
}

function receiveMessage(event) {
    if (event.origin && event.origin == iframeDomain) {
        var data = event.data;

        if (typeof data === 'string') {
            if (tryHandleUrlEvent(data)) {
                return;
            }

            if (tryHandlePageLoaderEvent(data)) {
                return;
            }
        }
    }
}

function tryHandleUrlEvent(data) {
    if (data.startsWith(urlEvent)) {
        var path = data.replace(urlEvent, '');

        pageLoaderHide();

        currentHash = '#' + path;
        window.location.replace(currentHash);

        return true;
    }

    return false;
}

function tryHandlePageLoaderEvent(data) {
    if (data.startsWith(pageLoaderEvent)) {

        pageLoaderShow();
        return true;
    }

    return false;
}

function hashChanged() {
    var hash = window.location.hash;

    if (hash === currentHash) {
        return;
    }

    currentHash = hash;

    hash = hash.substr(1);

    if (hash.length > 0) {
        sendMessage(urlEvent + hash);
        pageLoaderShow();
    }
}

function sendMessage(data) {
    var iframe = document.getElementById(iframeId);

    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(data, iframeDomain);
    }
}

function pageLoaderShow() {
    if (pageLoaderTimer) {
        clearTimeout(pageLoaderTimer);
    }

    pageLoaderTimer = setTimeout(function () {
        var iframe = document.getElementById(iframeId);

        var pageLoader = document.getElementById(pageLoaderId);
        pageLoader.style.display = 'block';
        pageLoader.style.top = iframe.offsetTop + "px";
        pageLoader.style.left = iframe.offsetLeft + "px";
        pageLoader.style.height = iframe.offsetHeight + "px";
        pageLoader.style.width = iframe.offsetWidth + "px";

    }, 500);
}

function pageLoaderHide() {
    clearTimeout(pageLoaderTimer);
    pageLoaderTimer = null;

    var pageLoader = document.getElementById(pageLoaderId);
    pageLoader.style.display = 'none';
}