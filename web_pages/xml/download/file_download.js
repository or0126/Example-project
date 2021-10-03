const DOWNLOAD_URL = buildUrlWithContextPath("download");

function displayXml(xmlString) {
    const xmlTextContainer = document.querySelector('#xmlText');
    xmlTextContainer.innerHTML = xmlString;
}

async function downloadXml(fileName) {
    const xmlType = document.querySelector('#xmlType');

    const xmlRetrievalUrl = DOWNLOAD_URL + '?xmlFileType=' + xmlType.value;

    const response = await fetch(xmlRetrievalUrl, {method: 'GET'});

    const xmlString = await response.text();

    displayXml(xmlString);

    download(`${xmlType.value.toLowerCase()}_export.xml`, xmlString);
}

function handleFormSubmit(event) {
    event.preventDefault();
    downloadXml();
}

window.addEventListener('load', () => {
    const downloadFormEl = document.querySelector('#downloadForm');
    downloadFormEl.addEventListener('submit', handleFormSubmit);
});

function download(filename, data) {
    const blob = new Blob([data], {type: 'text/xml'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}