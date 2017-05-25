/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{
    /**
     * @name   juiceWindow
     * @class   juiceWindow 是属性加载结构类。
     * @constructor
     * @desc 构造函数；
     * @namespace  <h3><font color="blue">juiceWindow &nbsp;API 注解说明</font></h3>
     */
    var l = $.jui;

    l.windowCount = 0;

    $.juiceWindow = function (options)
    {
        return l.run.call(null, "juiceWindow", arguments, { isStatic: true });
    };

    $.juiceWindow.show = function (p)
    {
        return $.juiceWindow(p);
    };

    $.juiceDefaults.Window = /**@lends juiceWindow#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否关闭当前显示页 。
         * @default true
         * @type Boolean
         */
        showClose: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示最大化按钮 。
         * @default true
         * @type Boolean
         */
        showMax: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示显示/隐藏窗口 。
         * @default true
         * @type Boolean
         */
        showToggle: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示最小化按钮 。
         * @default true
         * @type Boolean
         */
        showMin: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 标题显示 。
         * @default window
         * @type String
         */
        title: 'window',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否加载页面 。
         * @default false
         * @type Boolean
         */
        load: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 加载页面事件 。
         * @default null
         * @type event
         */
        onLoaded: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否模态窗口 。
         * @default false
         * @type Boolean
         */
        modal: false
    };

    $.juiceMethos.Window = {};

    l.controls.Window = function (options)
    {
        l.controls.Window.base.constructor.call(this, null, options);
    };
    l.controls.Window.juiceExtend(l.core.Win, {
        __getType: function ()
        {
            return 'Window';
        },
        __idPrev: function ()
        {
            return 'Window';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Window;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.window = $('<div class="l-window"><div class="l-window-header"><div class="l-window-header-buttons"><div class="l-window-toggle"></div><div class="l-window-max"></div><div class="l-window-close"></div><div class="l-clear"></div></div><div class="l-window-header-inner"></div></div><div class="l-window-content"></div></div>');
            g.element = g.window[0];
            g.window.content = $(".l-window-content", g.window);
            g.window.header = $(".l-window-header", g.window);
            g.window.buttons = $(".l-window-header-buttons:first", g.window);
            if (p.url)
            {
                if (p.load)
                {
                    g.window.content.load(p.url, function ()
                    {
                        g.trigger('loaded');
                    });
                    g.window.content.addClass("l-window-content-scroll");
                }
                else
                {
                    var iframe = $("<iframe frameborder='0' src='" + p.url + "'></iframe>");
                    var framename = "juiwindow" + l.windowCount++;
                    if (p.name) framename = p.name;
                    iframe.attr("name", framename).attr("id", framename);
                    p.framename = framename;
                    iframe.appendTo(g.window.content);
                    g.iframe = iframe;
                }
            }
            else if (p.content)
            {
                var content = $("<div>" + p.content + "</div>");
                content.appendTo(g.window.content);
            }
            else if (p.target)
            {
                g.window.content.append(p.target);
                p.target.show();
            }



            this.mask();

            g.active();

            $('body').append(g.window);

            g.set({ width: p.width, height: p.height });
            //位置初始化
            var left = 0;
            var top = 0;
            if (p.left != null) left = p.left;
            else p.left = left = 0.5 * ($(window).width() - g.window.width());
            if (p.top != null) top = p.top;
            else p.top = top = 0.5 * ($(window).height() - g.window.height()) + $(window).scrollTop() - 10;
            if (left < 0) p.left = left = 0;
            if (top < 0) p.top = top = 0;


            g.set(p);

            p.framename && $(">iframe", g.window.content).attr('name', p.framename);
            if (!p.showToggle) $(".l-window-toggle", g.window).remove();
            if (!p.showMax) $(".l-window-max", g.window).remove();
            if (!p.showClose) $(".l-window-close", g.window).remove();

            g._saveStatus();

            //拖动支持
            if ($.fn.juiceDrag)
            {
                g.draggable = g.window.drag = g.window.juiceDrag({ handler: '.l-window-header-inner', onStartDrag: function ()
                {
                    g.active();
                }, onStopDrag: function ()
                {
                    g._saveStatus();
                }, animate: false
                });
            }
            //改变大小支持
            if ($.fn.juiceResizable)
            {
                g.resizeable = g.window.resizable = g.window.juiceResizable({
                    onStartResize: function ()
                    {
                        g.active();
                        $(".l-window-max", g.window).removeClass("l-window-regain");
                    },
                    onStopResize: function (current, e)
                    {
                        var top = 0;
                        var left = 0;
                        if (!isNaN(parseInt(g.window.css('top'))))
                            top = parseInt(g.window.css('top'));
                        if (!isNaN(parseInt(g.window.css('left'))))
                            left = parseInt(g.window.css('left'));
                        if (current.diffTop)
                            g.window.css({ top: top + current.diffTop });
                        if (current.diffLeft)
                            g.window.css({ left: left + current.diffLeft });
                        if (current.newWidth)
                            g.window.width(current.newWidth);
                        if (current.newHeight)
                            g.window.content.height(current.newHeight - 28);

                        g._saveStatus();
                        return false;
                    }
                });
                g.window.append("<div class='l-btn-nw-drop'></div>");
            }
            //设置事件 
            $(".l-window-toggle", g.window).click(function ()
            {
                if ($(this).hasClass("l-window-toggle-close"))
                {
                    g.collapsed = false;
                    $(this).removeClass("l-window-toggle-close");
                } else
                {
                    g.collapsed = true;
                    $(this).addClass("l-window-toggle-close");
                }
                g.window.content.slideToggle();
            }).hover(function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', true);
            }, function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', false);
            });
            $(".l-window-close", g.window).click(function ()
            {
                if (g.trigger('close') == false) return false;
                g.window.hide();
                l.win.removeTask(g);
            }).hover(function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', true);
            }, function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', false);
            });
            $(".l-window-max", g.window).click(function ()
            {
                if ($(this).hasClass("l-window-regain"))
                {
                    if (g.trigger('regain') == false) return false;
                    g.window.width(g._width).css({ left: g._left, top: g._top });
                    g.window.content.height(g._height - 28);
                    $(this).removeClass("l-window-regain");
                }
                else
                {
                    if (g.trigger('max') == false) return false;
                    g.window.width($(window).width() - 2).css({ left: 0, top: 0 });
                    g.window.content.height($(window).height() - 28).show();
                    $(this).addClass("l-window-regain");
                }
            });
        },
        _saveStatus: function ()
        {
            var g = this;
            g._width = g.window.width();
            g._height = g.window.height();
            var top = 0;
            var left = 0;
            if (!isNaN(parseInt(g.window.css('top'))))
                top = parseInt(g.window.css('top'));
            if (!isNaN(parseInt(g.window.css('left'))))
                left = parseInt(g.window.css('left'));
            g._top = top;
            g._left = left;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最小化当前窗口。
         * @name   juiceWindow#min
         * @function
         */
        min: function ()
        {
            this.window.hide();
            this.minimize = true;
            this.actived = false;
        },
        _setShowMin: function (value)
        {
            var g = this, p = this.options;
            if (value)
            {
                if (!g.winmin)
                {
                    g.winmin = $('<div class="l-window-min"></div>').prependTo(g.window.buttons)
                    .click(function ()
                    {
                        g.min();
                    });
                    l.win.addTask(g);
                }
            }
            else if (g.winmin)
            {
                g.winmin.remove();
                g.winmin = null;
            }
        },
        _setLeft: function (value)
        {
            if (value != null)
                this.window.css({ left: value });
        },
        _setTop: function (value)
        {
            if (value != null)
                this.window.css({ top: value });
        },
        _setWidth: function (value)
        {
            if (value > 0)
                this.window.width(value);
        },
        _setHeight: function (value)
        {
            if (value > 28)
                this.window.content.height(value - 28);
        },
        _setTitle: function (value)
        {
            if (value)
                $(".l-window-header-inner", this.window.header).html(value);
        },
        _setUrl: function (url)
        {
            var g = this, p = this.options;
            p.url = url;
            if (p.load)
            {
                g.window.content.html("").load(p.url, function ()
                {
                    if (g.trigger('loaded') == false) return false;
                });
            }
            else if (g.jiframe)
            {
                g.jiframe.attr("src", p.url);
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 隐藏对话框。
         * @name   juiceWindow#hide
         * @function
         */
        hide: function ()
        {
            var g = this, p = this.options;
            this.unmask();
            this.window.hide();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 显示对话框。
         * @name   juiceWindow#show
         * @function
         */
        show: function ()
        {
            var g = this, p = this.options;
            this.mask();
            this.window.show();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除对话框。
         * @name   juiceWindow#remove
         * @function
         */
        remove: function ()
        {
            var g = this, p = this.options;
            this.unmask();
            this.window.remove();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置为最前端显示。
         * @name   juiceWindow#active
         * @function
         */
        active: function ()
        {
            var g = this, p = this.options;
            if (g.minimize)
            {
                var width = g._width, height = g._height, left = g._left, top = g._top;
                if (g.maximum)
                {
                    width = $(window).width();
                    height = $(window).height();
                    left = top = 0;
                    if (l.win.taskbar)
                    {
                        height -= l.win.taskbar.outerHeight();
                        if (l.win.top) top += l.win.taskbar.outerHeight();
                    }
                }
                g.set({ width: width, height: height, left: left, top: top });
            }
            g.actived = true;
            g.minimize = false;
            l.win.setFront(g);
            g.show();
            l.win.setFront(this);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置URL。
         * @name   juiceWindow#setUrl
         * @param [url]  数据源url。
         * @function
         */
        setUrl: function (url)
        {
            return _setUrl(url);
        }
    });

})(jQuery);