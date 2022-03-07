document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('autoUnfollow')

    chrome.storage.sync.get("autoUnfollow", function (data) {
        toggle.checked = data["autoUnfollow"]
    })

    toggle.addEventListener('change', function() {
        if (toggle.checked) {
            chrome.storage.sync.set({ autoUnfollow: true })
        } else {
            chrome.storage.sync.set({ autoUnfollow: false })
        }
    })
})