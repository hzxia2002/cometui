/**
 *  @fileOverview  jQuery jui 1.0
 *
 *  @author  <a href="http://jui.com">xhz&&tcg</a>
 *
 */
(function ($) {
    $.fn.juiceTree = function (options) {
        return $.jui.run.call(this, "juiceTree", arguments);
    };

    $.fn.juiceGetTreeManager = function () {
        return $.jui.run.call(this, "juiceGetTreeManager", arguments);
    };

    /**
     * @name   juiceTree
     * @class   juiceTree是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceTree &nbsp;API 注解说明</font></h3>
     */
    $.juiceDefaults.Tree = /**@lends juiceTree#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取数据源url。
         * @default ""
         * @type String
         */
        url:"",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   数据源。
         * @default null
         * @type Object
         */
        data:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  复选框,默认值为false。
         * @default false
         * @type Boolean
         */
        checkbox:false,
        autoCheckboxEven:true,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  父节点图标，默认为folder 图标。
         * @default  folder
         * @type String
         */
        parentIcon:'folder',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  子节点图标。
         * @default leaf
         * @type String
         */
        childIcon:'leaf',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  文本域名称。
         * @default text
         * @type String
         */
        textFieldName:'text',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  树节点参数属性。
         * @default ['id', 'url', 'uid', 'type']
         * @type String
         */
        attribute:['id', 'url', 'uid', 'type'],
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否显示line,true为显示，false为不显示。
         * @default true
         * @type Boolean
         */
        treeLine:true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  节点宽度，默认是90px。
         * @default 90
         * @type Number
         */
        nodeWidth:90,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  状态名称“__status”。
         * @default __status
         * @type String
         */
        statusName:'__status',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否子节点的判断函数。
         * @default null
         * @type Object
         */
        isLeaf:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否单选，默认是“false”，不单选,否则，单选。
         * @default false
         * @type Boolean
         */
        single:false,
        /**
         *@name  juiceTree#onBeforeExpand
         *@desc    树节点展开前触发事件。  onBeforeExpand: function () { }
         *@event
         *@param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *              onBeforeExpand: function(nodeData){ ... }
         *           };
         */
        onBeforeExpand:function () {
        },
        /**
         *@name   juiceTree#onContextmenu
         *@desc    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右键菜单触发事件。   onContextmenu: function () { }
         *@event
         */
        onContextmenu:function () {
        },
        /**
         *@name   juiceTree#onExpand
         *@desc     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点展开后触发事件。    onExpand: function () { }
         *@event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onExpand: function(nodeData){ ... }
         *          };
         */
        onExpand:function () {
        },
        /**
         *@name  juiceTree#onBeforeCollapse
         *@desc    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点收缩前触发事件。   onBeforeCollapse: function () { }
         *@event
         *@param  nodeData
         *nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *           onBeforeCollapse: function(nodeData){ ... }
         *          };
         */
        onBeforeCollapse:function () {
        },
        /**
         *@name  juiceTree#onCollapse
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点收缩后触发事件。   onCollapse: function () { }
         *@event
         *@param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onCollapse: function(nodeData){ ... }
         *          };
         */
        onCollapse:function () {
        },
        /**
         *@name   juiceTree#onBeforeSelect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选择前触发事件。   onBeforeSelect: function () { }
         *@event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onBeforeSelect: function(nodeData){ ... }
         *          };
         */
        onBeforeSelect:function () {
        },
        /**
         *@name   juiceTree#onSelect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选择后触发事件。 onSelect: function () { }
         *@event
         * @param  nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onSelect: function(nodeData){ ... }
         *          };
         */
        onSelect:function () {
        },
        /**
         *@name   juiceTree#onBeforeCancelSelect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点取消选择前触发事件。   onBeforeCancelSelect: function () { }
         * @event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onBeforeCancelSelect: function(nodeData){ ... }
         *          };
         */
        onBeforeCancelSelect:function () {
        },
        /**
         *@name   juiceTree#onCancelselect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点取消选择前触发事件。   onCancelselect: function () { }
         * @event
         * @param  nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onCancelselect: function(nodeData){ ... }
         *          };
         */
        onCancelselect:function () {
        },
        /**
         *@name   juiceTree#onCheck
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选中后触发事件。   onCheck: function () { }
         *@event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onCheck: function(nodeData){ ... }
         *          };
         */
        onCheck:function () {
        },
        /**
         *@name   juiceTree#onSuccess
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点远程装载成功后触发事件。   onSuccess: function () { }
         *@event
         * @param data
         * data - 装载成功后获取的数据json.
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onSuccess: function(data){ ... }
         *          };
         */
        onSuccess:function () {
        },
        /**
         *@name   juiceTree#onError
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;远程更新数据异常后执行的方法 .错误信息为jQuery.ajax返回的异常信息，可参考jQuery.ajax官方文档。  onError: function () { }
         *@event
         *@param xmlHttpRequest,textStatus,errorThrown,event
         *  xmlHttpRequest - XMLHttpRequest 对象
         *  textStatus - 错误信息
         *  errorThrown - （可选）捕获的异常对象
         *  event - jQuery.Event对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *                  onError:function(xmlHttpRequest,textStatus,errorThrown,event){
         *                           alert('error occured');
         *                       }
         *                  };
         */
        onError:function () {
        },
        /**
         *@name   juiceTree#onClick
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单击树节点触发事件。    onClick: function () { }
         *@event
         * @param data
         * nodeData - 树节点的json对象 event - jQuery.Event对象
         *@example   <b>示例:</b> <br>
         *         $("#tree").omTree({
         *            onClick: function(nodeData, event){ ... }
         *          });
         */
        onClick:function () {
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  节点id。
         * @default  id
         * @type String
         */
        idFieldName:'id',
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  父节点id名称。
         * @default  null
         * @type Object
         */
        parentIDFieldName:null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根节点id的值。
         * @default  0
         * @type Number
         */
        topParentIDValue:0,
        /**
         *@name   juiceTree#onBeforeAppend
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据前事件，可以通过return false取消操作。    onBeforeAppend: function () { }
         *@event
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onBeforeAppend: function(){ ... return false; }
         *          };
         */
        onBeforeAppend:function () {
        },
        /**
         *@name   juiceTree#onAppend
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据时事件，对数据进行预处理以后进行加载。    onAppend: function () { }
         *@event
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onAppend: function(){ ... return false; }
         *          };
         */
        onAppend:function () {
        },



        /**
         *@name   juiceTree#onAfterAppend
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据完事件。    onAfterAppend: function () { }
         *@event
         */
        onAfterAppend:function () {
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否以动画的形式显示，true，以动画的形式显示；false，不以动画的形式显示。
         * @default  0
         * @type Number
         */
        slide:true,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根节点id的值。
         * @default  0
         * @type Number
         */
        iconFieldName:'icon',
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否允许拖拽，false，不允许;true,为允许。
         * @default  false
         * @type Boolean
         */
        nodeDraggable:false,
        nodeDraggingRender:null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否点击展开/收缩 按钮时才有效。
         * @default  true
         * @type Boolean
         */
        btnClickToToggleOnly:true
    };

    //接口方法扩展   预留接口方法扩展，可供用户自行扩展
    /**
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;juiceMethos.Tree,预留接口方法扩展，可供用户自行扩展。
     * @name  juiceTree#Tree
     * @function
     */
    $.juiceMethos.Tree = $.juiceMethos.Tree || {};

    $.jui.controls.Tree = function (element, options)
    {
        $.jui.controls.Tree.base.constructor.call(this, element, options);
    };
    $.jui.controls.Tree.juiceExtend($.jui.core.UIComponent, {
        _extendMethods: function ()
        {
            return $.juiceMethos.Tree;
        },
        _init: function ()
        {
            $.jui.controls.Tree.base._init.call(this);
            var g = this, p = this.options;
            this._copyProperty(p, $(this.element));
            if (p.single) p.autoCheckboxEven = false;
        },
        _render:function () {
            var g = this, p = this.options;
            g.set(p, true);
            g.tree = $(g.element);
            g.tree.addClass('l-tree');
            g.sysAttribute = ['isexpand', 'ischecked', 'href', 'style'];
            g.loading = $("<div class='l-tree-loading'></div>");
            g.tree.after(g.loading);
            g.data = [];
            g.maxOutlineLevel = 1;
            g.treedataindex = 0;
            g._applyTree();
            g._setTreeEven();

            g.set(p, false);
        },
        _setTreeLine:function (value) {
            if (value) this.tree.removeClass("l-tree-noline");
            else this.tree.addClass("l-tree-noline");
        },
        _setUrl:function (url) {
            if (url) this.loadData(null, url);
        },
        _setData:function (data) {
            if (data) this.append(null, data);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置树所对应的静态数据。
         * @name  juiceTree#setData
         * @function
         * @param data
         * data - 树节点的json对象
         * @example   <b>示例:</b> <br>
         *        (function ($) {
         *            setData: function(data){
         *                  this.set('data', data);
         *            }
         *        })(jQuery);
         */
        setData:function (data) {
            this.set('data', data);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取setData中的数据data。
         * @name  juiceTree#getData
         * @function
         * @param data
         * data - 树节点的json对象
         * @return data  返回当前获取的数据
         * @example   <b>示例:</b> <br>
         *         (function ($) {
         *            getData: function(data){
         *                  return this.data);
         *            }
         *        })(jQuery);
         */
        getData:function () {
            return this.data;
        },

        getRoot:function(){
            var g = this;
            var node = {};
            node.data = g._getDataNodeByTreeDataIndex(g.data, "0");
            return node;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否包含子节点。
         * @name  juiceTree#hasChildren
         * @function
         * @param treenodedata
         * treenodedata - 树节点的json对象
         * @return  <b>data</b>  返回true 或 false
         * @example   <b>示例:</b> <br>
         *         (function ($) {
         *            hasChildren: function(treenodedata){
         *            ...
         *            return treenodedata.children ? true : false;
         *            }
         *          })(jQuery);
         */
        hasChildren:function (treenodedata) {
            if (this.options.isLeaf) return this.options.isLeaf(treenodedata);
            if("isLeaf" in treenodedata)  return (treenodedata.isLeaf!="true"&&treenodedata.isLeaf!=true);
            return treenodedata.children ? true : false;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取父节点数据。
         * @name  juiceTree#getParent
         * @function
         * @param treenode,level
         * treenode - 树节点对象
         * level -节点层级
         * @return  返回树节点数据
         * @example   <b>示例:</b> <br>
         *         (function ($) {
         *           getParent:function (treenode, level) {
         *            ...
         *            return "";
         *            }
         *           })(jQuery);
         */
        getParent:function (treenode, level) {
            var g = this;
            treenode = g.getNodeDom(treenode);
            var parentTreeNode = g.getParentTreeItem(treenode, level);
            if (!parentTreeNode) return null;
            var parentIndex = $(parentTreeNode).attr("treedataindex");
            return g._getDataNodeByTreeDataIndex(parentIndex);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取父节点。
         * @name  juiceTree#getParentTreeItem
         * @function
         * @param treenode,level
         * treenode - 树节点对象
         * level -节点层级
         * @return  返回父节点信息
         * @example   <b>示例:</b> <br>
         *          (function ($) {
         *           getParentTreeItem:function (treenode, level) {
         *            ...
         *            return "";
         *            }
         *           })(jQuery);
         */
        getParentTreeItem:function (treenode, level) {
            var g = this;
            treenode = g.getNodeDom(treenode);
            var treeitem = $(treenode);
            if (treeitem.parent().hasClass("l-tree"))
                return null;
            if (level == undefined) {
                if (treeitem.parent().parent("li").length == 0)
                    return null;
                return treeitem.parent().parent("li")[0];
            }
            var currentLevel = parseInt(treeitem.attr("outlinelevel"));
            var currenttreeitem = treeitem;
            for (var i = currentLevel - 1; i >= level; i--) {
                currenttreeitem = currenttreeitem.parent().parent("li");
            }
            return currenttreeitem[0];
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取所有被勾选或未被勾选节点的JSON数据对象集合。
         * @name  juiceTree#getChecked
         * @function
         * @return <b>nodes</b> 返回一个nodes数组
         * @example   <b>示例:</b> <br>
         *       (function ($) {
         *           getChecked:function () {
         *            ...
         *            return nodes;
         *            }
         *          })(jQuery);
         */
        getChecked:function () {
            var g = this, p = this.options;
            if (!this.options.checkbox) return null;
            var nodes = [];
            $(".l-checkbox-checked", g.tree).parent().parent("li").each(function () {
                var treedataindex = parseInt($(this).attr("treedataindex"));
                nodes.push({ target:this, data:g._getDataNodeByTreeDataIndex(g.data, treedataindex) });
            });
            $(".l-checkbox-incomplete", g.tree).parent().parent("li").each(function () {
                var treedataindex = parseInt($(this).attr("treedataindex"));
                nodes.push({ target:this, data:g._getDataNodeByTreeDataIndex(g.data, treedataindex) });
            });
            return nodes;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取被选中的节点的JSON数据对象。
         * @name  juiceTree#getSelected
         * @function
         * @return
         * @example   <b>示例:</b> <br>
         *      (function ($) {
         *           getSelected:function () {
         *            ...
         *            return "";
         *            }
         *        })(jQuery);
         */
        getSelected:function () {
            var g = this, p = this.options;
            var node = {};
            node.target = $(".l-selected", g.tree).parent("li")[0];
            if (node.target) {
                var treedataindex = parseInt($(node.target).attr("treedataindex"));
                node.data = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                return node;
            }
            return null;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;升级为父节点级别。
         * @name  juiceTree#upgrade
         * @function
         * @param treeNode
         * treeNode - 树节点对象
         * @example   <b>示例:</b> <br>
         *      (function ($) {
         *           upgrade:function (treeNode) {
         *            ...
         *            }
         *        })(jQuery);
         */
        upgrade:function (treeNode) {
            var g = this, p = this.options;
            $(".lineBtn", treeNode).each(function () {
                $(this).removeClass("lineBtn").addClass("switch btnbox roots_open ");
            });
            $(".l-note-last", treeNode).each(function () {
                $(this).removeClass("l-note-last").addClass("l-expandable-open");
            });
            $("." + g._getChildNodeClassName(), treeNode).each(function () {
                $(this)
                    .removeClass(g._getChildNodeClassName())
                    .addClass(g._getParentNodeClassName(true));
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;降级为叶节点级别。
         * @name  juiceTree#demotion
         * @function
         * @param treeNode
         * treeNode - 树节点对象
         * @example   <b>示例:</b> <br>
         *      (function ($) {
         *           demotion:function (treeNode) {
         *            ...
         *            }
         *        })(jQuery);
         */
        demotion:function (treeNode) {
            var g = this, p = this.options;
            if (!treeNode && treeNode[0].tagName.toLowerCase() != 'li') return;
            var islast = $(treeNode).hasClass("l-last");
            $(".l-expandable-open", treeNode).each(function () {
                $(this).removeClass("l-expandable-open")
                    .addClass(islast ? "l-note-last" : "l-note");
            });
            $(".l-expandable-close", treeNode).each(function () {
                $(this).removeClass("l-expandable-close")
                    .addClass(islast ? "l-note-last" : "l-note");
            });
            $("." + g._getParentNodeClassName(true), treeNode).each(function () {
                $(this)
                    .removeClass(g._getParentNodeClassName(true))
                    .addClass(g._getChildNodeClassName());
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收缩所有的树节点。
         * @name  juiceTree#collapseAll
         * @function
         * @example   <b>示例:</b> <br>
         *   //将所有的树节点收缩
         *    $('#myTree').omTree('collapseAll');
         */
        collapseAll:function () {
            var g = this, p = this.options;
            $(".l-expandable-open", g.tree).click();
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;展开所有的树节点。
         * @name  juiceTree#expandAll
         * @function
         * @example   <b>示例:</b> <br>
         *   //将所有的树节点收缩
         *    $('#myTree').omTree('expandAll');
         */
        expandAll:function () {
            var g = this, p = this.options;
            $(".l-expandable-close", g.tree).click();
        },
        /**
         *@name   juiceTree#onLoad
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选择前触发事件。   onLoad:function (node, data) { }
         *@event
         * @param node,data
         * node - 树节点对象
         * data - 树节点的数据
         *@example   <b>示例:</b> <br>
         *          onLoad:function (node, data)
         *          {
         *              ...
         *          };
         */
        onLoad:function (node, data) {
            if (!data) return;
            this.loading.hide();
            this.append(node, data);
            if (node) {
                node.isLoaded = true;
            }
            this.trigger('success', [data]);
        },
        onError:function (textStatus, errorThrown) {
            try {
                g.loading.hide();
                g.trigger('error', [XMLHttpRequest, textStatus, errorThrown]);
            }
            catch (e) {

            }
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求服务器,加载数据。
         * @name  juiceTree#loadData
         * @function
         * @param node,url,param
         * node - 树节点对象
         * url - 数据源url
         */
        loadData:function (node, url, param) {
            var g = this, p = this.options;
            p.url = url;
            g.loading.show();
            var ajaxtype = param ? "post" : "get";
            param = param || [];
//            p.params = param;
            if(g.initParams){
                g.initParams(p,node);
            }
            p.param = p.param||{};
            $.extend(p.param,node);
            //请求服务器
            $.jui.loadData(g, node);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;清空当前对象。
         * @name  juiceTree#clear
         * @function
         */
        clear:function () {
            var g = this, p = this.options;
            //g.tree.html("");
            $("> li", g.tree).each(function () {
                g.remove(this);
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取节点Dom属性。
         * @name  juiceTree#getNodeDom
         * @function
         * @param [nodeParm] 节点所属类型
         * @return nodeParm
         */
        getNodeDom:function (nodeParm) {
            var g = this, p = this.options;
            if (nodeParm == null) return nodeParm;
            if (typeof (nodeParm) == "string" || typeof (nodeParm) == "number") {
                return $("li[treedataindex=" + nodeParm + "]", g.tree).get(0);
            }
            else if (typeof (nodeParm) == "object" && 'treedataindex' in nodeParm) //nodedata
            {
                return g.getNodeDom(nodeParm['treedataindex']);
            }
            return nodeParm;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除树节点。
         * @name  juiceTree#remove
         * @function
         * @param [treeNode] 树节点
         */
        remove:function (treeNode) {
            var g = this, p = this.options;
            treeNode = g.getNodeDom(treeNode);
            var treedataindex = parseInt($(treeNode).attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            if (treenodedata) g._setTreeDataStatus([treenodedata], 'delete');
            var parentNode = g.getParentTreeItem(treeNode);
            //复选框处理
            if (p.checkbox) {
                g._setParentCheckboxStatus($(treeNode));
            }
            $(treeNode).remove();
            g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
        },
        _updateStyle:function (ul) {
            var g = this, p = this.options;
            var itmes = $(" > li", ul);
            var treeitemlength = itmes.length;
            if (!treeitemlength) return;
            //遍历设置子节点的样式
            itmes.each(function (i, item) {
                if (i == 0 && !$(this).hasClass("l-first"))
                    $(this).addClass("l-first");
                if (i == treeitemlength - 1 && !$(this).hasClass("l-last"))
                    $(this).addClass("l-last");
                if (i == 0 && i == treeitemlength - 1)
                    $(this).addClass("l-onlychild");
                $("> div .l-note,> div .l-note-last", this)
                    .removeClass("l-note l-note-last")
                    .addClass(i == treeitemlength - 1 ? "l-note-last" : "l-note");
                g._setTreeItem(this, { isLast:i == treeitemlength - 1 });
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更改树节点数据。
         * @name  juiceTree#update
         * @function
         * @param   domnode, newnodedata
         *   &nbsp;&nbsp;&nbsp; domnode - 原始节点数据；
         *   &nbsp;&nbsp;&nbsp; newnodedata - 更改后节点数据；
         */
        //@param [domnode] dom节点(li)、节点数据 或者节点 dataindex
        update:function (domnode, newnodedata) {
            var g = this, p = this.options;
            domnode = g.getNodeDom(domnode);
            var treedataindex = parseInt($(domnode).attr("treedataindex"));
            nodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            for (var attr in newnodedata) {
                nodedata[attr] = newnodedata[attr];
                if (attr == p.textFieldName) {
                    $("> .l-body > span", domnode).text(newnodedata[attr]);
                }
            }
        },

        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;增加节点集合。
         * @name  juiceTree#append
         * @function
         * @param [newdata] 数据集合 Array
         * @param [parentNode] dom节点(li)、节点数据 或者节点 dataindex
         * @param [nearNode] 附加到节点的上方/下方(非必填)
         * @param [isAfter] 附加到节点的下方(非必填)
         */
        append:function (parentNode, newdata, nearNode, isAfter) {
            var g = this, p = this.options;

            parentNode = g.getNodeDom(parentNode);
            if (g.trigger('beforeAppend', [parentNode, newdata]) == false) return false;
            if (!newdata || !newdata.length) return false;
            if (p.idFieldName && p.parentIDFieldName)
                newdata = g.arrayToTree(newdata, p.idFieldName, p.parentIDFieldName);
            g._addTreeDataIndexToData(newdata);
            g._setTreeDataStatus(newdata, 'add');
            if (nearNode != null) {
                nearNode = g.getNodeDom(nearNode);
            }
            g.trigger('append', [parentNode, newdata]);
            g._appendData(parentNode, newdata);
            if (parentNode == null)//增加到根节点
            {
                var gridhtmlarr = g._getTreeHTMLByData(newdata, 1, [], false);
                gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
                if (nearNode != null) {
                    $(nearNode)[isAfter ? 'after' : 'before'](gridhtmlarr.join(''));
                    g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
                }
                else {
                    //remove last node class
                    if ($("> li:last", g.tree).length > 0)
                        g._setTreeItem($("> li:last", g.tree)[0], { isLast:false });
                    g.tree.append(gridhtmlarr.join(''));
                }
                $(".l-body", g.tree).hover(function () {
                    $(this).addClass("l-over");
                }, function () {
                    $(this).removeClass("l-over");
                });

                g._upadteTreeWidth();
                g.trigger('afterAppend', [parentNode, newdata])
                return;
            }
            var treeitem = $(parentNode);
            var outlineLevel = parseInt(treeitem.attr("outlinelevel"));

            var hasChildren = $("> ul", treeitem).length > 0;
            if (!hasChildren) {
                treeitem.append("<ul class='l-children'></ul>");
                //设置为父节点
                g.upgrade(parentNode);
            }
            var isLast = [];
            for (var i = 1; i <= outlineLevel - 1; i++) {
                var currentParentTreeItem = $(g.getParentTreeItem(parentNode, i));
                isLast.push(currentParentTreeItem.hasClass("l-last"));
            }
            isLast.push(treeitem.hasClass("l-last"));
            var gridhtmlarr = g._getTreeHTMLByData(newdata, outlineLevel + 1, isLast, true);
            gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
            if (nearNode != null) {
                $(nearNode)[isAfter ? 'after' : 'before'](gridhtmlarr.join(''));
                g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
            }
            else {
                //remove last node class
                if ($("> .l-children > li:last", treeitem).length > 0)
                    g._setTreeItem($("> .l-children > li:last", treeitem)[0], { isLast:false });
                $(">.l-children", parentNode).append(gridhtmlarr.join(''));
            }
            g._upadteTreeWidth();
            $(">.l-children .l-body", parentNode).hover(function () {
                $(this).addClass("l-over");
            }, function () {
                $(this).removeClass("l-over");
            });
            g.trigger('afterAppend', [parentNode, newdata]);
        },
        _getDataLength:function(parent,datas,length,l){
            var g = this,p=this.options;
            var maxlevel = g.maxOutlineLevel;
            length = length||0;

            $(datas).each(function(i,item){
                if(item.text){
                    var strLength = item.text.replace(/[^\x00-\xff]/g, '__').length;
                    if(length<strLength){
                        length = strLength;
                    }
                }
                if(parent){
                    item.level = parent.level+1;
                }else{
                    item.level = 1;
                }
                if(item.children){
                    length = g._getDataLength(item,item.children,length);
                }
            });
            return length;
        },

        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消选择对象。
         * @name  juiceTree#cancelSelect
         * @function
         * @param [nodeParm] dom节点(li)、节点数据 或者节点 dataindex
         */
        cancelSelect:function (nodeParm) {
            var g = this, p = this.options;
            var domNode = g.getNodeDom(nodeParm);
            var treeitem = $(domNode);
            var treedataindex = parseInt(treeitem.attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            var treeitembody = $(">div:first", treeitem);
            if (p.checkbox)
                $(".l-checkbox", treeitembody).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
            else
                treeitembody.removeClass("l-selected");
            g.trigger('cancelSelect', [
                { data:treenodedata, target:treeitem[0]}
            ]);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择节点。
         * @name  juiceTree#selectNode
         * @function
         * @param [selectNodeParm] 条件函数、Dom节点或ID值
         */
        //选择节点(参数：条件函数、Dom节点或ID值)
        selectNode:function (selectNodeParm) {
            var g = this, p = this.options;
            var clause = null;
            if (typeof (selectNodeParm) == "function") {
                clause = selectNodeParm;
            }
            else if (typeof (selectNodeParm) == "object") {
                var treeitem = $(selectNodeParm);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                var treeitembody = $(">div:first", treeitem);
                if (p.checkbox)
                    $(".l-checkbox", treeitembody).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
                else
                    treeitembody.addClass("l-selected");

                g.trigger('select', [
                    { data:treenodedata, target:treeitem[0]}
                ]);
                return;
            }
            else {
                /**
                 * @ignore
                 */
                clause = function (data) {
                    if (!data[p.idFieldName]) return false;
                    return data[p.idFieldName].toString() == selectNodeParm.toString();
                };
            }
            $("li", g.tree).each(function () {
                var treeitem = $(this);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                if (clause(treenodedata, treedataindex)) {
                    g.selectNode(this);
                }
                else {
                    g.cancelSelect(this);
                }
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过id来获取文本内容。
         * @name  juiceTree#getTextByID
         * @function
         * @param [id]  id值。
         */
        getTextByID:function (id) {
            var g = this, p = this.options;
            var data = g.getDataByID(id);
            if (!data) return null;
            return data[p.textFieldName];
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过id来获取相应数据。
         * @name  juiceTree#getDataByID
         * @function
         * @param [id]  id值。
         */
        getDataByID:function (id) {
            var g = this, p = this.options;
            var data = null;
            $("li", g.tree).each(function () {
                if (data) return;
                var treeitem = $(this);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                if (treenodedata[p.idFieldName].toString() == id.toString()) {
                    data = treenodedata;
                }
            });
            return data;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;将ID、ParentID这种数据格式转换为树格式。
         * @name  juiceTree#arrayToTree
         * @function
         * @param [data]  数据。
         * @param [id]  当前节点id值。
         * @param [pid]  父节点id。
         */
        arrayToTree:function (data, id, pid)
        {
            if (!data || !data.length) return [];
            var targetData = [];                    //存储数据的容器(返回)
            var records = {};
            var itemLength = data.length;           //数据集合的个数
            for (var i = 0; i < itemLength; i++) {
                var o = data[i];
                records[o[id]] = o;
            }
            for (var i = 0; i < itemLength; i++) {
                var currentData = data[i];
                var parentData = records[currentData[pid]];
                if (!parentData) {
                    targetData.push(currentData);
                    continue;
                }
                parentData.children = parentData.children || [];
                parentData.children.push(currentData);
                if(parentData.ischecked&&!currentData.ischecked){
                    parentData.halfchecked = true;
                }
            }
            return targetData;
        },
        //根据数据索引获取数据
        _getDataNodeByTreeDataIndex:function (data, treedataindex) {
            var g = this, p = this.options;
            for (var i = 0; i < data.length; i++) {
                if (data[i].treedataindex == treedataindex)
                    return data[i];
                if (data[i].children) {
                    var targetData = g._getDataNodeByTreeDataIndex(data[i].children, treedataindex);
                    if (targetData) return targetData;
                }
            }
            return null;
        },
        //设置数据状态
        _setTreeDataStatus:function (data, status) {
            var g = this, p = this.options;
            $(data).each(function () {
                this[p.statusName] = status;
                if (this.children) {
                    g._setTreeDataStatus(this.children, status);
                }
            });
        },
        //设置data 索引
        _addTreeDataIndexToData:function (data) {
            var g = this, p = this.options;
            $(data).each(function () {
                if (this.treedataindex != undefined) return;
                this.treedataindex = g.treedataindex++;
                if (this.children) {
                    g._addTreeDataIndexToData(this.children);
                }
            });
        },
        _addToNodes:function (data) {
            var g = this, p = this.options;
            g.nodes = g.nodes || [];
            if ($.inArray(data, g.nodes) == -1)
                g.nodes.push(data);
            if (data.children) {
                $(data.children).each(function (i, item) {
                    g._addToNodes(item);
                });
            }
        },
        //添加项到g.data
        _appendData:function (treeNode, data) {
            var g = this, p = this.options;

            var treedataindex = parseInt($(treeNode).attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            if (g.treedataindex == undefined) g.treedataindex = 0;
            if (treenodedata && treenodedata.children == undefined) treenodedata.children = [];
            $(data).each(function (i, item) {
                if (treenodedata)
                    treenodedata.children[treenodedata.children.length] = item;
                else
                    g.data[g.data.length] = item;
                g._addToNodes(item);
            });
        },
        _setTreeItem:function (treeNode, options) {
            var g = this, p = this.options;
            if (!options) return;
            treeNode = g.getNodeDom(treeNode);
            var treeItem = $(treeNode);
            var outlineLevel = parseInt(treeItem.attr("outlinelevel"));
            if (options.isLast != undefined) {
                if (options.isLast == true) {
                    treeItem.removeClass("l-last").addClass("l-last");
                    $("> div .l-note", treeItem).removeClass("l-note").addClass("l-note-last");
                    $(".l-children li", treeItem)
                        .find(".l-box:eq(" + (outlineLevel - 1) + ")")
                        .removeClass("l-line");
                }
                else if (options.isLast == false) {
                    treeItem.removeClass("l-last");
                    $("> div .l-note-last", treeItem).removeClass("l-note-last").addClass("l-note");

                    $(".l-children li", treeItem)
                        .find(".l-box:eq(" + (outlineLevel - 1) + ")")
                        .removeClass("l-line")
                        .addClass("l-line");
                }
            }
        },
        _upadteTreeWidth:function () {
            var g = this, p = this.options;
            var treeWidth = g.maxOutlineLevel * 22;
            if (p.checkbox) treeWidth += 22;
            if (p.parentIcon || p.childIcon) treeWidth += 22;
            p.nodeWidth = g._getDataLength(null,g.data);
            treeWidth += p.nodeWidth;
//            g.tree.width(treeWidth);
        },
        _getChildNodeClassName:function () {
            var g = this, p = this.options;
            return 'l-tree-icon-' + p.childIcon;
        },
        _getParentNodeClassName:function (isOpen) {
            var g = this, p = this.options;
            var nodeclassname = 'l-tree-icon-' + p.parentIcon;
            if (isOpen) nodeclassname += '-open';
            return nodeclassname;
        },
        //根据data生成最终完整的tree html
        _getTreeHTMLByData:function (data, outlineLevel, isLast, isExpand) {
            var g = this, p = this.options;
            if (g.maxOutlineLevel < outlineLevel)
                g.maxOutlineLevel = outlineLevel;
            isLast = isLast || [];
            outlineLevel = outlineLevel || 1;
            var treehtmlarr = [];
            if (!isExpand) treehtmlarr.push('<ul class="l-children" style="display:none">');
            else treehtmlarr.push("<ul class='l-children'>");
            var maxDataLength = 0;
            for (var i = 0; i < data.length; i++) {
                var isFirst = i == 0;
                var isLastCurrent = i == data.length - 1;
                var isExpandCurrent = true;
                var o = data[i];

                if (!o.isexpand || o.isexpand == false || o.isexpand == "false") isExpandCurrent = false;

                treehtmlarr.push('<li ');
                if (o.treedataindex != undefined)
                    treehtmlarr.push('treedataindex="' + o.treedataindex + '" ');
                if (isExpandCurrent)
                    treehtmlarr.push('isexpand=' + o.isexpand + ' ');
                treehtmlarr.push('outlinelevel=' + outlineLevel + ' ');
                //增加属性支持
                for (var j = 0; j < g.sysAttribute.length; j++) {
                    if ($(this).attr(g.sysAttribute[j]))
                        data[dataindex][g.sysAttribute[j]] = $(this).attr(g.sysAttribute[j]);
                }
                for (var j = 0; j < p.attribute.length; j++) {
                    if (o[p.attribute[j]])
                        treehtmlarr.push(p.attribute[j] + '="' + o[p.attribute[j]] + '" ');
                }

                //css class
                treehtmlarr.push('class="');
                isFirst && treehtmlarr.push('l-first ');
                isLastCurrent && treehtmlarr.push('l-last ');
                isFirst && isLastCurrent && treehtmlarr.push('l-onlychild ');
                treehtmlarr.push('"');
                treehtmlarr.push('>');
                treehtmlarr.push('<div class="l-body">');
                for (var k = 0; k <= outlineLevel - 2; k++) {
//                    if (isLast[k]) treehtmlarr.push('<div class="l-box"></div>');
//                    else treehtmlarr.push('<div class="l-box l-line"></div>');
                }
                if (g.hasChildren(o)) {
                    if (isExpandCurrent) treehtmlarr.push('<div class="l-box l-expandable-open"></div>');
                    else treehtmlarr.push('<div class="l-box l-expandable-close"></div>');
                    if (p.checkbox) {
                        if(o.halfchecked)
                            treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-incomplete"></div>');
                        else if (o.ischecked)
                            treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-checked"></div>');
                        else
                            treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-unchecked"></div>');
                    }
                    if (p.parentIcon) {
                        //node icon
                        treehtmlarr.push('<div class="l-box l-tree-icon ');
                        treehtmlarr.push(g._getParentNodeClassName(p.parentIcon ? true : false) + " ");
                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('l-tree-icon-none');
                        treehtmlarr.push('">');
                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('<img src="' + o[p.iconFieldName] + '" />');
                        treehtmlarr.push('</div>');
                    }
                }
                else {
                    if (isLastCurrent) treehtmlarr.push('<div class="l-box l-note-last"></div>');
                    else treehtmlarr.push('<div class="l-box l-note"></div>');
                    if (p.checkbox) {
                        if(o.halfchecked)
                            treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-incomplete"></div>');
                        else if (o.ischecked)
                            treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-checked"></div>');
                        else
                            treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-unchecked"></div>');
                    }
                    if (p.childIcon) {
                        //node icon
                        treehtmlarr.push('<div class="l-box l-tree-icon ');
                        treehtmlarr.push(g._getChildNodeClassName() + " ");
                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('l-tree-icon-none');
                        treehtmlarr.push('">');
                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('<img src="' + o[p.iconFieldName] + '" />');
                        treehtmlarr.push('</div>');
                    }
                }

                treehtmlarr.push('<span>' + o[p.textFieldName] + '</span></div>');
                if (g.hasChildren(o)) {
                    var isLastNew = [];
                    for (var k = 0; k < isLast.length; k++) {
                        isLastNew.push(isLast[k]);
                    }
                    isLastNew.push(isLastCurrent);
                    if (o.children) {
                        treehtmlarr.push(g._getTreeHTMLByData(o.children, outlineLevel + 1, isLastNew, isExpandCurrent).join(''));
                    }
                }
                treehtmlarr.push('</li>');
            }
            treehtmlarr.push("</ul>");
            return treehtmlarr;

        },
        //根据简洁的html获取data
        _getDataByTreeHTML:function (treeDom) {
            var g = this, p = this.options;
            var data = [];
            $("> li", treeDom).each(function (i, item) {
                var dataindex = data.length;
                data[dataindex] =
                {
                    treedataindex:g.treedataindex++
                };
                data[dataindex][p.textFieldName] = $("> span,> a", this).html();
                for (var j = 0; j < g.sysAttribute.length; j++) {
                    if ($(this).attr(g.sysAttribute[j]))
                        data[dataindex][g.sysAttribute[j]] = $(this).attr(g.sysAttribute[j]);
                }
                for (var j = 0; j < p.attribute.length; j++) {
                    if ($(this).attr(p.attribute[j]))
                        data[dataindex][p.attribute[j]] = $(this).attr(p.attribute[j]);
                }
                if ($("> ul", this).length > 0) {
                    data[dataindex].children = g._getDataByTreeHTML($("> ul", this));
                }
            });
            return data;
        },
        _applyTree:function () {
            var g = this, p = this.options;
            g.data = g._getDataByTreeHTML(g.tree);
            var gridhtmlarr = g._getTreeHTMLByData(g.data, 1, [], true);
            gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
            g.tree.html(gridhtmlarr.join(''));
            g._upadteTreeWidth();
            $(".l-body", g.tree).hover(function () {
                $(this).addClass("l-over");
            }, function () {
                $(this).removeClass("l-over");
            });
        },
        _applyTreeEven:function (treeNode) {
            var g = this, p = this.options;
            $("> .l-body", treeNode).hover(function () {
                $(this).addClass("l-over");
            }, function () {
                $(this).removeClass("l-over");
            });
        },
        _getSrcElementByEvent:function (e) {
            var g = this;
            var obj = (e.target || e.srcElement);
            var tag = obj.tagName.toLowerCase();
            var jobjs = $(obj).parents().add(obj);
            var fn = function (parm) {
                for (var i = jobjs.length - 1; i >= 0; i--) {
                    if ($(jobjs[i]).hasClass(parm)) return jobjs[i];
                }
                return null;
            };
            if (jobjs.index(this.element) == -1) return { out:true };
            var r = {
                tree:fn("l-tree"),
                node:fn("l-body"),
                checkbox:fn("l-checkbox"),
                icon:fn("l-tree-icon"),
                text:tag == "span"
            };
            if (r.node) {
                var treedataindex = parseInt($(r.node).parent().attr("treedataindex"));
                r.data = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            }
            return r;
        },
        _setTreeEven:function () {
            var g = this, p = this.options;
            if (g.hasBind('contextmenu')) {
                g.tree.bind("contextmenu", function (e) {
                    var obj = (e.target || e.srcElement);
                    var treeitem = null;
                    if (obj.tagName.toLowerCase() == "a" || obj.tagName.toLowerCase() == "span" || $(obj).hasClass("l-box"))
                        treeitem = $(obj).parent().parent();
                    else if ($(obj).hasClass("l-body"))
                        treeitem = $(obj).parent();
                    else if (obj.tagName.toLowerCase() == "li")
                        treeitem = $(obj);
                    if (!treeitem) return;
                    var treedataindex = parseInt(treeitem.attr("treedataindex"));
                    var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                    return g.trigger('contextmenu', [
                        { data:treenodedata, target:treeitem[0] },
                        e
                    ]);
                });
            }
            g.tree.click(function (e) {
                var obj = (e.target || e.srcElement);
                var treeitem = null;
                if (obj.tagName.toLowerCase() == "a" || obj.tagName.toLowerCase() == "span" || $(obj).hasClass("l-box"))
                    treeitem = $(obj).parent().parent();
                else if ($(obj).hasClass("l-body"))
                    treeitem = $(obj).parent();
                else
                    treeitem = $(obj);
                if (!treeitem) return;
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                var treeitembtn = $("div.l-body:first", treeitem).find("div.l-expandable-open:first,div.l-expandable-close:first");
                var clickOnTreeItemBtn = $(obj).hasClass("l-expandable-open") || $(obj).hasClass("l-expandable-close");
                if (!$(obj).hasClass("l-checkbox") && !clickOnTreeItemBtn) {
                    if ($(">div:first", treeitem).hasClass("l-selected")) {
                        if (g.trigger('beforeCancelSelect', [
                            { data:treenodedata, target:treeitem[0]}
                        ]) == false)
                            return false;

                        $(">div:first", treeitem).removeClass("l-selected");
                        g.trigger('cancelSelect', [
                            { data:treenodedata, target:treeitem[0]}
                        ]);
                    }
                    else {
                        if (g.trigger('beforeSelect', [
                            { data:treenodedata, target:treeitem[0]}
                        ]) == false)
                            return false;
                        $(".l-body", g.tree).removeClass("l-selected");
                        $(">div:first", treeitem).addClass("l-selected");
                        g.trigger('select', [
                            { data:treenodedata, target:treeitem[0]}
                        ])
                    }
                }
                //chekcbox even
                if ($(obj).hasClass("l-checkbox")) {
                    if (p.autoCheckboxEven) {
                        //状态：未选中
                        if ($(obj).hasClass("l-checkbox-unchecked")) {
                            $(obj).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
                            $(".l-children .l-checkbox", treeitem)
                                .removeClass("l-checkbox-incomplete l-checkbox-unchecked")
                                .addClass("l-checkbox-checked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                true
                            ]);
                        }
                        //状态：选中
                        else if ($(obj).hasClass("l-checkbox-checked")) {
                            $(obj).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                            $(".l-children .l-checkbox", treeitem)
                                .removeClass("l-checkbox-incomplete l-checkbox-checked")
                                .addClass("l-checkbox-unchecked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                false
                            ]);
                        }
                        //状态：未完全选中
                        else if ($(obj).hasClass("l-checkbox-incomplete")) {
                            $(obj).removeClass("l-checkbox-incomplete").addClass("l-checkbox-checked");
                            $(".l-children .l-checkbox", treeitem)
                                .removeClass("l-checkbox-incomplete l-checkbox-unchecked")
                                .addClass("l-checkbox-checked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                true
                            ]);
                        }
                        g._setParentCheckboxStatus(treeitem);
                    }
                    else {
                        //状态：未选中
                        if ($(obj).hasClass("l-checkbox-unchecked")) {
                            $(obj).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
                            //是否单选
                            if (p.single) {
                                $(".l-checkbox", g.tree).not(obj).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                            }
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                true
                            ]);
                        }
                        //状态：选中
                        else if ($(obj).hasClass("l-checkbox-checked")) {
                            $(obj).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                false
                            ]);
                        }
                    }
                }
                //状态：已经张开
                else if (treeitembtn.hasClass("l-expandable-open") && (!p.btnClickToToggleOnly || clickOnTreeItemBtn)) {
                    if (g.trigger('beforeCollapse', [
                        { data:treenodedata, target:treeitem[0]}
                    ]) == false)
                        return false;
                    treeitembtn.removeClass("l-expandable-open").addClass("l-expandable-close");
                    if (p.slide)
                        $("> .l-children", treeitem).slideToggle('fast');
                    else
                        $("> .l-children", treeitem).toggle();
                    $("> div ." + g._getParentNodeClassName(true), treeitem)
                        .removeClass(g._getParentNodeClassName(true))
                        .addClass(g._getParentNodeClassName());
                    g.trigger('collapse', [
                        { data:treenodedata, target:treeitem[0]}
                    ]);
                }
                //状态：没有张开
                else if (treeitembtn.hasClass("l-expandable-close") && (!p.btnClickToToggleOnly || clickOnTreeItemBtn)) {
                    if (g.trigger('beforeExpand', [
                        { data:treenodedata, target:treeitem[0]}
                    ]) == false)
                        return false;
                    treeitembtn.removeClass("l-expandable-close").addClass("l-expandable-open");
                    var callback = function () {
                        g.trigger('expand', [
                            { data:treenodedata, target:treeitem[0]}
                        ]);
                    };
//
                    if (!treenodedata.isLoaded && p.url) {
                        $("> .l-children", treeitem).toggle();
                        callback();
                        g.loadData(treenodedata, p.url, treenodedata);
                    } else if (p.slide) {
                        $("> .l-children", treeitem).slideToggle('fast', callback);
                    }
                    else {
                        $("> .l-children", treeitem).toggle();
                        callback();
                    }
                    $("> div ." + g._getParentNodeClassName(), treeitem)
                        .removeClass(g._getParentNodeClassName())
                        .addClass(g._getParentNodeClassName(true));
                }
                g.trigger('click', [
                    { data:treenodedata, target:treeitem[0]}
                ]);
            });

            //节点拖拽支持
            if ($.fn.juiceDrag && p.nodeDraggable) {
                g.nodeDroptip = $("<div class='l-drag-nodedroptip' style='display:none'></div>").appendTo('body');
                g.tree.juiceDrag({ revert:true, animate:false,
                    proxyX:20, proxyY:20,
                    proxy:function (draggable, e) {
                        var src = g._getSrcElementByEvent(e);
                        if (src.node) {
                            var content = "dragging";
                            if (p.nodeDraggingRender) {
                                content = p.nodeDraggingRender(draggable.draggingNodes, draggable, g);
                            }
                            else {
                                content = "";
                                var appended = false;
                                for (var i in draggable.draggingNodes) {
                                    var node = draggable.draggingNodes[i];
                                    if (appended) content += ",";
                                    content += node.text;
                                    appended = true;
                                }
                            }
                            var proxy = $("<div class='l-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div>" + content + "</div>").appendTo('body');
                            return proxy;
                        }
                    },
                    onRevert:function () {
                        return false;
                    },
                    onRendered:function () {
                        this.set('cursor', 'default');
                        g.children[this.id] = this;
                    },
                    onStartDrag:function (current, e) {
                        if (e.button == 2) return false;
                        this.set('cursor', 'default');
                        var src = g._getSrcElementByEvent(e);
                        if (src.checkbox) return false;
                        if (p.checkbox) {
                            var checked = g.getChecked();
                            this.draggingNodes = [];
                            for (var i in checked) {
                                this.draggingNodes.push(checked[i].data);
                            }
                            if (!this.draggingNodes || !this.draggingNodes.length) return false;
                        }
                        else {
                            this.draggingNodes = [src.data];
                        }
                        this.draggingNode = src.data;
                        this.set('cursor', 'move');
                        g.nodedragging = true;
                        this.validRange = {
                            top:g.tree.offset().top,
                            bottom:g.tree.offset().top + g.tree.height(),
                            left:g.tree.offset().left,
                            right:g.tree.offset().left + g.tree.width()
                        };
                    },
                    onDrag:function (current, e) {
                        var nodedata = this.draggingNode;
                        if (!nodedata) return false;
                        var nodes = this.draggingNodes ? this.draggingNodes : [nodedata];
                        if (g.nodeDropIn == null) g.nodeDropIn = -1;
                        var pageX = e.pageX;
                        var pageY = e.pageY;
                        var visit = false;
                        var validRange = this.validRange;
                        if (pageX < validRange.left || pageX > validRange.right
                            || pageY > validRange.bottom || pageY < validRange.top) {

                            g.nodeDropIn = -1;
                            g.nodeDroptip.hide();
                            this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes l-drop-add").addClass("l-drop-no");
                            return;
                        }
                        for (var i = 0, l = g.nodes.length; i < l; i++) {
                            var nd = g.nodes[i];
                            var treedataindex = nd['treedataindex'];
                            if (nodedata['treedataindex'] == treedataindex) visit = true;
                            if ($.inArray(nd, nodes) != -1) continue;
                            var isAfter = visit ? true : false;
                            if (g.nodeDropIn != -1 && g.nodeDropIn != treedataindex) continue;
                            var jnode = $("li[treedataindex=" + treedataindex + "] div:first", g.tree);
                            var offset = jnode.offset();
                            var range = {
                                top:offset.top,
                                bottom:offset.top + jnode.height(),
                                left:g.tree.offset().left,
                                right:g.tree.offset().left + g.tree.width()
                            };
                            if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom) {
                                var lineTop = offset.top;
                                if (isAfter) lineTop += jnode.height();
                                g.nodeDroptip.css({
                                    left:range.left,
                                    top:lineTop,
                                    width:range.right - range.left
                                }).show();
                                g.nodeDropIn = treedataindex;
                                g.nodeDropDir = isAfter ? "bottom" : "top";
                                if (pageY > range.top + 7 && pageY < range.bottom - 7) {
                                    this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-yes").addClass("l-drop-add");
                                    g.nodeDroptip.hide();
                                    g.nodeDropInParent = true;
                                }
                                else {
                                    this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-add").addClass("l-drop-yes");
                                    g.nodeDroptip.show();
                                    g.nodeDropInParent = false;
                                }
                                break;
                            }
                            else if (g.nodeDropIn != -1) {
                                g.nodeDropIn = -1;
                                g.nodeDropInParent = false;
                                g.nodeDroptip.hide();
                                this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes  l-drop-add").addClass("l-drop-no");
                            }
                        }
                    },
                    onStopDrag:function (current, e) {
                        var nodes = this.draggingNodes;
                        g.nodedragging = false;
                        if (g.nodeDropIn != -1) {
                            for (var i = 0; i < nodes.length; i++) {
                                var children = nodes[i].children;
                                if (children) {
                                    nodes = $.grep(nodes, function (node, i) {
                                        var isIn = $.inArray(node, children) == -1;
                                        return isIn;
                                    });
                                }
                            }
                            for (var i in nodes) {
                                var node = nodes[i];
                                if (g.nodeDropInParent) {
                                    g.remove(node);
                                    g.append(g.nodeDropIn, [node]);
                                }
                                else {
                                    g.remove(node);
                                    g.append(g.getParent(g.nodeDropIn), [node], g.nodeDropIn, g.nodeDropDir == "bottom")
                                }
                            }
                            g.nodeDropIn = -1;
                        }
                        g.nodeDroptip.hide();
                        this.set('cursor', 'default');
                    }
                });
            }
        },
        //递归设置父节点的状态
        _setParentCheckboxStatus:function (treeitem) {
            var g = this, p = this.options;
            //当前同级别或低级别的节点是否都选中了
            var isCheckedComplete = $(".l-checkbox-unchecked", treeitem.parent()).length == 0;
            //当前同级别或低级别的节点是否都没有选中
            var isCheckedNull = $(".l-checkbox-checked", treeitem.parent()).length == 0;
            if (isCheckedComplete) {
                treeitem.parent().prev().find(".l-checkbox")
                    .removeClass("l-checkbox-unchecked l-checkbox-incomplete")
                    .addClass("l-checkbox-checked");
            }
            else if (isCheckedNull) {
                treeitem.parent().prev().find("> .l-checkbox")
                    .removeClass("l-checkbox-checked l-checkbox-incomplete")
                    .addClass("l-checkbox-unchecked");
            }
            else {
                treeitem.parent().prev().find("> .l-checkbox")
                    .removeClass("l-checkbox-unchecked l-checkbox-checked")
                    .addClass("l-checkbox-incomplete");
            }
            if (treeitem.parent().parent("li").length > 0)
                g._setParentCheckboxStatus(treeitem.parent().parent("li"));
        }
    });


})(jQuery);