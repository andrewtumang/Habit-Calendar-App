const electron = require("electron");
const settings = require("electron-settings");


let root = document.documentElement;
var settingsIcon = document.getElementById("settings-icon");
var settingDiv = document.getElementById("settings");
var modeSwitch = document.getElementById("mode-check");
var input = document.getElementById("hex-color");
var toggles = document.getElementsByClassName("day");

var months = document.getElementsByClassName("month");
var weeks;
var days = [];

var now = new Date();

window.onload = function() {
    if(settings.has("settings")) {
        if(settings.get("settings.mode") == "light") {
            setLight();
        }
        else {
            setDark();
            modeSwitch.checked = true;
        }
        root.style.setProperty("--color", settings.get("settings.color"));
    }
    else {
        settings.set("settings", {
            mode: "dark",
            color: "#34C759"
        });
    }

    if(!settings.has(now.getFullYear().toString())) {
        for(let i = 1; i < 13; i++) {
            var daysInMonth = new Date(now.getFullYear(), i, 0).getDate();
            settings.set(now.getFullYear().toString() + "." + i.toString(), "0".repeat(daysInMonth+1));
        }
    }

    input.value = settings.get("settings.color");
    input.addEventListener("change", function() {
        if(/^#([0-9A-F]{3}){1,2}$/i.test(input.value)) {
            input.classList.remove("invalid");
            settings.set("settings.color", input.value);
            root.style.setProperty("--color", input.value);
        }
        else {
            input.classList.add("invalid");
        }
    }, false);

    
    weeks = document.getElementsByClassName("week");
    for(let i = 0; i < weeks.length; i++) {
        days = days.concat(Array.from(weeks[i].getElementsByClassName("day")));
    }

    setMonthIndicators();
    populateMonth();
}

window.addEventListener("focus", function() {
    if(now.getDate() == new Date().getDate()) {
        return;
    }
    now = new Date();
    setMonthIndicators();
    populateMonth();
}, false);


for(let i = 0; i < toggles.length; i++) {
    toggles[i].getElementsByTagName("input")[0].addEventListener("click", function() {
        var value = this.checked? "1" : "0";
        var date = parseInt(this.parentElement.nextElementSibling.textContent);
        var month;
        var year;
        var grandClasses = this.parentElement.parentElement.classList;
        if(grandClasses.contains("currMonth")) {
            month = now.getMonth() + 1;
            year = now.getFullYear();
        }
        else {
            return;
        }
        var key = year.toString() + "." + month.toString();
        var oldValue = settings.get(key);
        var new1 = oldValue.substr(0, date);
        var new2 = oldValue.substr(date+1);
        var newValue = new1 + value + new2;
        if(!newValue.substr(1).includes("0")) {
            newValue = "1" + newValue.substr(1);
            months[now.getMonth()].classList.add("completed");
        }
        else {
            if(newValue[0] == "1") {
                newValue = "0" + newValue.substr(1);
                months[now.getMonth()].classList.remove("completed");
            }
        }
        settings.set(key, newValue);
    }, false);
}


settingsIcon.addEventListener("click", function() {
    if(settingsIcon.classList.contains("open")) {
        settingsIcon.classList.remove("open");
        settingsIcon.classList.add("closed");
    }
    else {
        settingsIcon.classList.remove("closed");
        settingsIcon.classList.add("open");
    }


    if(settingDiv.classList.contains("open")) {
        settingDiv.classList.remove("open");
        settingDiv.classList.add("closed");
    }
    else {
        settingDiv.classList.remove("closed");
        settingDiv.classList.add("open");
    }
}, false);


modeSwitch.addEventListener("click", function() {
    if(modeSwitch.checked) {
        settings.set("settings.mode", "dark");
        setDark();
    }
    else {
        settings.set("settings.mode", "light");
        setLight();
    }
}, false);





// FUNCTIONS

function populateMonth() {
    var startDay = now.getDate();
    var startMon = now.getMonth();
    var startYr = now.getFullYear();
    var dayOfWeek = now.getDay();
    var daysInMonth = new Date(startYr, startMon+1, 0).getDate();

    for(let i = 0; i < dayOfWeek; i++) {
        var date = new Date(startYr, startMon, i+1-dayOfWeek).getDate();
        days[i].children[1].textContent = date;
        days[i].classList.add("disabled");
        days[i].getElementsByTagName("input")[0].disabled = true;
        
        if(startMon == 0) {
            var prevYear = startYr - 1;
            var key = prevYear.toString() + ".12";
            if(settings.has(key) && settings.get(key)[date] == "1") {
                days[i].getElementsByTagName("input")[0].checked = true;
            }
        }
        else {
            var key = startYr.toString() + "." + startMon.toString();
            if(settings.get(key)[date] == "1") {
                days[i].getElementsByTagName("input")[0].checked = true;
            }
        }
    }
    for(let i = dayOfWeek; i < dayOfWeek+daysInMonth; i++) {
        var date = i-dayOfWeek+1;
        days[i].children[1].textContent = date;
        days[i].getElementsByTagName("input")[0].disabled = false;
        days[i].classList.remove("disabled");
        days[i].classList.add("currMonth");
        
        var key = startYr.toString() + "." + (startMon+1).toString();
        if(settings.get(key)[date] == "1") {
            days[i].getElementsByTagName("input")[0].checked = true;
        }
    }
    for(let i = dayOfWeek+daysInMonth; i < 42; i++) {
        var date = i - dayOfWeek - daysInMonth + 1;
        days[i].children[1].textContent = date;
        days[i].classList.add("disabled");
        days[i].getElementsByTagName("input")[0].disabled = true;
    }
}

function setMonthIndicators() {
    var month = now.getMonth();
    for(let i = 1; i < month+1; i++) {
        var key = now.getFullYear().toString() + "." + i.toString();
        if(settings.get(key)[0] == "1") {
            months[i-1].classList.remove("selected");
            months[i-1].classList.add("completed");
        }
    }
    months[month].classList.add("selected");
    var monthIndex = now.getMonth() + 1;
    var key2 = now.getFullYear().toString() + "." + monthIndex.toString();
    console.log(key2);
    if(settings.get(key2)[0] == "1") {
        months[month].classList.add("completed");
    }
}

function setDark() {
    root.style.setProperty("--text-color", "white");
    root.style.setProperty("--bg-color", "black");
    settingsIcon.setAttribute("style", "filter: opacity(0.5) invert(1.0)");
    settingsIcon.setAttribute("style", "-webkit-filter: opacity(0.5) invert(1.0)");
}

function setLight() {
    root.style.setProperty("--text-color", "black");
    root.style.setProperty("--bg-color", "white");
    settingsIcon.setAttribute("style", "filter: opacity(0.5) invert(0.0)");
    settingsIcon.setAttribute("style", "-webkit-filter: opacity(0.5) invert(0.0)");
}