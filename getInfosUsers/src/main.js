// ==UserScript==
// @name         SocialClub
// @version      0.3
// @description  Mostra alguns dados do perfil da socialclub
// @author       RuiGuilherme
// @match        https://pt.socialclub.rockstargames.com/member/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace    http://tampermonkey.net/
// ==/UserScript==

var $ = window.jQuery; //Gambiarra!?!?!?

$(document).ready(function() {
    $("#idAllData").click(function() {
        console.log($("#values"));
        $("#values").select();
        return document.execCommand("copy");
    });

    function getCookie(e) {
        for (var t = e + "=", r = decodeURIComponent(document.cookie).split(";"), o = 0; o < r.length; o++) {
            for (var n = r[o];
                 " " == n.charAt(0);) n = n.substring(1);
            if (0 == n.indexOf(t)) return n.substring(t.length, n.length)
        }
        return ""
    }

    var path = window.location.pathname;
    if(path[path.length-1] != '/') path += '/';
    var username = /^\/member\/([\w\W]+)\//.exec(path)[1];
    var getCook = getCookie('BearerToken');
    console.log("Cookies: "+getCook);
    setTimeout(function() { // Esse time apenas vai aguardar o navegador carregar todas informações
        $.ajax({
            method: 'GET',
            url: 'https://scapi.rockstargames.com/profile/getprofile?nickname=' + username + '&maxFriends=3',
            beforeSend: function(request) {
                request.setRequestHeader('Authorization', 'Bearer ' + getCook);
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
        }).done(function(data) {
            console.log(data);
            var scid = data.accounts[0].rockstarAccount.rockstarId;
            var getAllInfo = data.accounts[0].rockstarAccount;
            var dataName = $('[class^="ProfileHeader__name"]');
            dataName.append('<input style="" id="values" value="'+getAllInfo.rockstarId +"-"+ getAllInfo.name +"-"+ getAllInfo.primaryClanId +"-"+ getAllInfo.primaryClanName +"-"+ getAllInfo.primaryClanTag +'" />');
        });
    }, 3000);
});