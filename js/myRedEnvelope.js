$(function(){
    
    $table = $('#exampleTable').bootstrapTable({
        striped: true,  
       
          columns: [{
            field: 'id',
            title: '时间'
        }, {
            field: 'name',
            title: '金额'
        }, {
            field: 'price',
            title: '红包状态'
        }],
        data: [{
            id: '10-01 14:30',
            name: '100元',
            price: '已到账'
        },{
            id: '10-01 14:30',
            name: '50元',
            price: '已到账'
        },{
            id: '10-01 14:30',
            name: '50元',
            price: '已到账'
        },{
            id: '10-01 14:30',
            name: '50元',
            price: '已到账'
        },{
            id: '10-01 14:30',
            name: '50元',
            price: '已到账'
        },{
            id: '10-01 14:30',
            name: '50元',
            price: '已到账'
        },{
            id: '10-01 14:30',
            name: '50元',
            price: '已到账'
        }]
      });
})