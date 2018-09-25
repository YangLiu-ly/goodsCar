var goodsList = document.querySelector('.app ul');
var list = [];
var goodsTotal = [];
// var icount = 1;
var key = null;


function init(){
    events();
    sumBtnIsActive()
}
init()

//事件event
function events(){
    ajax('data.json');
    //商品列表点击事件
    goodsList.addEventListener('click', function(ele){
        var target = ele.target;
        
        //选中按钮事件
        if(target.tagName === 'INPUT'){
           if(target.checked){
                target.parentElement.classList.add('inputActive');
                updateSummary();
                sumBtnIsActive()
           }else{
                target.parentElement.classList.remove('inputActive');
                sumBtnIsActive()
                updateSummary();
           }
        }

        //加减商品数量
        if(target.tagName === 'A' && target.className === 'reduce'){
            //得到当前数量
            var danCountEl = target.nextElementSibling;
            var icount = danCountEl.innerHTML-0;
            var danMoneyEl = target.parentElement.nextElementSibling.lastChild;
            var danMoney = (danMoneyEl.innerHTML-0)/icount; //当前价格除以数量得到单价
            console.log(danMoney)
            //判断数量是否小于一
            icount = icount === 1 ? 1 : icount-1;
            danCountEl.innerHTML = icount; 
            danMoneyEl.innerHTML = (icount*danMoney).toFixed(2);
            updateSummary();   
        }

        //增加商品呢数量
        if(target.tagName === 'A' && target.className === 'add'){
            var danCountEl = target.previousElementSibling;
            var icount = danCountEl.innerHTML-0;
            console.log(danCountEl)
            var danMoneyEl = target.parentElement.nextElementSibling.lastChild;
            var danMoney = ((danMoneyEl.innerHTML-0)/icount).toFixed(2);

            danCountEl.innerHTML = ++icount;    
            danMoneyEl.innerHTML = (icount*danMoney).toFixed(2);
            updateSummary();   
        }
    })
}

//刷新底部结算栏目
function updateSummary() {
    var acGoodsList = document.querySelectorAll('.inputActive');
    var allmoney = 0;
    //获取总结的节点
    var zongjiEl = document.querySelector('.zongji>span>span');
    var zongCount = document.querySelector('.pros-num span');
    
    for(var i=0; i<acGoodsList.length; i++){
        allmoney += (acGoodsList[i].lastElementChild.lastChild.innerHTML-0);
    }
    zongjiEl.innerHTML = allmoney.toFixed(2);
    zongCount.innerHTML = acGoodsList.length;
}

//结算按钮是否激活
function sumBtnIsActive() {
    //得到被选中的商品
    var acBtnList = document.querySelectorAll('.inputActive');
    var sumBtn = document.querySelector('.summary');
    if(acBtnList.length == 0){
        sumBtn.style.backgroundColor = "#8f8f8f "
        sumBtn.style.cursor = 'default'
    }else{
        sumBtn.style.backgroundColor = '#f00'
        sumBtn.style.cursor = 'pointer'
    }
}

//渲染商品列表
function renderlist(arr){
    var html ='';
    for(var i=0; i<arr.length; i++){
        html += `
        <li class="${i%2==0? 'gray-bg': 'white-bg'} commodity clealboth">
            <input dataId="${arr[i].id}" type="checkbox" class="fleft"/>
            <div class="goods fleft">
                <div class="goods-img">
                    <img src="${arr[i].img}" alt="">
                </div>
                <h4>${arr[i].summary}</h4>
            </div>
            <div class="detail fleft">
                ${arr[i].message}
            </div>
            <div class="price fleft">
                <span class="oldprice">￥${arr[i].oldprice.toFixed(2)}</span>
                <span class="newprice">￥<span>${arr[i].newprice.toFixed(2)}</span></span>
            </div>
            <div class="count fleft">
                <a class="reduce">-</a>
                <span class="goods-conut">${arr[i].count}</span>
                <a class="add">+</a>
            </div>
            <span class="total-price">￥<span>${arr[i].money.toFixed(2)}</span></span>
        </li>`
    }
    goodsList.innerHTML = html;
}

/**
 * 请求数据
 */
function ajax(url, fnSuss,fnfalses){
    //创建XMLHttpREquest对象
    var xmlhttp;
    if (window.XMLHttpRequest){
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }else{
        // IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    } 
    //指定回调函数 即服务器处理完请求后返回响应，会调用此指定的js函数
    xmlhttp.onreadystatechange = setData;
    // xmlhttp.setRequestHeader('Content-Type', 'application/x-www-urlencoded');

    //建立到服务端的请求,url去缓存
    // xmlhttp.open("GET", 'data.json?t='+new Date().getTime(), true); //get的去缓存的一种方式；
    xmlhttp.open("GET", url, true);
    //发送请求
    xmlhttp.send();
    //回调函数
    function setData(){
        if(xmlhttp.readyState == 4){
            if(xmlhttp.status == 200){
               var data = xmlhttp.responseText;
               list = JSON.parse(data).data;
               //渲染页面
               renderlist(list);
            }
        }
    }
}
