// 增加喝水次数的逻辑
function incrCountForPopup() {
    chrome.storage.sync.get(['total','goal'], function (items){
        var newTotal = 0;
        if(items.total){
            newTotal += parseInt(items.total);
        }
        newTotal+= 1;
  
        chrome.storage.sync.set({'total': newTotal});
  
        if(newTotal >= items.goal){
            
            var opt = {
                type: "basic",
                title: "真棒，今日目标已完成!",
                message : "今天已经喝水" + items.goal + " 杯!",
                iconUrl:"icon.png"
            }
            chrome.notifications.create(opt);
        }
        close();
    });
  };


$(function(){

    chrome.storage.sync.get(['total','goal'], function(items){



        var defaultValue=0;
        
        if(items.total == null || items.total == ""){
            $('#total').text(defaultValue); 
        }
        if(items.goal == null || items.total == ""){
            $('#goal').text(defaultValue); 
        }

        $('#total').text(items.total);
        $('#goal').text(items.goal);
        // $('#amount').value("1");

        var percentage = (items.total/items.goal)*100;
        
        if(percentage<10 && percentage>=0){
            $("#glass").attr("src","images/one.gif");
        }
        else if(percentage<25 && percentage>=10){
            $("#glass").attr("src","images/two.gif");
        }
        else if(percentage<50 && percentage>=25){
            $("#glass").attr("src","images/three.gif");
        }
        else if(percentage<75 && percentage>=50){
            $("#glass").attr("src","images/four.gif");
        }
        else if(percentage<100 && percentage>=75){
            $("#glass").attr("src","images/five.gif");
        }
        else if(percentage>=100){
            $("#glass").attr("src","images/goal.gif");
        }
        else{
            $("#glass").attr("src","images/one.gif");
        }
    
    });

    $('#addAmount').click(incrCountForPopup);
});