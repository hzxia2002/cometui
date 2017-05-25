/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{

    $.fn.juiceToolBar = function (options)
    {
        return $.jui.run.call(this, "juiceToolBar", arguments);
    };

    $.fn.juiceGetToolBarManager = function ()
    {
        return $.jui.run.call(this, "juiceGetToolBarManager", arguments);
    };

    $.juiceDefaults.ToolBar = {};

    $.juiceMethos.ToolBar = {};

    $.jui.controls.ToolBar = function (element, options)
    {
        $.jui.controls.ToolBar.base.constructor.call(this, element, options);
    };
    $.jui.controls.ToolBar.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'ToolBar';
        },
        __idPrev: function ()
        {
            return 'ToolBar';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.ToolBar;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.toolBar = $(this.element);
            g.toolBar.addClass("l-toolbar");
            g.set(p);
        },
        _setItems: function (items)
            {
            var g = this,p = this.options;
            var isReverse = (p.align&&p.align=="right");
            $(isReverse?items.reverse():items).each(function (i, item)
            {
                g.addItem(item);
            });
        },
        addItem: function (item)
        {
            var g = this, p = this.options;
            if (item.line)
            {
                var sep = $('<div class="l-bar-separator"></div>');
                g.toolBar.append(sep);            
                if(p.align&&p.align=="right"){
                    sep.css("float","right");
                }
                return;
            }
            var ditem = $('<div class="l-toolbar-item l-panel-btn"></div>');
            g.toolBar.append(ditem);
            if(p.align&&p.align=="right"){
                ditem.css("float","right");
            }
            item.id && ditem.attr("toolbarid", item.id);
            if (item.img)
            {
                ditem.append("<img src='" + item.img + "' />");
                ditem.addClass("l-toolbar-item-hasicon");
            }
            
            else if (item.icon)
            {
                if (item.icon.indexOf('fa-') >= 0) {
                    ditem.append("<div class='l-icon " + item.icon + "'></div>");
                }
                else{
                    ditem.append("<div class='l-icon l-icon-" + item.icon + "'></div>");
                }
                
                ditem.addClass("l-toolbar-item-hasicon");
            }

            ditem.append("<span></span>");

            item.text && $("span:first", ditem).html(item.text);
            item.disable && ditem.addClass("l-toolbar-item-disable");
            item.click && ditem.click(function () { item.click(item); });
            ditem.hover(function ()
            {
                $(this).addClass("l-panel-btn-over");
            }, function ()
            {
                $(this).removeClass("l-panel-btn-over");
            });
        }
    });
})(jQuery);