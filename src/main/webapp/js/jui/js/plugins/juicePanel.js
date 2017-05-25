/**
 * @author tcg
 * @class  juicePanel
 * @description UI面板，用于加载页面，表单元素
 */
(function ($)
{
    $.fn.juicePanel = function (options)
    {
        return $.jui.run.call(this, "juicePanel", arguments);
    };

    $.fn.juiceGetPanelManager = function () {
        return $.jui.run.call(this, "juiceGetPanelManager", arguments);
    };

    $.juiceDefaults = $.juiceDefaults || {};
    $.juiceDefaults.Panel = {
        width: "100%",
        height: "auto",
        closeAble: true,
        draggable:true,
        onBeforeClose:null,
        onAfterClose:null,
        top: 0,
        left: 0,
        items: null,
        url:"",
        title:"",
        selfClose:false,
        icon:"",
        shadow: true
    };

    $.juiceMethos.Panel = {};

    $.jui.controls.Panel = function (element,options)
    {
        $.jui.controls.Panel.base.constructor.call(this, element, options);
    };
    $.jui.controls.Panel.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Panel';
        },
        __idPrev: function ()
        {
            return 'Panel';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Panel;
        },
        _init:function(){
            $.jui.controls.Panel.base._init.call(this);
            var g = this, p = this.options;
            this._copyProperty(p,$(this.element));
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.content = $(g.element);
            var panelhtmlarr = [];
            panelhtmlarr.push("　　<div class='l-panel'>");
            panelhtmlarr.push("        <div class='l-panel-header'><div class='panel-toggle-default'/><div class='panel-closed-defalut'/><div class='l-panel-icon-default'></div><span class='l-panel-header-text'></span></div>");
            panelhtmlarr.push("        <div class='l-grid-loading'></div>");
            panelhtmlarr.push("        <div class='l-panel-content'></div>");
            panelhtmlarr.push("    </div>");
            g.panel = $(panelhtmlarr.join(""));
            g.panel.insertBefore(g.content);
            g.contantPanel = $(".l-panel-content",g.panel);
            g.contantPanel.append(g.content);

            g._build();
            g._initSize();
            g._setEvent();

        },
        _build:function(){
            var g = this,p = this.options;
            g._initHeader();
            if(p.url){
                g._setUrl(p.url);
            }
        },
        _initHeader:function(){
            var g = this,p = this.options;
            if(p.collapse){
                $(".panel-toggle-default",g.panel).addClass("fa panel-toggle");
            }

            if(p.closeAble){
                $(".panel-closed-defalut",g.panel).addClass("fa panel-closed l-panel-close");
            }else{
                $(".panel-toggle-default",g.panel).css({right:"3px"});
            }
            //设置 标题
            if(p.title){
                $(".l-panel-header-text",g.panel).html(p.title);
            }
            //设置图标
            if(p.icon){
                $(".l-panel-icon-default",g.panel).addClass("fa "+ p.icon);
                $(".l-panel-header-text").css({left:"24px",position:"absolute"});
            }
        },
        _initSize:function(){
            var g = this,p = this.options;
            if(g.content.width()){
                g.contantPanel.width(g.content.width());
                g.panel.width(g.content.width());
            }else{
                g.contantPanel.width(p.width);
                g.panel.width(p.width);
            }
            if(g.content.height()||p.height=="auto"){
                g.contantPanel.height(g.content.height());
            }else{
                g.contantPanel.height(p.height);
            }
        },
        _setEvent:function(){
            var g = this,p = this.options;
            //panel 收缩
            $(".panel-toggle",g.panel).toggle(function(){
                $(".panel-toggle-default",g.panel).addClass("panel-toggle-down");
                g.contantPanel.hide();
            },function(){
                $(".panel-toggle-default",g.panel).removeClass("panel-toggle-down");
                g.contantPanel.show();
            });

            //panel 关闭
            $(".l-panel-close",g.panel).click(function(){
                g.trigger("beforeClose",[]);
                g.panel.remove();
                g.trigger("afterClose",[]);
            });

            $(window).bind("resize.panel", function (e)
            {
                g._onResize.call(g);
            });
        },
        _setWidth:function(value){
            var g = this,p = this.options;
            p.width = value;
            g.panel.width(value);
        },
        setWidth:function(value){
            this._setWidth(value);
        },
        _onResize:function(){
            var g = this,p = this.options;
            g._setWidth(g.panel.parent().width());
        } ,
        _setUrl:function(url){

        }
    })
})(jQuery);