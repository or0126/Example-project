async function populateBoatsInList(listElement, includePrivate, includeDisabled) {
    const includePrivateBoat = (includePrivate !== undefined && includePrivate !== null) ? includePrivate : 'false';
    const includeDisabledBoat = (includeDisabled !== undefined && includeDisabled !== null) ? includeDisabled : 'true';

    const GET_BOATS_URL = buildUrlWithContextPath('findBoats');
    const xmlRetrievalUrl = `${GET_BOATS_URL}?includePrivate=${includePrivateBoat}&includeDisabled=${includeDisabledBoat}`;
    const response = await fetch(xmlRetrievalUrl, {method: 'GET'});
    const boatDTOArr = await response.json();

    boatDTOArr.forEach(boat => {
        const option = document.createElement('option');
        option.text = `ID: ${boat.id}, Name: ${boat.name}, Type: ${getReadableEnum(boat.boatType)}`;

        if (boat.isDisabled) {
            option.text += ', Disabled';
        }
        else{
            option.text +=
                ((boat.isWide) ? ', Wide' : ', Not Wide') +
                ((boat.isCoastal) ? ', Coastal' : ', Not Coastal') +
                ((boat.isPrivate) ? ', Private' : ', Not Private');
        }
        option.value = boat.id;
        listElement.appendChild(option);
    });
}