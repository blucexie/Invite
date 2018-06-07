/**
 * Created by blucexie on 2018/1/12.
 */
$(function() {
  /*获取userCode*/
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  var userCode = getQueryString("userCode");

  $(".noCode").click(function() {
    $(".warn")
      .addClass("animated swing")
      .show();
    $(".shade").show();
  });
  $(".backBtn").click(function() {
    $(".warn").hide();
    $(".shade").hide();
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

  /*发送验证码*/
  $(".mesBtn").click(function() {
    if ($(".mesBtn").attr("disabled") == "disabled") {
      return;
    }
    var mobile = $("#mobile").val();
    if (mobile == "") {
      layer.open({
        content: "手机号不能为空",
        btn: "确定"
      });
    } else {
      if (isValidPhone(mobile)) {
        showLoader();
        $.ajax({
          url: "https://apix.funinhr.com/api/invite/send/RegisterSMS",
          type: "POST",
          timeout: 5000,
          dataType: "json",
          data: '{"mobile":"' + mobile + '"}',
          success: function(data) {
            hideLoader();
            var jsonData = eval("data=" + data["plaintext"]);
            if (jsonData == undefined || jsonData.item == undefined) {
              layer.open({
                content: "网络异常，请稍后重试",
                btn: "确定"
              });
              return;
            }
            var result = jsonData.item.result;
            var resultInfo = jsonData.item.resultInfo;
            if (result === 2001) {
              layer.open({
                content: "短信发送成功",
                btn: "确定"
              });
              timer = setInterval(countDown, 1000);
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
      } else {
        layer.open({
          content: "请输入正确的手机号码",
          btn: "确定"
        });
      }
    }
  });
  // 点击注册
  $(".enrollBtn").click(function() {
    var basicPass = true;
    var inputObject;
    $("#registry input").each(function() {
      if ($(this).val() == "") {
        inputObject = $(this);
        layer.open({
          content: $(this).attr("placeholder"),
          btn: "确定",
          yes: function(index) {
            layer.close(index);
            inputObject.focus();
          }
        });
        basicPass = false;
        return false;
      }
      var itemPass = true;
      var itemVal = $(this).val();
      var itemName = $(this).attr("name");
      if (itemName == "resumeMobile") {
        itemPass = isValidPhone(itemVal);
      }
      if (itemName == "validateCode") {
        itemPass = itemVal.length == 6;
      }
      if (itemName == "passWord") {
        itemPass = isPassWord(itemVal);
      }

      if (!itemPass) {
        inputObject = $(this);
        layer.open({
          content: $(this).attr("data-attribute"),
          btn: "确定",
          yes: function(index) {
            layer.close(index);
            inputObject.focus();
          }
        });

        $(this).addClass("errorShow");
        basicPass = false;
        return false;
      }
    });
    //有任何未校验通过的直接退出
    if (!basicPass) return false;

    var mobile = $("#mobile").val();
    var validateCode = $("#mesCode").val();
    var loginPwd = $("#passWord").val();
    // 显示遮罩
    showLoader();
    $.ajax({
      url: "https://apix.funinhr.com/api/invite/sms/register",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        mobile: mobile,
        validateCode: validateCode,
        loginPwd: loginPwd,
        userCode: userCode
      }),
      success: function(data) {
        console.log(data);
        var jsonData = JSON.parse(data["plaintext"]);
        var result = jsonData.item.result;
        var resultInfo = jsonData.item.resultInfo;
        if (result === 1001) {
          $("#loading").hide();
          $(".shade").show();
          $(".redPackets")
            .addClass("animated bounceInDown")
            .show();
            $('html,body').css({
              height:'100%',
              overflow:'hidden'
            })
        } else {
          layer.open({
            content: resultInfo,
            btn: "确定"
          });
          hideLoader();
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

  // 关闭红包
  $(".close").click(function() {
    $(".redPackets").hide();
    hideLoader();
    $('html,body').css({
      height:'auto',
      overflow:'auto'
    })
  });
});

//验证码发送倒计数
var s = 60;
var isLock = true;
var timer = null;

function countDown() {
  $(".mesBtn").attr("disabled", "disabled");
  s--;
  $(".mesBtn").text(s + "s后重试");
  if (s === 0) {
    clearInterval(timer);
    $(".mesBtn").removeAttr("disabled");
    $(".mesBtn").text("重新获取");
    isLock = true;
    s = 60;
  }
}
/*校验手机号码*/
function isValidPhone(mobile) {
  var re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|19[0-9]|14[57])[0-9]{8}$/;
  return re.test(mobile);
}
//校验密码
function isPassWord(passWord){
  var pw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
  return pw.test(passWord);
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
