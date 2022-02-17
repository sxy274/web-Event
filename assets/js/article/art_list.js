$(function () {
    initTable();
    getCate();

    // 表单筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name="cate_id"]').val();
        q.state = $('[name="state"]').val();
        initTable();
    })

    // 删除功能
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).parent().attr('data-id');
        layer.confirm('确认要删除吗？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layui.layer.msg(res.message)
                    layui.layer.msg(res.message);
                    initTable();
                }
            })

            layer.close(index)
        })
    })
})

// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 4, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}

// 获取文章列表数据的方法
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.data.length == 0 && q.pagenum > 1) {
                q.pagenum--;
                initTable();
                return;
            }
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)

            layui.laypage.render({
                elem: 'page-area' //注意，这里的 test1 是 ID，不用加 # 号
                , count: res.total,//数据总数，从服务端得到
                limit: q.pagesize, //每页显示条数，默认值10
                limits: [2, 4, 6, 8, 10],
                curr: q.pagenum,
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                jump: function (obj, first) {
                    if (!first) {
                        q.pagenum = obj.curr;
                        q.pagesize = obj.limit;
                        initTable();
                    }
                }
            });
        }
    })
}

// 定义美化时间的过滤器
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}

// 获取文章分类并渲染至下拉框
function getCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status != 0) return layui.layer.msg(res.message);
            var htmlStr = template('sel', res);
            $('[name="cate_id"]').html(htmlStr);
            // 有些时候，你的有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的
            // 你只需要执行 form.render(
            layui.form.render('select');
        }
    })
}
