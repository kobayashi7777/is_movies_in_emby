// ==UserScript==
// @name         missav番号emby入库检测
// @namespace    http://tampermonkey.net/
// @version      2024-07-13
// @description  try to take over the world!
// @author       You
// @match        https://missav.com/cn/*
// @match        https://missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none
// ==/UserScript==

(function() {

// emby参数

const server_url="https://emby.clearloves.top:43967";
//const server_url="https://192.168.5.200:39096";
//api key 自己去设置里设置
const api="5db9b4ef4d684cb0b862a5f9968a094c";
//用户id，从此获取http://192.168.5.200:39096/Users/Public
const user_id="d844e2e9c55d4828a26dbec2b6dbea03"

//从url中获取番号，无码有问题
//var website_url = window.location.href;
//var jav_code = website_url.split('/').pop();

var jav_code='xxx';
const h1Elements = document.querySelectorAll('h1.text-base.lg\\:text-lg.text-nord6');
h1Elements.forEach(function(h1) {
    jav_code=h1.textContent.split(" ")[0];
});

console.info(jav_code);
// 配置搜索参数
var params = {
    api_key: api,
    Recursive: 'true',
    IncludeItemTypes: 'Movie',
    SearchTerm :jav_code
};
var url = '{server_url}/emby/Users/{id}/Items?'
            .replace(/{server_url}/g,server_url)
            .replace(/{id}/g,user_id)
            + new URLSearchParams(params).toString();
console.info(url);
var res_count=0;
var first_movie_name="no similar movie in my emby";

//查找匹配番号
fetch(url)
    .then(response => {
        if (!response.ok) {
            console.info('挂了1');
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // console.log(data); // 处理返回的数据
        res_count = data.TotalRecordCount;
        const h1Elements = document.querySelectorAll('h1.text-base.lg\\:text-lg.text-nord6');
        h1Elements.forEach(function(h1) {
            const newElement = document.createElement('span');
            newElement.textContent = 'xxx';
            if(res_count>0){
                first_movie_name=data.Items[0].Name;
                newElement.textContent='Emby库中匹配番号共计'+res_count+'个，首个匹配影片：'+first_movie_name;
            }else{
                newElement.textContent='Emby库无番号为：'+jav_code+'   的影片';
            }
            newElement.className ="text-base lg:text-lg text-nord6";
            newElement.style.color = 'gold';
            h1.parentNode.insertBefore(newElement, h1.nextSibling);
        });
       /* if(res_count>0){
           first_movie_name=data.Items[0].Name;
        }
        console.info(res_count);
        console.info(first_movie_name);
       */

    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        console.info('挂了2',error);
    });

    // Your code here...
})();
