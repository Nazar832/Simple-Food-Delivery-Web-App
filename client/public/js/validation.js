function validate(input){
    let pattern;
    let message;

    switch (input.id) {
        case "name":
            pattern = /([A-Z][a-zA-Z]*)/;
            break;
        case "email":
            pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            break;
        case "phone":
            pattern = /^\d{10}$/;
            break;
        default:
            return [true];
    }

    validationPassed = pattern.test(input.value);
    if (validationPassed === true) {
        return [validationPassed];
    } else {
        message = `The ${input.id} is in incorrect format`;
        return [validationPassed, message];
    }
}