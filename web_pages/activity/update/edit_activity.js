async function fetchData() {
    const windowDTO = await getActivity(getUrlParameter("id"));

    document.querySelector('#id').value = windowDTO.id;
    document.querySelector('#activityName').value = windowDTO.activityName;
    document.querySelector('#time').value =
        `${timeToString(windowDTO.startTime)}-${timeToString(windowDTO.endTime)}`;
    document.querySelector('#boatType').value = windowDTO.boatType;
}

function buildWindowUrl(button) {
    return button.dataset.href +
        `?id=${getUrlParameter("id")}`;
}

window.addEventListener('load', () => {
    fetchData();

    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const redirectUrl = buildWindowUrl(button, 'editActivityFieldWindow');
            openWindow(button, redirectUrl);
        });
    });
});