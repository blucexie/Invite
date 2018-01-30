$(function(){

     /*获取userCode*/
    //  function getQueryString(name)
    //  {
    //      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    //      var r = window.location.search.substr(1).match(reg);
    //      if(r!=null)
    //          return  unescape(r[2]);
    //      return null;
    //  }
    //  var userCode = getQueryString("userCode");

    $('.btnBox img').click(function(){
        //sumToJava();
        $.ajax({
            url:'http://192.168.1.166:8080/funinhr-app/api/get/invite/config',
            type: "POST",
            dataType:"json",
            data: JSON.stringify({
                userCode:"5a2284afab5a442cdf81ab7b"
                //userCode:userCode
            }),
            success: function (data) {
                alert('请求成功')
                console.log(data)
                 var jsonData = JSON.parse(data['plaintext']);
                 var result = jsonData.item.result;
                var item = JSON.stringify(jsonData.item);
                 console.log(typeof item)
                 //var resultInfo = jsonData.item.resultInfo;
                if(result===1001){
                    alert(1001)    
                    sumToJava(item);
                }else {
                    // layer.open({
                    //     content: resultInfo
                    //     ,btn: '确定'
                    // });
                }
            },
            error: function () {
                // layer.open({
                //     content: '网络异常，请稍后重试'
                //     ,btn: '确定'
                // });
            }
        });
    })
   


})

function sumToJava(item){
    window.control.onSumResult(item);
 }