/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 */
(function ($)
{
    /**
     * @name   juiceMenu
     * @class   juiceMenu 是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceMenu &nbsp;API 注解说明</font></h3>
     */
    $.juiceMenu = function (options)
    {
        return $.jui.run.call(null, "juiceMenu", arguments);
    };

    $.juiceDefaults.Menu =/**@lends juiceMenu#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度设置。
         * @default 120
         * @type Number
         */
        width: 120,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 顶部距离。
         * @default 0
         * @type Number
         */
        top: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 左边距离。
         * @default 0
         * @type Number
         */
        left: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 元素集合。
         * @default   null
         * @type  Object
         */
        items: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  自动关闭。
         * @default   false
         * @type  Boolean
         */
        selfClose:false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  渐变，为true时，渐变，为false时，不渐变。
         * @default   true
         * @type  Boolean
         */
        shadow: true,

        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  "left" or "right"
         * @default   null
         * @type  String
         */
        arrowPosition:null
    };

    $.juiceMethos.Menu = {};

    $.jui.controls.Menu = function (options)
    {
        $.jui.controls.Menu.base.constructor.call(this, null, options);
    };
    $.jui.controls.Menu.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'SysMenu';
        },
        __idPrev: function ()
        {
            return 'SysMenu';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Menu;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.menuItemCount = 0;
            //全部菜单
            g.menus = {};
            //顶级菜单
            g.menu = g.createMenu();

            g.element = g.menu[0];
            g.menu.css({ top: p.top, left: p.left, width: p.width });

            p.items && $(p.items).each(function (i, item)
            {
                g.addItem(item);
            });
            $(document).bind('click.menu', function (e)
            {
                var obj = (e.target || e.srcElement);
                var jobjs = $(obj).parents().add(obj);
                for (var menuid in g.menus)
                {
                    var menu = g.menus[menuid];
                    if(jobjs.index(menu)!=-1&&$(".l-checkbox",menu.items).length>0){
                        return false;
                    }
                }
                for (var menuid in g.menus)
                {
                    var menu = g.menus[menuid];
                    if (!menu) return;
                    menu.hide();

                    if (menu.shadow) menu.shadow.hide();
                }
            });
            g.set(p);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  显示菜单。
         * @name  juiceMenu#show
         * @param [options]   选项元素
         * @param [menu]      菜单
         * @function
         */
        show: function (options, menu)
        {
            var g = this, p = this.options;
            if (menu == undefined) menu = g.menu;
            if (options && options.left != undefined)
            {
                menu.css({ left: options.left });
            }
            if (options && options.top != undefined)
            {
                menu.css({ top: options.top });
            }
            menu.show();
            g.updateShadow(menu);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  渐变更新。
         * @name  juiceMenu#updateShadow
         * @param [menu]      菜单
         * @function
         */
        updateShadow: function (menu)
        {
            var g = this, p = this.options;
            if (!p.shadow) return;
            menu.shadow.css({
                left: menu.css('left'),
                top: menu.css('top'),
                width: menu.outerWidth(),
                height: menu.outerHeight()
            });
            if (menu.is(":visible"))
                menu.shadow.show();
            else
                menu.shadow.hide();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  隐藏菜单。
         * @name  juiceMenu#hide
         * @param [menu]      菜单
         * @function
         */
        hide: function (menu)
        {
            var g = this, p = this.options;
            if (menu == undefined) menu = g.menu;
            g.hideAllSubMenu(menu);
            menu.hide();
            g.updateShadow(menu);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  用于绑定两个或多个事件处理器函数，以响应被选元素的轮流的 click 事件。
         * @name  juiceMenu#toggle
         * @function
         * @example  <b>示 &nbsp;例 </b> <br>
         *     对表格的切换一个类
         *     jQuery 代码:
         *     $("td").toggle(
         *            function () {
         *                    $(this).addClass("selected");
         *            },
         *            function () {
         *                   $(this).removeClass("selected");
         *            }
         *    );
         */
        toggle: function ()
        {
            var g = this, p = this.options;
            g.menu.toggle();
            g.updateShadow(g.menu);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根据itemid删除元素。
         * @name  juiceMenu#removeItem
         * @param [itemid]      元素id
         * @function
         */
        removeItem: function (itemid)
        {
            var g = this, p = this.options;
            $("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).remove();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根据itemid将其设置为可见。
         * @name  juiceMenu#setEnabled
         * @param [itemid]      元素id
         * @function
         */
        setEnabled: function (itemid)
        {
            var g = this, p = this.options;
            $("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).removeClass("l-menu-item-disable");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根据itemid将其设置为不可见。
         * @name  juiceMenu#setDisabled
         * @param [itemid]      元素id
         * @function
         */
        setDisabled: function (itemid)
        {
            var g = this, p = this.options;
            $("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).addClass("l-menu-item-disable");
        },
        isEnable: function (itemid)
        {
            var g = this, p = this.options;
            return !$("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).hasClass("l-menu-item-disable");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  统计元素的个数。
         * @name  juiceMenu#getItemCount
         * @function
         * @return    $("> .l-menu-item", g.menu.items).length;
         */
        getItemCount: function ()
        {
            var g = this, p = this.options;
            return $("> .l-menu-item", g.menu.items).length;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  在菜单中添加元素。
         * @name  juiceMenu#addItem
         * @param [item]   待添加的元素
         * @param [menu]   指定菜单
         * @function
         */
        addItem: function (item, menu)
        {
            var g = this, p = this.options;
            if (!item) return;
            if (menu == undefined) menu = g.menu;
            g._items = g._items||{};

            if (item.line)
            {
                menu.items.append('<div class="l-menu-item-line"></div>');
                return;
            }
            var ditem = $('<div class="l-menu-item"><div class="l-menu-item-text"></div> </div>');

            var itemcount = $("> .l-menu-item", menu.items).length;
            menu.items.append(ditem);
            ditem.attr("juimenutemid", ++g.menuItemCount);
            item.id = (item.id?item.id:"_Menu_"+g.menuItemCount);
            ditem.attr("menuitemid", item.id);
            ditem.attr("parentid",item.parentId||("parent_"+g.menuItemCount));
            ditem.attr("parentMenuId",item.parentMenuId||-1);
            item.checkbox && ditem.prepend('<div>&nbsp;<a class="l-checkbox '+(item.checked?'l-checkbox-checked':'')+'"/></div>');
            item.text && $(">.l-menu-item-text:first", ditem).html(item.text);
            item.icon && ditem.prepend('<div class="l-menu-item-icon l-icon-' + item.icon + '"></div>');
            g._items[item.id] = item;
            if (item.disable || item.disabled)
                ditem.addClass("l-menu-item-disable");
            if (item.children)
            {
                ditem.append('<div class="l-menu-item-arrow"></div>');
                var newmenu = g.createMenu(ditem.attr("juimenutemid"));
                g.menus[ditem.attr("juimenutemid")] = newmenu;
                newmenu.width(p.width);
                newmenu.hover(null, function ()
                {
                    if (!newmenu.showedSubMenu)
                        g.hide(newmenu);
                });
                $(item.children).each(function ()
                {
                    this.parentId = item.id;
                    this.parentMenuId = g.menuItemCount;
                    g.addItem(this, newmenu);
                });
            }
            item.click && ditem.click(function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                if(item.checkbox){
                    var isChecked = $(".l-checkbox",this).hasClass("l-checkbox-checked");
                    var parentContainer = g.getParentItems($(this));
                    var childContainer = g.getChildItems($(this)).reverse();
                    var container = childContainer.concat(parentContainer) ;
                    if(isChecked){
                        $(container.reverse()).each(function(){
                            if($(this).attr("parentMenuId")=="-1"&&$(".l-checkbox-checked",$(this).parent()).length==1){
                                return false;
                            }
                            $(".l-checkbox",this).removeClass("l-checkbox-checked");
                            var childItem = g.getItemById($(this).attr("menuitemid"));
                            childItem.checked = false;
                            childItem.click(childItem, itemcount);
                        });
                    }else{
                        $(container).each(function(){
                            $(".l-checkbox",this).addClass("l-checkbox-checked");
                            var childItem = g.getItemById($(this).attr("menuitemid"));
                            childItem.checked = true;
                            childItem.click(childItem, itemcount);
                        });
                    }
                }else{
                    item.click(item, itemcount,ditem);
                }

            });
            item.dblclick && ditem.dblclick(function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                item.dblclick(item, itemcount);
            });

            var menuover = $("> .l-menu-over:first", menu);
            ditem.hover(function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                var itemtop = $(this).offset().top;
                var top = itemtop - menu.offset().top;
                menuover.css({ top: top });
                g.hideAllSubMenu(menu);
                if (item.children)
                {
                    var juimenutemid = $(this).attr("juimenutemid");
                    if (!juimenutemid) return;
                    if (g.menus[juimenutemid])
                    {
                        g.show({ top: itemtop, left: $(this).offset().left + $(this).width() - 5 }, g.menus[juimenutemid]);
                        menu.showedSubMenu = true;
                    }
                }
            }, function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                var juimenutemid = $(this).attr("juimenutemid");
                if (item.children)
                {
                    var juimenutemid = $(this).attr("juimenutemid");
                    if (!juimenutemid) return;
                };
            });
        },
        getItemById:function(menuitemid){
            var g = this, p = this.options;
            return g._items[menuitemid];
        },
        getParentItems:function(ditem,container){
            var g = this, p = this.options;
            if(!container){
                container = new Array();
            }
            container.push(ditem);
            var checkedItem = $(".l-checkbox-checked",ditem.parent());
            if(checkedItem.length==1||checkedItem.length==0){
                var parentId = ditem.attr("parentId");
                if(parentId){
                    for(var menuId in g.menus){
                        var parentElement = $("div[menuitemid='"+parentId+"']", g.menus[menuId]);
                        if(parentElement.length>0){
                            g.getParentItems(parentElement,container)
                        }
                    }

                }
            }
            return container;
        },

        getChildItems:function(ditem,container){
            var g = this, p = this.options;
            if(!container){
                container = new Array();
            }
            if(g.menus[ditem.attr("juimenutemid")]){
                var childItem = $(".l-menu-item",g.menus[ditem.attr("juimenutemid")].items);
                if(childItem.length>0) {
                    childItem.each(function(i){
                        container.push($(this));
                        g.getChildItems($(this),container);
                    });
                }
            }
            return container;
        },

        hideAllSubMenu: function (menu)
        {
            var g = this, p = this.options;
            if (menu == undefined) menu = g.menu;
            $("> .l-menu-item", menu.items).each(function ()
            {
                if ($("> .l-menu-item-arrow", this).length > 0)
                {
                    var juimenutemid = $(this).attr("juimenutemid");
                    if (!juimenutemid) return;
                    g.menus[juimenutemid] && g.hide(g.menus[juimenutemid]);
                }
            });
            menu.showedSubMenu = false;
        },
        createMenu: function (parentMenuItemID)
        {
            var g = this, p = this.options;
            var menu = $('<div class="l-menu" style="display:none"><div class="l-menu-yline"></div><div class="l-menu-over"><div class="l-menu-over-l"></div> <div class="l-menu-over-r"></div></div><div class="l-menu-inner"></div></div>');

            if(p.arrowPosition == "left" && (!parentMenuItemID)){
                menu.addClass("l-menu-arrow-left");
            }

            if(p.arrowPosition == "right" && (!parentMenuItemID)){
                menu.addClass("l-menu-arrow-right");
            }

            parentMenuItemID && menu.attr("juiparentmenuitemid", parentMenuItemID);
            menu.items = $("> .l-menu-inner:first", menu);
            menu.appendTo('body');
            if (p.shadow)
            {
                menu.shadow = $('<div class="l-menu-shadow"></div>').insertAfter(menu);
                g.updateShadow(menu);
            }
            menu.hover(null, function ()
            {
                if (!menu.showedSubMenu)
                    $("> .l-menu-over:first", menu).css({ top: -28 });
            });
            if (parentMenuItemID)
                g.menus[parentMenuItemID] = menu;
            else
                g.menus[0] = menu;
            return menu;
        }
    });
    //旧写法保留
    $.jui.controls.Menu.prototype.setEnable = $.jui.controls.Menu.prototype.setEnabled;
    $.jui.controls.Menu.prototype.setDisable = $.jui.controls.Menu.prototype.setDisabled;



})(jQuery);