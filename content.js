const btnNotFollower = document.createElement('style')
btnNotFollower.innerHTML = `
.btn-not-follower { 
	background-color: #DE1C3D;
	border-color: #B21631;
}

.btn-not-follower:hover {
	background-color: #B21631;
	border-color: #B21631;
}
`

document.head.appendChild(btnNotFollower)



let sp1_1 = document.createElement("th")
let sp1 = document.createElement("th")
sp1_1.setAttribute("class", "border-bottom-0")
sp1.setAttribute("class", "text-nowrap")
sp1.innerHTML = "<a>Follows You</a>"

let sp2_1 = document.querySelector("body > main > div > div.card.mb-3 > div.table-responsive > table.table.table-sm.table-hover > thead > tr > th.border-bottom-0.d-none.d-sm-table-cell")
let sp2 = document.querySelector("body > main > div > div.card.mb-3 > div.table-responsive > table.table.table-sm.table-hover > thead > tr > th.d-none.d-sm-table-cell.text-nowrap")

if (sp2_1 && sp2) {

    let parentDiv_1 = sp2_1.parentNode
    let parentDiv = sp2.parentNode

    parentDiv_1.insertBefore(sp1_1, sp2_1)
    parentDiv.insertBefore(sp1, sp2)



    let list = document.querySelectorAll("body > main > div > div.card.mb-3 > div.table-responsive > table.table.table-sm.table-hover > tbody > tr")

    for (let user of list) {
        if (user.innerHTML.search("bold") == -1) {
            let sp1 = document.createElement("td")
            sp1.innerHTML = '<td title="Not Following" translate="no" class=""><img class="emoji" draggable="false" src="https://s.namemc.com/img/emoji/twitter/274c.svg" alt="❌"> <b>No</b></td>'
            
            let sp2 = user.getElementsByTagName("td")[3]
            let parentDiv = sp2.parentNode
            
            parentDiv.insertBefore(sp1, sp2)

            let button = user.getElementsByClassName("btn btn-block btn-sm btn-success")
            button[0].setAttribute("class", "btn btn-block btn-sm btn-success btn-not-follower")
        } else {
            let sp1 = document.createElement("td")
            sp1.innerHTML = '<td title="Following" translate="no" class=""><img class="emoji" draggable="false" src="https://s.namemc.com/img/emoji/twitter/2705.svg" alt="✅"> <b>Yes</b></td>'
            
            let sp2 = user.getElementsByTagName("td")[3]
            let parentDiv = sp2.parentNode
            
            parentDiv.insertBefore(sp1, sp2)
        }
    }
}