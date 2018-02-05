$(function(){
    
    var  inviteCode = sessionStorage.getItem("inviteCode");
    // 获取红包列表数据
        $.ajax({
            url:'https://apix.funinhr.com/api/get/invite/bonus/list',
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
                 var inviteBonusList = jsonData.item.inviteBonusList;
                 //空数据
                 var itemCount = jsonData.item.itemCount;
                 if(itemCount==0){
                     $('.noData').show();
                     $('#exampleTable').hide();
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
                            field: 'agreeTime',
                            title: '时间',
                            formatter: function (value, row, index) {
                                if(value !=null){
                                    if (value.toString().length >= 12) {
                                        return value.toString().substring(0, 4) + "-" + value.toString().substring(4, 6) + "-" + value.toString().substring(6, 8) + "    " + value.toString().substring(8, 10) + ":" + value.toString().substring(10, 12)
                                    } else if (value.toString().length >= 8) {
                                        return value.toString().substring(0, 4) + "-" + value.toString().substring(4, 6) + "-" + value.toString().substring(6, 8)
                                    }
                                }else{
                                    return "&nbsp;";
                                }
                            }
                        }, {
                            field: 'inviteBonus',
                            title: '金额'
                        }, {
                            field: 'inviteBonusType',
                            title: '红包状态',
                            formatter: function (value, row, index) {
                                if (value == '2001') return '注册红包';
                                else if(value == '2002')  return'邀请红包';
                                
                            }
                        }],
                        data: inviteBonusList
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