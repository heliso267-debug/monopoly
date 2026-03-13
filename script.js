// TELEGRAM
const tg = window.Telegram?.WebApp;

// SERVER
const SERVER_WS = "wss://YOUR_SERVER_DOMAIN/ws";

// ROOM
function getRoom(){
const p = new URLSearchParams(location.search);
return (p.get("room") || "").toUpperCase();
}

// GAME STATE
let socket = null;
let selectedToken = null;

let player = {
id:null,
name:"Гость",
money:1500
};

const tokens = ["🐶","🐱","🐸","🦊","🐼","🦁","🐵","🐯"];

// ==========================
// CHANCE CARDS
// ==========================

const CHANCE_CARDS = [

{ text:"Перейдите на поле СТАРТ и получите 200$", money:200 },

{ text:"Отправляйтесь в тюрьму", action:"jail" },

{ text:"Получите дивиденды банка 100$", money:100 },

{ text:"Заплатите 50$ за ремонт собственности", money:-50 },

{ text:"Получите от каждого игрока по 10$", action:"collect10" },

{ text:"Заплатите налог 150$", money:-150 },

{ text:"Получите карту выхода из тюрьмы", action:"jail_free" },

{ text:"Вернитесь назад на 3 клетки", action:"back3" },

{ text:"Банк выплачивает бонус 50$", money:50 },

{ text:"Заплатите каждому игроку 25$", action:"pay25" },

{ text:"Перейдите на ближайшую железную дорогу", action:"railroad" },

{ text:"Перейдите на ближайшее коммунальное предприятие", action:"utility" },

{ text:"Получите зарплату 200$", money:200 },

{ text:"Перейдите на Бесплатную стоянку", action:"parking" },

{ text:"Освободитесь из тюрьмы за 50$", money:-50 },

{ text:"Получите от банка 100$", money:100 }

];


// ==========================
// COMMUNITY CHEST
// ==========================

const CHEST_CARDS = [

{ text:"Заплатите налог на доход 200$", money:-200 },

{ text:"Получите пособие банка 50$", money:50 },

{ text:"Заплатите 100$ за улучшение участков", money:-100 },

{ text:"Получите от каждого игрока по 5$", action:"collect5" },

{ text:"Перейдите на поле СТАРТ и получите 200$", money:200 },

{ text:"Заплатите 100$ за коммунальные услуги", money:-100 },

{ text:"Получите приз банка 100$", money:100 },

{ text:"Заплатите 75$ за ремонт домов", money:-75 },

{ text:"Перейдите на коммунальное предприятие", action:"utility" },

{ text:"Получите наследство 150$", money:150 },

{ text:"Заплатите налог на имущество 50$", money:-50 },

{ text:"Получите компенсацию 75$", money:75 },

{ text:"Перейдите на Бесплатную стоянку", action:"parking" },

{ text:"Заплатите каждому игроку по 10$", action:"pay10" },

{ text:"Штраф банка 50$", money:-50 },

{ text:"Бонус за участие 25$", money:25 }

];

// ==========================
// UI
// ==========================

function updateMoney(){
document.getElementById("playerMoney").innerText = player.money + " $";
}

// ==========================
// LOG
// ==========================

function addLog(text){

const log = document.getElementById("gameLog");

const el = document.createElement("div");

el.className = "logLine";

el.innerText = text;

log.prepend(el);

}

// ==========================
// CARDS
// ==========================

function drawChance(){

const card = CHANCE_CARDS[Math.floor(Math.random()*CHANCE_CARDS.length)];

addLog("🎴 Шанс: " + card.text);

applyCard(card);

}

function drawChest(){

const card = CHEST_CARDS[Math.floor(Math.random()*CHEST_CARDS.length)];

addLog("📦 Казна: " + card.text);

applyCard(card);

}

function applyCard(card){

if(card.money){

player.money += card.money;

updateMoney();

}

}

// ==========================
// DICE
// ==========================

function rollDice(){

const d1 = Math.floor(Math.random()*6)+1;
const d2 = Math.floor(Math.random()*6)+1;

document.getElementById("die1").innerText = d1;
document.getElementById("die2").innerText = d2;

addLog("🎲 Выпало " + d1 + " и " + d2);

}

// ==========================
// TOKENS
// ==========================

function renderTokens(){

const grid = document.getElementById("tokenGrid");

tokens.forEach(t=>{

const btn = document.createElement("button");

btn.className = "tokenBtn";

btn.innerText = t;

btn.onclick = ()=>{

selectedToken = t;

document.querySelectorAll(".tokenBtn").forEach(x=>x.classList.remove("selected"));

btn.classList.add("selected");

document.getElementById("playerAvatar").innerText = t;

};

grid.appendChild(btn);

});

}

// ==========================
// WEBSOCKET
// ==========================

function connectWS(room){

socket = new WebSocket(${SERVER_WS}/${room});

socket.onopen = ()=>{

console.log("WS CONNECTED");

};

socket.onmessage = (event)=>{

const msg = JSON.parse(event.data);

if(msg.type==="room_state"){

renderPlayers(msg.players);

}

};

}

// ==========================
// PLAYERS
// ==========================

function renderPlayers(players){

const list = document.getElementById("playersList");

list.innerHTML="";

players.forEach(p=>{

const el=document.createElement("div");

el.className="playerItem";

el.innerText=p.name;

list.appendChild(el);

});

}

// ==========================
// INIT
// ==========================

function init(){

const room=getRoom();

document.getElementById("roomCode").innerText=room||"—";

renderTokens();

if(tg){

tg.expand();
tg.ready();

const u=tg.initDataUnsafe?.user;

if(u){

player.id=u.id;
player.name=u.first_name;

}

}

document.getElementById("playerName").innerText=player.name;

document.getElementById("playerId").innerText="id: "+(player.id||"—");

updateMoney();

document.getElementById("btnRoll").onclick=rollDice;

if(room){

connectWS(room);

}

}

init();
