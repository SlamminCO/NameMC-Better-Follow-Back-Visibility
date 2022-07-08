function getFollowingList() {
    let followingList = []

    const followButtonList = document.getElementsByClassName('btn btn-block btn-sm')

    for (let i = 0; i < followButtonList.length; i++) {
        const topElement = followButtonList[i].parentElement.parentElement
        const usernameElement = topElement.children[2].children[0]
        
        followingList.push({
            'username': usernameElement.innerText,
            'followsBack': usernameElement.classList.contains('font-weight-bold'),
            'topElement': topElement,
            'button': followButtonList[i]
        })
    }
    
    return followingList
}

function addFollowingBackColumn(followingList) {
    const followingTableHead = document.getElementsByClassName('table table-sm table-hover')[0].children[0]

    for (let i = 0; i < followingTableHead.children.length; i++) {
        const followingTableHeadRow = followingTableHead.children[i]

        const newTH = document.createElement('th')

        if (followingTableHeadRow.children[3].innerText != '') {
            newTH.innerText = 'Follows Back'
            newTH.classList.add('text-nowrap')
        } else {
            newTH.classList.add('border-bottom-0')
        }

        followingTableHeadRow.insertBefore(newTH, followingTableHeadRow.children[3])
    }

    for (let i = 0; i < followingList.length; i++) {
        const followsBackTD = document.createElement('td')

        if (!followingList[i]['followsBack']) {
            followsBackTD.innerText = '❌ No'
        } else {
            followsBackTD.innerText = '✅ Yes'
        }

        followingList[i]['topElement'].insertBefore(followsBackTD, followingList[i]['topElement'].children[3])
    }
}

function editFollowButtons(followingList) {
    for (let i = 0; i < followingList.length; i++) {
        if (!followingList[i]['followsBack']) {
            followingList[i]['button'].classList.add('btn-not-follower')
        }
    }
}

function ownsCurrentPage() {
    const pageOwner = document.getElementsByClassName('text-center text-nowrap')[0].children[0].innerText
    const accountSwitcher = document.getElementsByClassName('nav-link dropdown-toggle text-nowrap pl-0')[0]

    if (!accountSwitcher) return false

    const signedInAccount = accountSwitcher.children[1].innerText

    return pageOwner === signedInAccount
}

function addUnfollowNonFollowersButton(nonFollowerCount) {
    const unfollowAllButton = document.getElementsByClassName('btn btn-warning')[0]

    if (!unfollowAllButton) return

    unfollowAllButton.style.margin = '3px'

    const unfollowNonFollowersButton = document.createElement('button')
    unfollowNonFollowersButton.innerText = `Unfollow ${nonFollowerCount} Non-follower${(nonFollowerCount != 1) ? 's' : ''}`
    
    unfollowNonFollowersButton.setAttribute('id', 'btn-unf')
    unfollowNonFollowersButton.setAttribute('class', 'btn btn-success btn-unf btn-warning')
    unfollowNonFollowersButton.addEventListener('click', (ev) => {
        chrome.storage.sync.set({ autoUnfollowCurrentPage: true })
        window.location.reload()
    })

    unfollowNonFollowersButton.style.margin = '3px'

    unfollowAllButton.parentElement.insertBefore(unfollowNonFollowersButton, unfollowAllButton)
}

function getNonFollowers(followingList) {
    let nonFollowerList = []

    for (let i = 0; i < followingList.length; i++) {
        if (followingList[i]['followsBack']) continue
        nonFollowerList.push(followingList[i])
    }

    return nonFollowerList
}

function autoUnfollowProcess(nonFollowerList) {
    chrome.storage.sync.get("autoUnfollowCurrentPage", (data) => {
        const autoUnfollowCurrentPage = data["autoUnfollowCurrentPage"]
        
        if (nonFollowerList.length == 0 && autoUnfollowCurrentPage) {
            chrome.storage.sync.set({ autoUnfollowCurrentPage: false })
        }

        chrome.storage.sync.get("autoUnfollow", (data) => {
            const autoUnfollow = data["autoUnfollow"]

            if ((autoUnfollow || autoUnfollowCurrentPage) && nonFollowerList.length > 0) {
                for (let i = 0; i < nonFollowerList.length; i++) {
                    nonFollowerList[i]['button'].click()
                }
            }
        })
    })
}

function main() {
    const isOwner = ownsCurrentPage()
    const followingList = getFollowingList()
    const nonFollowerList = getNonFollowers(followingList)
    
    if (isOwner) editFollowButtons(followingList)

    addFollowingBackColumn(followingList)

    if (isOwner) addUnfollowNonFollowersButton(nonFollowerList.length)

    if (isOwner) autoUnfollowProcess(nonFollowerList)
}

main()
