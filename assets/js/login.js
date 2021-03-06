

$(function () {
  $('#link_login').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  })

  $('#link_reg').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })

  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      var value1 = $('.reg-box [name="password"]').val();
      if (value != value1) {
        return '两次输入密码不一致！';
      }
    }
  })



  // 注册功能
  $('.reg-box form').on('submit', function (e) {
    e.preventDefault();
    var username = $('.reg-box [name="username"]').val();
    var password = $('.reg-box [name="password"]').val();

    $.post('/api/reguser',
      { username: username, password: password }, function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('注册成功');

        $('#link_reg').click();
      })
  })

  // 登录功能
  $('.login-box form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }

        layer.msg(res.message);
        localStorage.setItem('token', res.token);
        location.href = '/index.html';
      }
    })
  })
})