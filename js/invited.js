$(function() {
  /*获取userCode*/
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  var userCode = getQueryString("userCode");

  // 获取红包和邀请人数
  $.ajax({
    url: "https://apix.funinhr.com/api/get/invite/info",
    type: "POST",
    timeout:5000,
    dataType: "json",
    data: JSON.stringify({
      userCode: userCode
    }),
    success: function(data) {
      var jsonData = JSON.parse(data["plaintext"]);
      var result = jsonData.item.result;
      var inviteSum = jsonData.item.inviteSum;
      var inviteBonusTotal = jsonData.item.inviteBonusTotal;
      var resultInfo = jsonData.item.resultInfo;
      var inviteCode = jsonData.item.inviteCode;
      sessionStorage.inviteCode = inviteCode;
      if (result === 1001) {
        $(".inviteBonusTotal").text(inviteBonusTotal);
        $(".inviteSum").text(inviteSum);
      } else {
        layer.open({
          content: resultInfo,
          btn: "确定"
        });
      }
    },
    error: function() {
      layer.open({
        content: "网络异常，请稍后重试",
        btn: "确定"
      });
    }
  });

  //跳转到我的红包列表
  $(".redPacketBox").click(function() {
    if (navigator.onLine) {
      //正常工作
      window.location.href = "myRedEnvelope.html";
      alert(true)
    } else {
      //执行离线状态时的任务
      window.location.href ="noNetwork.html"
    }
  });

  //跳转到我的邀请列表
  $(".inviteBox").click(function() {
    if (navigator.onLine) {
      //正常工作
      window.location.href = "myInvitation.html";
      alert(true)
    } else {
      //执行离线状态时的任务
      window.location.href ="noNetwork.html"
    }
  });
  //邀请排行榜
  $.ajax({
    url: "https://apix.funinhr.com/api/get/invite/ranking/config",
    type: "POST",
    dataType: "json",
    success: function(data) {
      var jsonData = JSON.parse(data["plaintext"]);
      var result = jsonData.item.result;
      var inviteRankingList = jsonData.item.inviteRankingList;
      //返回状态信息
      var resultInfo = jsonData.item.resultInfo;
      if (result === 1001) {
        $(".rankingList li").each(function(index, item) {
          $(this)
            .find("img")
            .attr("src", inviteRankingList[index].enterpriseLogo);
          $(this)
            .find(".company")
            .text(inviteRankingList[index].enteroriseName);
          $(this)
            .find(".inviteCount span")
            .text(inviteRankingList[index].inviteNum);
          $(this)
            .find(".bonus span")
            .text(inviteRankingList[index].inviteBonusTotal);
        });
      } else {
        layer.open({
          content: resultInfo,
          btn: "确定"
        });
      }
    },
    error: function() {
      layer.open({
        content: "网络异常，请稍后重试",
        btn: "确定"
      });
    }
  });

  // 点击立即邀请
  $(".btnBox img").click(function() {
    showLoader();
    $.ajax({
      url: "https://apix.funinhr.com/api/get/invite/config",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        userCode: userCode
      }),
      success: function(data) {
        hideLoader();
        var jsonData = JSON.parse(data["plaintext"]);
        var result = jsonData.item.result;
        var inviteConfig = JSON.stringify(jsonData.item.inviteConfig);
        var resultInfo = jsonData.item.resultInfo;
        if (result === 1001) {
          // 交互调用方法
          sumToJava(inviteConfig);
        } else {
          layer.open({
            content: resultInfo,
            btn: "确定"
          });
        }
      },
      error: function() {
        layer.open({
          content: "网络异常，请稍后重试",
          btn: "确定"
        });
        hideLoader();
      }
    });
  });
});

//安卓IOS交互方法
function sumToJava(inviteConfig) {
  alert(inviteConfig);
  window.control.onSumResult(inviteConfig);
}

//显示loading
function showLoader() {
  $("#loading").show();
  $(".shade").show();
}
//隐藏loading
function hideLoader() {
  $("#loading").hide();
  $(".shade").hide();
}
