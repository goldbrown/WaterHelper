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
      message = '该喝水啦！补充水分，身体更加精神！'
    }
    
    new Notification(hour + time[2] + ' ' + period, {
      icon: 'icon.png',
      body: message
    });

    console.log("localStorage.isSoundActivated : "+JSON.parse(localStorage.isSoundActivated));

    if(JSON.parse(localStorage.isSoundActivated)){
      audioNotification(notificationSound);
    }
  });
}

if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   
  localStorage.frequency = 1;        
  localStorage.isInitialized = true; 
  localStorage.isSoundActivated = true;
  var goal=8;
  var message = "该喝水啦！补充水分，身体会更加精神！";
  var sound = "Bubble";
  var total = 0;
  chrome.storage.sync.set({ 'goal' :goal, 'message':message, 'sound': sound, 'total' : total}, function(){
    var opt = {
        type: "basic",
        title: "喝水助手",
        message : "该喝水啦！补充水分，身体会更加精神！",
        iconUrl:"icon.png",
        requireInteraction: true
    }
    chrome.notifications.create('saveChanges', opt, function(){});
  });

}

if (window.Notification) {
  if (JSON.parse(localStorage.isActivated)) { show(); }
  var interval = 0; 
  setInterval(function() {
    interval++;
    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
      show();
      interval = 0;
    }
  }, 60000);
}
