function getModalInstance(modalEl) {
    let modal = bootstrap.Modal.getInstance(modalEl);

    if (modal === undefined || modal === null) {
        modal = new bootstrap.Modal(modalEl, {});
    }

    return modal;
}

function closeModal(modalEl){
    bootstrap.Modal.getInstance(modalEl).hide();
}