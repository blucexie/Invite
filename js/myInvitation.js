$(function(){
    var  inviteCode = sessionStorage.getItem("inviteCode");
    // 获取红包列表数据
        $.ajax({
            url:'https://apix.funinhr.com/api/get/invite/list',
            type: "POST",
            dataType:"json",
            data: JSON.stringify({
                inviteCode:inviteCode
            }),
            success: function (data) {   
                console.log(data)       
                 var jsonData = JSON.parse(data['plaintext']);
                 var result = jsonData.item.result;
                 //返回填充数据
                 var inviteList = jsonData.item.inviteList;
                 //判断显示几列数据
                 var inviteBonusType = jsonData.item.inviteBonusType;
                  //空数据
                  var itemCount = jsonData.item.itemCount;
                  if(itemCount==0){
                      $('.noData').show();
                      $('#exampleTable').hide()
                  }
                 //返回状态信息
                 var resultInfo = jsonData.item.resultInfo;
                if(result===1001){
                    $('#exampleTable').bootstrapTable({
                        striped: true, //隔行变色
                        pagination: true, // 设置为true会在底部显示分页条
                        pageSize: 10, // 如果设置了分页，每页数据条数
                        pageNumber: 1, // 如果设置了分布，首页页码
                        paginationHAlign:'right',
                        columns: [{
                            field: 'inviteName',
                            title: '姓名',
                        }, {
                            field: 'EnterpriseRole',
                            title: '类型',
                            formatter: function (value, row, index) {
                                if (value == 2) return '个人认证';
                                else if(value == 1)  return'企业认证';
                                else if(value == null)  return'已注册';
                                
                            }
                        }, {
                            field: 'enterpriseAuthen',
                            title: '认证状态',
                            formatter: function (value, row, index) {
                                if (value == 0) return '未认证';
                                else if(value == 1)  return'已认证';
                                else if(value == 2)  return'认证中';
                                else if(value == 3)  return'认证失败';
                                
                            }
                        },{
                            field: 'inviteBonus',
                            title: '红包钱数',
                        }
                    
                    ],
                        data: inviteList
                    });
                }else {
                    layer.open({
                        content: resultInfo
                        ,btn: '确定'
                    });
                }
            },
            error: function () {
                layer.open({
                    content: '网络异常，请稍后重试'
                    ,btn: '确定'
                });
            }
        });
})