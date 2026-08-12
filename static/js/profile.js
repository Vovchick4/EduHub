const avatar = document.getElementById("profile-avatar");

if (avatar) {
    avatar.addEventListener("click", function () {
        avatar.classList.toggle("enlarged");
    });
}