let unfollowAllButton = document.querySelector("body > main > div.text-center.mb-3 > button.btn.btn-warning")

if (unfollowAllButton) {
    let parentNode = unfollowAllButton.parentNode
    let newElement = document.createElement("button")
    newElement.innerHTML = " Unfollow 0 Non-Followers "
    
    newElement.setAttribute("class", "btn btn-success btn-unf")
    newElement.setAttribute("id", "btn-unf")
    newElement.addEventListener("click", function (ev) {
        chrome.storage.sync.set({ autoUnfollowCurrentPage: true })
        window.location.reload()
    })
    parentNode.insertBefore(newElement, unfollowAllButton)

    newElement = document.createElement("div")

    newElement.setAttribute("class", "text-center mb-3")
    parentNode.insertBefore(newElement, unfollowAllButton)
}

let topTable = document.querySelector("body > main > div > div.card.mb-3 > div.table-responsive > table.table.table-sm.table-hover > thead > tr > th.border-bottom-0.d-none.d-sm-table-cell")

if (topTable) {
    let newElement1 = document.createElement("th")

    newElement1.setAttribute("class", "border-bottom-0")
    
    let parentNode1 = topTable.parentNode
    parentNode1.insertBefore(newElement1, topTable)
}

let bottomTable = document.querySelector("body > main > div > div.card.mb-3 > div.table-responsive > table.table.table-sm.table-hover > thead > tr > th.d-none.d-sm-table-cell.text-nowrap")

if (bottomTable) {
    
    let newElement2 = document.createElement("th")
    newElement2.innerHTML = "<a>Follows Back</a>"

    newElement2.setAttribute("class", "text-nowrap")

    let parentNode2 = bottomTable.parentNode

    parentNode2.insertBefore(newElement2, bottomTable)
}

let users = {}
let tables = document.querySelectorAll("tr > td")


tables.forEach((value, key, parent) => {
    let subElement = value.getElementsByTagName("a").item(0)
    
    if (!subElement || subElement.getAttribute("translate") != "no") return

    users[subElement.getAttribute("title")] = {
        "class": subElement.getAttribute("class"),
        "dateElement": tables.item(key + 1),
        "parentNode": tables.item(key + 1).parentNode,
        "followButton": (unfollowAllButton) ? tables.item(key + 4).getElementsByTagName("button").item(0) : null
    }
})

let nonFollowers = 0

for (const user in users) {
    let isFollowing = (users[user]["class"].search("font-weight-bold") > -1) ? true : false
    let src = (isFollowing) ? "https://s.namemc.com/img/emoji/twitter/2705.svg" : "https://s.namemc.com/img/emoji/twitter/274c.svg"
    let alt = (isFollowing) ? "✅" : "❌"
    let txt = (isFollowing) ? "Yes" : "No"
    let newElement = document.createElement("td")
    newElement.innerHTML = `<img class="emoji" draggable="false" src=${src} alt=${alt}> <b>${txt}</b>`

    newElement.setAttribute("translate", "no")
    users[user]["parentNode"].insertBefore(newElement, users[user]["dateElement"])
    
    if (!isFollowing && unfollowAllButton) {
        users[user]["followButton"].setAttribute("class", `${users[user]["followButton"].getAttribute("class")} btn-not-follower`)
        
        nonFollowers += 1
        document.getElementById("btn-unf").innerHTML = ` Unfollow ${nonFollowers} Non-Follower${(nonFollowers > 1) ? "s" : ""} `
    }
}

if (unfollowAllButton) {
    chrome.storage.sync.get("autoUnfollowCurrentPage", (data) => {
        let autoUnfollowCurrentPage = data["autoUnfollowCurrentPage"]
        
        if (nonFollowers == 0 && autoUnfollowCurrentPage) {
            chrome.storage.sync.set({ autoUnfollowCurrentPage: false })
        }

        chrome.storage.sync.get("autoUnfollow", (data) => {
            let autoUnfollow = data["autoUnfollow"]


            if ((autoUnfollow || autoUnfollowCurrentPage) && nonFollowers > 0) {
                for (const user in users) {
                    if (users[user]["class"].search("font-weight-bold") == -1) {
                        users[user]["followButton"].click()
                    }
                }
            }
        })
    })
}