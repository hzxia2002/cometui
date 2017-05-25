/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{

    $.juiceMessageBox = function (options)
    {
        return $.jui.run.call(null, "juiceMessageBox", arguments, { isStatic: true });
    };


    $.juiceDefaults.MessageBox = {
        isDrag: true
    };

    $.juiceMethos.MessageBox = {};

    $.jui.controls.MessageBox = function (options)
    {
        $.jui.controls.MessageBox.base.constructor.call(this, null, options);
    };
    $.jui.controls.MessageBox.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'MessageBox';
        },
        __idPrev: function ()
        {
            return 'MessageBox';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.MessageBox;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            var messageBoxHTML = "";
            messageBoxHTML += '<div class="l-messagebox">';
            messageBoxHTML += '        <div class="l-messagebox-lt"></div><div class="l-messagebox-rt"></div>';
            messageBoxHTML += '        <div class="l-messagebox-l"></div><div class="l-messagebox-r"></div> ';
            messageBoxHTML += '        <div class="l-messagebox-image"></div>';
            messageBoxHTML += '        <div class="l-messagebox-title">';
            messageBoxHTML += '            <div class="l-messagebox-title-inner"></div>';
            messageBoxHTML += '            <div class="l-messagebox-close"></div>';
            messageBoxHTML += '        </div>';
            messageBoxHTML += '        <div class="l-messagebox-content">';
            messageBoxHTML += '        </div>';
            messageBoxHTML += '        <div class="l-messagebox-buttons"><div class="l-messagebox-buttons-inner">';
            messageBoxHTML += '        </div></div>';
            messageBoxHTML += '    </div>';
            g.messageBox = $(messageBoxHTML);
            $('body').append(g.messageBox);
            g.messageBox.close = function ()
            {
                g._removeWindowMask();
                g.messageBox.remove();
            };
            //设置参数属性
            p.width && g.messageBox.width(p.width);
            p.title && $(".l-messagebox-title-inner", g.messageBox).html(p.title);
            p.content && $(".l-messagebox-content", g.messageBox).html(p.content);
            if (p.buttons)
            {
                $(p.buttons).each(function (i, item)
                {
                    var btn = $('<div class="l-messagebox-btn"><div class="l-messagebox-btn-l"></div><div class="l-messagebox-btn-r"></div><div class="l-messagebox-btn-inner"></div></div>');
                    $(".l-messagebox-btn-inner", btn).html(item.text);
                    $(".l-messagebox-buttons-inner", g.messageBox).append(btn);
                    item.width && btn.width(item.width);
                    item.onclick && btn.click(function () { item.onclick(item, i, g.messageBox) });
                });
                $(".l-messagebox-buttons-inner", g.messageBox).append("<div class='l-clear'></div>");
            }
            var boxWidth = g.messageBox.width();
            var sumBtnWidth = 0;
            $(".l-messagebox-buttons-inner .l-messagebox-btn", g.messageBox).each(function ()
            {
                sumBtnWidth += $(this).width();
            });
            $(".l-messagebox-buttons-inner", g.messageBox).css({ marginLeft: parseInt((boxWidth - sumBtnWidth) * 0.5) });
            //设置背景、拖动支持 和设置图片
            g._applyWindowMask();
            g._applyDrag();
            g._setImage();

            //位置初始化
            var left = 0;
            var top = 0;
            var width = p.width || g.messageBox.width();
            if (p.left != null) left = p.left;
            else p.left = left = 0.5 * ($(window).width() - width);
            if (p.top != null) top = p.top;
            else p.top = top = 0.5 * ($(window).height() - g.messageBox.height()) + $(window).scrollTop() - 10;
            if (left < 0) p.left = left = 0;
            if (top < 0) p.top = top = 0;
            g.messageBox.css({ left: left, top: top });

            //设置事件
            $(".l-messagebox-btn", g.messageBox).hover(function ()
            {
                $(this).addClass("l-messagebox-btn-over");
            }, function ()
            {
                $(this).removeClass("l-messagebox-btn-over");
            });
            $(".l-messagebox-close", g.messageBox).hover(function ()
            {
                $(this).addClass("l-messagebox-close-over");
            }, function ()
            {
                $(this).removeClass("l-messagebox-close-over");
            }).click(function ()
            {
                g.messageBox.close();
            });
            g.set(p);
        },
        close: function ()
        {
            var g = this, p = this.options;
            this.g._removeWindowMask();
            this.messageBox.remove();
        },
        _applyWindowMask: function ()
        {
            var g = this, p = this.options;
            $(".l-window-mask").remove();
            $("<div class='l-window-mask' style='display: block;'></div>").appendTo($("body"));
        },
        _removeWindowMask: function ()
        {
            var g = this, p = this.options;
            $(".l-window-mask").remove();
        },
        _applyDrag: function ()
        {
            var g = this, p = this.options;
            if (p.isDrag && $.fn.juiceDrag)
                g.messageBox.juiceDrag({ handler: '.l-messagebox-title-inner', animate: false });
        },
        _setImage: function ()
        {
            var g = this, p = this.options;
            if (p.type)
            {
                if (p.type == 'success' || p.type == 'donne')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-donne").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 30 });
                }
                else if (p.type == 'error')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-error").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 30 });
                }
                else if (p.type == 'warn')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-warn").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 30 });
                }
                else if (p.type == 'question')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-question").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 40 });
                }
            }
        }
    });


    $.juiceMessageBox.show = function (p)
    {
        return $.juiceMessageBox(p);
    };
    $.juiceMessageBox.alert = function (title, content, type, onBtnClick)
    {
        title = title || "";
        content = content || title;
        var onclick = function (item, index, messageBox)
        {
            messageBox.close();
            if (onBtnClick)
                onBtnClick(item, index, messageBox);
        };
        p = {
            title: title,
            content: content,
            buttons: [{ text: '确定', onclick: onclick}]
        };
        if (type) p.type = type;
        return $.juiceMessageBox(p);
    };
    $.juiceMessageBox.confirm = function (title, content, callback)
    {
        var onclick = function (item, index, messageBox)
        {
            messageBox.close();
            if (callback)
            {
                callback(index == 0);
            }
        };
        p = {
            type: 'question',
            title: title,
            content: content,
            buttons: [{ text: '是', onclick: onclick }, { text: '否', onclick: onclick}]
        };
        return $.juiceMessageBox(p);
    };
    $.juiceMessageBox.success = function (title, content, onBtnClick)
    {
        return $.juiceMessageBox.alert(title, content, 'success', onBtnClick);
    };
    $.juiceMessageBox.error = function (title, content, onBtnClick)
    {
        return $.juiceMessageBox.alert(title, content, 'error', onBtnClick);
    };
    $.juiceMessageBox.warn = function (title, content, onBtnClick)
    {
        return $.juiceMessageBox.alert(title, content, 'warn', onBtnClick);
    };
    $.juiceMessageBox.question = function (title, content)
    {
        return $.juiceMessageBox.alert(title, content, 'question');
    };


})(jQuery);