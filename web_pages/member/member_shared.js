const GET_MEMBER_URL = buildUrlWithContextPath("getMember");
const GET_ANY_MEMBER_URL = buildUrlWithContextPath('getAnyMember');

//Gets the current user, unless the current user is a manager and userId is specified
async function getUser(userId){
    const url = userId ? `${GET_MEMBER_URL}?id=${userId}` : GET_MEMBER_URL;
    const response = await fetch(url);
    return await response.json();
}

//Gets any member
async function getAnyMember(memberId) {
    const response = await fetch(`${GET_ANY_MEMBER_URL}?memberId=${memberId}`);
    return await response.json();
}

async function populateMembersInList(listElement, isActive) {
    const membersDTO = await fetchMembers(isActive);
    doPopulateList(listElement, membersDTO);
}

async function populateMembersInMultipleLists(listArr, isActive) {
    if (!Array.isArray(listArr)) return;

    const membersDTO = await fetchMembers(isActive);
    if (Array.isArray(membersDTO)) {
        listArr.forEach(list => {
            const listClone = list.cloneNode(true);
            doPopulateList(listClone, membersDTO);
            list.parentNode.replaceChild(listClone, list);
        });
    }
}

async function fetchMembers(isActive, memberId, hasBoat){
    const FIND_MEMBERS_URL = buildUrlWithContextPath('findMembers');
    let params = '';
    params = appendToParams(params, 'memberId', memberId);
    params = appendToParams(params, 'hasBoat', hasBoat);
    params = appendToParams(params, 'isActive', isActive);

    const xmlRetrievalUrl = FIND_MEMBERS_URL + params;
    const response = await fetch(xmlRetrievalUrl, {method: 'GET'});
    return await response.json();
}

function doPopulateList(listElement, membersDTO) {
    if (Array.isArray(membersDTO)) {
        membersDTO.forEach(member => {
            const option = document.createElement('option');
            option.text = `${member.name} (id ${member.id})`;
            option.value = member.id;
            listElement.appendChild(option);
        });
    }
}