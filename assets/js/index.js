$(function () {
    getUserInfo();

    // 实现退出功能
    $('#logout').on('click', function () {
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.clear();

            location.href = '/login.html';
            layer.close(index);
        });
    })
})

// 获取用户信息并渲染
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        }
    })
}

// 渲染用户信息
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);

    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.text-avatar').html(text).show();
    }
}

