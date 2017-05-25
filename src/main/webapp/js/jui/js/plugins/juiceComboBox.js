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
     * @name   juiceComboBox
     * @class   juiceComboBox是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceComboBox &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceComboBox = function (options)
    {
        return $.jui.run.call(this, "juiceComboBox", arguments);
    };

    $.fn.juiceGetComboBoxManager = function ()
    {
        return $.jui.run.call(this, "juiceGetComboBoxManager", arguments);
    };

    $.juiceDefaults.ComboBox = /**@lends juiceComboBox#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否调整大小，true为调整，false为不调整。
         * @default true
         * @type Boolean
         */
        resize: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度设置。
         * @default ""
         * @type String
         */
        width:"",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否多选，true为多选，false为不多选。
         * @default  false
         * @type Boolean
         */
        isMultiSelect: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否选择复选框。
         * @default  false
         * @type Boolean
         */
        isShowCheckBox: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表格状态。
         * @default  false
         * @type Boolean
         */
        columns: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 下拉框宽度。
         * @default  0
         * @type Number
         */
        selectBoxWidth: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 下拉框高度。
         * @default  0
         * @type Number
         */
        selectBoxHeight: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择前事件。
         * @default  false
         * @type Boolean
         */
        onBeforeSelect: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择值事件。
         * @default  null
         * @type   Object
         */
        onSelected: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 输入值。
         * @default  null
         * @type   Object
         */
        initValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 输入文本。
         * @default  ""
         * @type   String
         */
        initText: "",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 文本宽度。
         * @default  0
         * @type   Number
         */
        textWidth:0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 域值。
         * @default  id
         * @type   String
         */
        valueField: 'id',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 文本域。
         * @default  text
         * @type   String
         */
        textField: 'text',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; id值。
         * @default  null
         * @type   String
         */
        valueFieldID: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否以动画的形式显示,true为以动画显示，false则表示不以动画显示。
         * @default  false
         * @type   Boolean
         */
        slide: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 以";"分割字符串。
         * @default  false
         * @type   Boolean
         */
        split: ";",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据。
         * @default  null
         * @type   Object
         */
        data: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 下拉框以树的形式显示，tree的参数跟juiceTree的参数一致。
         * @default  null
         * @type   Object
         */
        tree: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否只选择叶子。
         * @default  null
         * @type   Object
         */
        treeLeafOnly: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表格。
         * @default  null
         * @type   Object
         */
        grid: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; grid过滤。
         * @default  false
         * @type   Object
         */
        gridFilter:true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 类型。
         * @default  null
         * @type   Object
         */
        refType:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; id。
         * @default  null
         * @type   Object
         */
        refId:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 开始调整窗口大小时触发事件。
         * @default  null
         * @type   Object
         */
        onStartResize: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 结束调整窗口大小时触发事件。
         * @default  null
         * @type   Object
         */
        onEndResize: null,
        hideOnLoseFocus: true,
        forceLoad: false,
        validateName:"validateType",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源URL(需返回JSON)。
         * @default  ""
         * @type   String
         */
        url: "",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 操作成功时触发事件。
         * @default  null
         * @type   Object
         */
        onSuccess: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 操作失败时触发事件。
         * @default  null
         * @type   Object
         */
        onError: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 打开下拉框前事件，可以通过return false来阻止继续操作，利用这个参数可以用来调用其他函数，比如打开一个新窗口来选择值。
         * @default  null
         * @type   Object
         */
        onBeforeOpen: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 文本框显示html函数。
         * @default  null
         * @type   Object
         */
        render: null,

        /**
         * 树节点初始化值
         * @default  ""
         * @type   String
         */
        valuePrefix:"",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择框是否在附加到body,并绝对定位。
         * @default  true
         * @type   Boolean
         */
        absolute: true,

        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 缺省值。
         */
        defaultValue: null,

        /**
         * 编辑之后
         */
        onEndEdit:null,

        onBeforeEditor:null,

        joinStr:"",

        synAttrs:["op","dtype","entity","validateType"],
        /**
         * 数据提交类型，text：只提交显示至，value：只提交隐藏值，both：两者均提交
         */
        submitType:"both"
    };

    //扩展方法
    $.juiceMethos.ComboBox = $.juiceMethos.ComboBox || {};


    $.jui.controls.ComboBox = function (element, options)
    {
        $.jui.controls.ComboBox.base.constructor.call(this, element, options);
    };
    $.jui.controls.ComboBox.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'ComboBox';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.ComboBox;
        },

        _init: function ()
        {
            $.jui.controls.ComboBox.base._init.call(this);
            var p = this.options;
            this._copyProperty(p,$(this.element));
            p.width = p.textWidth ||p.width;
            //弹出树
            if(p.refType=="tree"&&p.refId){
                var tree = {};
                $.extend(tree,$.juiceDefaults.Tree,this.options.tree);
                this._copyProperty(tree,$("#" + p.refId));
                this.options.tree =tree;
            }
            //弹出grid
            if(p.refType=="grid"&&p.refId){
                var grid = {};
                $.extend(grid,$.juiceDefaults.Grid,this.options.grid);
                $.jui.controls.Grid.createParams(grid,$("#" + p.refId));
                this.options.grid = grid;
            }
            //自定义宽度
            if (p.columns)
            {
                p.isShowCheckBox = true;
            }
            if (p.isMultiSelect)
            {
                p.isShowCheckBox = true;
            }
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.data = p.data;
            g.inputText = null;
            g.select = null;
            g.textFieldID = "";
            g.valueFieldID = "";
            g.valueField = null; //隐藏域(保存值)
            //文本框初始化
            if (this.element.tagName.toLowerCase() == "input")
            {
//                this.element.readOnly = true;
                g.inputText = $(this.element);
                g.textFieldID = this.element.id;
            }
            else if (this.element.tagName.toLowerCase() == "select")
            {
                $(this.element).hide();
                g.select = $(this.element);
                p.isMultiSelect = false;
                p.isShowCheckBox = false;
                g.textFieldID = this.element.id + "_txt";
                g.inputText = $('<input type="text" readonly="true"/>');
                g.inputText.attr("id", g.textFieldID).insertAfter($(this.element));
            } else
            {
                //不支持其他类型
                return;
            }
            if (g.inputText[0].name == undefined) g.inputText[0].name = g.textFieldID;
            //隐藏域初始化
            g.valueField = null;
            if (p.valueFieldID)
            {
                g.valueField = $("#" + p.valueFieldID + ":input");
                if (g.valueField.length == 0) g.valueField = $('<input type="hidden"/>');
                g.valueField[0].id = g.valueField[0].name = p.valueFieldID;
            }
            else
            {
                g.valueField = $('<input type="hidden"/>');
                g.valueField[0].id = g.valueField[0].name = g.textFieldID + "_val";
            }

            if(p.submitType=="name"){
                g.valueField.removeAttr("name");
            }else if(p.submitType=="value"){
                g.inputText.removeAttr("name");
            }
            //属性拷贝
            for(var attr in p.synAttrs){
                if(attr!="id"||attr!="name"){
                    g.valueField.attr(p.synAttrs[attr],g.inputText.attr(p.synAttrs[attr]));
                }
            }
            if(g.inputText.attr(p.validateName)){
                g.inputText.removeAttr(p.validateName);
            }

            g.valueField.attr("error2Id",g.inputText[0].id);
            if (g.valueField[0].name == undefined) g.valueField[0].name = g.valueField[0].id;
            //开关
            g.link = $('<div class="l-trigger"><div class="l-trigger-icon"></div></div>');
            //下拉框
            g.selectBox = $('<div class="l-box-select"><div class="l-box-select-inner"><table cellpadding="0" cellspacing="0" border="0" class="l-box-select-table"></table></div></div>');

            g.selectBox.table = $("table:first", g.selectBox);
            //外层
            g.wrapper = g.inputText.wrap('<div class="l-text l-text-combobox"></div>').parent();

            g.wrapper.append('<div class="l-text-l"></div><div class="l-text-r"></div>');
            g.wrapper.append(g.link);
            //添加个包裹，
            g.textwrapper = g.wrapper.wrap('<div class="l-text-wrapper"></div>').parent();

            if (p.absolute)
                g.selectBox.appendTo('body').addClass("l-box-select-absolute");
            else
                g.textwrapper.append(g.selectBox);

            g.textwrapper.append(g.valueField);
            g.inputText.addClass("l-text-field");
            if (p.isShowCheckBox && !g.select)
            {
                $("table", g.selectBox).addClass("l-table-checkbox");
            } else
            {
                p.isShowCheckBox = false;
                $("table", g.selectBox).addClass("l-table-nocheckbox");
            }
            //开关 事件
            g.link.hover(function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger-hover";
            }, function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger";
            }).mousedown(function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger-pressed";
            }).mouseup(function ()
            {
                if (p.disabled) return;
                this.className = "l-trigger-hover";
            }).click(function ()
            {
                if (p.disabled) return;
                if (g.trigger('beforeOpen') == false) return false;
                g._toggleSelectBox(g.selectBox.is(":visible"));
            });
            g.inputText.click(function ()
            {
                if (p.disabled) return;
                if (g.trigger('beforeOpen') == false) return false;
                g._toggleSelectBox(g.selectBox.is(":visible"));
            }).blur(function ()
            {
                if (p.disabled) return;
                g.wrapper.removeClass("l-text-focus");
                g.link.removeClass("l-trigger-hover");
            }).focus(function ()
            {
                if (p.disabled) return;
                g.wrapper.addClass("l-text-focus");
                g.link.addClass("l-trigger-hover");
            });
            g.wrapper.hover(function ()
            {
                if (p.disabled) return;
                g.wrapper.addClass("l-text-over");
                g.link.addClass("l-trigger-hover");
            }, function ()
            {
                if (p.disabled) return;
                g.wrapper.removeClass("l-text-over");
                g.link.removeClass("l-trigger-hover");
            });
            g.resizing = false;
            g.selectBox.hover(null, function (e)
            {
//                if (p.hideOnLoseFocus && g.selectBox.is(":visible") && !g.boxToggling && !g.resizing&&p.isMultiSelect)
//                {
//                    g._toggleSelectBox(true);
//                }
            });
            var itemsleng = $("tr", g.selectBox.table).length;
            if (!p.selectBoxHeight && itemsleng < 8) p.selectBoxHeight = itemsleng * 30;
            if (p.selectBoxHeight)
            {
                g.selectBox.height(p.selectBoxHeight);
            }
            //下拉框内容初始化
            g.bulidContent();

            g.set(p);

            //下拉框宽度、高度初始化
            if (p.selectBoxWidth)
            {
                g.selectBox.width(p.selectBoxWidth);
            }
            else
            {
                g.selectBox.css('width', g.wrapper.css('width'));
            }
            this. _setEvent();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除当前ComboBox。
         * @name  juiceComboBox#destroy
         * @function
         * @example   <b>示例:</b> <br>
         *  destroy: function ()
         *        {
         *            if (this.wrapper) this.wrapper.remove();
         *            if (this.selectBox) this.selectBox.remove();
         *                this.options = null;
         *            $.jui.remove(this);
         *        }
         */
        destroy: function ()
        {
            if (this.wrapper) this.wrapper.remove();
            if (this.selectBox) this.selectBox.remove();
            this.options = null;
            $.jui.remove(this);
        },
        _setDisabled: function (value)
        {
            //禁用样式
            if (value)
            {
                this.wrapper.addClass('l-text-disabled');
            } else
            {
                this.wrapper.removeClass('l-text-disabled');
            }
        },
        _setLable: function (label)
        {
            var g = this, p = this.options;
            if (label)
            {
                if (g.labelwrapper)
                {
                    g.labelwrapper.find(".l-text-label:first").html(label + ':&nbsp');
                }
                else
                {
                    g.labelwrapper = g.textwrapper.wrap('<div class="l-labeltext"></div>').parent();
                    g.labelwrapper.prepend('<div class="l-text-label" style="float:left;display:inline;">' + label + ':&nbsp</div>');
                    g.textwrapper.css('float', 'left');
                }
                if (!p.labelWidth)
                {
                    p.labelWidth = $('.l-text-label', g.labelwrapper).outerWidth();
                }
                else
                {
                    $('.l-text-label', g.labelwrapper).outerWidth(p.labelWidth);
                }
                $('.l-text-label', g.labelwrapper).width(p.labelWidth);
                $('.l-text-label', g.labelwrapper).height(g.wrapper.height());
                g.labelwrapper.append('<br style="clear:both;" />');
                if (p.labelAlign)
                {
                    $('.l-text-label', g.labelwrapper).css('text-align', p.labelAlign);
                }
                g.textwrapper.css({ display: 'inline' });
                g.labelwrapper.width(g.wrapper.outerWidth() + p.labelWidth + 2);
            }
        },
        _setWidth: function (value)
        {
            var g = this;
            if (value > 20)
            {
                g.wrapper.css({ width: value });
                g.inputText.css({ width: value});
                g.textwrapper.css({ width: value });
            }
        },
        _setHeight: function (value)
        {
            var g = this;
            if (value > 10)
            {
                g.wrapper.height(value);
                g.inputText.height(value - 2);
                g.link.height(value - 4);
                g.textwrapper.css({ width: value });
            }
        },
        _setResize: function (resize)
        {
            //调整大小支持
            if (resize && $.fn.juiceResizable)
            {
                var g = this;
                g.selectBox.juiceResizable({ handles: 'se,s,e', onStartResize: function ()
                {
                    g.resizing = true;
                    g.trigger('startResize');
                }
                    , onEndResize: function ()
                    {
                        g.resizing = false;
                        if (g.trigger('endResize') == false)
                            return false;
                    }
                });
                g.selectBox.append("<div class='l-btn-nw-drop'></div>");
            }
        },
        findItemsByValue:function(value){
            var g = this, p = this.options;
            var datas = [];
            if (value === undefined) return "";
            var texts = "";
            var contain = function (checkvalue)
            {
                if(value==checkvalue||(!value&&!checkvalue)){
                    return true;
                }
                var targetdata = value?value.toString().split(p.split):[];
                for (var i = 0; i < targetdata.length; i++)
                {
                    if (targetdata[i] == checkvalue) return true;
                }
                return false;
            };
            $(g.data).each(function (i, item)
            {
                var val = item[p.valueField];
                if (contain(val))
                {
                    datas.push(item);
                }
            });
            return datas;
        },
        //查找Text,适用多选和单选
        findTextByValue: function (value)
        {
            var g = this, p = this.options;
            if (value === undefined) return "";
            var texts = "";
            var contain = function (checkvalue)
            {
                if(value==checkvalue||(!value&&!checkvalue)){
                    return true;
                }
                var targetdata = value?value.toString().split(p.split):[];
                for (var i = 0; i < targetdata.length; i++)
                {
                    if (targetdata[i] == checkvalue) return true;
                }
                return false;
            };
            $(g.data).each(function (i, item)
            {
                var val = item[p.valueField];
                var txt = item[p.textField];
                if (contain(val))
                {
                    texts += txt + p.split;
                }
            });
            if (texts.length > 0) texts = texts.substr(0, texts.length - 1);
            return texts;
        },
        //查找Value,适用多选和单选
        findValueByText: function (text)
        {
            var g = this, p = this.options;
            if (!text && text == "") return "";
            var contain = function (checkvalue)
            {
                var targetdata = text.toString().split(p.split);
                for (var i = 0; i < targetdata.length; i++)
                {
                    if (targetdata[i] == checkvalue) return true;
                }
                return false;
            };
            var values = "";
            $(g.data).each(function (i, item)
            {
                var val = item[p.valueField];
                var txt = item[p.textField];
                if (contain(txt))
                {
                    values += val + p.split;
                }
            });
            if (values.length > 0) values = values.substr(0, values.length - 1);
            return values;
        },
        removeItem: function ()
        {
        },
        insertItem: function ()
        {
        },
        addItem: function ()
        {

        },
        _setValue: function (value)
        {
            var g = this, p = this.options;
            this.initValue = value;
            var text = g.findTextByValue(value);
            if (p.tree)
            {
                g.selectValueByTree(value);
            }else if(p.grid){
                g.selectValueByGrid(value);
            }else if (!p.isMultiSelect){
                g._changeValue(value, text);
                $("tr[value=" + value?value:"" + "] td", g.selectBox).addClass("l-selected");
                $("tr[value!=" + value?value:"" + "] td", g.selectBox).removeClass("l-selected");
            } else
            {
                g._changeValue(value, text);
                var targetdata = value?value.toString().split(p.split):[];
                $("table.l-table-checkbox :checkbox", g.selectBox).each(function () { this.checked = false; });
                for (var i = 0; i < targetdata.length; i++)
                {
                    $("table.l-table-checkbox tr[value=" + targetdata[i] + "] :checkbox", g.selectBox).each(function () { this.checked = true; });
                }
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置所选值。
         * @name  juiceComboBox#selectValue
         * @param [value] 传递选中的部分的值
         * @function
         */
        selectValue: function (value)
        {
            this._setValue(value);
        },
        bulidContent: function ()
        {
            var g = this, p = this.options;
            this.clearContent();
            if (g.select)
            {
                g.setSelect();
            }
            else if (g.data&&!p.forceLoad)
            {
                g.setData(g.data);
            }
            else if (p.tree)
            {
                g.setTree(p.tree);
            }
            else if (p.grid)
            {
                g.setGrid(p.grid);
            }
            else if (p.url)
            {
                g.setUrl(p.url);
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据源。
         * @name  juiceComboBox#load
         * @param [url] 数据源url
         * @param [reLoad] 重新加载
         * @function
         */
        load:function(url,reLoad){
            var g = this, p = this.options;
            if(reLoad){
                g.setUrl(url);
            }else{
                g.setData(g.data);
            }
        } ,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;封装数据源。
         * @name  juiceComboBox#setUrl
         * @param [url] 数据源url
         * @function
         */
        setUrl:function(url){
            var g = this, p = this.options;
            p.url = url;
            $.ajax({
                type: 'post',
                url: p.url,
                cache: false,
                dataType: 'json',
                success: function (data)
                {
                    if(g.dataTransform){
                        data = g.dataTransform(data,p);
                    }
                    g.data = data;
                    if(p.defaultValue){
                        g.data.reverse().push(eval("("+p.defaultValue+")"));
                        g.data.reverse();
                    }
                    g.setData(g.data);
                    g._setValue(g.initValue||p.initValue);
                    g.trigger('success', [g.data]);
                },
                error: function (XMLHttpRequest, textStatus)
                {
                    g.trigger('error', [XMLHttpRequest, textStatus]);
                }
            });
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;清空文本信息。
         * @name  juiceComboBox#clearContent
         * @function
         */
        clearContent: function ()
        {
            var g = this, p = this.options;
            $("table", g.selectBox).html("");
            //g.inputText.val("");
            //g.valueField.val("");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置所选值。
         * @name  juiceComboBox#setSelect
         * @function
         */
        setSelect: function ()
        {
            var g = this, p = this.options;
            g.data = g.data||[];
            this.clearContent();
            $('option', g.select).each(function (i)
            {
                var item = {};
                var val = $(this).val();
                var txt = $(this).html();
                var tr = $("<tr><td index='" + i + "' value='" + val + "'>" + txt + "</td>");
                $("table.l-table-nocheckbox", g.selectBox).append(tr);
                $("td", tr).hover(function ()
                {
                    $(this).addClass("l-over");
                }, function ()
                {
                    $(this).removeClass("l-over");
                });
                item[p.valueField] = val;
                item[p.textField] = txt;
                //添加值以便form加载
                g.data.push(item);
            });
            $('td:eq(' + g.select[0].selectedIndex + ')', g.selectBox).each(function ()
            {
                if ($(this).hasClass("l-selected"))
                {
                    g.selectBox.hide();
                    return;
                }
                $(".l-selected", g.selectBox).removeClass("l-selected");
                $(this).addClass("l-selected");
                if (g.select[0].selectedIndex != $(this).attr('index') && g.select[0].onchange)
                {
                    g.select[0].selectedIndex = $(this).attr('index'); g.select[0].onchange();
                }
                var newIndex = parseInt($(this).attr('index'));
                g.select[0].selectedIndex = newIndex;
                g.select.trigger("change");
                g.selectBox.hide();
                var value = $(this).attr("value");
                var text = $(this).html();
                if (p.render)
                {
                    g.inputText.val(p.render(value, text));
                }
                else
                {
                    g.inputText.val(text);
                }
            });
            g._addClickEven();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对数据data进行封装。
         * @name  juiceComboBox#setData
         * @param [data] 数据data
         * @function
         */
        setData: function (data)
        {
            var g = this, p = this.options;
            this.clearContent();
            if (!data || !data.length) return;
            if (g.data != data) g.data = data;
            if (p.columns)
            {
                g.selectBox.table.headrow = $("<tr class='l-table-headerow'><td width='18px'></td></tr>");
                g.selectBox.table.append(g.selectBox.table.headrow);
                g.selectBox.table.addClass("l-box-select-grid");
                for (var j = 0; j < p.columns.length; j++)
                {
                    var headrow = $("<td columnindex='" + j + "' columnname='" + p.columns[j].name + "'>" + p.columns[j].header + "</td>");
                    if (p.columns[j].width)
                    {
                        headrow.width(p.columns[j].width);
                    }
                    g.selectBox.table.headrow.append(headrow);

                }
            }
            for (var i = 0; i < data.length; i++)
            {
                var val = data[i][p.valueField];
                var txt = data[i][p.textField];
                if(p.joinStr&&(val!=null&&val!="")&&(txt!=null&&txt!="")){
                    txt = val + p.joinStr + txt;
                }
                if (!p.columns)
                {
                    val = val||"";
                    $("table.l-table-checkbox", g.selectBox).append("<tr value='" + val + "'><td style='width:18px;'  index='" + i + "' value='" + val + "' text='" + txt + "' ><input type='checkbox' /></td><td index='" + i + "' value='" + val + "' align='left'>" + txt + "</td>");
                    $("table.l-table-nocheckbox", g.selectBox).append("<tr value='" + val + "'><td index='" + i + "' value='" + val + "' align='left'>" + txt + "</td>");
                } else
                {
                    var tr = $("<tr value='" + val + "'><td style='width:18px;'  index='" + i + "' value='" + (val?val:"") + "' text='" + txt + "' ><input type='checkbox' /></td></tr>");
                    $("td", g.selectBox.table.headrow).each(function ()
                    {
                        var columnname = $(this).attr("columnname");
                        if (columnname)
                        {
                            var td = $("<td>" + data[i][columnname] + "</td>");
                            tr.append(td);
                        }
                    });
                    g.selectBox.table.append(tr);
                }
            }
            //自定义复选框支持
//            if (p.isShowCheckBox && $.fn.juiceCheckBox)
//            {
//                $("table input:checkbox", g.selectBox).juiceCheckBox();
//            }
            $(".l-table-checkbox input:checkbox", g.selectBox).change(function ()
            {
                if (this.checked && g.hasBind('beforeSelect'))
                {
                    var parentTD = null;
                    if ($(this).parent().get(0).tagName.toLowerCase() == "div")
                    {
                        parentTD = $(this).parent().parent();
                    } else
                    {
                        parentTD = $(this).parent();
                    }
                    if (parentTD != null && g.trigger('beforeSelect', [parentTD.attr("value"), parentTD.attr("text")]) == false)
                    {
                        g.selectBox.slideToggle("fast");
                        return false;
                    }
                }
                if (!p.isMultiSelect)
                {
                    if (this.checked)
                    {
                        $("input:checked", g.selectBox).not(this).each(function ()
                        {
                            this.checked = false;
                            $(".l-checkbox-checked", $(this).parent()).removeClass("l-checkbox-checked");
                        });
                        g.selectBox.slideToggle("fast");
                    }
                }
                g._checkboxUpdateValue();
            });
            $("table.l-table-nocheckbox td", g.selectBox).hover(function ()
            {
                $(this).addClass("l-over");
            }, function ()
            {
                $(this).removeClass("l-over");
            });
            g._addClickEven();
            //选择项初始化
            g._dataInit();
        },
        //树
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 对tree对象的相关操作。
         * @name  juiceComboBox#setTree
         * @param [tree] 一个对象
         * @function
         */
        setTree: function (tree)
        {
            var g = this, p = this.options;
            this.clearContent();
            g.selectBox.table.remove();
            if (tree.checkbox != false)
            {
                tree.onCheck = function ()
                {
                    var nodes = g.treeManager.getChecked();
                    var value = [];
                    var text = [];
                    $(nodes).each(function (i, node)
                    {
                        if (p.treeLeafOnly && node.data.children) return;
                        value.push(node.data[p.valueField]);
                        text.push(node.data[p.textField]);

                    });
                    g._changeValue(value.join(p.split), text.join(p.split));
                };
            }
            else
            {
                tree.onClick = function(node){
                    if(this.getSelected()&&(node.data.id == this.getSelected().data.id)){
                        g.selectBox.hide();
                    }
                };
                tree.onBeforeSelect = function(node){
                    var g = this;
                    if (p.treeLeafOnly && g.hasChildren(node.data)) {
                        return false;
                    }
                } ;
                tree.onSelect = function (node){
                    var value = node.data[p.valueField];
                    var text = node.data[p.textField];
                    g._changeValue(value, text);
                };
                tree.onCancelSelect = function (node)
                {
                    g._changeValue("", "");
                };
            }
            tree.onAfterAppend = function (domnode, nodedata)
            {
                if (!g.treeManager) return;
                var value = null;

                if (g.valueField.val() != "") value = g.valueField.val();
                else if (p.initValue) value = p.initValue;
                g.selectValueByTree(value);
            };
            g.tree = $("<ul></ul>");
            g.selectBox.css("overflow","auto");
            $("div:first", g.selectBox).append(g.tree);
            g.tree.juiceTree(tree);
            g.treeManager = g.tree.juiceGetTreeManager();
        },
        selectValueByTree: function (value)
        {
            var g = this, p = this.options;
            if (value != null)
            {
                var text = "";
                var valuelist = value.toString().split(p.split);
                $(valuelist).each(function (i, item)
                {
                    g.treeManager.selectNode(p.valuePrefix+item.toString());
                    text += g.treeManager.getTextByID(item);
                    if (i < valuelist.length - 1) text += p.split;
                });
                text = (text&&text!="null")?text:p.initText;

                g._changeValue(value, text);
            }
        },
        //表格
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  对Grid。进行相关操作。
         * @name  juiceComboBox#setGrid
         * @param [grid] 一个对象
         * @function
         */
        setGrid: function (grid)
        {
            var g = this, p = this.options;
            this.clearContent();
            g.selectBox.table.remove();
            g.grid = $("div:first", g.selectBox);
            grid.columnWidth = grid.columnWidth || 120;
            grid.width = "100%";
            grid.height = "100%";
            grid.heightDiff = +2;
            grid.InWindow = false;
            p.hideOnLoseFocus = false;
            if (grid.checkbox != false)
            {
                grid.onCheckAllRow =  function (checked,grid,datas)
                {
                    var value = g.getValue()? g.getValue().split(p.split):[];
                    var text = g.getLabel()? g.getLabel().split(p.split):[];
                    if(checked){
                        var rowsdata = g.gridManager.getCheckedRows();
                        $(rowsdata).each(function (i, rowdata)
                        {
                            if(value.indexOf(rowdata[p.valueField]+"")<0){
                                value.push(rowdata[p.valueField]);
                                text.push(rowdata[p.textField]);
                            }
                        });
                    }else{
                        $(datas).each(function (i, rowdata)
                        {
                            var index = value.indexOf(rowdata[p.valueField]+"");
                            if(index>=0){
                                value.splice(index,1);
                                text.splice(index,1);
                            }
                        });
                    }

                    g._changeValue(value.join(p.split), text.join(p.split));
                    g.trigger("EndEdit");
                };
                grid.onCheckRow = function (checked,rowdata) {
                    var value = g.getValue() ? g.getValue().split(p.split) : [];
                    var text = g.getLabel() ? g.getLabel().split(p.split) : [];
                    if (checked) {
                        if(value.indexOf(rowdata[p.valueField]+"")<0){
                            value.push(rowdata[p.valueField]);
                            text.push(rowdata[p.textField]);
                        }
                    }else{
                        var index = value.indexOf(rowdata[p.valueField]+"");
                        if(index>=0){
                            value.splice(index,1);
                            text.splice(index,1);
                        }
                    }
                    g._changeValue(value.join(p.split), text.join(p.split));
                    g.trigger("EndEdit");
                };
                grid.onAfterShowData = function(){
                    var rows = g.gridManager.rows;
                    var value = g.getValue() ? g.getValue().split(p.split) : [];
                    $(rows).each(function (i, rowdata)
                    {
                        var index = value.indexOf(rowdata[p.valueField]+"");
                        if(index>=0){
                            g.gridManager.select(rowdata);
                        }
                    });
                };
                //                g.gridManager.bind('CheckAllRow', onCheckRow);
//                g.gridManager.bind('CheckRow', onCheckRow);
            }
            else
            {
                grid.onSelectRow = function (rowdata, rowobj, index)
                {
                    var value = rowdata[p.valueField];
                    var text = rowdata[p.textField];
                    g._changeValue(value, text);
                    g.selectedRow = rowdata;
                    g.selectBox.hide();
                    g.trigger("EndEdit");
                };
                grid.onUnSelectRow= function (rowdata, rowobj, index)
                {
                    g._changeValue("", "");
                    g.selectBox.hide();
                    g.trigger("EndEdit");
                };
            }
            g.gridManager = g.grid.juiceGrid(grid);

            g.bind('show', function ()
            {
                if (g.gridManager)
                {
                    g.gridManager._updateFrozenWidth();
                    if(p.gridFilter){
                        g.oldValue=g.inputText.val();
                        g.gridManager.options.parms = [];
                        g.gridManager.options.parms.push({name:p.textField,value:g.inputText.val()});
                        g.gridManager.options.page=g.gridManager.options.newPage = 1;
                        g.gridManager.loadData(true);
                    }
                }
            });
            g.bind('endResize', function ()
            {
                if (g.gridManager)
                {
                    g.gridManager._updateFrozenWidth();
                    g.gridManager.setHeight(g.selectBox.height());
                }
            });
            g.oldValue="";

            //绑定输入事件
            if(p.gridFilter){
                g.inputText.bind("keyup",function(e){
                    if(e.keyCode==38||e.keyCode==40||e.keyCode==13){
                        return;
                    }
                    if(g.oldValue===g.inputText.val()){
                        return;
                    }
                    if(g.selectBox.is(":hidden")){
                        g._toggleSelectBox(false);
                    }
                    g.oldValue=g.inputText.val();
                    g.gridManager.options.parms = [];
                    g.gridManager.options.parms.push({name:p.textField,value:g.inputText.val()});
                    g.gridManager.options.page=g.gridManager.options.newPage = 1;
                    g.gridManager.loadData(true);
                });
                g.inputText.bind("keydown",function(e){
                    if(e.keyCode==40){
                        if(g.selectBox.is(":hidden")){
                            g._toggleSelectBox(false);
                        }
                    }
                });
            }
        },
        selectValueByGrid: function (value)
        {
            var g = this, p = this.options;
            if (value != null)
            {
                var text = p.initText;
                var records = g.gridManager.getData();
                $(records).each(function(i,record){
                    if(value==record[p.valueField]){
                        text = record[p.textField] ;
                    }
                });
                g._changeValue(value, text);
            }
        },
        _getValue: function ()
        {
            return $(this.valueField).val();
        },
        getValue: function ()
        {
            //获取值
            return this._getValue();
        },
        _getLabel: function ()
        {
            return $(this.element).val();
        },
        getLabel: function ()
        {
            return this._getLabel();
        },
        updateStyle: function ()
        {
            var g = this, p = this.options;
            g._dataInit();
        },
        _dataInit: function ()
        {
            var g = this, p = this.options;
            var value = null;

            if (p.initValue != null && p.initText)
            {
                g._changeValue(p.initValue, p.initText);
            }
            //根据值来初始化
            else if (p.initValue != null)
            {
                value = p.initValue;
                if (p.tree)
                {
                    if(value)
                        g.selectValueByTree(value);
                }
                else
                {
                    var text = g.findTextByValue(value);
                    g._changeValue(value, text);
                }
            }
            //根据文本来初始化
            else if (p.initText != null)
            {
                value = g.findValueByText(p.initText);
                g._changeValue(value, p.initText);
            }
            else if (g.valueField.val() != "")
            {
                value = g.valueField.val();
                if (p.tree)
                {
                    if(value)
                        g.selectValueByTree(value);
                }
                else
                {
                    var text = g.findTextByValue(value);
                    g._changeValue(value, text);
                }
            }
            if (!p.isShowCheckBox && value != null)
            {
                $("table tr", g.selectBox).find("td:first").each(function ()
                {
                    if (value == $(this).attr("value"))
                    {
                        $(this).addClass("l-selected");
                    }
                });
            }
            if (p.isShowCheckBox && value != null)
            {
                $(":checkbox", g.selectBox).each(function ()
                {
                    var parentTD = null;
                    var checkbox = $(this);
                    if (checkbox.parent().get(0).tagName.toLowerCase() == "div")
                    {
                        parentTD = checkbox.parent().parent();
                    } else
                    {
                        parentTD = checkbox.parent();
                    }
                    if (parentTD == null) return;
                    var valuearr = value.toString().split(p.split);
                    $(valuearr).each(function (i, item)
                    {
                        if (item == parentTD.attr("value"))
                        {
                            $(".l-checkbox", parentTD).addClass("l-checkbox-checked");
                            checkbox[0].checked = true;
                        }
                    });
                });
            }
        },
        _onClick:function(e){
            var obj = (e.target || e.srcElement);
            var jobjs = $(obj).parents().add(obj);
            if (jobjs.index(this.element) == -1&&jobjs.index(this.link)==-1&&jobjs.index(this.selectBox)==-1) {
                if(this.selectBox.is(":visible"))this.selectBox.hide();
            };
//            alert(this.selectBox.is(":visible"))
//
        },
        _setEvent:function(){
            var g = this;
            $(document).bind("click.combox", function (e)
            {
                g._onClick.call(g, e);
            });
            $(document).bind("keydown.combox", function (e)
            {
                if(!g.selectBox.is(":hidden")){
                    if(e.keyCode==38){
                        if( g.gridManager){
                            if(!g.gridManager.getSelected()){
                                g.gridManager.selectWithoutTrigger(0);
                            }else{
                                g.gridManager.moveSelectRow(g.gridManager.getSelected(),1);
                            }
                        }

                    }else if(e.keyCode==40){
                        if(!g.gridManager.getSelected()){
                            g.gridManager.selectWithoutTrigger(0);
                        }else{
                            g.gridManager.moveSelectRow(g.gridManager.getSelected(),-1);
                        }
                    }else if(e.keyCode==13){
                        if(g.gridManager.getSelected()) {
                            g.gridManager.select(g.gridManager.getSelected());
                        }
                    }
                }
            });
        } ,
        //设置值到 文本框和隐藏域
        _changeValue: function (newValue, newText)
        {
            var g = this, p = this.options;
            g.valueField.val(newValue);
            newText = newText||p.initText;
            if (p&&p.render)
            {
                g.inputText.val(p.render(newValue, newText));
            }
            else
            {
                g.inputText.val(newText);
            }
            g.selectedValue = newValue;
            g.selectedText = newText;
            g.valueField.trigger("change");
            g.trigger('selected', [newValue, newText, g.findItemsByValue(newValue)]);
        },
        //更新选中的值(复选框)
        _checkboxUpdateValue: function ()
        {
            var g = this, p = this.options;
            var valueStr = "";
            var textStr = "";
            $("input:checked", g.selectBox).each(function ()
            {
                var parentTD = null;
                if ($(this).parent().get(0).tagName.toLowerCase() == "div")
                {
                    parentTD = $(this).parent().parent();
                } else
                {
                    parentTD = $(this).parent();
                }
                if (!parentTD) return;
                valueStr += parentTD.attr("value") + p.split;
                textStr += parentTD.attr("text") + p.split;
            });
            if (valueStr.length > 0) valueStr = valueStr.substr(0, valueStr.length - 1);
            if (textStr.length > 0) textStr = textStr.substr(0, textStr.length - 1);
            g._changeValue(valueStr, textStr);
        },
        _addClickEven: function ()
        {
            var g = this, p = this.options;
            //选项点击
            $(".l-table-nocheckbox td", g.selectBox).click(function ()
            {
                var value = $(this).attr("value");
                var index = parseInt($(this).attr('index'));
                var text = $(this).html();
                if (g.hasBind('beforeSelect') && g.trigger('beforeSelect', [value, text]) == false)
                {
                    if (p.slide) g.selectBox.slideToggle("fast");
                    else g.selectBox.hide();
                    return false;
                }
                if ($(this).hasClass("l-selected"))
                {
                    if (p.slide) g.selectBox.slideToggle("fast");
                    else g.selectBox.hide();
                    return;
                }
                $(".l-selected", g.selectBox).removeClass("l-selected");
                $(this).addClass("l-selected");
                if (g.select)
                {
                    if (g.select[0].selectedIndex != index)
                    {
                        g.select[0].selectedIndex = index;
                        g.select.trigger("change");
                    }
                }
                if (p.slide)
                {
                    g.boxToggling = true;
                    g.selectBox.hide("fast", function ()
                    {
                        g.boxToggling = false;
                    })
                } else g.selectBox.hide();
                g._changeValue(value, text);
            });
        },
        updateSelectBoxPosition: function ()
        {
            var g = this, p = this.options;
            if (p.absolute)
            {
                g.selectBox.css({ left: g.wrapper.offset().left, top: g.wrapper.offset().top + 1 + g.wrapper.outerHeight() });
            }
            else
            {
                var topheight = g.wrapper.offset().top - $(window).scrollTop();
                var selfheight = g.selectBox.height() + textHeight + 4;
                if (topheight + selfheight > $(window).height() && topheight > selfheight)
                {
                    g.selectBox.css("marginTop", -1 * (g.selectBox.height() + textHeight + 5));
                }
            }
        },
        _toggleSelectBox: function (isHide)
        {
            var g = this, p = this.options;
            var textHeight = g.wrapper.height();
            g.boxToggling = true;
            if (isHide)
            {
                if (p.slide)
                {
                    g.selectBox.slideToggle('fast', function ()
                    {
                        g.boxToggling = false;
                    });
                }
                else
                {
                    g.selectBox.hide();
                    g.boxToggling = false;
                }
            }
            else
            {
                g.updateSelectBoxPosition();
                if (p.slide)
                {
                    g.selectBox.slideToggle('fast', function ()
                    {
                        g.boxToggling = false;
                        if (!p.isShowCheckBox && $('td.l-selected', g.selectBox).length > 0)
                        {
                            var offSet = ($('td.l-selected', g.selectBox).offset().top - g.selectBox.offset().top);
                            $(".l-box-select-inner", g.selectBox).animate({ scrollTop: offSet });
                        }
                    });
                }
                else
                {
                    g.selectBox.show();
                    g.boxToggling = false;
                    if (!g.tree && !g.grid && !p.isShowCheckBox && $('td.l-selected', g.selectBox).length > 0)
                    {
                        var offSet = ($('td.l-selected', g.selectBox).offset().top - g.selectBox.offset().top);
                        $(".l-box-select-inner", g.selectBox).animate({ scrollTop: offSet });
                    }
                    if(g.selectBox.offset().left+g.selectBox.width()>document.body.clientWidth){
                        g.selectBox.css("left",document.body.clientWidth-g.selectBox.width()-30)
                    }
//                    if(g.selectBox.offset().left+g.selectBox.width()>document.body.clientWidth){
//                        document.body.scrollTo(100,500);
//                    }
                }
            }
            g.isShowed = g.selectBox.is(":visible");
            g.trigger('toggle', [isHide]);
            g.trigger(isHide ? 'hide' : 'show');
        }
    });

    $.jui.controls.ComboBox.prototype.setValue = $.jui.controls.ComboBox.prototype.selectValue;
    //设置文本框和隐藏控件的值
    $.jui.controls.ComboBox.prototype.setInputValue = $.jui.controls.ComboBox.prototype._changeValue;


})(jQuery);