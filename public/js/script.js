var privacy = document.getElementById("privacy");

const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
};

const observer = new IntersectionObserver(doPrivacy, options);
observer.observe(privacy);

function doPrivacy(entries) {
    if (!entries[0].isIntersecting) {
        return;
    }

    p = 0
    function makeid(length) {


        var result = '';
        var characters = 'BCDEFHIKLNPRSTUXYZabcdefghijklnopqrstuvxyz0123456789!#$%^&*()-_=+[]{}|;:,.<>?/';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += '<span>' + characters.charAt(Math.floor(Math.random() * charactersLength)) + '</span>';
        }

        if (p < 50) {
            p++
            privacy.innerHTML = result;
        } else {
            privacy.innerText = "privacy";
            clearInterval(privacyanim);
        }
    }
    var privacyanim = setInterval(makeid, 50, 5);
}

fetch("status")
    .then(response => response.json())
    .then(data => {
        document.getElementById("bytecounter").innerText = filesize(data.size.total_saved);
    })
    .catch(error => console.error('Error fetching byte counter:', error));
