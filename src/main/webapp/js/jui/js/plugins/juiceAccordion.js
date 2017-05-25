/**
* jQuery jui 1.0
* 
* http://jui.com
*
* 
*/
(function ($)
{
    $.fn.juiceAccordion = function (options)
    {
        return $.jui.run.call(this, "juiceAccordion", arguments);
    };

    $.fn.juiceGetAccordionManager = function ()
    {
        return $.jui.get(this);
    };
    /**
     * @name   juiceAccordion
     * @class    juiceAccordion是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceAccordion &nbsp;API 注解说明</font></h3>
     */
    $.juiceDefaults.Accordion = /**@lends juiceAccordion#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  抽屉布局的高度，可取值为'auto'（每个抽屉的高度分别由抽屉的内容决定），可以取值为'fit'，表示适应父容器的大小（height:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给height属性。
         * @default 0
         * @type Number
         */
        height: 0,
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 动画滑动速度，默认为“normal”。
         * @default normal
         * @type String
         */
        speed: "normal",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   是否自动改变高度。true表示随窗体的高度改变而改变，false则不随高度改变而改变。 这里默认的是false。
         */
        changeHeightOnResize: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  高度补差  初始值为0.
         * @default 0
         * @type Number
         *
         */
        heightDiff: 0
    };
    $.juiceMethos.Accordion = {};

    $.jui.controls.Accordion = function (element, options)
    {
        $.jui.controls.Accordion.base.constructor.call(this, element, options);
    };
    $.jui.controls.Accordion.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Accordion';
        },
        __idPrev: function ()
        {
            return 'Accordion';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Accordion;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.accordion = $(g.element);
            if (!g.accordion.hasClass("l-accordion-panel")) g.accordion.addClass("l-accordion-panel");
            var selectedIndex = 0;
            if ($("> div[lselected=true]", g.accordion).length > 0)
                selectedIndex = $("> div", g.accordion).index($("> div[lselected=true]", g.accordion));

            $("> div", g.accordion).each(function (i, box)
            {
                var header = $('<div class="l-accordion-header"><div class="l-accordion-toggle"></div><div class="l-accordion-header-inner"></div></div>');
                if (i == selectedIndex) {
                    // TODO 需要进一步完善
                    header.addClass("l-accordion-header-open");
                    $(".l-accordion-toggle", header).addClass("l-accordion-toggle-open");
                }
                if ($(box).attr("title"))
                {
                    $(".l-accordion-header-inner", header).html($(box).attr("title"));
                    $(box).attr("title", "");
                }
                $(box).before(header);
                if (!$(box).hasClass("l-accordion-content")) $(box).addClass("l-accordion-content");
            });

            //add Even
            $(".l-accordion-toggle", g.accordion).each(function ()
            {
                if (!$(this).hasClass("l-accordion-toggle-open") && !$(this).hasClass("l-accordion-toggle-close"))
                {
                    $(this).addClass("l-accordion-toggle-close");
                }
                if ($(this).hasClass("l-accordion-toggle-close"))
                {
                    $(this).parent().next(".l-accordion-content:visible").hide();
                }
            });
            $(".l-accordion-header", g.accordion).hover(function ()
            {
                $(this).addClass("l-accordion-header-over");
            }, function ()
            {
                $(this).removeClass("l-accordion-header-over");
            });
            $(".l-accordion-toggle", g.accordion).hover(function ()
            {
                if ($(this).hasClass("l-accordion-toggle-open"))
                    $(this).addClass("l-accordion-toggle-open-over");
                else if ($(this).hasClass("l-accordion-toggle-close"))
                    $(this).addClass("l-accordion-toggle-close-over");
            }, function ()
            {
                if ($(this).hasClass("l-accordion-toggle-open"))
                    $(this).removeClass("l-accordion-toggle-open-over");
                else if ($(this).hasClass("l-accordion-toggle-close"))
                    $(this).removeClass("l-accordion-toggle-close-over");
            });
            $(">.l-accordion-header", g.accordion).click(function ()
            {
                var togglebtn = $(".l-accordion-toggle:first", this);
                if (togglebtn.hasClass("l-accordion-toggle-close"))
                {
                    var siblings = $(this).siblings(".l-accordion-header");
                    siblings.each(function(i){
                        if($(siblings[i]).hasClass("l-accordion-header-open")){
                            $(siblings[i]).removeClass("l-accordion-header-open");
                        }
                    });
                    togglebtn.removeClass("l-accordion-toggle-close")
                    .removeClass("l-accordion-toggle-close-over l-accordion-toggle-open-over");
                    togglebtn.addClass("l-accordion-toggle-open");
                    $(this).addClass("l-accordion-header-open");
                    $(this).next(".l-accordion-content")
                    .show(p.speed)
                    .siblings(".l-accordion-content:visible").hide(p.speed);
                    $(this).siblings(".l-accordion-header").find(".l-accordion-toggle").removeClass("l-accordion-toggle-open").addClass("l-accordion-toggle-close");
                }
                else
                {
                    togglebtn.removeClass("l-accordion-toggle-open")
                    .removeClass("l-accordion-toggle-close-over l-accordion-toggle-open-over")
                    .addClass("l-accordion-toggle-close");
                    $(this).next(".l-accordion-content").hide(p.speed);
                }
            });
            //init
            g.headerHoldHeight = 0;
            $("> .l-accordion-header", g.accordion).each(function ()
            {
                g.headerHoldHeight += $(this).height();
            });
            if (p.height && typeof (p.height) == 'string' && p.height.indexOf('%') > 0)
            {
                g.onResize();
                if (p.changeHeightOnResize)
                {
                    $(window).resize(function ()
                    {
                        g.onResize();
                    });
                }
            }
            else
            {
                if (p.height)
                {
                    g.height = p.heightDiff + p.height;
                    g.accordion.height(g.height);
                    g.setHeight(p.height);
                }
                else
                {
                    g.header = g.accordion.height();
                }
            }

            g.set(p);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onresize 事件会在窗口或框架被调整大小时发生。
         * @name  juiceAccordion#onResize
         * @event
         * @example   <b>示例:</b> <br>
         *           onResize: function (){
         *               ...
         *           }
         */
        onResize: function ()
        {
            var g = this, p = this.options;
            if (!p.height || typeof (p.height) != 'string' || p.height.indexOf('%') == -1) return false;
            //set accordion height
            if (g.accordion.parent()[0].tagName.toLowerCase() == "body")
            {
                var windowHeight = $(window).height();
                windowHeight -= parseInt(g.layout.parent().css('paddingTop'));
                windowHeight -= parseInt(g.layout.parent().css('paddingBottom'));
                g.height = p.heightDiff + windowHeight * parseFloat(g.height) * 0.01;
            }
            else
            {
                g.height = p.heightDiff + (g.accordion.parent().height() * parseFloat(p.height) * 0.01);
            }
            g.accordion.height(g.height);
            g.setContentHeight(g.height - g.headerHoldHeight);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置高度。
         * @name  juiceAccordion#setHeight
         * @function
         * @param  height
         * height - 关于高度的参数。
         * @example   <b>示例:</b> <br>
         *          setHeight: function (height){
         *           var g = this, p = this.options;
         *            g.accordion.height(height);
         *           height -= g.headerHoldHeight;
         *           $("> .l-accordion-content", g.accordion).height(height);
         *           }
         */
        setHeight: function (height)
        {
            var g = this, p = this.options;
            g.accordion.height(height);
            height -= g.headerHoldHeight;
            $("> .l-accordion-content", g.accordion).height(height);
        }
    });


})(jQuery);