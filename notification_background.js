function audioNotification(notificationSound){
  console.log("notidfication Sound Passed : "+notificationSound);
  var sound = new Audio('audio/'+notificationSound+'.mp3');
  sound.play();
}

function show() {
  var time = /(..)(:..)/.exec(new Date());     
  var hour = time[1] % 12 || 12;              
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; 
  var message;
  var notificationSound;

  chrome.storage.sync.get(['message','sound'], function(items){
     message =items.message;
     notificationSound=items.sound;

     if(message == ""){
      message = '该喝水啦！喝水让我健康（点击"更多"，确认或者忽略）';
    }
    // alert((new Date()).getTime());
    var opt = {
      type: "basic",
      title: "喝水助手",
      message : message,
      iconUrl:"icon.png",
      requireInteraction: true,
      buttons: [
        {
          "title": "我去喝水了~"
        },
        {
          "title": "忽略这次~"
        }
      ]
    };
    chrome.notifications.create(opt);

    // console.log("localStorage.isSoundActivated : "+JSON.parse(localStorage.isSoundActivated));

    if(JSON.parse(localStorage.isSoundActivated)){
      audioNotification(notificationSound);
    }
  });
}

var  interval;
// 增加喝水次数的逻辑
function incrCountBackground() {
  chrome.storage.sync.get(['total','goal'], function (items){
      var newTotal = 0;
      if(items.total){
          newTotal += parseInt(items.total);
      }
      newTotal+= 1;

      chrome.storage.sync.set({'total': newTotal});
      if(newTotal == items.goal){
          var opt = {
              type: "basic",
              title: "真棒，今日目标已完成!",
              message : "今天已经喝水" + items.goal + " 杯!",
              iconUrl:"icon.png"
          }
          chrome.notifications.create(opt);
      }
      // 每次用户点击确认，则从此刻重新开始计时
      interval = 0;
  });
};

// 对于chrome notification添加按钮监听器
function ackCallback(notificationId, buttonIndex) {
  if (buttonIndex === 0) {
    // console.log("ackCallback");
    // 确认喝水的按钮
    incrCountBackground();
  }
}

chrome.notifications.onButtonClicked.addListener(ackCallback);

if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   
  localStorage.frequency = 1;        
  localStorage.isInitialized = true; 
  localStorage.isSoundActivated = true;
  var goal=8;
  var message = '该喝水啦！喝水让我健康（点击"更多"，确认或者忽略）';
  var sound = "Bubble";
  var total = 0;
  chrome.storage.sync.set({ 'goal' :goal, 'message':message, 'sound': sound, 'total' : total}, function(){
    var opt = {
        type: "basic",
        title: "喝水助手",
        message : message,
        iconUrl:"icon.png",
        requireInteraction: true
    }
    chrome.notifications.create(opt);
  });

}

if (window.Notification) {
  if (JSON.parse(localStorage.isActivated)) { show(); }
  interval = 0; 
  setInterval(function() {
    // console.log(interval);
    interval++;
    if (
      JSON.parse(localStorage.isActivated) && interval >= localStorage.frequency) {
      show();
      interval = 0;
    }
  }, 60000);
}