/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 */
(function ($)
{
    /**
     * @name   juiceTab
     * @class   juiceTab 是属性加载结构类。
     * @constructor
     * @description 构造函数。
     * @namespace  <h3><font color="blue">juiceTab &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceTab = function (options)
    {
        return $.jui.run.call(this, "juiceTab", arguments);
    };

    $.fn.juiceGetTabManager = function ()
    {
        return $.jui.run.call(this, "juiceGetTabManager", arguments);
    };
    /**@lends juiceTab#*/
    $.juiceDefaults.Tab ={
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度。
         * @default null
         * @type Object
         */
        height: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度补差。
         * @default 0
         * @type Number
         */
        heightDiff: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否随窗体的改变而改变高度。
         * @default false
         * @type Boolean
         */
        changeHeightOnResize: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示右键菜单。
         * @default true
         * @type Boolean
         */
        contextmenu: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否双击时关闭。
         * @default false
         * @type Boolean
         */
        dblClickToClose: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许拖动时改变tab项的位置。
         * @default false
         * @type Boolean
         */
        dragToMove: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;覆盖tab项前事件，可以通过return false阻止操作  。
         * @default null
         * @type event
         */
        onBeforeOverrideTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;覆盖tab项后事件  。
         * @default null
         * @type event
         */
        onAfterOverrideTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除tab项前事件，可以通过return false阻止操作 。
         * @default null
         * @type event
         */
        onBeforeRemoveTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除tab项后事件 。
         * @default null
         * @type event
         */
        onAfterRemoveTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加tab项前事件，可以通过return false阻止操作 。
         * @default null
         * @type event
         */
        onBeforeAddTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加tab项后事件 。
         * @default null
         * @type event
         */
        onAfterAddTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择tab项前事件，可以通过return false阻止操作 。
         * @default null
         * @type event
         */
        onBeforeSelectTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  选择tab项后事件。
         * @default null
         * @type event
         */
        onAfterSelectTabItem: null
    };
    $.juiceDefaults.TabString = {
        closeMessage: "关闭当前页",
        closeOtherMessage: "关闭其他",
        closeAllMessage: "关闭所有",
        reloadMessage: "刷新"
    };

    $.juiceMethos.Tab = {};

    $.jui.controls.Tab = function (element, options)
    {
        $.jui.controls.Tab.base.constructor.call(this, element, options);
    };
    $.jui.controls.Tab.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Tab';
        },
        __idPrev: function ()
        {
            return 'Tab';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Tab;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            if (p.height) g.makeFullHeight = true;
            g.tab = $(this.element);
            g.tab.addClass("l-tab");
            if (p.contextmenu && $.juiceMenu)
            {
                g.tab.menu = $.juiceMenu({ width: 100, items: [
                    { text: p.closeMessage, id: 'close', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    },
                    { text: p.closeOtherMessage, id: 'closeother', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    },
                    { text: p.closeAllMessage, id: 'closeall', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    },
                    { text: p.reloadMessage, id: 'reload', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    }
                ]
                });
            }
            g.tab.content = $('<div class="l-tab-content"></div>');
            $("> div", g.tab).appendTo(g.tab.content);
            g.tab.content.appendTo(g.tab);
            g.tab.links = $('<div class="l-tab-links"><ul style="left: 0px; "></ul></div>');
            g.tab.links.prependTo(g.tab);
            g.tab.links.ul = $("ul", g.tab.links);
            var lselecteds = $("> div[lselected=true]", g.tab.content);
            var haslselected = lselecteds.length > 0;
            g.selectedTabId = lselecteds.attr("tabid");
            $("> div", g.tab.content).each(function (i, box)
            {
                var li = $('<li class=""><a></a></li>');
                var contentitem = $(this);
                if (contentitem.attr("title"))
                {
                    $("> a", li).html(contentitem.attr("title"));
                    contentitem.attr("title", "");
                }
                var tabid = contentitem.attr("tabid");
                if (tabid == undefined)
                {
                    tabid = g.getNewTabid();
                    contentitem.attr("tabid", tabid);
                    if (contentitem.attr("lselected"))
                    {
                        g.selectedTabId = tabid;
                    }
                }
                li.attr("tabid", tabid);
                if (!haslselected && i == 0) g.selectedTabId = tabid;
                var showClose = contentitem.attr("showClose");
                if (showClose)
                {
                    li.append("<div class='l-tab-links-item-close'></div>");
                }
                $("> ul", g.tab.links).append(li);
                if (!contentitem.hasClass("l-tab-content-item")) contentitem.addClass("l-tab-content-item");
                if (contentitem.find("iframe").length > 0)
                {
                    var iframe = $("iframe:first", contentitem);
                    if (iframe[0].readyState != "complete")
                    {
                        if (contentitem.find(".l-tab-loading:first").length == 0)
                            contentitem.prepend("<div class='l-tab-loading' style='display:block;'></div>");
                        var iframeloading = $(".l-tab-loading:first", contentitem);
                        iframe.bind('load.tab', function ()
                        {
                            iframeloading.hide();
                        });
                    }
                }
            });
            //init 
            g.selectTabItem(g.selectedTabId);
            //set content height
            if (p.height)
            {
                if (typeof (p.height) == 'string' && p.height.indexOf('%') > 0)
                {
                    g.onResize();
                    if (p.changeHeightOnResize)
                    {
                        $(window).resize(function ()
                        {
                            g.onResize.call(g);
                        });
                    }
                } else
                {
                    g.setHeight(p.height);
                }
            }
            if (g.makeFullHeight)
                g.setContentHeight();
            //add even 
            $("li", g.tab.links).each(function ()
            {
                g._addTabItemEvent($(this));
            });
            g.tab.bind('dblclick.tab', function (e)
            {
                if (!p.dblClickToClose) return;
                g.dblclicking = true;
                var obj = (e.target || e.srcElement);
                var tagName = obj.tagName.toLowerCase();
                if (tagName == "a")
                {
                    var tabid = $(obj).parent().attr("tabid");
                    var allowClose = $(obj).parent().find("div.l-tab-links-item-close").length ? true : false;
                    if (allowClose)
                    {
                        g.removeTabItem(tabid);
                    }
                }
                g.dblclicking = false;
            });

            g.set(p);
        },
        _applyDrag: function (tabItemDom)
        {
            var g = this, p = this.options;
            g.droptip = g.droptip || $("<div class='l-tab-drag-droptip' style='display:none'><div class='l-drop-move-up'></div><div class='l-drop-move-down'></div></div>").appendTo('body');
            var drag = $(tabItemDom).juiceDrag(
                {
                    revert: true, animate: false,
                    proxy: function ()
                    {
                        var name = $(this).find("a").html();
                        g.dragproxy = $("<div class='l-tab-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div></div>").appendTo('body');
                        g.dragproxy.append(name);
                        return g.dragproxy;
                    },
                    onRendered: function ()
                    {
                        this.set('cursor', 'pointer');
                    },
                    onStartDrag: function (current, e)
                    {
                        if (!$(tabItemDom).hasClass("l-selected")) return false;
                        if (e.button == 2) return false;
                        var obj = e.srcElement || e.target;
                        if ($(obj).hasClass("l-tab-links-item-close")) return false;
                    },
                    onDrag: function (current, e)
                    {
                        if (g.dropIn == null)
                            g.dropIn = -1;
                        var tabItems = g.tab.links.ul.find('>li');
                        var targetIndex = tabItems.index(current.target);
                        tabItems.each(function (i, item)
                        {
                            if (targetIndex == i)
                            {
                                return;
                            }
                            var isAfter = i > targetIndex;
                            if (g.dropIn != -1 && g.dropIn != i) return;
                            var offset = $(this).offset();
                            var range = {
                                top: offset.top,
                                bottom: offset.top + $(this).height(),
                                left: offset.left - 10,
                                right: offset.left + 10
                            };
                            if (isAfter)
                            {
                                range.left += $(this).width();
                                range.right += $(this).width();
                            }
                            var pageX = e.pageX || e.screenX;
                            var pageY = e.pageY || e.screenY;
                            if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom)
                            {
                                g.droptip.css({
                                    left: range.left + 5,
                                    top: range.top - 9
                                }).show();
                                g.dropIn = i;
                                g.dragproxy.find(".l-drop-icon").removeClass("l-drop-no").addClass("l-drop-yes");
                            }
                            else
                            {
                                g.dropIn = -1;
                                g.droptip.hide();
                                g.dragproxy.find(".l-drop-icon").removeClass("l-drop-yes").addClass("l-drop-no");
                            }
                        });
                    },
                    onStopDrag: function (current, e)
                    {
                        if (g.dropIn > -1)
                        {
                            var to = g.tab.links.ul.find('>li:eq(' + g.dropIn + ')').attr("tabid");
                            var from = $(current.target).attr("tabid");
                            setTimeout(function ()
                            {
                                g.moveTabItem(from, to);
                            }, 0);
                            g.dropIn = -1;
                            g.dragproxy.remove();
                        }
                        g.droptip.hide();
                        this.set('cursor', 'default');
                    }
                });
            return drag;
        },
        _setDragToMove: function (value)
        {
            if (!$.fn.juiceDrag) return; //需要juiceDrag的支持
            var g = this, p = this.options;
            if (value)
            {
                if (g.drags) return;
                g.drags = g.drags || [];
                g.tab.links.ul.find('>li').each(function ()
                {
                    g.drags.push(g._applyDrag(this));
                });
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 切换两个tab项的位置。
         * @name   juiceTab#moveTabItem
         * @param [fromTabItemID]   其中一个tab项
         * @param [toTabItemID]    另一个tab项
         * @function
         */
        moveTabItem: function (fromTabItemID, toTabItemID)
        {
            var g = this;
            var from = g.tab.links.ul.find(">li[tabid=" + fromTabItemID + "]");
            var to = g.tab.links.ul.find(">li[tabid=" + toTabItemID + "]");
            var index1 = g.tab.links.ul.find(">li").index(from);
            var index2 = g.tab.links.ul.find(">li").index(to);
            if (index1 < index2)
            {
                to.after(from);
            }
            else
            {
                to.before(from);
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置tab按钮(左和右),显示返回true,隐藏返回false。
         * @name   juiceTab#setTabButton
         * @return true|false
         * @function
         */
        setTabButton: function ()
        {
            var g = this, p = this.options;
            var items = $("li", g.tab.links);

            var lastItem = items[items.length-1];
            var lastItemRight = $(lastItem).position().left + $(lastItem).width();

            var mainwidth = g.tab.width();
            if (lastItemRight > mainwidth)
            {
                if($(".l-tab-links-right", g.tab.links).length == 0)
                {
                    g.tab.links.append('<div class="l-tab-links-left"></div><div class="l-tab-links-right"></div>');
                    g.setTabButtonEven();
                }
                return true;
            } else
            {
                g.tab.links.ul.animate({ left: 0 });
                $(".l-tab-links-left,.l-tab-links-right", g.tab.links).remove();
                return false;
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置左右按钮的事件 标签超出最大宽度时，可左右拖动。
         * @name   juiceTab#setTabButtonEven
         * @function
         */
        setTabButtonEven: function ()
        {
            var g = this, p = this.options;

            $(".l-tab-links-left", g.tab.links).hover(function ()
            {
                $(this).addClass("l-tab-links-left-over");
            }, function ()
            {
                $(this).removeClass("l-tab-links-left-over");
            }).click(function ()
                {
                    g.moveToPrevTabItem();
                });
            $(".l-tab-links-right", g.tab.links).hover(function ()
            {
                $(this).addClass("l-tab-links-right-over");
            }, function ()
            {
                $(this).removeClass("l-tab-links-right-over");
            }).click(function ()
                {
                    g.moveToNextTabItem();
                });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 切换到上一个tab。
         * @name   juiceTab#moveToPrevTabItem
         * @function
         */
        moveToPrevTabItem: function ()
        {
            var g = this, p = this.options;
            var btnWitdth = $(".l-tab-links-left", g.tab.links).width();
            
            var currentLeft = g.tab.links.ul.position().left - btnWitdth;

            var items = $("li", g.tab.links);
            for(var i = items.length-1 ; i >=0; i--){
                var item = items[i];
                var itemLeft = $(item).position().left;
                if(itemLeft < (-1*currentLeft)){
                    if(i-1 < 0) return;
                    g.tab.links.ul.animate({ left: (-1*$(items[i-1]).position().left + 15) });
                    return;
                }
            }

            
            
            
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 切换到下一个tab。
         * @name   juiceTab#moveToNextTabItem
         * @function
         */
        moveToNextTabItem: function ()
        {
            var g = this, p = this.options;
            var btnWitdth = $(".l-tab-links-left", g.tab.links).width();
            
            var ulWidth = g.tab.width();
            var currentLeft = g.tab.links.ul.position().left;

            var items = $("li", g.tab.links);

            for(var i = 0; i < items.length; i++){
                var item = items[i];
                var itemLeft = $(item).position().left;
                var itemRight = $(item).position().left + $(item).width();
                if((itemRight + currentLeft) > ulWidth){
                    g.tab.links.ul.animate({ left:(-(itemRight -  ulWidth) - 51)});
                    return;
                }
            }

        },

        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  获取tab item 的数量。
         * @name   juiceTab#getTabItemCount
         * @return int
         * @function
         */
         getTabItemCount: function ()
        {
            var g = this, p = this.options;
            return $("li", g.tab.links.ul).length;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取tab seelcted item 的tabid 。
         * @name   juiceTab#getSelectedTabItemID
         * @return int
         * @function
         */
        getSelectedTabItemID: function ()
        {
            var g = this, p = this.options;
            return $("li.l-selected", g.tab.links.ul).attr("tabid");
        },
        getSelectedTabItem: function ()
        {
            var g = this, p = this.options;
            return $("li.l-selected", g.tab.links.ul);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除选中的tabitem。
         * @name   juiceTab#removeSelectedTabItem
         * @function
         */
        removeSelectedTabItem: function ()
        {
            var g = this, p = this.options;
            g.removeTabItem(g.getSelectedTabItemID());
        },
        //覆盖选择的tabitem
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 覆盖选中的Tab项 。
         * @name   juiceTab#overrideSelectedTabItem
         * @param [options] 选中的项
         * @function
         */
        overrideSelectedTabItem: function (options)
        {
            var g = this, p = this.options;
            g.overrideTabItem(g.getSelectedTabItemID(), options);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 覆盖指定的Tab项 。
         * @name   juiceTab#overrideTabItem
         * @param [targettabid]  预覆盖的内容项
         * @param [options]  指定的tab项
         * @function
         */
        overrideTabItem: function (targettabid, options)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeOverrideTabItem', [targettabid]) == false)
                return false;
            var tabid = options.tabid;
            if (tabid == undefined) tabid = g.getNewTabid();
            var url = options.url;
            var content = options.content;
            var target = options.target;
            var text = options.text;
            var showClose = options.showClose;
            var height = options.height;
            //如果已经存在
            if (g.isTabItemExist(tabid))
            {
                return;
            }
            var tabitem = $("li[tabid=" + targettabid + "]", g.tab.links.ul);
            var contentitem = $(".l-tab-content-item[tabid=" + targettabid + "]", g.tab.content);
            if (!tabitem || !contentitem) return;
            tabitem.attr("tabid", tabid);
            contentitem.attr("tabid", tabid);
            if ($("iframe", contentitem).length == 0 && url)
            {
                contentitem.html("<iframe frameborder='0' style='overflow: hidden;'></iframe>");
            }
            else if (content)
            {
                contentitem.html(content);
            }
            $("iframe", contentitem).attr("name", tabid);
            if (showClose == undefined) showClose = true;
            if (showClose == false) $(".l-tab-links-item-close", tabitem).remove();
            else
            {
                if ($(".l-tab-links-item-close", tabitem).length == 0)
                    tabitem.append("<div class='l-tab-links-item-close'></div>");
            }
            if (text == undefined) text = tabid;
            if (height) contentitem.height(height);
            $("a", tabitem).text(text);
            $("iframe", contentitem).attr("src", url);


            g.trigger('afterOverrideTabItem', [targettabid]);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选中tab项 。
         * @name   juiceTab#selectTabItem
         * @param [tabid] 表格id
         * @function
         */
        selectTabItem: function (tabid)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeSelectTabItem', [tabid]) == false)
                return false;
            g.selectedTabId = tabid;
            $("> .l-tab-content-item[tabid=" + tabid + "]", g.tab.content).show().siblings().hide();
            $("li[tabid=" + tabid + "]", g.tab.links.ul).addClass("l-selected").siblings().removeClass("l-selected");
            g.trigger('afterSelectTabItem', [tabid]);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 移动到最后一个tab 。
         * @name   juiceTab#moveToLastTabItem
         * @function
         */
        moveToLastTabItem: function ()
        {
            var g = this, p = this.options;
            var btnWitdth = $(".l-tab-links-left", g.tab.links).width();
            
            var ulWidth = g.tab.width();
            var currentLeft = g.tab.links.ul.position().left;

            var items = $("li", g.tab.links);
            var lastItem = items[items.length-1];
            var lastItemRight = $(lastItem).position().left + $(lastItem).width();
            if((lastItemRight + currentLeft) > ulWidth){
                g.tab.links.ul.animate({ left:(-(lastItemRight -  ulWidth) - 51)});
                return;
            }

            
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 判断tab是否存在 。
         * @name   juiceTab#isTabItemExist
         * @param  [tabid]  表格id
         * @function
         */
        isTabItemExist: function (tabid)
        {
            var g = this, p = this.options;
            return $("li[tabid=" + tabid + "]", g.tab.links.ul).length > 0;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加一个tab 。
         * @name   juiceTab#addTabItem
         * @param [options]  所选项
         * @function
         */
        addTabItem: function (options)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeAddTabItem', [tabid]) == false)
                return false;
            var tabid = options.tabid;
            if (tabid == undefined) tabid = g.getNewTabid();
            var url = options.url;
            var content = options.content;
            var text = options.text;
            var showClose = options.showClose;
            var height = options.height;
            //如果已经存在
            if (g.isTabItemExist(tabid))
            {
                g.selectTabItem(tabid);
                return;
            }
            var tabitem = $("<li><a></a><div class='l-tab-links-item-close'></div></li>");
            var contentitem = $("<div class='l-tab-content-item'><div class='l-tab-loading' style='display:block;'></div><iframe frameborder='0' style='overflow: hidden;'></iframe></div>");
            var iframeloading = $("div:first", contentitem);
            var iframe = $("iframe:first", contentitem);
            if (g.makeFullHeight)
            {
                var newheight = g.tab.height() - g.tab.links.height();
                contentitem.height(newheight);
            }
            tabitem.attr("tabid", tabid);
            contentitem.attr("tabid", tabid);
            if (url)
            {
                iframe.attr("name", tabid)
                    .attr("id", tabid)
                    .attr("src", url)
                    .bind('load.tab', function ()
                    {
                        iframeloading.hide();
                        if (options.callback)
                            options.callback();
                    });
            }
            else
            {
                iframe.remove();
                iframeloading.remove();
            }
            if (content)
            {
                contentitem.html(content);
            }
            else if (options.target)
            {
                contentitem.append(options.target);
            }
            if (showClose == undefined) showClose = true;
            if (showClose == false) $(".l-tab-links-item-close", tabitem).remove();
            if (text == undefined) text = tabid;
            if (height) contentitem.height(height);
//            $("a", tabitem).text(text);
            $("a", tabitem).html(text);

            g.tab.links.ul.append(tabitem);
            g.tab.content.append(contentitem);
            g.selectTabItem(tabid);
            if (g.setTabButton())
            {
                g.moveToLastTabItem();
            }
            //增加事件
            g._addTabItemEvent(tabitem);
            if (p.dragToMove && $.fn.juiceDrag)
            {
                g.drags = g.drags || [];
                tabitem.each(function ()
                {
                    g.drags.push(g._applyDrag(this));
                });
            }
            g.trigger('afterAddTabItem', [tabid]);
        },
        _addTabItemEvent: function (tabitem)
        {
            var g = this, p = this.options;
            tabitem.click(function ()
            {
                var tabid = $(this).attr("tabid");
                g.selectTabItem(tabid);
            });
            //右键事件支持
            g.tab.menu && g._addTabItemContextMenuEven(tabitem);
            $(".l-tab-links-item-close", tabitem).hover(function ()
            {
                $(this).addClass("l-tab-links-item-close-over");
            }, function ()
            {
                $(this).removeClass("l-tab-links-item-close-over");
            }).click(function ()
                {
                    var tabid = $(this).parent().attr("tabid");
                    g.removeTabItem(tabid);
                });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 移除tab项 。
         * @name   juiceTab#removeTabItem
         * @param  [tabid]  表格id
         * @function
         */
        removeTabItem: function (tabid)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeRemoveTabItem', [tabid]) == false)
                return false;
            var currentIsSelected = $("li[tabid=" + tabid + "]", g.tab.links.ul).hasClass("l-selected");
            if (currentIsSelected)
            {
                $(".l-tab-content-item[tabid=" + tabid + "]", g.tab.content).prev().show();
                $("li[tabid=" + tabid + "]", g.tab.links.ul).prev().addClass("l-selected").siblings().removeClass("l-selected");
            }
            $(".l-tab-content-item[tabid=" + tabid + "]", g.tab.content).remove();
            $("li[tabid=" + tabid + "]", g.tab.links.ul).remove();
            g.setTabButton();
            g.trigger('afterRemoveTabItem', [tabid]);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加或缩小Tab内容区域的高度 。
         * @name   juiceTab#addHeight
         * @param [heightDiff]   高度补差
         * @function
         */
        addHeight: function (heightDiff)
        {
            var g = this, p = this.options;
            var newHeight = g.tab.height() + heightDiff;
            g.setHeight(newHeight);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置Tab的高度 。
         * @name   juiceTab#setHeight
         * @param  [height] 高度
         * @function
         */
        setHeight: function (height)
        {
            var g = this, p = this.options;
            g.tab.height(height);
            g.setContentHeight();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置文本框的高度 。
         * @name   juiceTab#setContentHeight
         * @function
         */
        setContentHeight: function ()
        {
            var g = this, p = this.options;
            var newheight = g.tab.height() - g.tab.links.height();
            g.tab.content.height(newheight);
            $("> .l-tab-content-item", g.tab.content).height(newheight);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取新的tab的id 。
         * @name   juiceTab#getNewTabid
         * @return  int
         * @function
         */
        getNewTabid: function ()
        {
            var g = this, p = this.options;
            g.getnewidcount = g.getnewidcount || 0;
            return 'tabitem' + (++g.getnewidcount);
        },
        //notabid 过滤掉tabid的
        //noclose 过滤掉没有关闭按钮的
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取新的tabid的集合 。
         * @name   juiceTab#getTabidList
         * @return     tabidlist  一个tabidlist集合
         * @function
         */
        getTabidList: function (notabid, noclose)
        {
            var g = this, p = this.options;
            var tabidlist = [];
            $("> li", g.tab.links.ul).each(function ()
            {
                if ($(this).attr("tabid")
                    && $(this).attr("tabid") != notabid
                    && (!noclose || $(".l-tab-links-item-close", this).length > 0))
                {
                    tabidlist.push($(this).attr("tabid"));
                }
            });
            return tabidlist;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除其他 。
         * @name   juiceTab#removeOther
         * @function
         */
        removeOther: function (tabid, compel)
        {
            var g = this, p = this.options;
            var tabidlist = g.getTabidList(tabid, true);
            $(tabidlist).each(function ()
            {
                g.removeTabItem(this);
            });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 刷新指定的Tab项  。
         * @name   juiceTab#reload
         * @param [tabid]  指定tabid
         * @function
         */
        reload: function (tabid)
        {
            var g = this, p = this.options;
            var contentitem = $(".l-tab-content-item[tabid=" + tabid + "]");
            var iframeloading = $(".l-tab-loading:first", contentitem);
            var iframe = $("iframe:first", contentitem);
            var url = $(iframe).attr("src");
            iframeloading.show();
            iframe.attr("src", url).unbind('load.tab').bind('load.tab', function ()
            {
                iframeloading.hide();
            });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除所有  。
         * @name   juiceTab#removeAll
         * @param [compel]
         * @function
         */
        removeAll: function (compel)
        {
            var g = this, p = this.options;
            var tabidlist = g.getTabidList(null, true);
            $(tabidlist).each(function ()
            {
                g.removeTabItem(this);
            });
        },
        onResize: function ()
        {
            var g = this, p = this.options;
            if (!p.height || typeof (p.height) != 'string' || p.height.indexOf('%') == -1) return false;
            //set tab height
            if (g.tab.parent()[0].tagName.toLowerCase() == "body")
            {
                var windowHeight = $(window).height();
                windowHeight -= parseInt(g.tab.parent().css('paddingTop'));
                windowHeight -= parseInt(g.tab.parent().css('paddingBottom'));
                g.height = p.heightDiff + windowHeight * parseFloat(g.height) * 0.01;
            }
            else
            {
                g.height = p.heightDiff + (g.tab.parent().height() * parseFloat(p.height) * 0.01);
            }
            g.tab.height(g.height);
            g.setContentHeight();
        },
        _menuItemClick: function (item)
        {
            var g = this, p = this.options;
            if (!item.id || !g.actionTabid) return;
            switch (item.id)
            {
                case "close":
                    g.removeTabItem(g.actionTabid);
                    g.actionTabid = null;
                    break;
                case "closeother":
                    g.removeOther(g.actionTabid);
                    break;
                case "closeall":
                    g.removeAll();
                    g.actionTabid = null;
                    break;
                case "reload":
                    g.selectTabItem(g.actionTabid);
                    g.reload(g.actionTabid);
                    break;
            }
        },
        _addTabItemContextMenuEven: function (tabitem)
        {
            var g = this, p = this.options;
            tabitem.bind("contextmenu", function (e)
            {
                if (!g.tab.menu) return;
                g.actionTabid = tabitem.attr("tabid");
                g.tab.menu.show({ top: e.pageY, left: e.pageX });
                if ($(".l-tab-links-item-close", this).length == 0)
                {
                    g.tab.menu.setDisabled('close');
                }
                else
                {
                    g.tab.menu.setEnabled('close');
                }
                return false;
            });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取指定tabid的ItemUrl  。
         * @name   juiceTab#getItemUrl
         * @param [tabid]     指定的tabid
         * @return   $(iframe).attr("src") src属性
         * @function
         */
        getItemUrl: function (tabid)
        {
            var contentitem = $(".l-tab-content-item[tabid=" + tabid + "]");
            var iframe = $("iframe:first", contentitem);
            return $(iframe).attr("src");
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取选定项tab的ItemUrl  。
         * @name   juiceTab#getSelectedItemUrl
         * @return      this.getItemUrl(tabid);  int
         * @function
         */
        getSelectedItemUrl: function ()
        {
            var tabid = this.getSelectedTabItemID();
            return this.getItemUrl(tabid);
        } ,
        getItemByTabId: function (tabid)
        {
            var g = this, p = this.options;
            return $("li[tabid=" + tabid + "]", g.tab.links.ul);
        },
        tabItemLoad:function(tabId,url){
            var contentitem = $(".l-tab-content-item[tabid=" + tabId + "]");
            var iframe = $("iframe:first", contentitem);
             $(iframe).attr("src",url);
        }
    });



})(jQuery);