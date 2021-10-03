let multiSelectActivities = null;

async function init() {
    multiSelectActivities = await populateActivities();
}

function getActivityParams() {
    const startTimeEl = document.getElementById('startTime');
    const endTimeEl = document.getElementById('endTime');
    const boatTypeEl = document.getElementById('boatType');

    const activityParams = new Array(3);
    activityParams[0] = {name: 'startTime', value: startTimeEl.value};
    activityParams[1] = {name: 'endTime', value: endTimeEl.value};
    activityParams[2] = {name: 'boatType', value: boatTypeEl.value};

    return activityParams;
}

window.addEventListener('load', function (event) {
    onRequestLoad(UPDATE_REQUEST_TIME, null, init, getActivityParams);
});