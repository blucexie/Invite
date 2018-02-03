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
                 var jsonData = JSON.parse(data['plaintext']);
                 var result = jsonData.item.result;
                 //返回填充数据
                 var inviteList = jsonData.item.inviteList;
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
                            field: 'inviteBonusType',
                            title: '邀请类型',
                            formatter: function (value, row, index) {
                                if (value == '2001') return '注册';
                                else if(value == '2002')  return'认证';
                                
                            }
                        }, {
                            field: 'inviteBonus',
                            title: '贡献红包',
                        }],
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