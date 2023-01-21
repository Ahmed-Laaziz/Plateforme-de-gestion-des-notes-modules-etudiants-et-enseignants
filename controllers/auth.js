const user_exist = (user, this_user) => {
    (user.find()).forEach(individu => {
        if (this_user.email == individu.email) {
            return true;
        } else {
            return false;
        }
    });
}

module.exports = user_exist;