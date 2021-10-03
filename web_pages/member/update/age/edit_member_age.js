function validateAge(){
    const age = document.getElementById('inputField').value;

    let errorMsg = null;
    if (!isNaturalNumber(age)){
        errorMsg = 'Operation failed. Age must be a natural number';
    }

    return errorMsg;
}

window.addEventListener('load', function (event) {
    onMemberLoad(UPDATE_TYPE_AGE, validateAge);
});