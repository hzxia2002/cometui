/**
* jQuery jui 1.0
* 
* http://jui.com
*  

*/
(function ($)
{
    $.fn.juiceMenuBar = function (options)
    {
        return $.jui.run.call(this, "juiceMenuBar", arguments);
    };
    $.fn.juiceGetMenuBarManager = function ()
    {
        return $.jui.run.call(this, "juiceGetMenuBarManager", arguments);
    };

    $.juiceDefaults.MenuBar = {};

    $.juiceMethos.MenuBar = {};

    $.jui.controls.MenuBar = function (element, options)
    {
        $.jui.controls.MenuBar.base.constructor.call(this, element, options);
    };
    $.jui.controls.MenuBar.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'MenuBar';
        },
        __idPrev: function ()
        {
            return 'MenuBar';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.MenuBar;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.menubar = $(this.element);
            //todo 添加竖形菜单判断
            g.menubar.addClass("l-menu-horizontal");
            if (!g.menubar.hasClass("l-menubar")) g.menubar.addClass("l-menubar ");
            if (p && p.items)
            {
                $(p.items).each(function (i, item)
                {
                    g.addItem(item);
                });
            }
            $(document).click(function ()
            {
                $(".l-panel-btn-selected", g.menubar).removeClass("l-panel-btn-selected");
            });
            g.set(p);
        },
        addItem: function (item)
        {
            var g = this, p = this.options;
            var ditem = $('<div class="l-menubar-item"><span></span><div class="l-menubar-item-down"></div></div>');
            g.menubar.append(ditem);
            item.id && ditem.attr("menubarid", item.id);
            item.text && $("span:first", ditem).html(item.text);
            item.disable && ditem.addClass("l-menubar-item-disable");
            item.click && ditem.click(function () { item.click(item); });
            if (item.menu)
            {
                var menu = $.juiceMenu(item.menu);
                ditem.hover(function ()
                {
                    g.actionMenu && g.actionMenu.hide();
                    var left = $(this).offset().left;
                    var top = $(this).offset().top + $(this).height();
                    menu.show({ top: top, left: left });
                    g.actionMenu = menu;
                    $(this).addClass("l-panel-btn-over l-panel-btn-selected").siblings(".l-menubar-item").removeClass("l-panel-btn-selected");
                }, function ()
                {
                    $(this).removeClass("l-panel-btn-over");
                });

            }
            else
            {
                ditem.hover(function ()
                {
                    $(this).addClass("l-panel-btn-over");
                }, function ()
                {
                    $(this).removeClass("l-panel-btn-over");
                });
                $(".l-menubar-item-down", ditem).remove();
            }

        }
    });

})(jQuery);