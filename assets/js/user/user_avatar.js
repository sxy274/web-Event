$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传按钮绑定事件，点击上传文件
    $('#btnChoose').on('click', function () {
        $('#file').click();
    })

    // 输入框绑定change事件，获取上传的图片并显示
    $('#file').on('change', function (e) {
        // 获取上传文件列表
        var filelist = e.target.files;
        // 判断列表是否为空
        if (filelist.length === 0) { return layui.layer.msg('请选择图片') }
        // 获取上传的图片
        var file = filelist[0];
        // 生成路径
        var imgURL = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });



    // 为按钮绑定事件，确认上传图片
    $('#btnUpload').on('click', function () {
        // 拿到裁剪后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg('更新头像失败！')
                layui.layer.msg('更换头像成功');
                window.parent.getUserInfo();
            }
        })
    })
})