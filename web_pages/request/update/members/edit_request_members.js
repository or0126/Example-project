async function init() {
    const inputEl = document.getElementById('inputField');
    await populateMembersInList(inputEl);

    let multiSelectMembers = initMultiSelect('inputField', 'Select Additional Members');
    const requestDTO = await getRequest(getUrlParameter('id'));
    requestDTO.additionalMembers.forEach((member) => {
        setMultiSelectValue(multiSelectMembers, member.id);
    });
}

function getSelectedMembers() {
    const membersEl = document.getElementById('inputField');
    const selectedMembers = getMultiSelectValues(membersEl);
    return [{name: 'additionalMembers', value: selectedMembers}];
}

window.addEventListener('load', function (event) {
    onRequestLoad(UPDATE_REQUEST_MEMBERS, null, init, getSelectedMembers);
});