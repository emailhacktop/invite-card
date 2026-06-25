"use strict";

const ADMIN_PASSWORD = "Amin2000";

const params =
new URLSearchParams(
window.location.search
);

const guestId =
params.get("id");

const guestToken =
params.get("token");

const guestNameElement =
document.getElementById(
"guestName"
);

const expiredElement =
document.getElementById(
"expired"
);

function fail(message){

document.body.textContent =
message;

throw new Error(message);
}

if(
typeof guests !== "object"
){
fail("guests.js error");
}

if(
!guestId ||
!Object.prototype.hasOwnProperty.call(
guests,
guestId
)
){
fail("guest not found");
}

const guest =
guests[guestId];

if(
guest.token !== guestToken
){
fail("invalid token");
}

const viewKey =
"views_" + guestId;

let views =
Number.parseInt(
localStorage.getItem(viewKey)
|| "0",
10
);

if(views >= 10){

expiredElement.style.display =
"flex";

}else{

localStorage.setItem(
viewKey,
String(views + 1)
);

const finalText =
"خدمت " + guest.name;

let index = 0;

function typeWriter(){

if(index < finalText.length){

guestNameElement.textContent +=
finalText.charAt(index);

index++;

window.setTimeout(
typeWriter,
80
);
}
}

typeWriter();
}

let tapCount = 0;

const adminLogo =
document.getElementById(
"adminLogo"
);

adminLogo.addEventListener(
"click",
function(){

tapCount++;

if(tapCount >= 7){

const pass =
window.prompt(
"رمز مدیریت"
);

if(
pass === ADMIN_PASSWORD
){

localStorage.removeItem(
viewKey
);

window.alert(
"ریست شد"
);

window.location.reload();

}else{

window.alert(
"رمز اشتباه است"
);
}

tapCount = 0;
}
}
);
