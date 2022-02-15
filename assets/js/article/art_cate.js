$(function () {
    getCate();

    // 弹出添加框
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#tpl').html()
        });
    })
    // 添加文章分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layui.layer.msg('新增分类失败！');
                getCate();
                layui.layer.msg('新增分类成功！');
                layui.layer.close(indexAdd);
            }
        })
    })

    // 弹出修改框
    $('tbody').on('click', '.edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#tplEdit').html()
        });

        var id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.form.val('form-edit', res.data)
            }
        })
    })
    // 修改文章分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.layer.msg(res.message);
                layer.close(indexEdit);
                getCate();
            }
        })
    })
    // 删除文章分类
    $('tbody').on('click', '.delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    getCate();
                }
            })
        })
    })
})

function getCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message)
            var htmlStr = template('tb', res);
            $('tbody').html(htmlStr);
        }
    })
}