const GET_NOTIFICATION_URL = buildUrlWithContextPath('getNotification');

async function fetchNotification(){
    const notificationId = getUrlParameter('id');
    const response = await fetch(`${GET_NOTIFICATION_URL}?id=${notificationId}`);
    const notificationDTO = await response.json();

    if (notificationDTO) {
        const userDTO = await getAnyMember(notificationDTO.userId);
        document.getElementById('title').innerHTML = notificationDTO.title;
        document.getElementById('context').innerHTML = `By ${userDTO.name} (id ${notificationDTO.id}) ` +
        `at ${dateTimeToString(notificationDTO.dateTime)}`;
        document.getElementById('text').innerHTML = notificationDTO.text;
    }
}

window.addEventListener('load', () => {
   fetchNotification();
});