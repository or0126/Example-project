const GET_ACTIVITY_URL = buildUrlWithContextPath('getActivity');

async function getActivity(id){
    const response = await fetch(`${GET_ACTIVITY_URL}?id=${id}`);
    return await response.json();
}

async function populateActivitiesInList(listElement) {
    const GET_ACTIVITIES_URL = buildUrlWithContextPath('getAllActivities');
    const xmlRetrievalUrl = `${GET_ACTIVITIES_URL}`;
    const response = await fetch(xmlRetrievalUrl, {method: 'GET'});
    const activityDTOArr = await response.json();

    if (Array.isArray(activityDTOArr)) {
        activityDTOArr.forEach(activity => {
            const option = document.createElement('option');
            option.text = getActivityDescription(activity);
            option.value = activity.id;
            listElement.appendChild(option);
        });
    }
}

function getActivityDescription(activity) {
    return activity.activityName
            + " (" + timeToString(activity.startTime)
            + "-" + timeToString(activity.endTime)
            + ((activity.boatType) ? ", " + getReadableEnum(activity.boatType) : "")
            + ")";
}