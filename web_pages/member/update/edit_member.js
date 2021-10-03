async function fetchData() {
    const chosenMember = getUrlParameter("chosenMember");
    const memberDTO = await getUser(chosenMember);

    document.querySelector('#memberId').value = memberDTO.id;
    document.querySelector('#memberName').value = memberDTO.name;
    document.querySelector('#memberType').value = memberDTO.memberType;
    document.querySelector('#phone').value = memberDTO.phone;
    document.querySelector('#email').value = memberDTO.email;
    document.querySelector('#password').value = memberDTO.password;
    document.querySelector('#joinDate').value = dateTimeToString(memberDTO.joinDate);
    document.querySelector('#expirationDate').value = dateTimeToString(memberDTO.expirationDate);
    document.querySelector('#age').value = (memberDTO.age || memberDTO.age === 0) ? memberDTO.age : null;
    document.querySelector('#comments').value = (memberDTO.comments) ? memberDTO.comments : null;
    document.querySelector('#hasBoat').checked = (memberDTO.hasBoat === true);
    document.querySelector('#privateBoatId').value = (memberDTO.boatId) ? memberDTO.boatId : null;
    document.querySelector('#experience').value = memberDTO.experience;
}

function buildWindowUrl(button) {
    const chosenMember = getUrlParameter("chosenMember");

    let redirectUrl = button.dataset.href;
    if (chosenMember) {
        redirectUrl += `?chosenMember=${chosenMember}`;
    }

    return redirectUrl;
}

window.addEventListener('load', () => {
    fetchData();

    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const redirectUrl = buildWindowUrl(button);
            openWindow(button, redirectUrl, 'editMemberFieldWindow');
        });
    });
});