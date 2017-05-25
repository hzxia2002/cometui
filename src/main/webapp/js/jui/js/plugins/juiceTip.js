/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/

(function ($)
{
    /**
     * @name   juiceTip
     * @class   juiceTip 是属性加载结构类。
     * @constructor
     * @desc 构造函数；
     * @namespace  <h3><font color="blue">juiceTip &nbsp;API 注解说明</font></h3>
     */
    //气泡,可以在指定位置显示
    $.juiceTip = function (p)
    {
        return $.jui.run.call(null, "juiceTip", arguments);
    };

    //target：将jui对象ID附加上
    /**
     *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在指定Dom Element右侧显示气泡。
     * @name   juiceTip#juiceTip
     * @param  [options]   所选对象
     * @return     $.jui.get(this, 'juitipid')   jui对象ID
     * @function
     */
    $.fn.juiceTip = function (options)
    {
        this.each(function ()
        {
            var p = $.extend({}, $.juiceDefaults.ElementTip, options || {});
            p.target = p.target || this;
            //如果是自动模式：鼠标经过时显示，移开时关闭
            if (p.auto || options == undefined)
            {
                if (!p.content)
                {
                    p.content = this.title;
                    if (p.removeTitle)
                        $(this).removeAttr("title");
                }
                p.content = p.content || this.title;
                $(this).bind('mouseover.tip', function ()
                {
                    p.x = $(this).offset().left + $(this).width() + (p.distanceX || 0);
                    p.y = $(this).offset().top + (p.distanceY || 0);
                    $.juiceTip(p);
                }).bind('mouseout.tip', function ()
                {

                    var tipmanager = $.jui.managers[this.juitipid];
                    if (tipmanager)
                    {
                        tipmanager.remove();
                    }
                });
            }
            else
            {
                if (p.target.juitipid) return;
                p.x = $(this).offset().left + $(this).width() + (p.distanceX || 0);
                p.y = $(this).offset().top + (p.distanceY || 0);
                p.x = p.x || 0;
                p.y = p.y || 0;
                $.juiceTip(p);
            }
        });
        return $.jui.get(this, 'juitipid');
    };
    /**
     *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;关闭指定在Dom Element(附加了jui对象ID,属性名"juitipid")显示的气泡。
     * @name   juiceTip#juiceHideTip
     * @param  [options]   所选对象
     * @function
     */
    $.fn.juiceHideTip = function (options)
    {
        return this.each(function ()
        {
            var p = options || {};
            if (p.isLabel == undefined)
            {
                //如果是lable，将查找指定的input，并找到jui对象ID
                p.isLabel = this.tagName.toLowerCase() == "label" && $(this).attr("for") != null;
            }
            var target = this;
            if (p.isLabel)
            {
                var forele = $("#" + $(this).attr("for"));
                if (forele.length == 0) return;
                target = forele[0];
            }
            var tipmanager = $.jui.managers[target.juitipid];
            if (tipmanager)
            {
                tipmanager.remove();
            }
        }).unbind('mouseover.tip').unbind('mouseout.tip');
    };


    $.fn.juiceGetTipManager = function ()
    {
        return $.jui.get(this);
    };


    $.juiceDefaults = $.juiceDefaults || {};


    //隐藏气泡
    $.juiceDefaults.HideTip = {};

    //气泡
    $.juiceDefaults.Tip =/**@lends juiceTip#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 内容 。
         * @default null
         * @type Object
         */
        content: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  回调函数 。
         * @default null
         * @type  function
         */
        callback: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度  。
         * @default 150
         * @type   Number
         */
        width: 150,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度  。
         * @default null
         * @type   Object
         */
        height: null,
        x: 0,
        y: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 保存ID到那一个对象(jQuery)(待移除)  。
         * @default null
         * @type   Object
         */
        appendIdTo: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 目标对象 。
         * @default null
         * @type   Object
         */
        target: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否自动模式，如果是，那么：鼠标经过时显示，移开时关闭,并且当content为空时自动读取attr[title] 。
         * @default null
         * @type   Object
         */
        auto: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 自动模式时，默认是否移除掉title 。
         * @default true
         * @type   Boolean
         */
        removeTitle: true
    };

    //在指定Dom Element右侧显示气泡,通过$.fn.juiceTip调用
    $.juiceDefaults.ElementTip = {
        distanceX: 1,
        distanceY: -3,
        auto: null,
        removeTitle: true
    };

    $.juiceMethos.Tip = {};

    $.jui.controls.Tip = function (options)
    {
        $.jui.controls.Tip.base.constructor.call(this, null, options);
    };
    $.jui.controls.Tip.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Tip';
        },
        __idPrev: function ()
        {
            return 'Tip';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Tip;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            var tip = $('<div class="l-verify-tip"><div class="l-verify-tip-corner"></div><div class="l-verify-tip-content"></div></div>');
            g.tip = tip;
            g.tip.attr("id", g.id);
            if (p.content)
            {
                $("> .l-verify-tip-content:first", tip).html(p.content);
                tip.appendTo('body');
            }
            else
            {
                return;
            }
            tip.css({ left: p.x, top: p.y }).show();
            p.width && $("> .l-verify-tip-content:first", tip).width(p.width - 8);
            p.height && $("> .l-verify-tip-content:first", tip).width(p.height);
            eee = p.appendIdTo;
            if (p.appendIdTo)
            {
                p.appendIdTo.attr("juiceTipId", g.id);
            }
            if (p.target)
            {
                $(p.target).attr("juiceTipId", g.id);
                p.target.juitipid = g.id;
            }
            p.callback && p.callback(tip);
            g.set(p);
        },
        _setContent: function (content)
        {
            $("> .l-verify-tip-content:first", this.tip).html(content);
        },
        remove: function ()
        {
            if (this.options.appendIdTo)
            {
                this.options.appendIdTo.removeAttr("juiceTipId");
            }
            if (this.options.target)
            {
                $(this.options.target).removeAttr("juiceTipId");
                this.options.target.juitipid = null;
            }
            this.tip.remove();
        }
    });
})(jQuery);