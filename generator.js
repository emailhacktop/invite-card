"use strict";

const BASE_URL =
"https://emailhacktop.github.io/invite-card/invite.html";

const container =
document.getElementById(
"list"
);

let allLinks = "";

function safeCSV(value){

const text =
String(value);

if(
text.startsWith("=") ||
text.startsWith("+") ||
text.startsWith("-") ||
text.startsWith("@")
){
return "'" + text;
}

return text;
}

for(const id in guests){

if(
!Object.prototype.hasOwnProperty.call(
guests,
id
)
){
continue;
}

const guest =
guests[id];

const link =
BASE_URL +
"?id=" +
encodeURIComponent(id) +
"&token=" +
encodeURIComponent(guest.token);

allLinks +=
guest.name +
"\n" +
link +
"\n\n";

const card =
document.createElement("div");

card.className = "card";

const name =
document.createElement("div");

name.className = "name";

name.textContent =
guest.name;

const linkBox =
document.createElement("div");

linkBox.className = "link";

linkBox.textContent =
link;

const button =
document.createElement("button");

button.textContent =
"کپی لینک";

button.addEventListener(
"click",
function(){

navigator.clipboard
.writeText(link);

window.alert(
"کپی شد"
);
}
);

card.appendChild(name);
card.appendChild(linkBox);
card.appendChild(button);

container.appendChild(card);
}

document
.getElementById("copyAllBtn")
.addEventListener(
"click",
function(){

navigator.clipboard
.writeText(allLinks);

window.alert(
"همه لینک‌ها کپی شد"
);
}
);

document
.getElementById("csvBtn")
.addEventListener(
"click",
function(){

let csv =
"ID,NAME,TOKEN\n";

for(const id in guests){

if(
!Object.prototype.hasOwnProperty.call(
guests,
id
)
){
continue;
}

csv +=
safeCSV(id) + "," +
safeCSV(guests[id].name) + "," +
safeCSV(guests[id].token) +
"\n";
}

const blob =
new Blob(
[csv],
{
type:
"text/csv;charset=utf-8;"
}
);

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download =
"guests.csv";

document.body.appendChild(a);

a.click();

a.remove();

URL.revokeObjectURL(url);
}
);
