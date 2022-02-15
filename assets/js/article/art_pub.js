// 初始化富文本编辑器
initEditor();

// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options);

$(function () {
    getCate();


    $('#chooseBtn').on('click', function () {
        $('#coverImg').click();
    })

    // 更换文章封面
    $('#coverImg').on('change', function (e) {
        if (this.files.length === 0) {
            return layui.layer.msg('请选择封面')
        }
        var newImgURL = URL.createObjectURL(this.files[0]);
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);
    })

    var state = '已发布';
    $('#draft').on('click', function () {
        state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('state', state)
                fd.append('cover_img', blob)

                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })
})

function getCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message)
            var htmlStr = template('sel', res);
            $('select').html(htmlStr);
            // 动态插入的数据layui不会自动渲染，需要使用render方法
            layui.form.render('select');
        }
    })
}

function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
            // 发布文章成功后，跳转到文章列表页面
            location.href = '/article/art_list.html'
        }
    })
}