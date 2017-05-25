/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 *
 */
(function ($)
{
    /**
     * @name   juiceFieldSet
     * @class   juiceFieldSet是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceFieldSet &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceFieldSet = function ()
    {
        return $.jui.run.call(this, "juiceFieldSet", arguments);
    };

    $.juiceDefaults = $.juiceDefaults || {};
    $.juiceDefaults.FieldSet = /**@lends juiceFieldSet#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 控件宽度。
         * @default 0
         * @type Number
         */
        width: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度。
         * @default auto
         * @type Number
         */
        height: "auto",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 标题。
         * @default ""
         * @type String
         */
        title:""
    };

    //Field布局组件
    $.jui.controls.FieldSet = function (element, options)
    {
        $.jui.controls.FieldSet.base.constructor.call(this, element, options);

    };

    $.jui.controls.FieldSet.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'FieldSet'
        },
        __idPrev: function ()
        {
            return 'FieldSet';
        },
        _init: function ()
        {
            var g = this, p = this.options;
            $.jui.controls.FieldSet.base._init.call(this);
            g._copyProperty(p,$(this.element));
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.field = $(this.element);
            g.field.addClass("l-fieldset");

            var headerArr = [];
            headerArr.push( "<legend class='l-fieldset-header l-fieldset-header-default'>" );
            headerArr.push( "   <div class='l-tool'><img  class='l-tool-toggle l-tool-toggle-default' src='data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='/></div>" );
            headerArr.push( "   <div  class='l-fieldset-header-text'></div>");
            headerArr.push( "   <div  class='l-clear'></div>");
            headerArr.push("</legend>");

            g.header = $(headerArr.join(""));
            g.headerText = $(".l-fieldset-header-text",g.header);
            //内容容器
            g.cotentWrap = $("<div class='l-fieldset-body'></div>");

            g.tool = $(".l-tool",g.header);
            g.cotentWrap.append(g.field.children());
            g.field.prepend(g.header);
            g.field.append(g.cotentWrap);
            g._build();
            delete headerArr;
        },
        _build:function(){
            var g = this, p = this.options;
            g._setTitle();
            g._size();
            g._setEvent();
        } ,
        _setTitle:function(title){
            var g = this, p = this.options;
            p.title = title||p.title||"标题";
            g.headerText.html(p.title);

        },
        _setEvent:function(){
            var g = this, p = this.options;
            g.tool.click(function(){
                if(g.tool.hasClass("l-tool-down-over")){
                    g.tool.removeClass("l-tool-down-over");
                    g.tool.removeClass("l-tool-down");
                    g.tool.addClass("l-tool-over");
                    g.field.removeClass("l-fieldset-collapsed");
                }else{
                    g.tool.addClass("l-tool-down-over");
                    g.tool.removeClass("l-tool-over");
                    g.field.addClass("l-fieldset-collapsed");
                }

            });

            g.tool.hover(function(){
                if(g.tool.hasClass("l-tool-down")){
                    g.tool.addClass("l-tool-down-over");
                    g.tool.remove("l-tool-down");
                }else{
                    g.tool.addClass("l-tool-over");
                }
            },function(){
                if(g.tool.hasClass("l-tool-down-over")){
                    g.tool.addClass("l-tool-down");
                    g.tool.removeClass("l-tool-down-over");
                }else if(g.tool.hasClass("l-tool-over")){
                    g.tool.removeClass("l-tool-over");
                }
            });
        },
        _size:function(){
            var g = this, p = this.options;
            if(p.width)
                g.field.width(p.width);
            
            var titleWidth = p.titleWidth||(p.title?(p.title.length)*14+30:20);
            g.header.width(titleWidth);
        }

    });
})(jQuery);