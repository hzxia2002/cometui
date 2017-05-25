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
     * @name   juiceGrid
     * @class   juiceGrid 是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceGrid &nbsp;API 注解说明</font></h3>
     */
    var l = $.jui;

    $.fn.juiceGrid = function (options)
    {
        return $.jui.run.call(this, "juiceGrid", arguments);
    };

    $.fn.juiceGetGridManager = function ()
    {
        return $.jui.run.call(this, "juiceGetGridManager", arguments);
    };

    $.juiceDefaults.Grid = /**@lends juiceGrid#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 文本标题。
         * @default  ''
         * @type String
         */
        title: '',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度值。
         * @default  auto
         * @type  String|Number
         */
        width: 'auto',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度值。
         * @default  auto
         * @type  String|Number
         */
        height: 'auto',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 默认列宽度。
         * @default  null
         * @type  String|Number
         */
        columnWidth: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; table是否可伸缩。
         * @default  true
         * @type   Boolean
         */
        resizable: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源url。
         * @default  ""
         * @type  String
         */
        url: "",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否分页。
         * @default  true
         * @type  Boolean
         */
        usePager: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 默认当前页。
         * @default  1
         * @type  Number
         */
        page: 1,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 每页默认的结果数。
         * @default  15
         * @type  Number
         */
        pageSize: 15,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 可选择设定的每页结果数。
         * @default  [10, 20, 30, 40, 50]
         * @type  Array
         */
        pageSizeOptions: [15,30,50],
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提交到服务器的参数。
         * @default  []
         * @type  Array
         */
        parms: [],
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源。
         * @default  []
         * @type  Array
         */
        columns: [],
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表格收缩。
         * @default  true
         * @type  Boolean
         */
        toggleAble: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最小显示的列。
         * @default  1
         * @type  Number
         */
        minColToggle: 1,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源：本地(local)或(server),本地是将读取p.data。不需要配置，取决于设置了data或是url。
         * @default  server
         * @type  String
         */
        dataType: 'server',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据。
         * @default  null
         * @type  Array
         */
        data: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提交数据的方式：本地(local)或(server),选择本地方式时将在客服端分页、排序。
         * @default  server
         * @type  String
         */
        dataAction: 'server',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否显示'显示隐藏Grid'按钮。
         * @default  false
         * @type  Boolean
         */
        showTableToggleBtn: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;切换每页记录数是否应用juiceComboBox。
         * @default  false
         * @type  Boolean
         */
        switchPageSizeApplyComboBox: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否允许调整列宽。
         * @default  true
         * @type  Boolean
         */
        allowAdjustColWidth: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否显示复选框。
         * @default  false
         * @type  Boolean
         */
        checkbox: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否显示'切换列层'按钮。
         * @default  true
         * @type  Boolean
         */
        allowHideColumn: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否允许编辑。
         * @default  false
         * @type  Boolean
         */
        enabledEdit: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否滚动。
         * @default  true
         * @type  Boolean
         */
        isScroll: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;拖动列事件。
         * @default  null
         * @type  event
         */
        onDragCol: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;切换列事件。
         * @default  null
         * @type  event
         */
        onToggleCol: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改变排序事件。
         * @default  null
         * @type  event
         */
        onChangeSort: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;成功获取服务器数据的事件。
         * @default  null
         * @type  event
         */
        onSuccess: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;双击行事件。
         * @default  null
         * @type  event
         */
        onDblClickRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择行事件。
         * @default  null
         * @type  event
         */
        onSelectRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消选择行事件。
         * @default  null
         * @type  event
         */
        onUnSelectRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择前事件，可以通过return false阻止操作(复选框)。
         * @default  null
         * @type  event
         */
        onBeforeCheckRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择事件(复选框)。
         * @default  null
         * @type  event
         */
        onCheckRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择前事件，可以通过return false阻止操作(复选框 全选/全不选)。
         * @default  null
         * @type  event
         */
        onBeforeCheckAllRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  选择事件(复选框 全选/全不选)。
         * @default  null
         * @type  event
         */
        onCheckAllRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 显示数据前事件，可以通过reutrn false阻止操作 。
         * @default  null
         * @type  event
         */
        onBeforeShowData: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  显示完数据事件。
         * @default  null
         * @type  event
         */
        onAfterShowData: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 错误事件 。
         * @default  null
         * @type  event
         */
        onError: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提交前事件 。
         * @default  null
         * @type  event
         */
        onSubmit: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 默认时间显示格式 。
         * @default  yyyy-MM-dd
         * @type  String
         */
        dateFormat: 'yyyy-MM-dd',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否以窗口的高度为准 height设置为百分比时可用 。
         * @default  true
         * @type  Boolean
         */
        InWindow: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 状态名 。
         * @default  __status
         * @type  String
         */
        statusName: '__status',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提交方式 。
         * @default  post
         * @type  String
         */
        method: 'post',
        async: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据转换 。
         * @default  null
         * @type  Object
         */
        dataTransform:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否固定单元格的高度 。
         * @default  true
         * @type  Boolean
         */
        fixedCellHeight: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度补差,当设置height:100%时，可能会有高度的误差，可以通过这个属性调整 。
         * @default  0
         * @type  Number
         */
        heightDiff: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 类名 。
         * @default  null
         * @type  Object
         */
        cssClass: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源字段名 。
         * @default  Rows
         * @type  String
         */
        root: 'Rows',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源记录数字段名 。
         * @default  Total
         * @type  String
         */
        record: 'Total',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 页索引参数名，(提交给服务器) 。
         * @default  page
         * @type  String
         */
        pageParmName: 'page',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 页记录数参数名，(提交给服务器) 。
         * @default  pagesize
         * @type  String
         */
        pagesizeParmName: 'pageSize',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 页排序列名(提交给服务器) 。
         * @default  sortname
         * @type  String
         */
        sortnameParmName: 'sortname',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 页排序方向(提交给服务器) 。
         * @default  sortorder
         * @type  String
         */
        sortorderParmName: 'sortorder',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  刷新事件，可以通过return false来阻止操作。
         * @default  null
         * @type  event
         */
        onReload: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 第一页，可以通过return false来阻止操作 。
         * @default  null
         * @type  event
         */
        onToFirst: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  上一页，可以通过return false来阻止操作。
         * @default  null
         * @type  event
         */
        onToPrev: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  下一页，可以通过return false来阻止操作。
         * @default  null
         * @type  event
         */
        onToNext: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最后一页，可以通过return false来阻止操作 。
         * @default  null
         * @type  event
         */
        onToLast: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否允许反选行  。
         * @default  false
         * @type  Boolean
         */
        allowUnSelectRow: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 奇偶行效果 。
         * @default  true
         * @type  Boolean
         */
        alternatingRow: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 鼠标移动，行的样式改变 。
         * @default  l-grid-row-over
         * @type  String
         */
        mouseoverRowCssClass: 'l-grid-row-over',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许排序 。
         * @default  true
         * @type  Boolean
         */
        enabledSort: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行自定义属性渲染器(包括style，也可以定义) 。
         * @default  null
         * @type   function
         */
        rowAttrRender: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 分组 - 列名。
         * @default  ""
         * @type    String
         */
        groupColumnName: "",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 分组 - 列显示名字。
         * @default  分组
         * @type   String
         */
        groupColumnDisplay: '分组',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 分组 - 渲染器。
         * @default  分组
         * @type   function
         */
        groupRender: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 统计行(全部数据) 。
         * @default  分组
         * @type   function
         */
        totalRender: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 初始化时是否不加载 。
         * @default  false
         * @type   Boolean
         */
        delayLoad: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据过滤查询函数,(参数一 data item，参数二 data item index) 。
         * @default  null
         * @type   function
         */
        where: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 复选框模式时，是否只允许点击复选框才能选择行 。
         * @default  false
         * @type   Boolean
         */
        selectRowButtonOnly: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  增加行后事件 。
         * @default  null
         * @type   event
         */
        onAfterAddRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  编辑前事件 。
         * @default  null
         * @type   event
         */
        onBeforeEdit: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  验证编辑器结果是否通过 。
         * @default  null
         * @type   event
         */
        onBeforeSubmitEdit: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 结束编辑后事件  。
         * @default  null
         * @type   event
         */
        onAfterEdit: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  加载时函数 。
         * @default  null
         * @type   event
         */
        onLoading: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 加载完函数  。
         * @default  null
         * @type   event
         */
        onLoaded: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  右击事件 。
         * @default  null
         * @type   event
         */
        onContextmenu: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  右击行时是否选中 。
         * @default  false
         * @type   Boolean
         */
        onRClickToSelect: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Ajax contentType参数 。
         * @default  null
         * @type   Object
         */
        contentType: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 复选框列宽度 。
         * @default  27
         * @type   Number
         */
        checkboxColWidth: 27,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 明细列宽度 。
         * @default  29
         * @type   Number
         */
        detailColWidth: 29,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否点击单元格的时候就编辑 。
         * @default  true
         * @type   Boolean
         */
        clickToEdit: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否点击明细的时候进入编辑 。
         * @default  false
         * @type   Boolean
         */
        detailToEdit: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 点击结束编辑事件 。
         * @default  null
         * @type   event
         */
        onEndEdit: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 双击行选中行事件 。
         * @default  null
         * @type   event
         */
        onDblClickRow: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最小列宽 。
         * @default  80
         * @type   Number
         */
        minColumnWidth: 80,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; treeGrid模式 。
         * @default  null
         * @type   Object
         */
        tree: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 复选框 初始化函数 。
         * @default  null
         * @type   function
         */
        isChecked: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否固定列 。
         * @default  true
         * @type   Boolean
         */
        frozen: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 明细按钮是否在固定列中 。
         * @default  false
         * @type   Boolean
         */
        frozenDetail: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 复选框按钮是否在固定列中 。
         * @default  true
         * @type   Boolean
         */
        frozenCheckbox: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 详细高度 。
         * @default  260
         * @type   Number
         */
        detailHeight: 260,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示行序号 。
         * @default  false
         * @type   Boolean
         */
        rownumbers: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行序号是否在固定列中 。
         * @default  true
         * @type   Boolean
         */
        frozenRownumbers: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行序号列宽 。
         * @default  26
         * @type   Number
         */
        rownumbersColWidth: 26,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许表头拖拽 。
         * @default  false
         * @type   Boolean
         */
        colDraggable: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许行拖拽 。
         * @default  false
         * @type   Boolean
         */
        rowDraggable: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行拖动函数 。
         * @default  null
         * @type   function
         */
        rowDraggingRender: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许行拖拽 。
         * @default  true
         * @type   Boolean
         */
        autoCheckChildren: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行拖拽事件 。
         * @default  null
         * @type   event
         */
        onRowDragDrop: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行默认的高度 。
         * @default  30
         * @type   Number
         */
        rowHeight: 30,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表头行的高度 。
         * @default  23
         * @type   Number
         */
        headerRowHeight: 32,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 工具条,参数同 juiceToolbar的 。
         * @default  null
         * @type   Object
         */
        toolbar: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表格头部图标。
         * @default  null
         * @type   String
         */
        headerImg: null,
        /**
         * 新增行要拷贝的列，如果为空，拷贝可编辑的列
         */
        copyColumns:"",

        detail:null,
        /**
         * 是否显示表头菜单
         */

        showHeadMenu:true,
        /**
         * 是否单选
         */
        singleSelect:true,

        showAddButton:true
    };
    $.juiceDefaults.GridString = {
        errorMessage: '发生错误',
        pageStatMessage: '当前显示{from}-{to}条，共{total}条',
        pageTextMessage: 'Page',
        loadingMessage: '加载中...',
        findTextMessage: '查找',
        noRecordMessage: '没有符合条件的记录存在',
        isContinueByDataChanged: '数据已经改变,如果继续将丢失数据,是否继续?',
        cancelMessage: '取消',
        saveMessage: '保存',
        applyMessage: '应用',
        draggingMessage: '{count}行'
    };
    //接口方法扩展
    $.juiceMethos.Grid = $.juiceMethos.Grid || {};

    //排序器扩展
    $.juiceDefaults.Grid.sorters = $.juiceDefaults.Grid.sorters || {};

    //格式化器扩展
    $.juiceDefaults.Grid.formatters = $.juiceDefaults.Grid.formatters || {};

    //编辑器扩展
    $.juiceDefaults.Grid.editors = $.juiceDefaults.Grid.editors || {};


    $.juiceDefaults.Grid.sorters['date'] = function (val1, val2)
    {
        return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
    };
    $.juiceDefaults.Grid.sorters['int'] = function (val1, val2)
    {
        return parseInt(val1) < parseInt(val2) ? -1 : parseInt(val1) > parseInt(val2) ? 1 : 0;
    };
    $.juiceDefaults.Grid.sorters['float'] = function (val1, val2)
    {
        return parseFloat(val1) < parseFloat(val2) ? -1 : parseFloat(val1) > parseFloat(val2) ? 1 : 0;
    };
    $.juiceDefaults.Grid.sorters['string'] = function (val1, val2)
    {
        return val1.localeCompare(val2);
    };

    $.juiceDefaults.Grid.formatters['float'] =
        $.juiceDefaults.Grid.formatters['int'] =
            $.juiceDefaults.Grid.formatters['text'] =  function (value, column)
            {
                var format = column.decimalFormat;
                if(format&&(0!=value)&&value){
                    var ret = $.jui.uitl.numberFormat(value,format);
                    var prefix = format.match(/^([^\d]+)/g);
                    var subfix = format.match(/([^\d]+)$/g);
                    if(prefix!=null){
                        ret = prefix + ret ;
                    }
                    if(subfix!=null){
                        ret += subfix;
                    }
                    return ret;
                }
                return  value;
            };

    $.juiceDefaults.Grid.formatters['date'] = function (value, column)
    {
        function getFormatDate(date, dateformat)
        {
            var g = this, p = this.options;
            if (isNaN(date)) return null;
            var format = dateformat;
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(format))
            {
                format = format.replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            for (var k in o)
            {
                if (new RegExp("(" + k + ")").test(format))
                {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
        if (!value) return "";
        // /Date(12321223123232)/
        if (typeof (value) == "string" && /^\/Date/.test(value))
        {
            value = value.replace(/^\//, "new ").replace(/\/$/, "");
            eval("value = " + value);
        }else if (typeof (value) == "string"){
            //value = new Date(value);
            value = new Date(Date.parse(value.replace(/-/g,"/")));
        }
        if (value instanceof Date)
        {
            var format = column.dateFormat || this.options.dateFormat || "yyyy-MM-dd";
            return getFormatDate(value, format);
        }
        else
        {
            return value.toString();
        }
    };


    $.juiceDefaults.Grid.editors['date'] =
    {
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 创建一个文本框容器 。
         * @name   juiceGrid#create
         * @param [container]  容器
         * @param [editParm]   编辑目标
         * @return      input   返回一个标签元素。
         * @function
         */
        create: function (container, editParm)
        {
            var column = editParm.column;
            var input = $("<input type='text'/>");
            container.append(input);
            var options = {};
            var ext = column.editor.p || column.editor.ext;
            if (ext)
            {
                var tmp = typeof (ext) == 'function' ?
                    ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
                $.extend(options, tmp);
            }
            this.box = input.juiceDateEditor(options);
            return input;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取当前编辑框内容。
         * @name   juiceGrid#getValue
         * @param [input]  input对象
         * @param [editParm] 待编辑元素
         * @return         返回input标签元素的value值。
         * @function
         */
        getValue: function (input, editParm)
        {
            return  input.juice('option', 'value');
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取当前编辑框的值 。
         * @name   juiceGrid#setValue
         * @param [input]  input对象
         * @param [value]   参数，传值
         * @param [editParm] 待编辑元素
         * @function
         */
        setValue: function (input, value, editParm)
        {
            input.juice('option', 'value', value);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 调整大小 。
         * @name   juiceGrid#resize
         * @param [input]  input对象
         * @param [width]  宽度
         * @param [height]  高度
         * @param [editParm] 待编辑元素
         * @function
         */
        resize: function (input, width, height, editParm)
        {
            input.juice('option', 'width', width);
            input.juice('option', 'height', height);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除元素 。
         * @name   juiceGrid#destroy
         * @param [input]  input对象
         * @param [editParm] 待编辑元素
         * @function
         */
        destroy: function (input, editParm)
        {
            input.juice('destroy');
        }
    };

    $.juiceDefaults.Grid.editors['select'] =
        $.juiceDefaults.Grid.editors['combobox'] =
        {
            create: function (container, editParm)
            {
                var column = editParm.column;
                var input = $("<input type='text'/>");
                container.append(input);
                var options = {
//                    data: column.editor.data,
                    slide: false,
                    onBeforeEditor: column.editor.onBeforeEditor,
                    valueField: column.editor.valueField || column.editor.valueColumnName,
                    textField: column.editor.textField || column.editor.displayColumnName
                };
                this.options = $.extend(true,options,column.editor);
                var ext = column.editor.p || column.editor.ext;
                if (ext)
                {
                    var tmp = typeof (ext) == 'function' ?
                        ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
                    $.extend(options, tmp);
                }
                if(this.options.onBeforeEditor){
                    this.options.onBeforeEditor.call(this,options,editParm.record);
                }
                this.box = input.juiceComboBox(options);
                return input;
            },
            getValue: function (input, editParm)
            {
                var value = input.juice('option', 'value');
                editParm["record"][this.options.textField] =  this.box.selectedText||"";
                if(this.options.onAfterEditor&&this.value!=value){
                    this.options.onAfterEditor.call(this,editParm.record);
                }
                return value;
            },
            setValue: function (input, value, editParm)
            {   this.value = value;
                input.juice('option', 'value', value);
            },
            getData:function(){
                return  this.box.data;
            },
            resize: function (input, width, height, editParm)
            {
                input.juice('option', 'width', width);
                this.box.selectBox.width(width);
                input.juice('option', 'height', height);
            },
            destroy: function (input, editParm)
            {
                input.juice('destroy');
            }
        };

    $.juiceDefaults.Grid.editors['tree'] =
    {
        create: function (container, editParm)
        {
            var column = editParm.column;
            var input = $("<input type='text'/>");
            container.append(input);
            var options = {
                slide: false,
                valueField: column.editor.valueField ||"id",
                textField: column.editor.textField ||"text" ,
                valueColumnName: column.editor.valueColumnName||column.name,
                displayColumnName: column.editor.displayColumnName|| column.name+"_text"
            };
            options = $.extend(true,options,column.editor);
            var ext = column.editor.p || column.editor.ext;

            if (ext)
            {
                var tmp = typeof (ext) == 'function' ?
                    ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
                $.extend(options, tmp);
            }
            this.box = input.juiceComboBox(options);
            this.options = options;
            return input;
        },
        getValue: function (input, editParm)
        {

            var value =   input.juice('option', 'value');
            editParm["record"][this.options.displayColumnName] =  this.box.selectedText||"";
            return value;
        },
        setValue: function (input, value, editParm)
        {
            input.juice('option', 'value', value);
        },
        resize: function (input, width, height, editParm)
        {
            input.juice('option', 'width', width);
            this.box.selectBox.width(width);
            input.juice('option', 'height', height);
        },
        destroy: function (input, editParm)
        {
            input.juice('destroy');
        }
    };

    $.juiceDefaults.Grid.editors['grid'] =
    {
        create: function (container, editParm)
        {
            var column = editParm.column;
            var input = $("<input type='text'/>");
            container.append(input);
            var options = {
//                    data: column.editor.data,
                slide: false,
                initText:editParm.record[column.editor.textField],
                valueField: column.editor.valueField ||"id",
                textField: column.editor.textField ||"text" ,
                valueColumnName: column.editor.valueField||column.name,
                displayColumnName: column.editor.textField|| column.name+"_text"
            };
            options = $.extend(true,options,column.editor);
            var ext = column.editor.p || column.editor.ext;

            if (ext)
            {
                var tmp = typeof (ext) == 'function' ?
                    ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
                $.extend(options, tmp);
            }
            if(options.onBeforeEditor){
                options.onBeforeEditor.call(this,options,editParm.record);
            }
            this.box = input.juiceComboBox(options);
            this.options = options;
            return input;
        },
        getValue: function (input, editParm)
        {
            var value =   this.box.selectedValue;
            editParm["record"][this.options.displayColumnName] =  this.box.selectedText||"";
            if(this.options.onAfterEditor&&this.value!=value&&this.box.selectedRow){
                this.options.onAfterEditor.call(this,editParm.record,this.box.selectedRow);
            }
            return value;
        },
        setValue: function (input, value, editParm)
        {
            input.juice('option', 'value', value);
        },
        getData:function(){
            return  this.box.gridManager.data;
        },
        resize: function (input, width, height, editParm)
        {
            input.juice('option', 'width', width);
            input.juice('option', 'height', height);
        },
        destroy: function (input, editParm)
        {
            input.juice('destroy');
        }
    };

    $.juiceDefaults.Grid.editors['int'] =
        $.juiceDefaults.Grid.editors['float'] =
            $.juiceDefaults.Grid.editors['spinner'] =
            {
                create: function (container, editParm)
                {
                    var column = editParm.column;
                    var input = $("<input type='text'/>");
                    container.append(input);
                    input.css({ border: '#6E90BE' }) ;
                    var options = {
                        type: column.editor.type == 'float' ? 'float' : 'int'
                    };
                    if (column.editor.minValue != undefined) options.minValue = column.editor.minValue;
                    if (column.editor.maxValue != undefined) options.maxValue = column.editor.maxValue;
                    input.juiceSpinner(options);
                    return input;
                },
                getValue: function (input, editParm)
                {
                    var column = editParm.column;
                    var isInt = column.editor.type == "int";
                    if(input.val()){
                        if (isInt)
                            return parseInt(input.val(), 10);
                        else
                            return parseFloat(input.val());
                    }

                },
                setValue: function (input, value, editParm)
                {
                    input.val(value);
                },
                resize: function (input, width, height, editParm)
                {
                    input.juice('option', 'width', width);
                    input.juice('option', 'height', height);
                },
                destroy: function (input, editParm)
                {
                    input.juice('destroy');
                }
            };


    $.juiceDefaults.Grid.editors['string'] =
        $.juiceDefaults.Grid.editors['text'] = {
            create: function (container, editParm)
            {
                var input = $("<input type='text' class='l-text-editing'/>");
                container.append(input);
                input.juiceTextBox();
                return input;
            },
            getValue: function (input, editParm)
            {
                return input.val();
            },
            setValue: function (input, value, editParm)
            {
                input.val(value);
            },
            resize: function (input, width, height, editParm)
            {
                input.juice('option', 'width', width);
                input.juice('option', 'height', height);
            },
            destroy: function (input, editParm)
            {
                input.juice('destroy');
            }
        };

    $.juiceDefaults.Grid.editors['chk'] = $.juiceDefaults.Grid.editors['checkbox'] = {
        create: function (container, editParm)
        {
            var input = $("<input type='checkbox' />");
            container.append(input);
            input.juiceCheckBox();
            return input;
        },
        getValue: function (input, editParm)
        {
            return input[0].checked ? 1 : 0;
        },
        setValue: function (input, value, editParm)
        {
            input.val(value ? true : false);
        },
        resize: function (input, width, height, editParm)
        {
            input.juice('option', 'width', width);
            input.juice('option', 'height', height);
        },
        destroy: function (input, editParm)
        {
            input.juice('destroy');
        }
    };

    $.jui.controls.Grid = function (element, options)
    {
        $.jui.controls.Grid.base.constructor.call(this, element, options);
    };

    $.jui.controls.Grid.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return '$.jui.controls.Grid';
        },
        __idPrev: function ()
        {
            return 'grid';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Grid;
        },
        _init: function ()
        {
            $.jui.controls.Grid.base._init.call(this);
            var g = this, p = this.options;
            $.jui.controls.Grid.createParams(p,$(this.element));

            p.dataType = (p.url) ? "server" : "local";
            if (p.dataType == "local")
            {
                p.data = p.data || [];
                p.dataAction = "local";
            }
            if (p.isScroll == false)
            {
                p.height = 'auto';
            }
            if (!p.frozen)
            {
                p.frozenCheckbox = false;
                p.frozenDetail = false;
                p.frozenRownumbers = false;
            }
            if (p.detailToEdit)
            {
                p.enabledEdit = true;
                p.clickToEdit = false;
                p.detail = {
                    height: 'auto',
                    onShowDetail: function (record, container, callback)
                    {
                        $(container).addClass("l-grid-detailpanel-edit");
                        g.beginEdit(record, function (rowdata, column)
                        {
                            var editContainer = $("<div class='l-editbox'></div>");
                            editContainer.width(120).height(p.rowHeight + 1);
                            editContainer.appendTo(container);
                            return editContainer;
                        });
                        function removeRow()
                        {
                            $(container).parent().parent().remove();
                            g.collapseDetail(record);
                        }
                        $("<div class='l-clear'></div>").appendTo(container);
                        $("<div class='l-button'>" + p.saveMessage + "</div>").appendTo(container).click(function ()
                        {
                            g.endEdit(record);
                            removeRow();
                        });
                        $("<div class='l-button'>" + p.applyMessage + "</div>").appendTo(container).click(function ()
                        {
                            g.submitEdit(record);
                        });
                        $("<div class='l-button'>" + p.cancelMessage + "</div>").appendTo(container).click(function ()
                        {
                            g.cancelEdit(record);
                            removeRow();
                        });
                    }
                };
            }
            if (p.tree)//启用分页模式
            {
                p.tree.childrenName = p.tree.childrenName || "children";
                p.tree.isParent = p.tree.isParent || function (rowData)
                    {
                        var exist = p.tree.childrenName in rowData;
                        return exist;
                    };
                p.tree.isExtend = p.tree.isExtend || function (rowData)
                    {
                        if ('isextend' in rowData && rowData['isextend'] == false)
                            return false;
                        return true;
                    };
            }
            g.editorDatas = {};
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.grid = $(g.element);
            g.grid.addClass("l-panel");
            var gridhtmlarr = [];
            gridhtmlarr.push("        <div class='l-panel-header'><div class='grid-panel-title'></div><div class='grid-up-toggle'/><div class='grid-down-toggle' style='display: none'/><span class='l-panel-header-text'></span></div>");
            gridhtmlarr.push("                    <div class='l-grid-loading'></div>");
            gridhtmlarr.push("        <div class='l-panel-topbar'></div>");
            gridhtmlarr.push("        <div class='l-panel-bwarp'>");
            gridhtmlarr.push("            <div class='l-panel-body'>");
            gridhtmlarr.push("                <div class='l-grid'>");
            gridhtmlarr.push("                    <div class='l-grid-dragging-line'></div>");
            gridhtmlarr.push("                    <div class='l-grid-popup'><table cellpadding='0' cellspacing='0'><tbody></tbody></table></div>");

            gridhtmlarr.push("                  <div class='l-grid1'>");
            gridhtmlarr.push("                      <div class='l-grid-header l-grid-header1'>");
            gridhtmlarr.push("                          <div class='l-grid-header-inner'><table class='l-grid-header-table' cellpadding='0' cellspacing='0'><tbody></tbody></table></div>");
            gridhtmlarr.push("                      </div>");
            gridhtmlarr.push("                      <div class='l-grid-body l-grid-body1'>");
            gridhtmlarr.push("                      </div>");
            gridhtmlarr.push("                  </div>");

            gridhtmlarr.push("                  <div class='l-grid2'>");
            gridhtmlarr.push("                      <div class='l-grid-header l-grid-header2'>");
            gridhtmlarr.push("                          <div class='l-grid-header-inner'><table class='l-grid-header-table' cellpadding='0' cellspacing='0'><tbody></tbody></table></div>");
            gridhtmlarr.push("                      </div>");
            gridhtmlarr.push("                      <div class='l-grid-body l-grid-body2 l-scroll'>");
            gridhtmlarr.push("                      </div>");
            gridhtmlarr.push("                  </div>");


            gridhtmlarr.push("                 </div>");
            gridhtmlarr.push("              </div>");
            gridhtmlarr.push("         </div>");
            gridhtmlarr.push("         <div class='l-panel-bar'>");
            gridhtmlarr.push("            <div class='l-panel-bbar-inner'>");
            gridhtmlarr.push("                <div class='l-bar-group  l-bar-message'><span class='l-bar-text'></span></div>");
            gridhtmlarr.push("            <div class='l-bar-group l-bar-selectpagesize'></div>");
            gridhtmlarr.push("                <div class='l-bar-separator'></div>");
            gridhtmlarr.push("                <div class='l-bar-group'>");
            gridhtmlarr.push("                    <div class='l-bar-button l-bar-btnfirst'><span></span></div>");
            gridhtmlarr.push("                    <div class='l-bar-button l-bar-btnprev'><span></span></div>");
            gridhtmlarr.push("                </div>");
            gridhtmlarr.push("                <div class='l-bar-separator'></div>");
            gridhtmlarr.push("                <div class='l-bar-group'><span class='pcontrol'> <input type='text' size='4' value='1' style='width:22px; height: 19px; line-height:19px;text-align: center' maxlength='3' /> / <span></span></span></div>");
            gridhtmlarr.push("                <div class='l-bar-separator'></div>");
            gridhtmlarr.push("                <div class='l-bar-group'>");
            gridhtmlarr.push("                     <div class='l-bar-button l-bar-btnnext'><span></span></div>");
            gridhtmlarr.push("                    <div class='l-bar-button l-bar-btnlast'><span></span></div>");
            gridhtmlarr.push("                </div>");
            gridhtmlarr.push("                <div class='l-bar-separator'></div>");
            gridhtmlarr.push("                <div class='l-bar-group'>");
            gridhtmlarr.push("                     <div class='l-bar-button l-bar-btnload'><span></span></div>");
            gridhtmlarr.push("                </div>");
            gridhtmlarr.push("                <div class='l-bar-separator'></div>");
            gridhtmlarr.push("                <div class='l-bar-group'>");
            gridhtmlarr.push("                     <div class='l-bar-button l-icon-add-default'><span></span></div>");
            gridhtmlarr.push("                </div>");
            gridhtmlarr.push("                <div class='l-bar-separator-default'></div>");
            gridhtmlarr.push("                <div class='l-clear'></div>");
            gridhtmlarr.push("            </div>");
            gridhtmlarr.push("         </div>");
            g.grid.html(gridhtmlarr.join(''));
            //头部
            g.header = $(".l-panel-header:first", g.grid);
            //主体
            g.body = $(".l-panel-body:first", g.grid);
            //底部工具条
            g.toolbar = $(".l-panel-bar:first", g.grid);
            //显示/隐藏列
            g.popup = $(".l-grid-popup:first", g.grid);
            //加载中
            g.gridloading = $(".l-grid-loading:first", g.grid);
            //调整列宽层
            g.draggingline = $(".l-grid-dragging-line", g.grid);
            //顶部工具栏
            g.topbar = $(".l-panel-topbar:first", g.grid);

            g.gridview = $(".l-grid:first", g.grid);
            g.gridview.attr("id", g.id + "grid");
            g.gridview1 = $(".l-grid1:first", g.gridview);
            g.gridview2 = $(".l-grid2:first", g.gridview);
            //表头
            g.gridheader = $(".l-grid-header:first", g.gridview2);
            //表主体
            g.gridbody = $(".l-grid-body:first", g.gridview2);

            //frozen
            g.f = {};
            //表头
            g.f.gridheader = $(".l-grid-header:first", g.gridview1);
            //表主体
            g.f.gridbody = $(".l-grid-body:first", g.gridview1);

            g.currentData = null;
            g.changedCells = {};
            g.editors = {};                 //多编辑器同时存在
            g.editor = { editing: false };  //单编辑器,配置clickToEdit
            if (p.height == "auto")
            {
                g.bind("SysGridHeightChanged", function ()
                {
                    if (g.enabledFrozen())
                        g.gridview.height(Math.max(g.gridview1.height(), g.gridview2.height()));
                });
            }

            var pc = $.extend({}, p);

            this._bulid();
            this._setColumns(p.columns);
            //添加头显示菜单
//            g._initHeaderMenu() ;

            delete pc['columns'];
            delete pc['data'];
            delete pc['url'];
            g.set(pc);
            if (!p.delayLoad)
            {
                if (p.data)
                    g.set({ data: p.data });
                else if (p.url)
                    g.set({ url: p.url });
            }
        },
        _setFrozen: function (frozen)
        {
            if (frozen)
                this.grid.addClass("l-frozen");
            else
                this.grid.removeClass("l-frozen");
        },
        _setCssClass: function (value)
        {
            this.grid.addClass(value);
        },
        _setLoadingMessage: function (value)
        {
            this.gridloading.html(value);
        },
        _setHeight: function (h)
        {
            var g = this, p = this.options;
            g.unbind("SysGridHeightChanged");
            if (h == "auto")
            {
                g.bind("SysGridHeightChanged", function ()
                {
                    if (g.enabledFrozen())
                        g.gridview.height(Math.max(g.gridview1.height(), g.gridview2.height()));
                });
                return;
            }
            if (typeof h == "string" && h.indexOf('%') > 0)
            {
                if (p.inWindow)
                    h = $(window).height() * parseFloat(h) * 0.01;
                else
                    h = g.grid.parent().height() * parseFloat(h) * 0.01;
            }
            if (p.title) h -= 24;
            if (p.usePager) h -= 33;
            if (p.totalRender) h -= 25;
            if (p.toolbar) h -= g.topbar.outerHeight();
            var gridHeaderHeight = p.headerRowHeight * (g._columnMaxLevel - 1) + p.headerRowHeight - 1;
            h -= (gridHeaderHeight);
            if (h > 0)
            {
                var border = 1;

                g.gridbody.height(h - border * 4);
                g.f.gridbody.height(h - border * 4);
                g.gridview.height(h + gridHeaderHeight - border * 2);
                if(g.f.gridbody[0].clientHeight>g.gridbody[0].clientHeight){
                    g.f.gridbody.height(g.gridbody[0].clientHeight);
                }
            }
        },
        _updateFrozenWidth: function ()
        {
            var g = this, p = this.options;
            if (g.enabledFrozen())
            {
                g.gridview1.width(g.f.gridtablewidth);
                var view2width = g.gridview.width() - g.f.gridtablewidth;
                g.gridview2.css({ left: g.f.gridtablewidth });
                if (view2width > 0) g.gridview2.css({ width: view2width });
            }
        },
        _setWidth: function (value)
        {
            var g = this, p = this.options;
            if (g.enabledFrozen()) g._onResize();
        },
        _setUrl: function (value)
        {
            this.options.url = value;
            if (value)
            {
                this.options.dataType = "server";
                this.loadData(true);
            }
            else
            {
                this.options.dataType = "local";
            }
        },
        _setData: function (value)
        {
            this.loadData(this.options.data);
        },
        loadColumnData:function(){
            var g = this, p = this.options;
            g._loadColumnData();
        },
        _loadColumnData:function(){
            var g = this, p = this.options;
            $(g.columns).each(function(i,column){
                if(column.editor&&(column.editor.type=="select"||column.editor.type=="combobox")){
                    g.editorDatas[column.name] = null;
                    if( column.editor.url){
                        var options = {
                            type: 'post',
                            url: column.editor.url,
                            cache: false,
                            dataType:'json',
                            success: function (data)
                            {
                                if($.juiceMethos.ComboBox.dataTransform){
                                    data = $.juiceMethos.ComboBox.dataTransform(data);
                                }
                                g.editorDatas[column.name] = data;
                            }
                        };
                        $.jui.ajaxQueue.offer(options);
                    }else if(column.editor.data){
                        g.editorDatas[column.name] = column.editor.data;
                    }

                }
            });
        },
        _renderColumn:function(data){
            var g = this, p = this.options;
            var columnStore = {};
            $(g.columns).each(function(i,column){
                if(column.editor&&(column.editor.type=="select"||column.editor.type=="combobox")){
                    columnStore[column.name] = {};
                    columnStore[column.name]["textField"] = column.editor.textField;
                    columnStore[column.name]["valueField"] = column.editor.valueField;
                }
            });
            var renderData = {};
            for(var ekey in g.editorDatas){
                renderData[ekey] = {};
                $(g.editorDatas[ekey]).each(function(i,item){
                    if(columnStore[ekey]){
                        renderData[ekey][item[columnStore[ekey]["valueField"]]+""] = item[columnStore[ekey]["textField"]];
                    }
                });
            }
            var rows = data[p.root];
            if(rows){
                for(var i=0;i<rows.length;i++){
                    for(var key in rows[i]){
                        if(renderData[key]){
                            var text = renderData[key][rows[i][key]];
                            if(columnStore[key]){
                                rows[i][columnStore[key]["textField"]+""] = text;
                            }
                        }
                    }
                }
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 刷新数据 。
         * @name   juiceGrid#loadData
         * @param [loadDataParm]  是否重新提交服务器,或者是筛选的函数,也可以指定data
         * @function
         */
        loadData: function (loadDataParm)
        {
            var g = this, p = this.options;
            g.loading = true;
            var clause = null;
            var loadServer = true;
            g._loadColumnData();
            if (typeof (loadDataParm) == "function")
            {
                clause = loadDataParm;
                loadServer = false;
            }
            else if (typeof (loadDataParm) == "boolean")
            {
                loadServer = loadDataParm;
                p.dataType = "server";
            }
            else if (typeof (loadDataParm) == "object" && loadDataParm)
            {
                loadServer = false;
                //p.dataType = "local";
                p.data = loadDataParm;
            }
            //参数初始化
            if (!p.newPage) p.newPage = 1;
            if (p.dataAction == "server")
            {
                if (!p.sortOrder) p.sortOrder = "asc";
            }
            if(g.initParams){
                g.initParams(p);
            }
            var param = [];
            if (p.parms)
            {
                if (p.parms.length)
                {
                    $(p.parms).each(function ()
                    {
                        param.push({ name: this.name, value: this.value });
                    });
                }
                else if (typeof p.parms == "object")
                {
                    for (var name in p.parms)
                    {
                        param.push({ name: name, value: p.parms[name] });
                    }
                }
            }
            if (p.dataAction == "server")
            {
                if (p.usePager)
                {
                    param.push({ name: p.pageParmName, value: p.newPage });
                    param.push({ name: p.pagesizeParmName, value: p.pageSize });
                }
                if (p.sortName)
                {
                    param.push({ name: p.sortnameParmName, value: p.sortName });
                    param.push({ name: p.sortorderParmName, value: p.sortOrder });
                }
            };
            $(".l-bar-btnload span", g.toolbar).addClass("l-disabled");
            if (p.dataType == "local")
            {
                g.filteredData = g.data = p.data;
                if (clause)
                    g.filteredData[p.root] = g._searchData(g.filteredData[p.root], clause);
                if (p.usePager)
                    g.currentData = g._getCurrentPageData(g.filteredData);
                else
                {
                    g.currentData = g.filteredData;
                }
                g._showData();
            }
            else if (p.dataAction == "local" && !loadServer)
            {
                if (g.data && g.data[p.root])
                {
                    g.filteredData = g.data;
                    if (clause)
                        g.filteredData[p.root] = g._searchData(g.filteredData[p.root], clause);
                    g.currentData = g._getCurrentPageData(g.filteredData);
                    g._showData();
                }
            }
            else
            {
                g.loadServerData(param, clause);
                //g.loadServerData.juiceDefer(g, 10, [param, clause]);
            }
            g.loading = false;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 加载服务器数据，其中包含传送数据前的一个 beforeSend函数，
         * &nbsp;&nbsp;&nbsp;一个成功传送数据的success函数，一个加载完成的complete函数，以及一个加载失败的error函数。
         * @name   juiceGrid#loadServerData
         * @param [param]  加载参数
         * @param [clause]  是筛选的函数
         * @function
         */
        loadServerData: function (param, clause)
        {
            var g = this, p = this.options;
            var ajaxOptions = {
                type: p.method,
                url: p.url,
                data: param,
                async: p.async,
                dataType: 'json',
                beforeSend: function ()
                {
                    if (g.hasBind('loading'))
                    {
                        g.trigger('loading');
                    }
                    else
                    {
                        g.toggleLoading(true);
                    }
                },
                success: function (data)
                {
                    g.trigger('success', [data, g]);
                    if(g.dataTransform)data=g.dataTransform.call(g,data,g);
                    if (!data || !data[p.root] || !data[p.root].length)
                    {
                        g.currentData = g.data = {};
                        g.currentData[p.root] = g.data[p.root] = [];
                        g.currentData[p.record] = g.data[p.record] = 0;
                        g._showData();
                        return;
                    }
                    g.data = data;

//                    if (p.dataAction == "server")
//                    {
                    g.currentData = g.data;
//                    }
//                    else
//                    {
//                        g.filteredData = g.data;
//                        if (clause) g.filteredData[p.root] = g._searchData(g.filteredData[p.root], clause);
//                        if (p.usePager)
//                            g.currentData = g._getCurrentPageData(g.filteredData);
//                        else
//                            g.currentData = g.filteredData;
//                    }
                    g._showData.juiceDefer(g, 10, [g.currentData]);
                },
                complete: function ()
                {
                    g.trigger('complete', [g]);
                    if (g.hasBind('loaded'))
                    {
                        g.trigger('loaded', [g]);
                    }
                    else
                    {
                        g.toggleLoading.juiceDefer(g, 10, [false]);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown)
                {
                    g.currentData = g.data = {};
                    g.currentData[p.root] = g.data[p.root] = [];
                    g.currentData[p.record] = g.data[p.record] = 0;
                    g.toggleLoading.juiceDefer(g, 10, [false]);
                    $(".l-bar-btnload span", g.toolbar).removeClass("l-disabled");
                    g.trigger('error', [XMLHttpRequest, textStatus, errorThrown]);
                }
            };
            if (p.contentType) ajaxOptions.contentType = p.contentType;
            $.jui.ajaxQueue.offer(ajaxOptions);
        },
        load:function(data){
            var g = this;
            g.currentData = g.data = data;
            g._showData.juiceDefer(g, 10, [g.currentData]);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 加载伸展/收缩数据。
         * @name   juiceGrid#toggleLoading
         * @param [show]  显示类型
         * @function
         */
        toggleLoading: function (show)
        {
            this.gridloading[show ? 'show' : 'hide']();
        },
        _createEditor: function (editor, container, editParm, width, height)
        {
            var g = this;
            var editorInput = editor.create(container, editParm);
            if (editor.setValue) editor.setValue(editorInput, editParm.value, editParm);
            if (editor.resize) editor.resize(editorInput, width, height, editParm);

            //弥补ie 6,8,9下不能获取到焦点的bug
            if(navigator.userAgent.indexOf("MSIE")>0){
                var esrc = editorInput[0];
                if(esrc==null){
                    esrc=event.srcElement||event.target;
                }
                var rtextRange =esrc.createTextRange();
                rtextRange.moveStart('character',esrc.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            }
            return editorInput;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 使一行进入编辑状态。
         * @name   juiceGrid#beginEdit
         * @param [rowParm]    rowindex或者rowdata
         * @param [containerBulider]    编辑器填充层构造器
         * @function
         */
        beginEdit: function (rowParm, containerBulider)
        {
            var g = this, p = this.options;
            if (!p.enabledEdit || p.clickToEdit) return;
            var rowdata = g.getRow(rowParm);
            if (rowdata._editing) return;
            if (g.trigger('beginEdit', { record: rowdata, rowindex: rowdata['__index'] }) == false) return;
            g.editors[rowdata['__id']] = {};
            rowdata._editing = true;
            g.reRender({ rowdata: rowdata });
            containerBulider = containerBulider || function (rowdata, column)
                {
                    var cellobj = g.getCellObj(rowdata, column);
                    var container = $(cellobj).html("");
                    g.setCellEditing(rowdata, column, true);
                    return container;
                };
            for (var i = 0, l = g.columns.length; i < l; i++)
            {
                var column = g.columns[i];
                if (!column.name || !column.editor || !column.editor.type || !p.editors[column.editor.type]) continue;
                var editor = p.editors[column.editor.type];
                var editParm = { record: rowdata, value: rowdata[column.name], column: column, rowindex: rowdata['__index'], grid: g };
                var container = containerBulider(rowdata, column);
                var width = container.width(), height = container.height();
                var editorInput = g._createEditor(editor, container, editParm, width, height);
                g.editors[rowdata['__id']][column['__id']] = { editor: editor, input: editorInput, editParm: editParm, container: container };
            }
            g.trigger('afterBeginEdit', { record: rowdata, rowindex: rowdata['__index'] });

        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消编辑。
         * @name   juiceGrid#cancelEdit
         * @param [rowParm]    rowindex或者rowdata
         * @function
         */
        cancelEdit: function (rowParm)
        {
            var g = this;
            if (rowParm == undefined)
            {
                for (var rowid in g.editors)
                {
                    g.cancelEdit(rowid);
                }
            }
            else
            {
                var rowdata = g.getRow(rowParm);
                if (!g.editors[rowdata['__id']]) return;
                if (g.trigger('cancelEdit', { record: rowdata, rowindex: rowdata['__index'] }) == false) return;
                for (var columnid in g.editors[rowdata['__id']])
                {
                    var o = g.editors[rowdata['__id']][columnid];
                    if (o.editor.destroy) o.editor.destroy(o.input, o.editParm);
                }
                delete g.editors[rowdata['__id']];
                delete rowdata['_editing'];
                g.reRender({ rowdata: rowdata });
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;增加编辑行。
         * @name   juiceGrid#addEditRow
         * @param [rowdata]    行数据
         * @function
         */
        addEditRow: function (rowdata)
        {
            this.submitEdit();
            rowdata = this.add(rowdata);
            this.beginEdit(rowdata);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提交编辑数据。
         * @name   juiceGrid#submitEdit
         * @param [rowParm]     rowindex或者rowdata
         * @function
         */
        submitEdit: function (rowParm)
        {
            var g = this, p = this.options;
            if (rowParm == undefined)
            {
                for (var rowid in g.editors)
                {
                    g.submitEdit(rowid);
                }
            }
            else
            {
                var rowdata = g.getRow(rowParm);
                var newdata = {};
                if (!g.editors[rowdata['__id']]) return;
                for (var columnid in g.editors[rowdata['__id']])
                {
                    var o = g.editors[rowdata['__id']][columnid];
                    var column = o.editParm.column;
                    if (column.name)
                        newdata[column.name] = o.editor.getValue(o.input, o.editParm);
                }
                if (g.trigger('beforeSubmitEdit', { record: rowdata, rowindex: rowdata['__index'], newdata: newdata }) == false)
                    return false;
                g.updateRow(rowdata, newdata);
                g.trigger('afterSubmitEdit', { record: rowdata, rowindex: rowdata['__index'], newdata: newdata });
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束编辑。
         * @name   juiceGrid#endEdit
         * @param [rowParm]  rowindex或者rowdata(行编辑模式)(单元格编辑模式为空)
         * @function
         */
        endEdit: function (rowParm)
        {
            var g = this, p = this.options;
            if (g.editor.editing)
            {
                var o = g.editor;
                g.trigger('sysEndEdit', [g.editor.editParm]);
                g.trigger('endEdit', [g.editor.editParm]);
                if (o.editor.destroy) o.editor.destroy(o.input, o.editParm);
                g.editor.container.remove();
                g.reRender({ rowdata: g.editor.editParm.record, column: g.editor.editParm.column });
                g.trigger('afterEdit', [g.editor.editParm]);
                g.editor = { editing: false };
            }
            else if (rowParm != undefined)
            {
                var rowdata = g.getRow(rowParm);
                if (!g.editors[rowdata['__id']]) return;
                if (g.submitEdit(rowParm) == false) return false;
                for (var columnid in g.editors[rowdata['__id']])
                {
                    var o = g.editors[rowdata['__id']][columnid];
                    if (o.editor.destroy) o.editor.destroy(o.input, o.editParm);
                }
                delete g.editors[rowdata['__id']];
                delete rowdata['_editing'];
                g.trigger('afterEdit', { record: rowdata, rowindex: rowdata['__index'] });
            }
            else
            {
                for (var rowid in g.editors)
                {
                    g.endEdit(rowid);
                }
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置宽度。
         * @name   juiceGrid#setWidth
         * @param [w] 宽度变量
         * @return  设定的宽度
         * @function
         */
        setWidth: function (w)
        {
            return this._setWidth(w);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置高度。
         * @name   juiceGrid#setHeight
         * @param [h] 高度变量
         * @return  设定的高度
         * @function
         */
        setHeight: function (h)
        {
            return this._setHeight(h);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置向上收缩。
         * @name   juiceGrid#setUpCollapse
         * @param [isCollapse]  是否收缩
         * @function
         */
        setUpCollapse:function(isCollapse){
            var g = this, p = this.options;
            if (!g.grid) return false;
            g.upCollapse = isCollapse;
            if (g.upCollapse)
            {
                g.body.hide();
                g.toolbar.hide();
            }else
            {
                g.body.show();
                g.toolbar.show();
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否启用复选框列。
         * @name   juiceGrid#enabledCheckbox
         * @return Boolean true|false
         * @function
         */
        enabledCheckbox: function ()
        {
            return this.options.checkbox ? true : false;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否固定列。
         * @name   juiceGrid#enabledFrozen
         * @return Boolean true|false
         * @function
         */
        enabledFrozen: function ()
        {
            var g = this, p = this.options;
            if (!p.frozen) return false;
            var cols = g.columns || [];
            if (g.enabledDetail() && p.frozenDetail || g.enabledCheckbox() && p.frozenCheckbox
                || p.frozenRownumbers && p.rownumbers) return true;
            for (var i = 0, l = cols.length; i < l; i++)
            {
                if (cols[i].frozen)
                {
                    return true;
                }
            }
            this._setFrozen(false);
            return false;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否启用明细编辑。
         * @name   juiceGrid#enabledDetailEdit
         * @return Boolean true|false
         * @function
         */
        enabledDetailEdit: function ()
        {
            if (!this.enabledDetail()) return false;
            return this.options.detailToEdit ? true : false;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否启用明细列。
         * @name   juiceGrid#enabledDetail
         * @return Boolean  false
         * @function
         */
        enabledDetail: function ()
        {
            if (this.options.detail && this.options.detail.onShowDetail) return true;
            return false;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否启用分组。
         * @name   juiceGrid#enabledGroup
         * @return Boolean true|false
         * @function
         */
        enabledGroup: function ()
        {
            return this.options.groupColumnName ? true : false;
        },
        enabledColumnsGroup:function(){
            return (this.options.groupColumnName&&this.options.groupColumnName.indexOf(",")>0) ? true : false;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除所选行。
         * @name   juiceGrid#deleteSelectedRow
         * @function
         */
        deleteSelectedRow: function ()
        {
            if (!this.selected) return;
            for (var i in this.selected)
            {
                var o = this.selected[i];
                if (o['__id'] in this.records)
                    this._deleteData.juiceDefer(this, 10, [o]);
            }
            this.reRender.juiceDefer(this, 20);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;移除多行 。
         * @name   juiceGrid#removeRange
         * @param [rowArr]  多行数据
         * @function
         */
        removeRange: function (rowArr)
        {
            var g = this, p = this.options;
            $.each(rowArr, function ()
            {
                g._removeData(this);
            });
            g.reRender();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;移除行 。
         * @name   juiceGrid#remove
         * @param [rowParm]  rowindex或者rowdata
         * @function
         */
        remove: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            g._removeData(rowParm);
            g.reRender();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一次性删除多行 。
         * @name   juiceGrid#deleteRange
         * @param [rowArr]  多行数据
         * @function
         */
        deleteRange: function (rowArr)
        {
            var g = this, p = this.options;
            $.each(rowArr, function ()
            {
                g._deleteData(this);
            });
            g.reRender();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除单行 。
         * @name   juiceGrid#deleteRow
         * @param [rowParm]   rowindex或者rowdata
         * @function
         */
        deleteRow: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            if (!rowdata) return;
            g._deleteData(rowdata);
            g.reRender();
            g.isDataChanged = true;
        },
        _deleteData: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            rowdata[p.statusName] = 'delete';
            if (p.tree)
            {
                var children = g.getChildren(rowdata, true);
                if (children)
                {
                    for (var i = 0, l = children.length; i < l; i++)
                    {
                        children[i][p.statusName] = 'delete';
                    }
                }
            }
            g.deletedRows = g.deletedRows || [];
            g.deletedRows.push(rowdata);
            g._removeSelected(rowdata);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新单元格 。
         * @name   juiceGrid#updateCell
         * @param  {arg} column index、column name、column、单元格
         * @param  {value} 值
         * @param  {rowParm} rowindex或者rowdata
         * @function
         */
        updateCell: function (arg, value, rowParm)
        {
            var g = this, p = this.options;
            var column, cellObj, rowdata;
            if (typeof (arg) == "string") //column name
            {
                for (var i = 0, l = g.columns.length; i < l; i++)
                {
                    if (g.columns[i].name == arg)
                    {
                        g.updateCell(i, value, rowParm);
                    }
                }
                return;
            }
            if (typeof (arg) == "number")
            {
                column = g.columns[arg];
                rowdata = g.getRow(rowParm);
                cellObj = g.getCellObj(rowdata, column);
            }
            else if (typeof (arg) == "object" && arg['__id'])
            {
                column = arg;
                rowdata = g.getRow(rowParm);
                cellObj = g.getCellObj(rowdata, column);
            }
            else
            {
                cellObj = arg;
                var ids = cellObj.id.split('|');
                var columnid = ids[ids.length - 1];
                column = g._columns[columnid];
                var row = $(cellObj).parent();
                rowdata = rowdata || g.getRow(row[0]);
            }
            if (value != null && column.name)
            {
                rowdata[column.name] = value;
                if (rowdata[p.statusName] != 'add')
                    rowdata[p.statusName] = 'update';
                g.isDataChanged = true;
            }
//            g.reRender({ rowdata: rowdata, column: column });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一次性增加多行 。
         * @name   juiceGrid#addRows
         * @param  {Array} rowdataArr 要附加的数据
         * @param  {Object} neardata    插入的位置 可以是DOM对象，也可以是Row Data(非必填)
         * @param  {Boolean} isBefore   是否加在之前
         * @param  {Object} parentRowData 父节点数据
         * @function
         */
        addRows: function (rowdataArr, neardata, isBefore, parentRowData)
        {
            var g = this, p = this.options;
            $(rowdataArr).each(function ()
            {
                g.addRow(this, neardata, isBefore, parentRowData);
            });
        },
        _createRowid: function ()
        {
            return "r" + (1000 + this.recordNumber);
        },
        _isRowId: function (str)
        {
            return (str in this.records);
        },
        _addNewRecord: function (o, previd, pid)
        {
            var g = this, p = this.options;
            g.recordNumber++;
            o['__id'] = g._createRowid();
            o['__previd'] = previd;
            if (previd && previd != -1)
            {
                var prev = g.records[previd];
                if (prev['__nextid'] && prev['__nextid'] != -1)
                {
                    var prevOldNext = g.records[prev['__nextid']];
                    if (prevOldNext)
                        prevOldNext['__previd'] = o['__id'];
                }
                prev['__nextid'] = o['__id'];
                o['__index'] = prev['__index'] + 1;
            }
            else
            {
                o['__index'] = 0;
            }
            if (p.tree)
            {
                if (pid && pid != -1)
                {
                    var parent = g.records[pid];
                    o['__pid'] = pid;
                    o['__level'] = parent['__level'] + 1;
                }
                else
                {
                    o['__pid'] = -1;
                    o['__level'] = 1;
                }
                o['__hasChildren'] = o[p.tree.childrenName] ? true : false;
            }
            if (o[p.statusName] != "add")
                o[p.statusName] = "nochanged";
            g.rows[o['__index']] = o;
            g.records[o['__id']] = o;
            return o;
        },
        //将原始的数据转换成适合 grid的行数据
        _getRows: function (data)
        {
            var g = this, p = this.options;
            var targetData = [];
            function load(data)
            {
                if (!data || !data.length) return;
                for (var i = 0, l = data.length; i < l; i++)
                {
                    var o = data[i];
                    targetData.push(o);
                    if (o[p.tree.childrenName])
                    {
                        load(o[p.tree.childrenName]);
                    }
                }
            }
            load(data);
            return targetData;
        },
        _updateGridData: function ()
        {
            var g = this, p = this.options;
            g.recordNumber = 0;
            g.rows = [];
            g.records = {};
            var previd = -1;
            function load(data, pid)
            {
                if (!data || !data.length) return;
                for (var i = 0, l = data.length; i < l; i++)
                {
                    var o = data[i];
                    g.formatRecord(o);
                    if (o[p.statusName] == "delete") continue;
                    g._addNewRecord(o, previd, pid);
                    previd = o['__id'];
                    if (o['__hasChildren'])
                    {
                        load(o[p.tree.childrenName], o['__id']);
                    }
                }
            }
            load(g.currentData[p.root], -1);
            return g.rows;
        },
        _moveData: function (from, to, isAfter)
        {
            var g = this, p = this.options;
            var fromRow = g.getRow(from);
            var toRow = g.getRow(to);
            var fromIndex, toIndex;
            var listdata = g._getParentChildren(fromRow);
            fromIndex = $.inArray(fromRow, listdata);
            listdata.splice(fromIndex, 1);
            listdata = g._getParentChildren(toRow);
            toIndex = $.inArray(toRow, listdata);
            listdata.splice(toIndex + (isAfter ? 1 : 0), 0, fromRow);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;移动行  。
         * @name   juiceGrid#move
         * @param  {Object}from  来源表头
         * @param  {Object} to 目标位置表头
         * @param  {Boolean}isAfter 是否附加到后面
         * @function
         */
        move: function (from, to, isAfter)
        {
            this._moveData(from, to, isAfter);
            this.reRender();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;移动多行  。
         * @name   juiceGrid#moveRange
         * @param  {Object}rows  多行数据
         * @param  {Object} to 目标位置表头
         * @param  {Boolean}isAfter 是否附加到后面
         * @function
         */
        moveRange: function (rows, to, isAfter)
        {
            for (var i in rows)
            {
                this._moveData(rows[i], to, isAfter);
            }
            this.reRender();
        },
        moveSelectRow:function(rowParm,up){
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var listdata = g._getParentChildren(rowdata);
            var index = $.inArray(rowdata, listdata);
            if(index>0&&up>0){
                g.selectWithoutTrigger(index-1);
            }
            if(index>=0&&index<(listdata.length-1)&&up<0){
                g.selectWithoutTrigger(index+1);
            }

        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上移  。
         * @name   juiceGrid#up
         * @param  {Object} rowParm rowindex或者rowdata
         * @function
         */
        up: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var listdata = g._getParentChildren(rowdata);
            var index = $.inArray(rowdata, listdata);
            if (index == -1 || index == 0) return;
            var selected = g.getSelected();
            g.move(rowdata, listdata[index - 1], false);
            g.select(selected);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下移  。
         * @name   juiceGrid#down
         * @param  {Object} rowParm rowindex或者rowdata
         * @function
         */
        down: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var listdata = g._getParentChildren(rowdata);
            var index = $.inArray(rowdata, listdata);
            if (index == -1 || index == listdata.length - 1) return;
            var selected = g.getSelected();
            g.move(rowdata, listdata[index + 1], true);
            g.select(selected);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;增加多行数据  。
         * @name   juiceGrid#addDataRows
         * @param  {Object}  rowdatas     要附加的数据(非必填)
         * @param  {Object}  neardata     插入的位置 可以是DOM对象，也可以是Row Data(非必填)
         * @param  {Boolean}  isBefore    是否在指定Dom对象的前方插入行(非必填)
         * @param  {Object}  parentRowData 作为子节点加入到这个行(树模式可用)(非必填)
         * @function
         */
        addDataRows:function(rowdatas, neardata, isBefore, parentRowData){
            var g = this, p = this.options;
            $(rowdatas).each(function(index,rowdata){
                g.addRowInit(rowdata, neardata, isBefore, parentRowData);
            });
            g.addRowRender(rowdatas);
//            alert(g._generateRowsHtml(rowdatas,g.enabledFrozen()));
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;增加新行 。
         * @name   juiceGrid#addRow
         * @param  {Object}  rowdatas     要附加的数据(非必填)
         * @param  {Object}  neardata     插入的位置 可以是DOM对象，也可以是Row Data(非必填)
         * @param  {Boolean}  isBefore    是否在指定Dom对象的前方插入行(非必填)
         * @param  {Object}  parentRowData 作为子节点加入到这个行(树模式可用)(非必填)
         * @return {Object}  rowdata
         * @function
         */
        addRow: function (rowdata, neardata, isBefore, parentRowData)
        {
            var g = this,p=this.options;
            g.addRowInit(rowdata, neardata, isBefore, parentRowData);
            g.addRowRender([rowdata]);
        },
        addRowInit:function(rowdata, neardata, isBefore, parentRowData){
            var g = this,p=this.options;
            g._addData(rowdata, parentRowData, neardata, isBefore);
            rowdata[p.statusName] = 'add';
            rowdata["__id"] =g._createRowid();
            if (p.tree)
            {
                var children = g.getChildren(rowdata, true);
                if (children)
                {
                    for (var i = 0, l = children.length; i < l; i++)
                    {
                        children[i][p.statusName] = 'add';
                    }
                }
            }
            g.isDataChanged = true;
            p.total = p.total ?parseInt(p.total) + 1 : 1;
            p.pageCount = Math.ceil(p.total / p.pageSize);
            g._buildPager();
            g.trigger('SysGridHeightChanged');
            g.trigger('afterAddRow', [rowdata]);
        },
        addRowRender:function(rowdatas){
            var g = this,p=this.options;
            g._updateGridData();
            var frozen = g.enabledFrozen();
            if (frozen)
            {
                $("tbody",g.f.gridbody).append(g._generateRowsHtml(rowdatas,true));
            }
            $("tbody",g.gridbody).append(g._generateRowsHtml(rowdatas,false));
            //滚动到最后一条 记录
            var scrollTop = g.gridbody.scrollTop();
            g.gridbody.scrollTop(g.gridbody.height()+g.gridbody[0].scrollHeight);
            if (scrollTop != null){
                g.f.gridbody[0].scrollTop = scrollTop;
            }
            if(!p.isScroll){
                g._onResize();
            }
            for(var i=0;i<rowdatas.length;i++){
                g.select(rowdatas[i]);
            }

        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新行  。
         * @name   juiceGrid#updateRow
         * @param  {Object}  rowDom     DOM对象
         * @param  {Object}  newRowData  要附加的数据(非必填)
         * @return {Object}  rowdata
         * @function
         */
        updateRow: function (rowDom, newRowData)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowDom);
            //标识状态
            g.isDataChanged = true;
            for(var key in newRowData){
                if(rowdata[key]!=newRowData[key]){
                    var rowcell = g.getCellObj(rowDom,g._getColumnByName(key));
                    $(rowcell).addClass("l-grid-row-cell-edited");
                }
            }
            $.extend(rowdata, newRowData || {});
            if (rowdata[p.statusName] != 'add')
                rowdata[p.statusName] = 'update';
            g.reRender.juiceDefer(g, 10, [{ rowdata: rowdata}]);
            return rowdata;
        },
        getColumnByName:function(name){
            var g = this, p = this.options;
            return g._getColumnByName(name);
        },
        _getColumnByName:function(name){
            var g = this, p = this.options;
            for(var key in g._columns){
                if(g._columns[key]["name"] == name){
                    return  g._columns[key] ;
                }
            }
            return null;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置单元格可编辑  。
         * @name   juiceGrid#setCellEditing
         * @param  {Object}  rowdata     列对象
         * @param  {Object}  column    列
         * @param  {Object}  editing  可编辑
         * @function
         */
        setCellEditing: function (rowdata, column, editing)
        {
            var g = this, p = this.options;
            var cell = g.getCellObj(rowdata, column);
            var methodName = editing ? 'addClass' : 'removeClass';
            $(cell)[methodName]("l-grid-row-cell-editing");
            if (column['__previd'] != -1 && column['__previd'] != null)
            {
                var cellprev = $(g.getCellObj(rowdata, column)).prev();
                if(!cellprev.length){
                    var prevRow = $(g.getRowObj(rowdata['__id'],true));
                    cellprev = prevRow.children()[ prevRow.children().length-1];
                }
                $(cellprev)[methodName]("l-grid-row-cell-editing-leftcell");
            }
            if (rowdata['__id'] != 0)
            {
                var prevrowobj = $(g.getRowObj(rowdata['__id'])).prev();
                var cellprev;
                if (!prevrowobj.length){
                    cellprev = document.getElementById(column['__domid']);
                }else{
                    var prevrow = g.getRow(prevrowobj[0]);
                    var cellprev = g.getCellObj(prevrow, column);
                    if (!cellprev) return;
                }
                $(cellprev)[methodName]("l-grid-row-cell-editing-topcell");
            }

        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置非空白单元格  。
         * @name   juiceGrid#setCellNotBlank
         * @param  {Object}  rowdata     列对象
         * @param  {Object}  column    列
         * @param  {Object}  editing  可编辑
         * @function
         */
        setCellNotBlank:function(rowdata, column, editing){
            var g = this, p = this.options;
            var cell = g.getCellObj(rowdata, column);
            var methodName = editing ? 'addClass' : 'removeClass';
            $(cell)[methodName]("l-grid-row-cell-blank");
            if (column['__previd'] != -1 && column['__previd'] != null)
            {
                var cellprev = $(g.getCellObj(rowdata, column)).prev();
                if(!cellprev.length){
                    var prevRow = $(g.getRowObj(rowdata['__id'],true));
                    cellprev = prevRow.children()[ prevRow.children().length-1];
                }
                $(cellprev)[methodName]("l-grid-row-cell-blank-leftcell");
            }
            if (rowdata['__id'] != 0)
            {
                var prevrowobj = $(g.getRowObj(rowdata['__id'])).prev();
                var cellprev;
                if (!prevrowobj.length){
                    cellprev = document.getElementById(column['__domid']);
                }else{
                    var prevrow = g.getRow(prevrowobj[0]);
                    var cellprev = g.getCellObj(prevrow, column);
                    if (!cellprev) return;
                }
                $(cellprev)[methodName]("l-grid-row-cell-blank-topcell");
            }
        },
        reRender: function (e)
        {
            var g = this, p = this.options;
            e = e || {};
            var rowdata = e.rowdata, column = e.column;
            if (column && (column.isdetail || column.ischeckbox)) return;
            if (rowdata && rowdata[p.statusName] == "delete") return;
            if (rowdata && column)
            {
                var cell = g.getCellObj(rowdata, column);
                $(cell).html(g._getCellHtml(rowdata, column));
                if (!column.issystem)
                    g.setCellEditing(rowdata, column, false);
            }
            else if (rowdata)
            {
                $(g.columns).each(function () {g.reRender({ rowdata: rowdata, column: this }); });
            }
            else if (column)
            {
                for (var rowid in g.records) { g.reRender({ rowdata: g.records[rowid], column: column }); }
                for (var i = 0; i < g.totalNumber; i++)
                {
                    var tobj = document.getElementById(g.id + "|total" + i + "|" + column['__id']);
                    $("div:first", tobj).html(g._getTotalCellContent(column, g.groups && g.groups[i] ? g.groups[i] : g.currentData[p.root]));
                }
            }
            else
            {
                g._showData();
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取数据 。
         * @name   juiceGrid#getData
         * @param  {Object}  status     状态名,可以为空
         * @param  {Object}  removeStatus    否移除状态字段,可以为空
         * @return {Array} data 一个数据数组。
         * @function
         */
        getData: function (status, removeStatus)
        {
            var g = this, p = this.options;
            var data = [];
            for (var rowid in g.records)
            {
                var o = $.extend(true, {}, g.records[rowid]);
                if (o[p.statusName] == status || status == undefined)
                {
                    data.push(g.formatRecord(o, removeStatus));
                }
            }
            return data;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格式化数据 。
         * @name   juiceGrid#formatRecord
         * @param  {Object}  o  待格式化的对象
         * @param  {Object}  removeStatus    否移除状态字段,可以为空
         * @return {Object} o 对象
         * @function
         */
        formatRecord: function (o, removeStatus)
        {
            delete o['__id'];
            delete o['__previd'];
            delete o['__nextid'];
            delete o['__index'];
            if (this.options.tree)
            {
                delete o['__pid'];
                delete o['__level'];
                delete o['__hasChildren'];
            }
            if (removeStatus) delete o[this.options.statusName];
            return o;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取修改过的数据。
         * @name   juiceGrid#getUpdated
         * @return   更新后的数据
         * @function
         */
        getUpdated: function ()
        {
            return this.getData('update', true);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取删除过的数据。
         * @name   juiceGrid#getDeleted
         * @return  {Object}  data
         * @function
         */
        getDeleted: function ()
        {
            var g = this,p=this.options;
            var data = [];
            for (var i=0;i<g.selected.length;i++)
            {
                var o = $.extend(true, {},g.selected[i]);
                data.push(g.formatRecord(o, true));
            }
            return data;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取新增加的数据。
         * @name   juiceGrid#getAdded
         * @return  {Object}  新增后数据
         * @function
         */
        getAdded: function ()
        {
            return this.getData('add', true);
        },
        checkData:function(){
            var isFilled = true;
            var g = this, p = this.options;
            for (var rowid in g.records)
            {
                var o = $.extend(true, {}, g.records[rowid]);
                if (o[p.statusName] == "add" ||o[p.statusName] == "update"|| status == undefined)
                {
                    $(g.columns).each(function(index,column){
                        if(column.editor&&!column.allowBlank&&!o[column.name]){
                            g.setCellNotBlank(o,column,true);
                            isFilled = false;
                        }
                    });
                }
            }
            return isFilled;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取列信息 。
         * @name   juiceGrid#getColumn
         * @param  {String} columnParm 列ID、列索引
         * @return  {Object}  columnParm
         * @function
         */
        getColumn: function (columnParm)
        {
            var g = this, p = this.options;
            if (typeof columnParm == "string") // column id
            {
                if (g._isColumnId(columnParm))
                    return g._columns[columnParm];
                else
                    return g.columns[parseInt(columnParm)];
            }
            else if (typeof (columnParm) == "number") //column index
            {
                return g.columns[columnParm];
            }
            else if (typeof columnParm == "object" && columnParm.nodeType == 1) //column header cell
            {
                var ids = columnParm.id.split('|');
                var columnid = ids[ids.length - 1];
                return g._columns[columnid];
            }
            return columnParm;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 根据列名获取列类型   。
         * @name   juiceGrid#getColumnType
         * @param  {String} columnname 列名称
         * @return  {Object}  null|String  Column  Type
         * @function
         */
        getColumnType: function (columnname)
        {
            var g = this, p = this.options;
            for (i = 0; i < g.columns.length; i++)
            {
                if (g.columns[i].name == columnname)
                {
                    if (g.columns[i].type) return g.columns[i].type;
                    return "string";
                }
            }
            return null;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否包含汇总。
         * @name   juiceGrid#isTotalSummary
         * @return  {Boolean} false
         * @function
         */
        isTotalSummary: function ()
        {
            var g = this, p = this.options;
            for (var i = 0; i < g.columns.length; i++)
            {
                if (g.columns[i].totalSummary) return true;
            }
            return false;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 根据层次获取列集合，如果columnLevel为空，获取叶节点集合 。
         * @name   juiceGrid#getColumns
         * @param  {String} columnLevel 列层级
         * @return  {Array}  columns  返回指定层级的Columns。
         * @function
         */
        getColumns: function (columnLevel)
        {
            var g = this, p = this.options;
            var columns = [];
            for (var id in g._columns)
            {
                var col = g._columns[id];
                if (columnLevel != undefined)
                {
                    if (col['__level'] == columnLevel) columns.push(col);
                }
                else
                {
                    if (col['__leaf']) columns.push(col);
                }
            }
            return columns;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变排序。
         * @name   juiceGrid#changeSort
         * @param  {String} columnName 列名称
         * @param  {String} sortOrder 排序类型
         * @function
         */
        changeSort: function (columnName, sortOrder)
        {
            var g = this, p = this.options;
            if (g.loading) return true;
            if (p.dataAction == "local")
            {
                var columnType = g.getColumnType(columnName);
                if (!g.sortedData)
                    g.sortedData = g.filteredData;
                if (p.sortName == columnName)
                {
                    if(g.reverse&&sortOrder=="asc"){
                        g.sortedData[p.root].reverse();
                        g.reverse = false;
                    }else if(sortOrder=="desc"&&!g.reverse){
                        g.sortedData[p.root].reverse();
                        g.reverse = true;
                    }
                } else
                {
                    g.sortedData[p.root].sort(function (data1, data2)
                    {
                        var ret =  g._compareData(data1, data2, columnName, columnType);
                        if(sortOrder=="asc"){
                            return ret;
                        }else{
                            return -ret;
                        }
                    });
                    g.reverse = sortOrder != "asc";
                }
                if (p.usePager)
                    g.currentData = g._getCurrentPageData(g.sortedData);
                else
                    g.currentData = g.sortedData;
                g._showData();
            }
            var column = g.getColumnByName(columnName);
            if(column.sortName){
                columnName = column.sortName;
            }
            if(column.sortPrefix){
                columnName = column.sortPrefix + columnName;
            }
            p.sortName = columnName;
            p.sortOrder = sortOrder;
            if (p.dataAction == "server")
            {
                g.loadData(p.where);
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变分页。
         * @name   juiceGrid#changePage
         * @param  {String} ctype  类型：first/prev/next/last/input
         * @function
         */
        changePage: function (ctype)
        {
            var g = this, p = this.options;
            if (g.loading) return true;
            if (p.dataAction != "local" && g.isDataChanged && !confirm(p.isContinueByDataChanged))
                return false;
            p.pageCount = parseInt($(".pcontrol span", g.toolbar).html());
            switch (ctype)
            {
                case 'first': if (p.page == 1) return; p.newPage = 1; break;
                case 'prev': if (p.page == 1) return; if (p.page > 1) p.newPage = parseInt(p.page) - 1; break;
                case 'next': if (p.page >= p.pageCount) return; p.newPage = parseInt(p.page) + 1; break;
                case 'last': if (p.page >= p.pageCount) return; p.newPage = p.pageCount; break;
                case 'input':
                    var nv = parseInt($('.pcontrol input', g.toolbar).val());
                    if (isNaN(nv)) nv = 1;
                    if (nv < 1) nv = 1;
                    else if (nv > p.pageCount) nv = p.pageCount;
                    $('.pcontrol input', g.toolbar).val(nv);
                    p.newPage = nv;
                    break;
            }
            if (p.newPage == p.page) return false;
            if (p.newPage == 1)
            {
                $(".l-bar-btnfirst span", g.toolbar).addClass("l-disabled");
                $(".l-bar-btnprev span", g.toolbar).addClass("l-disabled");
            }
            else
            {
                $(".l-bar-btnfirst span", g.toolbar).removeClass("l-disabled");
                $(".l-bar-btnprev span", g.toolbar).removeClass("l-disabled");
            }
            if (p.newPage == p.pageCount)
            {
                $(".l-bar-btnlast span", g.toolbar).addClass("l-disabled");
                $(".l-bar-btnnext span", g.toolbar).addClass("l-disabled");
            }
            else
            {
                $(".l-bar-btnlast span", g.toolbar).removeClass("l-disabled");
                $(".l-bar-btnnext span", g.toolbar).removeClass("l-disabled");
            }
            g.trigger('changePage', [p.newPage]);
            if (p.dataAction == "server")
            {
                g.loadData(p.where);
            }
            else
            {
                g.currentData = g._getCurrentPageData(g.filteredData);
                g._showData();
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取选中的行。
         * @name   juiceGrid#getSelectedRow
         * @return {Object} null|o
         * @function
         */
        getSelectedRow: function ()
        {
            for (var i in this.selected)
            {
                var o = this.selected[i];
                if (o['__id'] in this.records)
                    return o;
            }
            return null;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取选中的多行数据。
         * @name   juiceGrid#getSelectedRows
         * @return {Array} arr
         * @function
         */
        getSelectedRows: function ()
        {
            var arr = [];
            for (var i in this.selected)
            {
                var o = this.selected[i];
                if (o['__id'] in this.records)
                    arr.push(o);
            }
            return arr;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取选中的行 DOM对象 。
         * @name   juiceGrid#getSelectedRowObj
         * @return {Array} Row Dom Object
         * @function
         */
        getSelectedRowObj: function ()
        {
            for (var i in this.selected)
            {
                var o = this.selected[i];
                if (o['__id'] in this.records)
                    return this.getRowObj(o);
            }
            return null;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取选中的行 DOM对象集合 。
         * @name   juiceGrid#getSelectedRowObjs
         * @return {Array}  arr  Row Dom Object
         * @function
         */
        getSelectedRowObjs: function ()
        {
            var arr = [];
            for (var i in this.selected)
            {
                var o = this.selected[i];
                if (o['__id'] in this.records)
                    arr.push(this.getRowObj(o));
            }
            return arr;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取单元格DOM对象 。
         * @name   juiceGrid#getCellObj
         * @return {Object}  Cell Object
         * @function
         */
        getCellObj: function (rowParm, column)
        {
            var rowdata = this.getRow(rowParm);
            column = this.getColumn(column);
            return document.getElementById(this._getCellDomId(rowdata, column));
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 行DOM转换为行数据 。
         * @name   juiceGrid#getRowObj
         * @param  {Object} rowParm
         * @param  {Object}  frozen  固定不变
         * @return {Object}  rowParm
         * @function
         */
        getRowObj: function (rowParm, frozen)
        {
            var g = this, p = this.options;
            if (rowParm == null) return null;
            if (typeof (rowParm) == "string")
            {
                if (g._isRowId(rowParm))
                    return document.getElementById(g.id + (frozen ? "|1|" : "|2|") + rowParm);
                else
                    return document.getElementById(g.id + (frozen ? "|1|" : "|2|") + g.rows[parseInt(rowParm)]['__id']);
            }
            else if (typeof (rowParm) == "number")
            {
                return document.getElementById(g.id + (frozen ? "|1|" : "|2|") + g.rows[rowParm]['__id']);
            }
            else if (typeof (rowParm) == "object" && rowParm['__id']) //rowdata
            {
                return g.getRowObj(rowParm['__id'], frozen);
            }
            return rowParm;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取选中的行数据 。
         * @name   juiceGrid#getRow
         * @param  {Object} rowParm   rowindex或者rowdata
         * @return {Object}  rowParm
         * @function
         */
        getRow: function (rowParm)
        {
            var g = this, p = this.options;
            if (rowParm == null) return null;
            if (typeof (rowParm) == "string")
            {
                if (g._isRowId(rowParm))
                    return g.records[rowParm];
                else
                    return g.rows[parseInt(rowParm)];
            }
            else if (typeof (rowParm) == "number")
            {
                return g.rows[parseInt(rowParm)];
            }
            else if (typeof (rowParm) == "object" && rowParm.nodeType == 1 && !rowParm['__id']) //dom对象
            {
                return g._getRowByDomId(rowParm.id);
            }
            return rowParm;
        },
        _setColumnVisible: function (column, hide)
        {
            var g = this, p = this.options;

            if (!hide)  //显示
            {
                column._hide = false;
                document.getElementById(column['__domid']).style.display = "";
                g._updateRowCols();
                //判断分组列是否隐藏,如果隐藏了则显示出来
                if (column['__pid'] != -1)
                {
                    var pcol = g._columns[column['__pid']];
                    var unHiddenCount = 0;
                    for (var i = 0; pcol && i < pcol.columns.length; i++)
                    {
                        if (!pcol.columns[i]._hide)
                        {
                            unHiddenCount ++;
                        }
                    }

                    if(unHiddenCount>=1) {
                        pcol['__colSpan'] = parseInt(pcol['__colSpan']||"0") +(column['__colSpan']||1);
                        var headercell = document.getElementById(pcol['__domid']);
                        headercell.colSpan =  pcol['__colSpan'];
                    }
                    if (pcol._hide)
                    {
                        document.getElementById(pcol['__domid']).style.display = "";
                        this._setColumnVisible(pcol, hide);
                    }

                }
            }
            else //隐藏
            {
                column._hide = true;
                document.getElementById(column['__domid']).style.display = "none";
                //判断同分组的列是否都隐藏,如果是则隐藏分组列
                if (column['__pid'] != -1)
                {
                    var hideall = true;
                    var pcol = this._columns[column['__pid']];
                    pcol['__colSpan'] = pcol['__colSpan']||1;
                    if(pcol['__colSpan']>=1){
                        pcol['__colSpan'] = (pcol['__colSpan']||1) - (column['__colSpan']||1);
                        var headercell = document.getElementById(pcol['__domid']);
                        if(pcol['__colSpan']>=1){
                            headercell.colSpan =  pcol['__colSpan'];
                        }
                    }
                    for (var i = 0; pcol && i < pcol.columns.length; i++)
                    {
                        if (!pcol.columns[i]._hide)
                        {
                            hideall = false;
                            break;
                        }
                    }
                    if (hideall)
                    {
                        pcol._hide = true;
                        document.getElementById(pcol['__domid']).style.display = "none";
                        this._setColumnVisible(pcol, hide);
                    }
                }
                g._updateRowCols();

            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 显示/隐藏列  。
         * @name   juiceGrid#toggleCol
         * @param  {Object} columnparm   列参数,可以是列索引、列ID,也可以是列名
         * @param  {Object} visible      是否可见
         * @param  {Object} toggleByPopup
         * @function
         */
        toggleCol: function (columnparm, visible, toggleByPopup)
        {
            var g = this, p = this.options;
            var column;
            if (typeof (columnparm) == "number")
            {
                column = g.columns[columnparm];
            }
            else if (typeof (columnparm) == "object" && columnparm['__id'])
            {
                column = columnparm;
            }
            else if (typeof (columnparm) == "string")
            {
                if (g._isColumnId(columnparm)) // column id
                {
                    column = g._columns[columnparm];
                }
                else  // column name
                {
                    for (var level = 1; level <= g._columnMaxLevel; level++)
                    {
                        var columns = g.getColumns(level);           //获取level层次的列集合
                        $(columns).each(function ()
                        {
                            if (this.name == columnparm)
                                g.setColumnVisable(this, visible, toggleByPopup);
                        });
                    }
                    return;
                }
            }
            if (!column) return;
            var columnindex = column['__leafindex'];
            var headercell = document.getElementById(column['__domid']);
            if (!headercell) return;
            headercell = $(headercell);
            var cells = [];
            for (var i in g.rows)
            {
                var obj = g.getCellObj(g.rows[i], column);
                if (obj) cells.push(obj);
            }
            for (var i = 0; i < g.totalNumber; i++)
            {
                var tobj = document.getElementById(g.id + "|total" + i + "|" + column['__id']);
                if (tobj) cells.push(tobj);
            }
            var colwidth = column._width;
            //显示列
            if (visible && column._hide)
            {
                if (column.frozen)
                    g.f.gridtablewidth += (parseInt(colwidth) + 1);
                else
                    g.gridtablewidth += (parseInt(colwidth) + 1);
                g._setColumnVisible(column, false);
                $(cells).show();
            }
            //隐藏列
            else if (!visible && !column._hide)
            {
                if (column.frozen)
                    g.f.gridtablewidth -= (parseInt(colwidth) + 1);
                else
                    g.gridtablewidth -= (parseInt(colwidth) + 1);
                g._setColumnVisible(column, true);
                $(cells).hide();
            }
            if (column.frozen)
            {
                $("div:first", g.f.gridheader).width(g.f.gridtablewidth);
                $("div:first", g.f.gridbody).width(g.f.gridtablewidth);
            }
            else
            {
                $("div:first", g.gridheader).width(g.gridtablewidth + 40);
                $("div:first", g.gridbody).width(g.gridtablewidth);
            }
            g._updateFrozenWidth();
            if (!toggleByPopup)
            {
                $(':checkbox[columnindex=' + columnindex + "]", g.popup).each(function ()
                {
                    this.checked = visible;
                    if ($.fn.juiceCheckBox)
                    {
                        var checkboxmanager = $(this).juiceGetCheckBoxManager();
                        if (checkboxmanager) checkboxmanager.updateStyle();
                    }
                });
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置指定列可见 。
         * @name   juiceGrid#setColumnVisable
         * @param  {Object} columnparm   列参数,可以是列索引、列ID,也可以是列名
         * @param  {Object} visible      是否可见
         * @param  {Object} toggleByPopup
         * @function
         */
        setColumnVisable:function(column, visible, toggleByPopup){
            var g = this, p = this.options;
            g.toggleCol(column, visible, toggleByPopup);
            if(column.columns&&column.columns.length>0){
                $(column.columns).each(function (i,childColumn)
                {
                    g.setColumnVisable(childColumn, visible, toggleByPopup);
                });
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置列宽 。
         * @name   juiceGrid#setColumnWidth
         * @param  {Object} columnparm   列参数,可以是列索引、列ID,也可以是列名
         * @param  {Number} newwidth  新的宽度
         * @function
         */
        setColumnWidth: function (columnparm, newwidth)
        {
            var g = this, p = this.options;
            if (!newwidth) return;
            newwidth = parseInt(newwidth, 10);
            var column;
            if (typeof (columnparm) == "number")
            {
                column = g.columns[columnparm];
            }
            else if (typeof (columnparm) == "object" && columnparm['__id'])
            {
                column = columnparm;
            }
            else if (typeof (columnparm) == "string")
            {
                if (g._isColumnId(columnparm)) // column id
                {
                    column = g._columns[columnparm];
                }
                else  // column name
                {
                    $(g.columns).each(function ()
                    {
                        if (this.name == columnparm)
                            g.setColumnWidth(this, newwidth);
                    });
                    return;
                }
            }
            if (!column) return;
            var mincolumnwidth = p.minColumnWidth;
            if (column.minWidth) mincolumnwidth = column.minWidth;
            newwidth = newwidth < mincolumnwidth ? mincolumnwidth : newwidth;
            var diff = newwidth - column._width;
            if (g.trigger('beforeChangeColumnWidth', [column, newwidth]) == false) return;
            column._width = newwidth;
            if (column.frozen)
            {
                g.f.gridtablewidth += diff;
                $("div:first", g.f.gridheader).width(g.f.gridtablewidth);
                $("div:first", g.f.gridbody).width(g.f.gridtablewidth);
            }
            else
            {
                g.gridtablewidth += diff;
                $("div:first", g.gridheader).width(g.gridtablewidth + 40);
                $("div:first", g.gridbody).width(g.gridtablewidth);
            }
            $(document.getElementById(column['__domid'])).css('width', newwidth);
            var cells = [];
            for (var rowid in g.records)
            {
                var obj = g.getCellObj(g.records[rowid], column);
                if (obj) cells.push(obj);

                if (!g.enabledDetailEdit() && g.editors[rowid] && g.editors[rowid][column['__id']])
                {
                    var o = g.editors[rowid][column['__id']];
                    if (o.editor.resize) o.editor.resize(o.input, newwidth, o.container.height(), o.editParm);
                }
            }
            for (var i = 0; i < g.totalNumber; i++)
            {
                var tobj = document.getElementById(g.id + "|total" + i + "|" + column['__id']);
                if (tobj) cells.push(tobj);
            }
            $(cells).css('width', newwidth).find("> div.l-grid-row-cell-inner:first").css('width', newwidth - 8);

            g._updateFrozenWidth();


            g.trigger('afterChangeColumnWidth', [column, newwidth]);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变列表头内容 。
         * @name   juiceGrid#changeHeaderText
         * @param  {Object} columnparm   列参数,可以是列索引、列ID,也可以是列名
         * @param  {String} headerText  头文本
         * @function
         */
        changeHeaderText: function (columnparm, headerText)
        {
            var g = this, p = this.options;
            var column;
            if (typeof (columnparm) == "number")
            {
                column = g.columns[columnparm];
            }
            else if (typeof (columnparm) == "object" && columnparm['__id'])
            {
                column = columnparm;
            }
            else if (typeof (columnparm) == "string")
            {
                if (g._isColumnId(columnparm)) // column id
                {
                    column = g._columns[columnparm];
                }
                else  // column name
                {
                    $(g.columns).each(function ()
                    {
                        if (this.name == columnparm)
                            g.changeHeaderText(this, headerText);
                    });
                    return;
                }
            }
            if (!column) return;
            var columnindex = column['__leafindex'];
            var headercell = document.getElementById(column['__domid']);
            $(".l-grid-hd-cell-text", headercell).html(headerText);
            if (p.allowHideColumn)
            {
                $(':checkbox[columnindex=' + columnindex + "]", g.popup).parent().next().html(headerText);
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变列的位置 。
         * @name   juiceGrid#changeCol
         * @param  {Object}from  来源表头
         * @param  {Object} to 目标位置表头
         * @param  {Boolean}isAfter 是否附加到后面
         * @function
         */
        changeCol: function (from, to, isAfter)
        {
            var g = this, p = this.options;
            if (!from || !to) return;
            var fromCol = g.getColumn(from);
            var toCol = g.getColumn(to);
            fromCol.frozen = toCol.frozen;
            var fromColIndex, toColIndex;
            var fromColumns = fromCol['__pid'] == -1 ? p.columns : g._columns[fromCol['__pid']].columns;
            var toColumns = toCol['__pid'] == -1 ? p.columns : g._columns[toCol['__pid']].columns;
            fromColIndex = $.inArray(fromCol, fromColumns);
            toColIndex = $.inArray(toCol, toColumns);
            var sameParent = fromColumns == toColumns;
            var sameLevel = fromCol['__level'] == toCol['__level'];
            toColumns.splice(toColIndex + (isAfter ? 1 : 0), 0, fromCol);
            if (!sameParent)
            {
                fromColumns.splice(fromColIndex, 1);
            }
            else
            {
                if (isAfter) fromColumns.splice(fromColIndex, 1);
                else fromColumns.splice(fromColIndex + 1, 1);
            }
            g._setColumns(p.columns);
            g.reRender();
//            g._initHeaderMenu();
        },

        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 收缩明细 。
         * @name   juiceGrid#collapseDetail
         * @param  {Object}rowParm  rowindex或者rowdata
         * @function
         */
        collapseDetail: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            if (!rowdata) return;
            for (var i = 0, l = g.columns.length; i < l; i++)
            {
                if (g.columns[i].isdetail)
                {
                    var row = g.getRowObj(rowdata);
                    var cell = g.getCellObj(rowdata, g.columns[i]);
                    $(row).next("tr.l-grid-detailpanel").hide();
                    $(".l-grid-row-cell-detailbtn:first", cell).removeClass("l-open");
                    g.trigger('SysGridHeightChanged');
                    return;
                }
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 展开明细  。
         * @name   juiceGrid#extendDetail
         * @param  {Object}rowParm  rowindex或者rowdata
         * @function
         */
        extendDetail: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            if (!rowdata) return;
            for (var i = 0, l = g.columns; i < l; i++)
            {
                if (g.columns[i].isdetail)
                {
                    var row = g.getRowObj(rowdata);
                    var cell = g.getCellObj(rowdata, g.columns[i]);
                    $(row).next("tr.l-grid-detailpanel").show();
                    $(".l-grid-row-cell-detailbtn:first", cell).addClass("l-open");
                    g.trigger('SysGridHeightChanged');
                    return;
                }
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取父节点数据(树模式)   。
         * @name   juiceGrid#getParent
         * @param  {Object}rowParm  rowindex或者rowdata
         * @return {Object}
         * @function
         */
        getParent: function (rowParm)
        {
            var g = this, p = this.options;
            if (!p.tree) return null;
            var rowdata = g.getRow(rowParm);
            if (!rowdata) return null;
            if (rowdata['__pid'] in g.records) return g.records[rowdata['__pid']];
            else return null;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取子节点数据(树模式)   。
         * @name   juiceGrid#getChildren
         * @param  {Object}rowParm  rowindex或者rowdata
         * @param  {Object}deep   层级
         * @return {Array} arr
         * @function
         */
        getChildren: function (rowParm, deep)
        {
            var g = this, p = this.options;
            if (!p.tree) return null;
            var rowData = g.getRow(rowParm);
            if (!rowData) return null;
            var arr = [];
            function loadChildren(data)
            {
                if (data[p.tree.childrenName])
                {
                    for (var i = 0, l = data[p.tree.childrenName].length; i < l; i++)
                    {
                        var o = data[p.tree.childrenName][i];
                        if (o['__status'] == 'delete') continue;
                        arr.push(o);
                        if (deep)
                            loadChildren(o);
                    }
                }
            }
            loadChildren(rowData);
            return arr;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否叶节点(树模式)  。
         * @name   juiceGrid#isLeaf
         * @param  {Object}rowParm  rowindex或者rowdata
         * @return
         * @function
         */
        isLeaf: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            if (!rowdata) return;
            return rowdata['__hasChildren'] ? false : true;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否包括子节点(树模式)  。
         * @name   juiceGrid#hasChildren
         * @param  {Object}rowParm  rowindex或者rowdata
         * @return
         * @function
         */
        hasChildren: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = this.getRow(rowParm);
            if (!rowdata) return;
            return (rowdata[p.tree.childrenName] && rowdata[p.tree.childrenName].length) ? true : false;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否存在某记录 。
         * @name   juiceGrid#existRecord
         * @param  {Object}record  数据记录
         * @return {Boolean}  false|true
         * @function
         */
        existRecord: function (record)
        {
            for (var rowid in this.records)
            {
                if (this.records[rowid] == record) return true;
            }
            return false;
        },
        _removeSelected: function (rowdata)
        {
            var g = this, p = this.options;
            if (p.tree)
            {
                var children = g.getChildren(rowdata, true);
                if (children)
                {
                    for (var i = 0, l = children.length; i < l; i++)
                    {
                        var index2 = $.inArray(children[i], g.selected);
                        if (index2 != -1) g.selected.splice(index2, 1);
                    }
                }
            }
            var index = $.inArray(rowdata, g.selected);
            if (index != -1) g.selected.splice(index, 1);
        },
        _getParentChildren: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var listdata;
            if (p.tree && g.existRecord(rowdata) && rowdata['__pid'] in g.records)
            {
                listdata = g.records[rowdata['__pid']][p.tree.childrenName];
            }
            else
            {
                listdata = g.currentData[p.root];
            }
            return listdata;
        },
        _removeData: function (rowdata)
        {
            var g = this, p = this.options;
            var listdata = g._getParentChildren(rowdata);
            var index = $.inArray(rowdata, listdata);
            if (index != -1)
            {
                listdata.splice(index, 1);
            }
            g._removeSelected(rowdata);
        },
        _addData: function (rowdata, parentdata, neardata, isBefore)
        {
            var g = this, p = this.options;
            var listdata = g.currentData[p.root];
            if (neardata)
            {
                if (p.tree)
                {
                    if (parentdata)
                        listdata = parentdata[p.tree.childrenName];
                    else if (neardata['__pid'] in g.records)
                        listdata = g.records[neardata['__pid']][p.tree.childrenName];
                }
                var index = $.inArray(neardata, listdata);
                listdata.splice(index == -1 ? -1 : index + (isBefore ? 0 : 1), 0, rowdata);
            }
            else
            {
                if (p.tree && parentdata)
                {
                    listdata = parentdata[p.tree.childrenName];
                }
                listdata.push(rowdata);
            }
        },
        //移动数据(树)
        //@parm [parentdata] 附加到哪一个节点下级
        //@parm [neardata] 附加到哪一个节点的上方/下方
        //@parm [isBefore] 是否附加到上方
        _appendData: function (rowdata, parentdata, neardata, isBefore)
        {
            var g = this, p = this.options;
            rowdata[p.statusName] = "update";
            g._removeData(rowdata);
            g._addData(rowdata, parentdata, neardata, isBefore);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 一次性附加多行 。
         * @name   juiceGrid#appendRange
         * @param  {Object} rows  要附加的数据
         * @param  {Object} parentdata  父节点
         * @param  {Object} neardata  插入的位置 rowid或者rowdata
         * @param  {Object} isBefore  是否在之前附加(非必填)
         * @function
         */
        appendRange: function (rows, parentdata, neardata, isBefore)
        {
            var g = this, p = this.options;
            var toRender = false;
            $.each(rows, function (i, item)
            {
                if (item['__id'] && g.existRecord(item))
                {
                    if (g.isLeaf(parentdata)) g.upgrade(parentdata);
                    g._appendData(item, parentdata, neardata, isBefore);
                    toRender = true;
                }
                else
                {
                    g.appendRow(item, parentdata, neardata, isBefore);
                }
            });
            if (toRender) g.reRender();

        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 一次附加一行 。
         * @name   juiceGrid#appendRow
         * @param  {Object} rows  要附加的数据
         * @param  {Object} parentdata  父节点
         * @param  {Object} neardata  插入的位置 rowid或者rowdata
         * @param  {Object} isBefore  是否在之前附加(非必填)
         * @function
         */
        appendRow: function (rowdata, parentdata, neardata, isBefore)
        {
            var g = this, p = this.options;
            if ($.isArray(rowdata))
            {
                g.appendRange(rowdata, parentdata, neardata, isBefore);
                return;
            }
            if (rowdata['__id'] && g.existRecord(rowdata))
            {
                g._appendData(rowdata, parentdata, neardata, isBefore);
                g.reRender();
                return;
            }
            if (parentdata && g.isLeaf(parentdata)) g.upgrade(parentdata);
            g.addRow(rowdata, neardata, isBefore ? true : false, parentdata);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 升级(树模式)  。
         * @name   juiceGrid#upgrade
         * @param  {Object} rowParm  rowindex或者rowdata
         * @function
         */
        upgrade: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            if (!rowdata || !p.tree) return;
            rowdata[p.tree.childrenName] = rowdata[p.tree.childrenName] || [];
            rowdata['__hasChildren'] = true;
            var rowobjs = [g.getRowObj(rowdata)];
            if (g.enabledFrozen()) rowobjs.push(g.getRowObj(rowdata, true));
            $("> td > div > .l-grid-tree-space:last", rowobjs).addClass("l-grid-tree-link l-grid-tree-link-open");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 降级(树模式)  。
         * @name   juiceGrid#demotion
         * @param  {Object} rowParm  rowindex或者rowdata
         * @function
         */
        demotion: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            if (!rowdata || !p.tree) return;
            var rowobjs = [g.getRowObj(rowdata)];
            if (g.enabledFrozen()) rowobjs.push(g.getRowObj(rowdata, true));
            $("> td > div > .l-grid-tree-space:last", rowobjs).removeClass("l-grid-tree-link l-grid-tree-link-open l-grid-tree-link-close");
            if (g.hasChildren(rowdata))
            {
                var children = g.getChildren(rowdata);
                for (var i = 0, l = children.length; i < l; i++)
                {
                    g.deleteRow(children[i]);
                }
            }
            rowdata['__hasChildren'] = false;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 收缩(树模式) 。
         * @name   juiceGrid#collapse
         * @param  {Object} rowParm  rowindex或者rowdata
         * @function
         */
        collapse: function (rowParm)
        {
            var g = this, p = this.options;
            var targetRowObj = g.getRowObj(rowParm);
            var linkbtn = $(".l-grid-tree-link", targetRowObj);
            if (linkbtn.hasClass("l-grid-tree-link-close")) return;
            g.toggle(rowParm);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 展开(树模式) 。
         * @name   juiceGrid#expand
         * @param  {Object} rowParm  rowindex或者rowdata
         * @function
         */
        expand: function (rowParm)
        {
            var g = this, p = this.options;
            var targetRowObj = g.getRowObj(rowParm);
            var linkbtn = $(".l-grid-tree-link", targetRowObj);
            if (linkbtn.hasClass("l-grid-tree-link-open")) return;
            g.toggle(rowParm);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 伸展/收缩节点(树模式)  。
         * @name   juiceGrid#toggle
         * @param  {Object} rowParm  rowindex或者rowdata
         * @function
         */
        toggle: function (rowParm)
        {
            if (!rowParm) return;
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var targetRowObj = [g.getRowObj(rowdata)];
            if (g.enabledFrozen()) targetRowObj.push(g.getRowObj(rowdata, true));
            var level = rowdata['__level'], indexInCollapsedRows;
            var linkbtn = $(".l-grid-tree-link:first", targetRowObj);
            var opening = true;
            g.collapsedRows = g.collapsedRows || [];
            if (linkbtn.hasClass("l-grid-tree-link-close")) //收缩
            {
                linkbtn.removeClass("l-grid-tree-link-close").addClass("l-grid-tree-link-open");
                indexInCollapsedRows = $.inArray(rowdata, g.collapsedRows);
                if (indexInCollapsedRows != -1) g.collapsedRows.splice(indexInCollapsedRows, 1);
            }
            else //折叠
            {
                opening = false;
                linkbtn.addClass("l-grid-tree-link-close").removeClass("l-grid-tree-link-open");
                indexInCollapsedRows = $.inArray(rowdata, g.collapsedRows);
                if (indexInCollapsedRows == -1) g.collapsedRows.push(rowdata);
            }
            var children = g.getChildren(rowdata, true);
            for (var i = 0, l = children.length; i < l; i++)
            {
                var o = children[i];
                var currentRow = $([g.getRowObj(o['__id'])]);
                if (g.enabledFrozen()) currentRow = currentRow.add(g.getRowObj(o['__id'], true));
                if (opening)
                {
                    $(".l-grid-tree-link", currentRow).removeClass("l-grid-tree-link-close").addClass("l-grid-tree-link-open");
                    currentRow.show();
                }
                else
                {
                    $(".l-grid-tree-link", currentRow).removeClass("l-grid-tree-link-open").addClass("l-grid-tree-link-close");
                    currentRow.hide();
                }
            }
        },
        _bulid: function ()
        {
            var g = this;
            g._clearGrid();
            //创建头部
            g._initBuildHeader();
            //宽度高度初始化
            g._initHeight();
            //创建底部工具条
            g._initFootbar();
            //创建分页
            g._buildPager();
            //创建事件
            g._setEvent();

        },
        _setColumns: function (columns)
        {
            var g = this;
            //初始化列
            g._initColumns();
            //创建表头
            g._initBuildGridHeader();
            //创建 显示/隐藏 列 列表
            g._initBuildPopup();
            g._initHeaderMenu();
        },
        _initBuildHeader: function ()
        {
            var g = this, p = this.options;
            if (p.title)
            {
                $(".l-panel-header-text", g.header).html(p.title);
                if (p.headerImg)
                    g.header.append("<img src='" + p.headerImg + "' />").addClass("l-panel-header-hasicon");
                if(p.toggleAble){
                    $(".grid-up-toggle", g.header).hover(function (){
                        $(this).addClass("grid-up-toggle-over");
                    }, function (){
                        $(this).removeClass("grid-up-toggle-over");
                    }).click(function () {
                        g.setUpCollapse(true);
                        $(".grid-down-toggle", g.header).show();
                        $(this).hide();
                    });
                    $(".grid-down-toggle", g.header).hover(function (){
                        $(this).addClass("grid-down-toggle-over");
                    }, function (){
                        $(this).removeClass("grid-down-toggle-over");
                    }).click(function () {
                        g.setUpCollapse(false);
                        $(".grid-up-toggle", g.header).show();
                        $(this).hide();
                    });
                } else{
                    $(".grid-up-toggle").removeClass("grid-up-toggle");
                }
            }
            else
            {
                g.header.hide();
            }
            if (p.toolbar)
            {
                if ($.fn.juiceToolBar){
                    g.toolbarManager = g.topbar.juiceToolBar(p.toolbar);

                }
            }
            else
            {
                $(".l-grid-header", g.gridview1).addClass("l-grid-header-radius-left");
                $(".l-grid-header", g.gridview2).addClass("l-grid-header-radius-right");
                g.topbar.remove();
            }
        },

        _createColumnId: function (column)
        {
            if (column.id != null) return column.id.toString();
            return "c" + (100 + this._columnCount);
        },
        _isColumnId: function (str)
        {
            return (str in this._columns);
        },
        _initColumns: function ()
        {
            var g = this, p = this.options;
            g._columns = {};             //全部列的信息
            g._columnCount = 0;
            g._columnLeafCount = 0;
            g._columnMaxLevel = 1;
            g._changeLevel = 1;
            if (!p.columns) return;
            function removeProp(column, props)
            {
                for (var i in props)
                {
                    if (props[i] in column)
                        delete column[props[i]];
                }
            }
            //设置id、pid、level、leaf，返回叶节点数,如果是叶节点，返回1
            function setColumn(column, level, pid, previd)
            {
                removeProp(column, ['__id', '__pid', '__previd', '__nextid', '__domid', '__leaf', '__leafindex', '__level', '__colSpan', '__rowSpan']);
                if (level > g._columnMaxLevel) g._columnMaxLevel = level;
                g._columnCount++;
                column['__id'] = g._createColumnId(column);
                column['__domid'] = g.id + "|hcell|" + column['__id'];
                g._columns[column['__id']] = column;
                if (!column.columns || !column.columns.length)
                    column['__leafindex'] = g._columnLeafCount++;
                column['__level'] = level;
                column['__pid'] = pid;
                column['__previd'] = previd;
                if (!column.columns || !column.columns.length)
                {
                    column['__leaf'] = true;
                    return 1;
                }
                var leafcount = 0;
                var newid = -1;
                for (var i = 0, l = column.columns.length; i < l; i++)
                {
                    var col = column.columns[i];
                    leafcount += setColumn(col, level + 1, column['__id'], newid);
                    newid = col['__id'];
                }
                column['__leafcount'] = leafcount;
                return leafcount;
            }
            var lastid = -1;
            //行序号
            if (p.rownumbers)
            {
                var frozenRownumbers = g.enabledGroup() ? false : p.frozen && p.frozenRownumbers;
                var col = { isrownumber: true, issystem: true, width: p.rownumbersColWidth, frozen: frozenRownumbers };
                setColumn(col, 1, -1, lastid);
                lastid = col['__id'];
            }
            //明细列
            if (g.enabledDetail())
            {
                var frozenDetail = g.enabledGroup() ? false : p.frozen && p.frozenDetail;
                var col = { isdetail: true, issystem: true, width: p.detailColWidth, frozen: frozenDetail };
                setColumn(col, 1, -1, lastid);
                lastid = col['__id'];
            }
            //复选框列
            if (g.enabledCheckbox())
            {
                var frozenCheckbox = g.enabledGroup() ? false : p.frozen && p.frozenCheckbox;
                var col = { ischeckbox: true, issystem: true, width: p.detailColWidth, frozen: frozenCheckbox };
                setColumn(col, 1, -1, lastid);
                lastid = col['__id'];
            }
            for (var i = 0, l = p.columns.length; i < l; i++)
            {
                var col = p.columns[i];
                setColumn(col, 1, -1, lastid);
                lastid = col['__id'];
            }
            //设置colSpan和rowSpan
            for (var id in g._columns)
            {
                var col = g._columns[id];
                if (col['__leafcount'] > 1)
                {
                    col['__colSpan'] = col['__leafcount'];
                }
                if (col['__leaf'] && col['__level'] != g._columnMaxLevel)
                {
                    col['__rowSpan'] = g._columnMaxLevel - col['__level'] + 1;
                }
            }
            g._changeLevel = g._columnMaxLevel;
            //叶级别列的信息
            g.columns = g.getColumns();
            $(g.columns).each(function (i, column)
            {
                column.columnname = column.name;
                column.columnindex = i;
                column.type = column.type || "string";
                column.islast = i == g.columns.length - 1;
                column.isSort = (column.isSort == true||column.isSort=="true");
                column.frozen = column.frozen ? true : false;
                column._width = g._getColumnWidth(column);
                column._hide = column.hide ? true : false;
            });
        },
        _getColumnWidth: function (column)
        {
            var g = this, p = this.options;
            if (column._width) return column._width;
            var colwidth;
            if (column.width)
            {
                colwidth = column.width;
            }
            else if (p.columnWidth)
            {
                colwidth = p.columnWidth;
            }
            if (!colwidth)
            {
                var lwidth = 4;
                if (g.enabledCheckbox()) lwidth += p.checkboxColWidth;
                if (g.enabledDetail()) lwidth += p.detailColWidth;
                colwidth = parseInt((g.grid.width() - lwidth) / g.columns.length);
            }
            if (typeof (colwidth) == "string" && colwidth.indexOf('%') > 0)
            {
                column._width = colwidth = parseInt(parseInt(colwidth) * 0.01 * (g.grid.width() - g.columns.length));
            }
            if (column.minWidth && colwidth < column.minWidth) colwidth = column.minWidth;
            if (column.maxWidth && colwidth > column.maxWidth) colwidth = column.maxWidth;
            column._width = colwidth;
            if(!column.frozen&&!column._hide&&g.gridview2.width()){
                column._percentWidth = (colwidth/(g.gridview2.width()));
            }
            return colwidth;
        },
        _createHeaderCell: function (column)
        {
            var g = this, p = this.options;
            var tdHeight = p.headerRowHeight *( column['__rowSpan']? column['__rowSpan']:1);
            var  jcell = $("<td class='l-grid-hd-cell'><div class='l-grid-hd-ct' style='height:"+(tdHeight-1)+"px;line-height: "+(tdHeight-1)+"px'><div class='l-grid-hd-cell-inner'> <span class='l-grid-hd-cell-text'></span></div><div class='l-grid-hd-trigger'/></div></td>");
            jcell.hover(function(){
                $(".l-grid-hd-trigger",this).show();
                $(this).addClass("l-grid-hd-over");
            },function(){
                $(".l-grid-hd-trigger",this).hide();
                $(this).removeClass("l-grid-hd-over");
            });
            if(p.showHeadMenu){
                $(".l-grid-hd-trigger",jcell).click(function(e){
                    g.currentHeader = column;
                    g._initMenu();
                    g.menu.show({ top: e.pageY , left:e.pageX });
                    return false;
                });
            }
            jcell.attr("id", column['__domid']);

            if (!column['__leaf'])
                jcell.addClass("l-grid-hd-cell-mul");
            if (column.columnindex == g.columns.length - 1)
            {
                jcell.addClass("l-grid-hd-cell-last");
            }
            if (column.isrownumber)
            {
                jcell.addClass("l-grid-hd-cell-rownumbers");
                jcell.html("<div class='l-grid-hd-cell-inner'></div>");
            }
            if (column.ischeckbox&&!p.singleSelect)
            {
                jcell.addClass("l-grid-hd-cell-checkbox");
                jcell.html("<div class='l-grid-hd-cell-inner'><div class='l-grid-hd-cell-text l-grid-hd-cell-btn-checkbox'></div></div>");
            }
            if (column.isdetail)
            {
                jcell.addClass("l-grid-hd-cell-detail");
                jcell.html("<div class='l-grid-hd-cell-inner'><div class='l-grid-hd-cell-text l-grid-hd-cell-btn-detail'></div></div>");
            }
            if (column.heightAlign)
            {
                $(".l-grid-hd-cell-inner:first", jcell).css("textAlign", column.heightAlign);
            }
            if (column['__colSpan']) jcell.attr("colSpan", column['__colSpan']);
            if (column['__rowSpan'])
            {
                jcell.attr("rowSpan", column['__rowSpan']);
                jcell.height(p.headerRowHeight * column['__rowSpan']);
            } else
            {
                jcell.height(p.headerRowHeight);
            }
            if (column['__leaf'])
            {
                jcell.width(column['_width']);
                jcell.attr("columnindex", column['__leafindex']);
            }
            if (column._hide) jcell.hide();
            if (column.name) jcell.attr({ columnname: column.name });
            var headerText = "";
            if (column.display && column.display != "")
                headerText = column.display;
            else if (column.headerRender)
                headerText = column.headerRender(column);
            else
                headerText = "&nbsp;";
            $(".l-grid-hd-cell-text:first", jcell).html(headerText);
            if (!column.issystem && column['__leaf'] && column.resizable !== false && $.fn.juiceResizable)
            {
                g.colResizable[column['__id']] = jcell.juiceResizable({ handles: 'e',
                    onStartResize: function (e, ev)
                    {
                        this.proxy.hide();
                        g.draggingline.css({ height: g.body.height(), top: 0, left: ev.pageX - g.grid.offset().left + parseInt(g.body[0].scrollLeft) }).show();
                    },
                    onResize: function (e, ev)
                    {
                        g.colresizing = true;
                        g.draggingline.css({ left: ev.pageX - g.grid.offset().left + parseInt(g.body[0].scrollLeft) });
                        $('body').add(jcell).css('cursor', 'e-resize');
                    },
                    onStopResize: function (e)
                    {
                        g.colresizing = false;
                        $('body').add(jcell).css('cursor', 'default');
                        g.draggingline.hide();
                        g.setColumnWidth(column, column._width + e.diffX);
                        if(!column.frozen&&!column._hide){
                            column._percentWidth = ((column._width)/(g.gridview2.width()));
                        }
                        return false;
                    }
                });
            }
            return jcell;
        },
        _initBuildGridHeader: function ()
        {
            var g = this, p = this.options;
            g.gridtablewidth = 0;
            g.f.gridtablewidth = 0;
            if (g.colResizable)
            {
                for (var i in g.colResizable)
                {
                    g.colResizable[i].destroy();
                }
                g.colResizable = null;
            }
            g.colResizable = {};
            $("tbody:first", g.gridheader).html("");
            $("tbody:first", g.f.gridheader).html("");
            for (var level = 1; level <= g._columnMaxLevel; level++)
            {
                var columns = g.getColumns(level);           //获取level层次的列集合
                var islast = level == g._columnMaxLevel;     //是否最末级
                var tr = $("<tr class='l-grid-hd-row'></tr>");
                var trf = $("<tr class='l-grid-hd-row'></tr>");
                if (!islast) tr.add(trf).addClass("l-grid-hd-mul");
                $("tbody:first", g.gridheader).append(tr);
                $("tbody:first", g.f.gridheader).append(trf);
                $(columns).each(function (i, column)
                {
                    (column.frozen ? trf : tr).append(g._createHeaderCell(column));
                    if (column['__leaf'] && (!column._hide))
                    {
                        var colwidth = column['_width'];
                        if (!column.frozen)
                            g.gridtablewidth += (parseInt(colwidth) ? parseInt(colwidth) : 0) + 1;
                        else
                            g.f.gridtablewidth += (parseInt(colwidth) ? parseInt(colwidth) : 0) + 1;
                    }
                });
            }
            if (g._columnMaxLevel > 0)
            {
                var h = p.headerRowHeight * g._columnMaxLevel;
                g.gridheader.add(g.f.gridheader).height(h);
                if (p.rownumbers && p.frozenRownumbers) g.f.gridheader.find("td:first").height(h);
            }
            g._updateFrozenWidth();
            $("div:first", g.gridheader).width(g.gridtablewidth + 40);
        },
        _updateRowCols:function(){
            var g = this, p = this.options;
            var maxLevel = g._getMaxLevel(p.columns);
            for (var id in g._columns)
            {
                var col = g._columns[id];
                if (col['__leaf'] && col['__level'] != g._columnMaxLevel)
                {
                    col['__rowSpan'] = maxLevel - col['__level'] + 1;
                }
                var headercell = document.getElementById(col['__domid']);
                if(col['__rowSpan']!=undefined&&col['__rowSpan']>1){
                    headercell.rowSpan =  col['__rowSpan'];
                }
            }
        },
        _getMaxLevel:function(columns,level){
            var g = this, p = this.options;
            var maxLevel= level||0;
            $(columns).each(function(){
                if(this["_hide"]!=undefined&&!this["_hide"]){
                    maxLevel++;
                    return false;
                }
            });

            $(columns).each(function(){
                if(this.columns) {
                    maxLevel =  g._getMaxLevel(this.columns,maxLevel);
                }

            });

            return maxLevel;
        },
        _initHeaderMenu:function(){
            var g = this, p = this.options;
            var items = g._createMenuItem(p.columns);
            g.menu = $.juiceMenu({
                selfClose:true,
                width:140,
                items:[
                    { text:"升序排序",icon:"asc",id:"order_asc",click:function(){
                        var columnName = g.currentHeader.name;
                        g.changeSort(columnName, 'asc');
                    }},
                    { text:"降序排序",icon:"desc",id:"order_desc",click:function(){
                        var columnName = g.currentHeader.name;
                        g.changeSort(columnName, 'desc');
                    }},
                    { line: true },
                    { text:"锁定此列",icon:"lock",id:"lock",click:function(){
                        g._lockColumn();
                    }},
                    { text:"撤销锁定",icon:"unlock-gray",id:"unlock",click:function(){
                        g._unlockColumn();
                    }},
                    { line: true },
                    { text:"按此列进行分组",icon:"group",id:"group",click:function(){
                        g._groupByColumn();
                    }},
                    { line: true },
                    { text:"追加此列分组",icon:"groupColumns",id:"groupColumns",click:function(){
                        g._groupByColumns();
                    }},
                    { text:"取消记录分组",id:"ungroup",click:function(){
                        g._unGroupByColumn();
                    }},
                    { line: true },
                    { text:"表格列",icon:"columns",children:items}
                ]
            });
        },
        _unlockColumn:function(){
            var g = this;
            g.currentHeader.frozen = false;
            g._setColumns();
            g.reRender();
        },
        _lockColumn:function(){
            var g = this;
            g.currentHeader.frozen = true;
            g._setColumns();
            g._setFrozen(true);
            g.reRender();
        },
        _groupByColumn:function(){
            var g = this, p = this.options;
            g.frozenIds = g.frozenIds||[];
            p.groupColumnName = g.currentHeader.name;
            g._groupCommon();
        },
        _groupByColumns:function(){
            var g = this, p = this.options;
            g.frozenIds = g.frozenIds||[];
            if(!g._isContainCurrentHeader()){
                p.groupColumnName +="," + g.currentHeader.name;
            }
            g._groupCommon();
        },
        _unGroupByColumn:function(){
            var g = this, p = this.options;
            p.groupColumnName ="";
            $(g.frozenIds).each(function(){
                g._columns[this].frozen = true;
            });
            p.enabledEdit = g.enabledEdit;
            g._setColumns();
            g.reRender();
        },
        _groupCommon:function() {
            var g = this, p = this.options;
            $(g.columns).each(function () {
                if (this.frozen) {
                    g.frozenIds.push(this["__id"]);
                    this.frozen = false;
                    this["_hide"] = false;
                }
            });
            g.enabledEdit = p.enabledEdit;
            p.enabledEdit = false;
            g._setColumns();
            g.reRender();
        },
        _isContainCurrentHeader:function(){
            var g = this, p = this.options;
            return p.groupColumnName&&(","+p.groupColumnName+",").indexOf(","+g.currentHeader.name+",")>=0;
        },
        _initMenu:function(){
            var g = this, p = this.options;
            var lockditems = $(".l-menu-item[menuitemid='lock']", g.menu.items);
            var unlockditems = $(".l-menu-item[menuitemid='unlock']", g.menu.items);
            var lockditem=$(".l-menu-item-icon",lockditems);
            var unlockditem=$(".l-menu-item-icon",unlockditems);
            g.menu.setEnable("group");
            g.menu.setEnable("lock");
            g.menu.setEnable("unlock");

            if(g._isContainCurrentHeader()){
                g.menu.setDisable("group") ;
                g.menu.setDisable("groupColumns") ;
            } else if(p.groupColumnName){
                g.menu.setEnable("groupColumns")
            }else{
                g.menu.setDisable("groupColumns") ;
                g.menu.setDisable("ungroup") ;
            }
            if(g.currentHeader.frozen){
                lockditem.removeClass("l-icon-lock") ;
                lockditem.addClass("l-icon-lock-gray") ;
                g.menu.setDisable("lock") ;
                unlockditem.removeClass("l-icon-unlock-gray");
                unlockditem.addClass("l-icon-unlock");
            }else{
                lockditem.removeClass("l-icon-lock-gray") ;
                lockditem.addClass("l-icon-lock") ;
                g.menu.setDisable("unlock") ;
                unlockditem.removeClass("l-icon-unlock");
                unlockditem.addClass("l-icon-unlock-gray");
            }
            if(g._getMaxLevel(p.columns)>1){
                g.menu.setDisable("lock") ;
                g.menu.setDisable("unlock") ;
            }
            if(p.groupColumnName){
                g.menu.setDisable("lock") ;
                g.menu.setDisable("unlock") ;

            }
        },
        _createMenuItem:function(columns){
            var g = this;
            var items = new Array();
            $(columns).each(function (i, column)
            {
                if (column.issystem) return;
                if (column.isAllowHide == false) return;
                if (column.hide == true) return;
                var item = {text:column.display,id:column.name,checkbox:true,checked:true,click:function(){

                    if(item.checked){
                        item.checked = false;
                    } else{
                        item.checked = true;
                    }
                    g.toggleCol(column["columnindex"],!item.checked, true);
                }};
                items.push(item);
                if(column.columns&&column.columns.length>0){
                    item.children = g._createMenuItem(column.columns);
                }
            });
            return items;
        },
        _initBuildPopup: function ()
        {
            var g = this, p = this.options;
            $(':checkbox', g.popup).unbind();
            $('tbody tr', g.popup).remove();
            $(g.columns).each(function (i, column)
            {
                if (column.issystem) return;
                if (column.isAllowHide == false) return;
                var chk = 'checked="checked"';
                if (column._hide) chk = '';
                var header = column.display;
                $('tbody', g.popup).append('<tr><td class="l-column-left"><input type="checkbox" ' + chk + ' class="l-checkbox" columnindex="' + i + '"/></td><td class="l-column-right">' + header + '</td></tr>');
            });
            if ($.fn.juiceCheckBox)
            {
                $('input:checkbox', g.popup).juiceCheckBox(
                    {
                        onBeforeClick: function (obj)
                        {
                            if (!obj.checked) return true;
                            if ($('input:checked', g.popup).length <= p.minColToggle)
                                return false;
                            return true;
                        }
                    });
            }
            //表头 - 显示/隐藏'列控制'按钮事件
            if (p.allowHideColumn)
            {
                $('tr', g.popup).hover(function ()
                    {
                        $(this).addClass('l-popup-row-over');
                    },
                    function ()
                    {
                        $(this).removeClass('l-popup-row-over');
                    });
                var onPopupCheckboxChange = function ()
                {
                    if ($('input:checked', g.popup).length + 1 <= p.minColToggle)
                    {
                        return false;
                    }
                    g.toggleCol(parseInt($(this).attr("columnindex")), this.checked, true);
                };
                if ($.fn.juiceCheckBox)
                    $(':checkbox', g.popup).bind('change', onPopupCheckboxChange);
                else
                    $(':checkbox', g.popup).bind('click', onPopupCheckboxChange);
            }
        },
        _initHeight: function ()
        {
            var g = this, p = this.options;
            if (p.height == 'auto')
            {
                g.gridbody.height('auto');
                g.f.gridbody.height('auto');
            }
            if (p.width)
            {
                g.grid.width(p.width);
            }
            g._onResize.call(g);
        },
        _initFootbar: function ()
        {
            var g = this, p = this.options;
            if (p.usePager)
            {
                //创建底部工具条 - 选择每页显示记录数
                var optStr = "";
                var selectedIndex = -1;
                $(p.pageSizeOptions).each(function (i, item)
                {
                    var selectedStr = "";
                    if (p.pageSize == item) selectedIndex = i;
                    optStr += "<option value='" + item + "' " + selectedStr + " >" + item + "</option>";
                });

                $('.l-bar-selectpagesize', g.toolbar).append("<select name='rp' class='select-selectpagesize'>" + optStr + "</select>");
                if (selectedIndex != -1) $('.l-bar-selectpagesize select', g.toolbar)[0].selectedIndex = selectedIndex;
                if (p.switchPageSizeApplyComboBox && $.fn.juiceComboBox)
                {
                    $(".l-bar-selectpagesize select", g.toolbar).juiceComboBox(
                        {
                            onBeforeSelect: function ()
                            {
                                if (p.url && g.isDataChanged && !confirm(p.isContinueByDataChanged))
                                    return false;
                                return true;
                            },
                            width: 45
                        });
                }
                if(p.showAddButton){
                    $('.l-icon-add-default', g.toolbar).addClass("l-icon-add");
                    // $('.l-bar-separator-default', g.toolbar).addClass("l-bar-separator");
                }
            }
            else
            {
                g.toolbar.hide();
            }
        },
        showAddButton:function(flag){
            var g = this, p = this.options;
            if(flag){
                $('.l-icon-add-default', g.toolbar).addClass("l-icon-add");
                // $('.l-bar-separator-default', g.toolbar).addClass("l-bar-separator");
            }else{
                $('.l-icon-add-default', g.toolbar).removeClass("l-icon-add");
                // $('.l-bar-separator-default', g.toolbar).removeClass("l-bar-separator");
            }
            p.showAddButton = flag;

        },
        _searchData: function (data, clause)
        {
            var g = this, p = this.options;
            var newData = new Array();
            for (var i = 0; i < data.length; i++)
            {
                if (clause(data[i], i))
                {
                    newData[newData.length] = data[i];
                }
            }
            return newData;
        },
        _clearGrid: function ()
        {
            var g = this, p = this.options;
            for (var i in g.rows)
            {
                var rowobj = $(g.getRowObj(g.rows[i]));
                if (g.enabledFrozen())
                    rowobj = rowobj.add(g.getRowObj(g.rows[i], true));
                rowobj.unbind();
            }
            //清空数据
            g.gridbody.html("");
            g.f.gridbody.html("");
            g.recordNumber = 0;
            g.records = {};
            g.rows = [];
            //清空选择的行
            g.selected = [];
            g.totalNumber = 0;
            //编辑器计算器
            g.editorcounter = 0;
        },
        _fillGridBody: function (data, frozen)
        {
            var g = this, p = this.options;
            //加载数据
            var gridhtmlarr = ['<div class="l-grid-body-inner"><table class="l-grid-body-table" cellpadding=0 cellspacing=0><tbody>'];
            gridhtmlarr.push(g._generateRowsHtml(data, frozen));
            gridhtmlarr.push('</tbody></table></div>');
            (frozen? g.f.gridbody : g.gridbody).html(gridhtmlarr.join(''));
            //分组时不需要
            if (!g.enabledGroup())
            {
                //创建汇总行
                g._bulidTotalSummary(frozen);
            }
            $("> div:first", g.gridbody).width(g.gridtablewidth);
            g._onResize();
        },
        _generateRowsHtml:function(data,frozen) {
            var g = this, p = this.options;
            var gridhtmlarr = [];
            if (g.enabledGroup()&&!g.enabledColumnsGroup()) //启用分组模式
            {
                var groups = []; //分组列名数组
                var groupsdata = []; //切成几块后的数据
                g.groups = groupsdata;
                for (var rowparm in data) {
                    var item = data[rowparm];
                    var groupColumnValue = item[p.groupColumnName];
                    var valueIndex = $.inArray(groupColumnValue, groups);
                    if (valueIndex == -1) {
                        groups.push(groupColumnValue);
                        valueIndex = groups.length - 1;
                        groupsdata.push([]);
                    }
                    groupsdata[valueIndex].push(item);
                }
                $(groupsdata).each(function (i, item) {
                    if (groupsdata.length == 1)
                        gridhtmlarr.push('<tr class="l-grid-grouprow l-grid-grouprow-last l-grid-grouprow-first"');
                    if (i == groupsdata.length - 1)
                        gridhtmlarr.push('<tr class="l-grid-grouprow l-grid-grouprow-last"');
                    else if (i == 0)
                        gridhtmlarr.push('<tr class="l-grid-grouprow l-grid-grouprow-first"');
                    else
                        gridhtmlarr.push('<tr class="l-grid-grouprow"');
                    gridhtmlarr.push(' groupindex"=' + i + '" >');
                    gridhtmlarr.push('<td colSpan="' + g.columns.length + '" class="l-grid-grouprow-cell">');
                    gridhtmlarr.push('<span class="l-grid-group-togglebtn">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                    if (p.groupRender)
                        gridhtmlarr.push(p.groupRender(groups[i], item, p.groupColumnDisplay));
                    else
                        gridhtmlarr.push(p.groupColumnDisplay + ':' + g._getCellContent(item[0],g._getColumnByName(p.groupColumnName))||groups[i]||"__blank");
                    gridhtmlarr.push('</td>');
                    gridhtmlarr.push('</tr>');
                    gridhtmlarr.push(g._getHtmlFromData(item, frozen));
                    //汇总
                    if (g.isTotalSummary())
                        gridhtmlarr.push(g._getTotalSummaryHtml(item, "l-grid-totalsummary-group", frozen));
                });
            } else  if(g.enabledColumnsGroup()){
                var columnStr = p.groupColumnName;
                var columns = columnStr.split(",");
                if(typeof columns!="object"){
                    columns = [columns];
                }
                var datas = g._groupData(data,columns);
                g._extraGroupData(datas,gridhtmlarr,frozen,columns,0);
            }
            else {
                gridhtmlarr.push(g._getHtmlFromData(data, frozen));
            }
            return  gridhtmlarr.join("");
        },
        _showData: function ()
        {
            var g = this, p = this.options;
            var data = g.currentData[p.root];
            g._renderColumn(g.data);
            //进行column数据转换。（combox 值.渲染）
            if (p.usePager)
            {
                //更新总记录数
                if (p.dataAction == "server" && g.data && g.data[p.record])
                    p.total = g.data[p.record];
                else if (g.filteredData && g.filteredData[p.root])
                    p.total = g.filteredData[p.root].length;
                else if (g.data && g.data[p.root])
                    p.total = g.data[p.root].length;
                else if (data)
                    p.total = data.length;

                p.page = p.newPage;
                if (!p.total) p.total = 0;
                if (!p.page) p.page = 1;
                p.pageCount = Math.ceil(p.total / p.pageSize);
                if (!p.pageCount) p.pageCount = 1;
                //更新分页
                g._buildPager();
            }
            //加载中
            $('.l-bar-btnloading:first', g.toolbar).removeClass('l-bar-btnloading');
            if (g.trigger('beforeShowData', [g.currentData]) == false) return;
            g._clearGrid();
            g.isDataChanged = false;
            if (!data) return;
            $(".l-bar-btnload:first span", g.toolbar).removeClass("l-disabled");
            g._updateGridData();
            if (g.enabledFrozen())
                g._fillGridBody(g.rows, true);
            g._fillGridBody(g.rows, false);
            g.trigger('SysGridHeightChanged');
            if (p.totalRender)
            {
                $(".l-panel-bar-total", g.element).remove();
                $(".l-panel-bar", g.element).before('<div class="l-panel-bar-total">' + p.totalRender(g.data, g.filteredData) + '</div>');
            }
            if (p.mouseoverRowCssClass)
            {
                for (var i in g.rows)
                {
                    var rowobj = $(g.getRowObj(g.rows[i]));
                    if (g.enabledFrozen())
                        rowobj = rowobj.add(g.getRowObj(g.rows[i], true));
                    rowobj.bind('mouseover.gridrow', function ()
                    {
                        g._onRowOver(this, true);
                    }).bind('mouseout.gridrow', function ()
                    {
                        g._onRowOver(this, false);
                    });
                }
            }
            g.gridbody.trigger('scroll.grid');
            g.trigger('afterShowData', [g.currentData]);
        },
        _groupData:function(datas,columns){
            var g = this;
            var ret = {};
            for(var i= 0;i<datas.length;i++) {
                var data = datas[i];
                var column;
                var p;
                for(var j=0;j<columns.length;j++){
                    column = columns[j];
                    var value = g._getCellContent(data,g._getColumnByName(column))||data[column]||"__blank";
                    if(j==0){
                        if(!ret[value]){
                            ret[value] =  {};
                        }
                        p = ret;
                    }else if(j>0&&j<columns.length-1){
                        var preKey = g._getCellContent(data,g._getColumnByName(columns[j-1]));
                        p = p[preKey||"__blank"];
                        if(!p[value]){
                            p[value] = {};
                        }
                    }else if(j==columns.length-1){
                        var preKey = g._getCellContent(data,g._getColumnByName(columns[j-1]));
                        p = p[preKey||"__blank"];
                        if(!p[value]){
                            p[value]  = [];
                        }
                        p[value].push(data);
                    }
                }
            }
            return ret;
        },
        _extraGroupData:function(datas,gridhtmlarr,frozen,columns,depth,parentKey,currentKey){

            var g = this, p = this.options;
            depth++;
            if(parentKey&&currentKey){
                parentKey += "||" + currentKey;
            }else if(currentKey){
                parentKey = currentKey;
            }else{
                parentKey = "";
            }
            for(var key in datas){
                if(typeof datas[key]=="object"&&!datas[key].length){

                    g._createGroupHtml(parentKey, key, gridhtmlarr, columns[depth-1],depth,false);
                    g._extraGroupData(datas[key],gridhtmlarr,frozen,columns,depth,parentKey,key);

                }else {
                    var item = datas[key];
                    g._createGroupHtml(parentKey, key, gridhtmlarr,columns[depth-1], depth,true);

                    gridhtmlarr.push(g._getHtmlFromData(item, frozen));
                }

            }
        },
        _createGroupHtml:function(parentKey, key, gridhtmlarr ,column,depth,hasData) {
            var g = this, p = this.options;
            if(parentKey){
                parentKey += "||" + key;
            }else{
                parentKey = key;
            }
            if(column.showAsXml){
                key = g._xmlToHtml(key);
                parentKey = g._xmlToHtml(parentKey);
            }
            gridhtmlarr.push('<tr class="l-grid-grouprow l-grid-grouprow-last l-grid-grouprow-first l-grid-group-header"');
            gridhtmlarr.push(' groupKey="' + parentKey + '" >');
            gridhtmlarr.push('<td colSpan="' + g.columns.length + '" class="l-grid-grouprow-cell">');
            for (var i = 1; i < depth; i++) {
                gridhtmlarr.push("<div class='l-grid-tree-space'></div><div class='l-grid-tree-space'></div>");
            }
            var btnCss = "l-grid-group-togglebtn";
            if(!hasData){
                btnCss = "l-grid-groups-togglebtn";
            }
            gridhtmlarr.push('<span class="'+btnCss+'">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
            gridhtmlarr.push(g.getColumnByName(column).display + ':' + key);
            gridhtmlarr.push('</td>');
            gridhtmlarr.push('</tr>');
        } ,
        _getRowDomId: function (rowdata, frozen)
        {
            var p=this.options;
            return this.id + "|" + ((frozen) ? "1" : "2") + "|" + rowdata['__id'];
        },
        _getCellDomId: function (rowdata, column)
        {
            return this._getRowDomId(rowdata, column.frozen) + "|" + column['__id'];
        },
        _getHtmlFromData: function (data, frozen)
        {
            if (!data) return "";
            var g = this, p = this.options;
            var gridhtmlarr = [];
            for (var rowparm in data)
            {
                var item = data[rowparm];
                var rowid = item['__id'];
                if (!item) continue;
                gridhtmlarr.push('<tr');
                gridhtmlarr.push(' id="' + g._getRowDomId(item, frozen) + '"');
                gridhtmlarr.push(' class="l-grid-row'); //class start
                if (!frozen && g.enabledCheckbox() && p.isChecked && p.isChecked(item))
                {
                    g.select(item);
                    gridhtmlarr.push(' l-selected');
                }
                else if (g.isSelected(item))
                {
                    gridhtmlarr.push(' l-selected');
                }
                if (item['__index'] % 2 == 1 && p.alternatingRow)
                    gridhtmlarr.push(' l-grid-row-alt');
                gridhtmlarr.push('" ');  //class end
                if (p.rowAttrRender) gridhtmlarr.push(p.rowAttrRender(item, rowid));
                if (p.tree && g.collapsedRows && g.collapsedRows.length)
                {
                    var isHide = function ()
                    {
                        var pitem = g.getParent(item);
                        while (pitem)
                        {
                            if ($.inArray(pitem, g.collapsedRows) != -1) return true;
                            pitem = g.getParent(pitem);
                        }
                        return false;
                    };
                    if (isHide()) gridhtmlarr.push(' style="display:none;" ');
                }
                gridhtmlarr.push('>');
                $(g.columns).each(function (columnindex, column)
                {
                    if (frozen != column.frozen) return;
                    gridhtmlarr.push('<td');
                    gridhtmlarr.push(' id="' + g._getCellDomId(item, this) + '"');
                    //如果是行序号(系统列)
                    if (this.isrownumber)
                    {
                        gridhtmlarr.push(' class="l-grid-row-cell l-grid-row-cell-rownumbers" style="width:' + this.width + 'px"><div class="l-grid-row-cell-inner"');
                        if (p.fixedCellHeight)
                            gridhtmlarr.push(' style = "height:' + p.rowHeight + 'px;" ');
//                        gridhtmlarr.push('>' + (parseInt(item['__index']) + 1) + '</div></td>');
                        gridhtmlarr.push('>' + (parseInt(item['__index'])+((p.newPage-1)*p.pageSize) + 1) + '</div></td>');
                        return;
                    }
                    //如果是复选框(系统列)
                    if (this.ischeckbox)
                    {
                        gridhtmlarr.push(' class="l-grid-row-cell l-grid-row-cell-checkbox" style="width:' + this.width + 'px"><div class="l-grid-row-cell-inner"');
                        if (p.fixedCellHeight)
                            gridhtmlarr.push(' style = "height:' + p.rowHeight + 'px;" ');
                        gridhtmlarr.push('><span class="l-grid-row-cell-btn-checkbox"></span></div></td>');
                        return;
                    }
                    //如果是明细列(系统列)
                    else if (this.isdetail)
                    {
                        gridhtmlarr.push(' class="l-grid-row-cell l-grid-row-cell-detail" style="width:' + this.width + 'px"><div class="l-grid-row-cell-inner"');
                        if (p.fixedCellHeight)
                            gridhtmlarr.push(' style = "height:' + p.rowHeight + 'px;" ');
                        gridhtmlarr.push('><span class="l-grid-row-cell-detailbtn"></span></div></td>');
                        return;
                    }
                    var colwidth = this._width;
                    gridhtmlarr.push(' class="l-grid-row-cell ');
//                    if (g.changedCells[rowid + "_" + this['__id']]) gridhtmlarr.push("l-grid-row-cell-edited ");
                    if (this.islast)
                        gridhtmlarr.push('l-grid-row-cell-last ');
                    gridhtmlarr.push('"');
                    //if (this.columnname) gridhtmlarr.push('columnname="' + this.columnname + '"');
                    gridhtmlarr.push(' style = "');
                    gridhtmlarr.push('width:' + colwidth + 'px; ');
                    if (column._hide)
                    {
                        gridhtmlarr.push('display:none;');
                    }
                    gridhtmlarr.push(' ">');
                    gridhtmlarr.push(g._getCellHtml(item, column));
                    gridhtmlarr.push('</td>');
                });
                gridhtmlarr.push('</tr>');
            }
            return gridhtmlarr.join('');
        },
        _getCellHtml: function (rowdata, column)
        {
            var g = this, p = this.options;
            if (column.isrownumber)
                return '<div class="l-grid-row-cell-inner">' + (parseInt(rowdata['__index']) + 1) + '</div>';
            var htmlarr = [];
            htmlarr.push('<div class="l-grid-row-cell-inner"');
            //htmlarr.push('<div');
            htmlarr.push(' style = "width:' + parseInt(column._width - 8) + 'px;');
            if (p.fixedCellHeight) htmlarr.push('height:' + p.rowHeight + 'px;min-height:' + p.rowHeight + 'px; ');
            if (column.align) htmlarr.push('text-align:' + column.align + ';');
            var content = g._getCellContent(rowdata, column);
            htmlarr.push('">' + content + '</div>');
            return htmlarr.join('');
        },
        _getCellContent: function (rowdata, column)
        {
            if (!rowdata || !column) return "";
            if (column.isrownumber) return parseInt(rowdata['__index']) + 1;
            var rowid = rowdata['__id'];
            var rowindex = rowdata['__index'];
            var value = column.name ? rowdata[column.name] : "";
            if(column.name&&column.name.indexOf(".")){
                var names = column.name.split(".");
                for(var i=0;i<names.length;i++){
                    if(i==0){
                        value = rowdata[names[i]];
                    }else if(value){
                        value = value[names[i]];
                    } else{
                        break;
                    }

                }
            }

            var g = this, p = this.options;
            if(column.showAsXml){
                value = g._xmlToHtml(value);
            }
            var content = "";
            //combox 添加默认的渲染器
            if(column.editor&&column.editor.type=="select"&&!column.render) {
                column.render = function(item){
                    var columnName = column.editor.textField||column.editor.displayColumnName||"text";
                    return  item[columnName];
                }
            }
            if (column.render)
            {
                content = column.render.call(g, rowdata, rowindex, value, column);
            }
            else if (p.formatters[column.type])
            {
                content = p.formatters[column.type].call(g, value, column);
            }
            else if (value != null)
            {
                content = value.toString();
            }
            if (p.tree && (p.tree.columnName != null && p.tree.columnName == column.name || p.tree.columnId != null && p.tree.columnId == column.id))
            {
                content = g._getTreeCellHtml(content, rowdata);
            }
            return content || "";
        },
        _getTreeCellHtml: function (oldContent, rowdata)
        {
            var level = rowdata['__level'];
            var g = this, p = this.options;
            //var isExtend = p.tree.isExtend(rowdata);
            var isExtend = $.inArray(rowdata, g.collapsedRows || []) == -1;
            var isParent = p.tree.isParent(rowdata);
            var content = "";
            level = parseInt(level) || 1;
            for (var i = 1; i < level; i++)
            {
                content += "<div class='l-grid-tree-space'></div>";
            }
            if (isExtend && isParent)
                content += "<div class='l-grid-tree-space l-grid-tree-link l-grid-tree-link-open'></div>";
            else if (isParent)
                content += "<div class='l-grid-tree-space l-grid-tree-link l-grid-tree-link-close'></div>";
            else
                content += "<div class='l-grid-tree-space'></div>";
            content += "<span class='l-grid-tree-content'>" + oldContent + "</span>";
            return content;
        },
        _applyEditor: function (obj)
        {
            var g = this, p = this.options;
            var rowcell = obj;
            var ids = rowcell.id.split('|');
            var columnid = ids[ids.length - 1];
            var column = g._columns[columnid];
            var row = $(rowcell).parent();
            var rowdata = g.getRow(row[0]);
            var rowid = rowdata['__id'];
            var rowindex = rowdata['__index'];
            if (!column || !column.editor) return;
            var columnname = column.name;
            var columnindex = column.columnindex;
            if (column.editor.type && p.editors[column.editor.type])
            {
                if(column.frozen&&rowdata[p.statusName]!="add"){
                    return;
                }
                var currentdata = rowdata[columnname];
                var editParm = { record: rowdata, value: currentdata, column: column, rowindex: rowindex };
                if (g.trigger('beforeEdit', [editParm]) == false) return false;

                var editor = p.editors[column.editor.type];
                var jcell = $(rowcell), offset = $(rowcell).offset();
                jcell.html("");
                g.setCellNotBlank(rowdata,column,false);
                g.setCellEditing(rowdata, column, true);
                var width = $(rowcell).width(), height = $(rowcell).height();
                var container = $("<div class='l-grid-editor'></div>").appendTo('body');
                var ua = navigator.userAgent.toLowerCase();
                var s , ieVersion;
                (s = ua.match(/msie ([\d.]+)/)) ?ieVersion = s[1] : 0 ;
                if ($.browser.mozilla)
                    container.css({ left: offset.left, top: offset.top }).show();
                else if(6<ieVersion&&ieVersion<9)
                    container.css({ left: offset.left, top: offset.top }).show();
                else if(ieVersion>=9)
                    container.css({ left: offset.left, top: offset.top+1 }).show();
                else
                    container.css({ left: offset.left+1, top: offset.top+1 }).show();
                if(g.editorDatas[column.name]){
                    if(column.editor.type=="grid"){
                        column.editor.grid = column.editor.grid||{};
                        column.editor.grid.data = g.editorDatas[column.name];
                    }else{
                        column.editor.data = g.editorDatas[column.name];
                    }
                }
                var editorInput = g._createEditor(editor, container, editParm, width, height) ;
                g.editor = { editing: true, editor: editor, input: editorInput, editParm: editParm, container: container };
                g.unbind('sysEndEdit');
                g.bind('sysEndEdit', function ()
                {
                    var newValue = editor.getValue(editorInput, editParm);
                    if(column.editor.type=="select"||column.editor.type=="grid"&&!g.editorDatas[column.name]){
                        g.editorDatas[column.name] = editor.getData();
                    }
                    if (newValue != currentdata)
                    {
                        $(rowcell).addClass("l-grid-row-cell-edited");
                        g.changedCells[rowid + "_" + column['__id']] = true;
                        if (column.editor.onChange) column.editor.onChange(rowcell, newValue);
                        editParm.value = newValue;
                        if (g._checkEditAndUpdateCell(editParm))
                        {
                            if (column.editor.onChanged) column.editor.onChanged(rowcell, newValue);
                        }
                    }
                });
                editorInput[0].focus();
            }
        },
        _checkEditAndUpdateCell: function (editParm)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeSubmitEdit', [editParm]) == false) return false;
            g.updateCell(editParm.column, editParm.value, editParm.record);
//            if (editParm.column.render || g.enabledTotal()) g.reRender({rowdata:editParm.record, column: editParm.column });
//            g.reRender({ rowdata: editParm.record,column: editParm.column  });
            return true;
        },
        _getCurrentPageData: function (source)
        {
            var g = this, p = this.options;
            var data = {};
            data[p.root] = [];
            if (!source || !source[p.root] || !source[p.root].length)
            {
                data[p.record] = 0;
                return data;
            }
            data[p.record] = source[p.root].length;
            if (!p.newPage) p.newPage = 1;
            for (i = (p.newPage - 1) * p.pageSize; i < source[p.root].length && i < p.newPage * p.pageSize; i++)
            {
                data[p.root].push(source[p.root][i]);
            }
            return data;
        },
        //比较某一列两个数据
        _compareData: function (data1, data2, columnName, columnType)
        {
            var g = this, p = this.options;
            var val1 = data1[columnName], val2 = data2[columnName];
            if (val1 == null && val2 != null) return 1;
            else if (val1 == null && val2 == null) return 0;
            else if (val1 != null && val2 == null) return -1;
            if (p.sorters[columnType])
                return p.sorters[columnType].call(g, val1, val2);
            else
                return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
        },
        _getTotalCellContent: function (column, data)
        {
            var g = this, p = this.options;
            var totalsummaryArr = [];
            if (column.totalSummary)
            {
                var isExist = function (type)
                {
                    for (var i = 0; i < types.length; i++)
                        if (types[i].toLowerCase() == type.toLowerCase()) return true;
                    return false;
                };
                var sum = 0, count = 0, avg = 0;
                var max = parseFloat(data[0][column.name]);
                var min = parseFloat(data[0][column.name]);
                for (var i = 0; i < data.length; i++)
                {
                    count += 1;
                    var value = parseFloat(data[i][column.name]);
                    if (!value) continue;
                    sum += value;
                    if (value > max) max = value;
                    if (value < min) min = value;
                }
                avg = sum * 1.0 / data.length;
                if (column.totalSummary.render)
                {
                    var renderhtml = column.totalSummary.render({
                        sum: sum,
                        count: count,
                        avg: avg,
                        min: min,
                        max: max
                    }, column, g.data);
                    totalsummaryArr.push(renderhtml);
                }
                else if (column.totalSummary.type)
                {
                    var types = column.totalSummary.type.split(',');
                    if (isExist('sum'))
                        totalsummaryArr.push("<div>Sum=" + sum.toFixed(2) + "</div>");
                    if (isExist('count'))
                        totalsummaryArr.push("<div>Count=" + count + "</div>");
                    if (isExist('max'))
                        totalsummaryArr.push("<div>Max=" + max.toFixed(2) + "</div>");
                    if (isExist('min'))
                        totalsummaryArr.push("<div>Min=" + min.toFixed(2) + "</div>");
                    if (isExist('avg'))
                        totalsummaryArr.push("<div>Avg=" + avg.toFixed(2) + "</div>");
                }
            }
            return totalsummaryArr.join('');
        },
        _getTotalSummaryHtml: function (data, classCssName, frozen)
        {
            var g = this, p = this.options;
            var totalsummaryArr = [];
            if (classCssName)
                totalsummaryArr.push('<tr class="l-grid-totalsummary ' + classCssName + '">');
            else
                totalsummaryArr.push('<tr class="l-grid-totalsummary">');
            $(g.columns).each(function (columnindex, column)
            {
                if (this.frozen != frozen) return;
                //如果是行序号(系统列)
                if (this.isrownumber)
                {
                    totalsummaryArr.push('<td class="l-grid-totalsummary-cell l-grid-totalsummary-cell-rownumbers" style="width:' + this.width + 'px"><div>&nbsp;</div></td>');
                    return;
                }
                //如果是复选框(系统列)
                if (this.ischeckbox)
                {
                    totalsummaryArr.push('<td class="l-grid-totalsummary-cell l-grid-totalsummary-cell-checkbox" style="width:' + this.width + 'px"><div>&nbsp;</div></td>');
                    return;
                }
                //如果是明细列(系统列)
                else if (this.isdetail)
                {
                    totalsummaryArr.push('<td class="l-grid-totalsummary-cell l-grid-totalsummary-cell-detail" style="width:' + this.width + 'px"><div>&nbsp;</div></td>');
                    return;
                }
                totalsummaryArr.push('<td class="l-grid-totalsummary-cell');
                if (this.islast)
                    totalsummaryArr.push(" l-grid-totalsummary-cell-last");
                totalsummaryArr.push('" ');
                totalsummaryArr.push('id="' + g.id + "|total" + g.totalNumber + "|" + column.__id + '" ');
                totalsummaryArr.push('width="' + this._width + '" ');
                columnname = this.columnname;
                if (columnname)
                {
                    totalsummaryArr.push('columnname="' + columnname + '" ');
                }
                totalsummaryArr.push('columnindex="' + columnindex + '" ');
                totalsummaryArr.push('><div class="l-grid-totalsummary-cell-inner"');
                if (column.align)
                    totalsummaryArr.push(' style="text-Align:' + column.align + ';"');
                totalsummaryArr.push('>');
                totalsummaryArr.push(g._getTotalCellContent(column, data));
                totalsummaryArr.push('</div></td>');
            });
            totalsummaryArr.push('</tr>');
            if (!frozen) g.totalNumber++;
            return totalsummaryArr.join('');
        },
        _bulidTotalSummary: function (frozen)
        {
            var g = this, p = this.options;
            if (!g.isTotalSummary()) return false;
            if (!g.currentData || g.currentData[p.root].length == 0) return false;
            var totalRow = $(g._getTotalSummaryHtml(g.currentData[p.root], null, frozen));
            $("tbody:first", frozen ? g.f.gridbody : g.gridbody).append(totalRow);
        },
        _buildPager: function ()
        {
            var g = this, p = this.options;
            $('.pcontrol input', g.toolbar).val(p.page);
            if (!p.pageCount) p.pageCount = 1;
            $('.pcontrol span', g.toolbar).html(p.pageCount);
            var r1 = parseInt((p.page - 1) * p.pageSize) + 1.0;
            var r2 = parseInt(r1) + parseInt(p.pageSize) - 1;
            if (!p.total) p.total = 0;
            if (p.total < r2) r2 = p.total;
            if (!p.total) r1 = r2 = 0;
            if (r1 < 0) r1 = 0;
            if (r2 < 0) r2 = 0;
            var stat = p.pageStatMessage;
            stat = stat.replace(/{from}/, r1);
            stat = stat.replace(/{to}/, r2);
            stat = stat.replace(/{total}/, p.total);
            stat = stat.replace(/{pagesize}/, p.pageSize);
            $('.l-bar-text', g.toolbar).html(stat);
            if (!p.total)
            {
                $(".l-bar-btnfirst span,.l-bar-btnprev span,.l-bar-btnnext span,.l-bar-btnlast span", g.toolbar)
                    .addClass("l-disabled");
            }
            if (p.page == 1)
            {
                $(".l-bar-btnfirst span", g.toolbar).addClass("l-disabled");
                $(".l-bar-btnprev span", g.toolbar).addClass("l-disabled");
            }
            else if (p.page > p.pageCount && p.pageCount > 0)
            {
                $(".l-bar-btnfirst span", g.toolbar).removeClass("l-disabled");
                $(".l-bar-btnprev span", g.toolbar).removeClass("l-disabled");
            }
            if (p.page == p.pageCount)
            {
                $(".l-bar-btnlast span", g.toolbar).addClass("l-disabled");
                $(".l-bar-btnnext span", g.toolbar).addClass("l-disabled");
            }
            else if (p.page < p.pageCount && p.pageCount > 0)
            {
                $(".l-bar-btnlast span", g.toolbar).removeClass("l-disabled");
                $(".l-bar-btnnext span", g.toolbar).removeClass("l-disabled");
            }
        },
        _getRowIdByDomId: function (domid)
        {
            var ids = domid.split('|');
            var rowid = ids[2];
            return rowid;
        },
        _getRowByDomId: function (domid)
        {
            return this.records[this._getRowIdByDomId(domid)];
        },
        _getSrcElementByEvent: function (e)
        {
            var g = this;
            var obj = (e.target || e.srcElement);
            var jobjs = $(obj).parents().add(obj);
            var fn = function (parm)
            {
                for (var i = 0, l = jobjs.length; i < l; i++)
                {
                    if (typeof parm == "string")
                    {
                        if ($(jobjs[i]).hasClass(parm)) return jobjs[i];
                    }
                    else if (typeof parm == "object")
                    {
                        if (jobjs[i] == parm) return jobjs[i];
                    }
                }
                return null;
            };
            if (fn("l-grid-editor")) return { editing: true, editor: fn("l-grid-editor") };
            if (jobjs.index(this.element) == -1) return { out: true };
            var indetail = false;
            if (jobjs.hasClass("l-grid-detailpanel") && g.detailrows)
            {
                for (var i = 0, l = g.detailrows.length; i < l; i++)
                {
                    if (jobjs.index(g.detailrows[i]) != -1)
                    {
                        indetail = true;
                        break;
                    }
                }
            }
            var r = {
                grid: fn("l-panel"),
                indetail: indetail,
                frozen: fn(g.gridview1[0]) ? true : false,
                header: fn("l-panel-header"), //标题
                gridheader: fn("l-grid-header"), //表格头
                gridbody: fn("l-grid-body"),
                total: fn("l-panel-bar-total"), //总汇总
                popup: fn("l-grid-popup"),
                toolbar: fn("l-panel-bar")
            };
            if (r.gridheader)
            {
                r.hrow = fn("l-grid-hd-row");
                r.hcell = fn("l-grid-hd-cell");
                r.hcelltext = fn("l-grid-hd-cell-text");
                r.checkboxall = fn("l-grid-hd-cell-checkbox");
                if (r.hcell)
                {
                    var columnid = r.hcell.id.split('|')[2];
                    r.column = g._columns[columnid];
                }
            }
            if (r.gridbody)
            {
                r.row = fn("l-grid-row");
                r.cell = fn("l-grid-row-cell");
                r.checkbox = fn("l-grid-row-cell-btn-checkbox");
                r.groupbtn = fn("l-grid-group-togglebtn");
                r.groupsbtn = fn("l-grid-groups-togglebtn");
                r.grouprow = fn("l-grid-grouprow");
                r.detailbtn = fn("l-grid-row-cell-detailbtn");
                r.detailrow = fn("l-grid-detailpanel");
                r.totalrow = fn("l-grid-totalsummary");
                r.totalcell = fn("l-grid-totalsummary-cell");
                r.rownumberscell = $(r.cell).hasClass("l-grid-row-cell-rownumbers") ? r.cell : null;
                r.detailcell = $(r.cell).hasClass("l-grid-row-cell-detail") ? r.cell : null;
                r.checkboxcell = $(r.cell).hasClass("l-grid-row-cell-checkbox") ? r.cell : null;
                r.treelink = fn("l-grid-tree-link");
                r.editor = fn("l-grid-editor");
                if (r.row) r.data = this._getRowByDomId(r.row.id);
                if (r.cell) r.editing = $(r.cell).hasClass("l-grid-row-cell-editing");
                if (r.editor) r.editing = true;
                if (r.editing) r.out = false;
            }
            if (r.toolbar)
            {
                r.first = fn("l-bar-btnfirst");
                r.last = fn("l-bar-btnlast");
                r.next = fn("l-bar-btnnext");
                r.prev = fn("l-bar-btnprev");
                r.load = fn("l-bar-btnload");
                r.add = fn("l-icon-add");
                r.button = fn("l-bar-button");
            }

            return r;
        },
        _setEvent: function ()
        {
            var g = this, p = this.options;
            g.grid.bind("mousedown.grid", function (e)
            {
                g._onMouseDown.call(g, e);
            });
            g.grid.bind("dblclick.grid", function (e)
            {
                g._onDblClick.call(g, e);
            });
            g.grid.bind("contextmenu.grid", function (e)
            {
                return g._onContextmenu.call(g, e);
            });
            $(document).bind("mouseup.grid", function (e)
            {
                g._onMouseUp.call(g, e);
            });
            $(document).bind("click.grid", function (e)
            {
                g._onClick.call(g, e);
            });
            $(window).bind("resize.grid", function (e)
            {
                g._onResize.call(g);
            });
            $(document).bind("keydown.grid", function (e)
            {
                if (e.ctrlKey) g.ctrlKey = true;
                if(e.keyCode==9||e.keyCode==39){
                    e.preventDefault();
                    if(g.editor&&g.editor.editParm){
                        g._toNextCell(g.editor.editParm.rowindex,g.editor.editParm.column.columnindex);
                    }
                }
                if(g.editor&&g.editor.editParm){

                    if(e.keyCode==37){
                        g._toPrevCell(g.editor.editParm.rowindex,g.editor.editParm.column.columnindex);
                    }
//                    if(e.keyCode==38){
//                        g._toPrevRow(g.editor.editParm.rowindex,g.editor.editParm.column.columnindex);
//                    }
//                    if(e.keyCode==40){
//                        g._toNextRow(g.editor.editParm.rowindex,g.editor.editParm.column.columnindex);
//                    }
                }

            });
            $(document).bind("keyup.grid", function (e)
            {
                delete g.ctrlKey;
            });
            //表体 - 滚动联动事件
            g.gridbody.bind('scroll.grid', function ()
            {
                var scrollLeft = g.gridbody.scrollLeft();
                var scrollTop = g.gridbody.scrollTop();
                if (scrollLeft != null){
                    g.gridheader[0].scrollLeft = scrollLeft;
                }
                if (scrollTop != null)
                    g.f.gridbody[0].scrollTop = scrollTop;
                g.endEdit();
                g.trigger('SysGridHeightChanged');
            });
            //工具条 - 切换每页记录数事件
            $('select', g.toolbar).change(function ()
            {
                if (g.isDataChanged && !confirm(p.isContinueByDataChanged))
                    return false;
                p.newPage = 1;
                p.pageSize = this.value;
                g.loadData(p.where);
            });
            //工具条 - 切换当前页事件
            $('span.pcontrol :text', g.toolbar).blur(function (e)
            {
                g.changePage('input');
            });
            $("div.l-bar-button", g.toolbar).hover(function ()
            {
                $(this).addClass("l-bar-button-over");
            }, function ()
            {
                $(this).removeClass("l-bar-button-over");
            });
            //列拖拽支持
            if ($.fn.juiceDrag && p.colDraggable)
            {
                g.colDroptip = $("<div class='l-drag-coldroptip' style='display:none'><div class='l-drop-move-up'></div><div class='l-drop-move-down'></div></div>").appendTo('body');
                g.gridheader.add(g.f.gridheader).juiceDrag({ revert: true, animate: false,
                    proxyX: 0, proxyY: 0,
                    proxy: function (draggable, e)
                    {
                        var src = g._getSrcElementByEvent(e);
                        if (src.hcell && src.column)
                        {
                            var content = $(".l-grid-hd-cell-text:first", src.hcell).html();
                            var proxy = $("<div class='l-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div></div>").appendTo('body');
                            proxy.append(content);
                            return proxy;
                        }
                    },
                    onRevert: function () { return false; },
                    onRendered: function ()
                    {
                        this.set('cursor', 'default');
                        g.children[this.id] = this;
                    },
                    onStartDrag: function (current, e)
                    {
                        if (e.button == 2) return false;
                        if (g.colresizing) return false;

                        this.set('cursor', 'default');
                        var src = g._getSrcElementByEvent(e);
                        var pageX = e.pageX;
                        var pageY = e.pageY;
                        var trig = $(".l-grid-hd-trigger",src.hcell);
                        var triggerOffset = trig.offset();
                        if(triggerOffset){
                            if (pageX > triggerOffset.left && pageX < (triggerOffset.left+ trig.width() )
                                && pageY <(triggerOffset.top+ trig.height())&& pageY > triggerOffset.top){
                                return false;
                            }
                        }
                        if (!src.hcell || !src.column || src.column.issystem || src.hcelltext) return false;
                        if ($(src.hcell).css('cursor').indexOf('resize') != -1) return false;
                        this.draggingColumn = src.column;
                        g.coldragging = true;

                        var gridOffset = g.grid.offset();
                        var top = gridOffset.top + (p.title?g.header.height():0);
                        this.validRange = {
                            top: top,
                            bottom:top + g.gridheader.height(),
                            left: gridOffset.left - 10,
                            right: gridOffset.left + g.grid.width() + 10
                        };
                    },
                    onDrag: function (current, e)
                    {
                        this.set('cursor', 'default');
                        var column = this.draggingColumn;
                        if (!column) return false;
                        if (g.colresizing) return false;
                        if (g.colDropIn == null)
                            g.colDropIn = -1;
                        var pageX = e.pageX;
                        var pageY = e.pageY;
                        var visit = false;
                        var gridOffset = g.grid.offset();
                        var validRange = this.validRange;
                        if (pageX < validRange.left || pageX > validRange.right
                            || pageY > validRange.bottom || pageY < validRange.top)
                        {
                            g.colDropIn = -1;
                            g.colDroptip.hide();
                            this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes").addClass("l-drop-no");
                            return;
                        }
                        for (var colid in g._columns)
                        {
                            var col = g._columns[colid];
                            if (column == col)
                            {
                                visit = true;
                                continue;
                            }
                            if (col.issystem) continue;
                            var sameLevel = col['__level'] == column['__level'];
                            var isAfter = !sameLevel ? false : visit ? true : false;
                            if (column.frozen != col.frozen) isAfter = col.frozen ? false : true;
                            if (g.colDropIn != -1 && g.colDropIn != colid) continue;
                            var cell = document.getElementById(col['__domid']);
                            var offset = $(cell).offset();
                            var range = {
                                top: offset.top,
                                bottom: offset.top + $(cell).height(),
                                left: offset.left - 60,
                                right: offset.left + 60
                            };
                            if (isAfter)
                            {
                                var cellwidth = $(cell).width();
                                range.left += cellwidth;
                                range.right += cellwidth;
                            }
                            if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom)
                            {
                                var height = p.headerRowHeight;
                                if (col['__rowSpan']) height *= col['__rowSpan'];
                                g.colDroptip.css({
                                    left: range.left + 54,
                                    top: range.top - 9,
                                    height: height + 9 * 2
                                }).show();
                                g.colDropIn = colid;
                                g.colDropDir = isAfter ? "right" : "left";
                                this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no").addClass("l-drop-yes");
                                break;
                            }
                            else if (g.colDropIn != -1)
                            {
                                g.colDropIn = -1;
                                g.colDroptip.hide();
                                this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes").addClass("l-drop-no");
                            }
                        }
                    },
                    onStopDrag: function (current, e)
                    {
                        var column = this.draggingColumn;
                        g.coldragging = false;
                        if (g.colDropIn != -1)
                        {
                            g.changeCol.juiceDefer(g, 0, [column, g.colDropIn, g.colDropDir == "right"]);
                            g.colDropIn = -1;
                        }
                        g.colDroptip.hide();
                        this.set('cursor', 'default');
                    }
                });
            }
            //行拖拽支持
            if ($.fn.juiceDrag && p.rowDraggable)
            {
                g.rowDroptip = $("<div class='l-drag-rowdroptip' style='display:none'></div>").appendTo('body');
                g.gridbody.add(g.f.gridbody).juiceDrag({ revert: true, animate: false,
                    proxyX: 0, proxyY: 0,
                    proxy: function (draggable, e)
                    {
                        var src = g._getSrcElementByEvent(e);
                        if (src.row)
                        {
                            var content = p.draggingMessage.replace(/{count}/, draggable.draggingRows ? draggable.draggingRows.length : 1);
                            if (p.rowDraggingRender)
                            {
                                content = p.rowDraggingRender(draggable.draggingRows, draggable, g);
                            }
                            var proxy = $("<div class='l-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div>" + content + "</div>").appendTo('body');
                            return proxy;
                        }
                    },
                    onRevert: function () { return false; },
                    onRendered: function ()
                    {
                        this.set('cursor', 'default');
                        g.children[this.id] = this;
                    },
                    onStartDrag: function (current, e)
                    {
                        if (e.button == 2) return false;
                        if (g.colresizing) return false;
                        if (!g.columns.length) return false;
                        this.set('cursor', 'default');
                        var src = g._getSrcElementByEvent(e);
                        if (!src.cell || !src.data || src.checkbox) return false;
                        var ids = src.cell.id.split('|');
                        var column = g._columns[ids[ids.length - 1]];
                        if (src.rownumberscell || src.detailcell || src.checkboxcell || column == g.columns[0])
                        {
                            if (g.enabledCheckbox())
                            {
                                this.draggingRows = g.getSelecteds();
                                if (!this.draggingRows || !this.draggingRows.length) return false;
                            }
                            else
                            {
                                this.draggingRows = [src.data];
                            }
                            this.draggingRow = src.data;
                            this.set('cursor', 'move');
                            g.rowdragging = true;
                            this.validRange = {
                                top: g.gridbody.offset().top,
                                bottom: g.gridbody.offset().top + g.gridbody.height(),
                                left: g.grid.offset().left - 10,
                                right: g.grid.offset().left + g.grid.width() + 10
                            };
                        }
                        else
                        {
                            return false;
                        }
                    },
                    onDrag: function (current, e)
                    {
                        var rowdata = this.draggingRow;
                        if (!rowdata) return false;
                        var rows = this.draggingRows ? this.draggingRows : [rowdata];
                        if (g.colresizing) return false;
                        if (g.rowDropIn == null) g.rowDropIn = -1;
                        var pageX = e.pageX;
                        var pageY = e.pageY;
                        var visit = false;
                        var validRange = this.validRange;
                        if (pageX < validRange.left || pageX > validRange.right
                            || pageY > validRange.bottom || pageY < validRange.top)
                        {
                            g.rowDropIn = -1;
                            g.rowDroptip.hide();
                            this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes l-drop-add").addClass("l-drop-no");
                            return;
                        }
                        for (var i in g.rows)
                        {
                            var rd = g.rows[i];
                            var rowid = rd['__id'];
                            if (rowdata == rd) visit = true;
                            if ($.inArray(rd, rows) != -1) continue;
                            var isAfter = visit ? true : false;
                            if (g.rowDropIn != -1 && g.rowDropIn != rowid) continue;
                            var rowobj = g.getRowObj(rowid);
                            var offset = $(rowobj).offset();
                            var range = {
                                top: offset.top - 4,
                                bottom: offset.top + $(rowobj).height() + 4,
                                left: g.grid.offset().left,
                                right: g.grid.offset().left + g.grid.width()
                            };
                            if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom)
                            {
                                var lineTop = offset.top;
                                if (isAfter) lineTop += $(rowobj).height();
                                g.rowDroptip.css({
                                    left: range.left,
                                    top: lineTop,
                                    width: range.right - range.left
                                }).show();
                                g.rowDropIn = rowid;
                                g.rowDropDir = isAfter ? "bottom" : "top";
                                if (p.tree && pageY > range.top + 5 && pageY < range.bottom - 5)
                                {
                                    this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-yes").addClass("l-drop-add");
                                    g.rowDroptip.hide();
                                    g.rowDropInParent = true;
                                }
                                else
                                {
                                    this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-add").addClass("l-drop-yes");
                                    g.rowDroptip.show();
                                    g.rowDropInParent = false;
                                }
                                break;
                            }
                            else if (g.rowDropIn != -1)
                            {
                                g.rowDropIn = -1;
                                g.rowDropInParent = false;
                                g.rowDroptip.hide();
                                this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes  l-drop-add").addClass("l-drop-no");
                            }
                        }
                    },
                    onStopDrag: function (current, e)
                    {
                        var rows = this.draggingRows;
                        g.rowdragging = false;
                        for (var i = 0; i < rows.length; i++)
                        {
                            var children = rows[i].children;
                            if (children)
                            {
                                rows = $.grep(rows, function (node, i)
                                {
                                    var isIn = $.inArray(node, children) == -1;
                                    return isIn;
                                });
                            }
                        }
                        if (g.rowDropIn != -1)
                        {
                            if (p.tree)
                            {
                                var neardata, prow;
                                if (g.rowDropInParent)
                                {
                                    prow = g.getRow(g.rowDropIn);
                                }
                                else
                                {
                                    neardata = g.getRow(g.rowDropIn);
                                    prow = g.getParent(neardata);
                                }
                                g.appendRange(rows, prow, neardata, g.rowDropDir != "bottom");
                                g.trigger('rowDragDrop', {
                                    rows: rows,
                                    parent: prow,
                                    near: neardata,
                                    after: g.rowDropDir == "bottom"
                                });
                            }
                            else
                            {
                                g.moveRange(rows, g.rowDropIn, g.rowDropDir == "bottom");
                                g.trigger('rowDragDrop', {
                                    rows: rows,
                                    parent: prow,
                                    near: g.getRow(g.rowDropIn),
                                    after: g.rowDropDir == "bottom"
                                });
                            }

                            g.rowDropIn = -1;
                        }
                        g.rowDroptip.hide();
                        this.set('cursor', 'default');
                    }
                });
            }
        },
        _onRowOver: function (rowParm, over)
        {
            if (l.draggable.dragging) return;
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var methodName = over ? "addClass" : "removeClass";
            if (g.enabledFrozen())
                $(g.getRowObj(rowdata, true))[methodName](p.mouseoverRowCssClass);
            $(g.getRowObj(rowdata, false))[methodName](p.mouseoverRowCssClass);
        },
        _onMouseUp: function (e)
        {
            var g = this, p = this.options;
            if (l.draggable.dragging)
            {
                var src = g._getSrcElementByEvent(e);

                //drop in header cell
                if (src.hcell && src.column)
                {
                    g.trigger('dragdrop', [{ type: 'header', column: src.column, cell: src.hcell }, e]);
                }
                else if (src.row)
                {
                    g.trigger('dragdrop', [{ type: 'row', record: src.data, row: src.row }, e]);
                }
            }
        },
        _onMouseDown: function (e)
        {
            var g = this, p = this.options;
        },
        _onContextmenu: function (e)
        {
            var g = this, p = this.options;
            var src = g._getSrcElementByEvent(e);
            if (src.row)
            {
                if (p.onRClickToSelect)
                    g.select(src.data);
                if (g.hasBind('contextmenu'))
                {
                    return g.trigger('contextmenu', [{ data: src.data, rowindex: src.data['__index'], row: src.row }, e]);
                }
            }

        },
        _onDblClick: function (e)
        {
            var g = this, p = this.options;
            var src = g._getSrcElementByEvent(e);
            if (src.row)
            {
                g.trigger('dblClickRow', [src.data, src.data['__id'], src.row]);
            }
        },
        _onClick: function (e)
        {
            var obj = (e.target || e.srcElement);
            var g = this, p = this.options;
            var src = g._getSrcElementByEvent(e);
            if (src.out)
            {
                if (g.editor.editing && !$.jui.win.masking&&!g.isComplexEditor(g.editor)) g.endEdit();
                else if(g.endComPlexEditor(g.editor)) g.endEdit();
//                if (p.allowHideColumn) g.menu.hide();
                return;
            }
            if (src.indetail || src.editing)
            {
                return;
            }
            if (g.editor.editing)
            {
                g.endEdit();
            }
            if (p.allowHideColumn)
            {
                if (!src.popup)
                {
                    g.popup.hide();
                }
            }
            if (src.checkboxall) //复选框全选
            {
                var row = $(src.hrow);
                var uncheck = row.hasClass("l-checked");
                if (g.trigger('beforeCheckAllRow', [!uncheck, g.element]) == false) return false;
                if (uncheck)
                {
                    row.removeClass("l-checked");
                }
                else
                {
                    row.addClass("l-checked");
                }
                g.selected = [];
                for (var rowid in g.records)
                {
                    if (uncheck)
                        g.unselect(g.records[rowid]);
                    else
                        g.selectWithoutTrigger(g.records[rowid]);
                }
                g.trigger('checkAllRow', [!uncheck, g.element,g.rows]);
            }
            else if (src.hcelltext) //排序
            {
                var hcell = $(src.hcelltext).parent().parent();
                if (!p.enabledSort || !src.column) return;
                if (src.column.isSort == false) return;
                if (p.url && g.isDataChanged && !confirm(p.isContinueByDataChanged)) return;
                var sort = $(".l-grid-hd-cell-sort:first", hcell);
                var columnName = src.column.name;
                if (!columnName) return;
                if (sort.length > 0)
                {
                    if (sort.hasClass("l-grid-hd-cell-sort-asc"))
                    {
                        sort.removeClass("l-grid-hd-cell-sort-asc").addClass("l-grid-hd-cell-sort-desc");
                        hcell.removeClass("l-grid-hd-cell-asc").addClass("l-grid-hd-cell-desc");
                        g.changeSort(columnName, 'desc');
                    }
                    else if (sort.hasClass("l-grid-hd-cell-sort-desc"))
                    {
                        sort.removeClass("l-grid-hd-cell-sort-desc").addClass("l-grid-hd-cell-sort-asc");
                        hcell.removeClass("l-grid-hd-cell-desc").addClass("l-grid-hd-cell-asc");
                        g.changeSort(columnName, 'asc');
                    }
                }
                else
                {
                    hcell.removeClass("l-grid-hd-cell-desc").addClass("l-grid-hd-cell-asc");
                    $(src.hcelltext).after("<span class='l-grid-hd-cell-sort l-grid-hd-cell-sort-asc'>&nbsp;&nbsp;</span>");
                    g.changeSort(columnName, 'asc');
                }
                $(".l-grid-hd-cell-sort", g.gridheader).add($(".l-grid-hd-cell-sort", g.f.gridheader)).not($(".l-grid-hd-cell-sort:first", hcell)).remove();
            }
            //明细
            else if (src.detailbtn && p.detail)
            {
                var item = src.data;
                var row = $([g.getRowObj(item, false)]);
                if (g.enabledFrozen()) row = row.add(g.getRowObj(item, true));
                var rowid = item['__id'];
                if ($(src.detailbtn).hasClass("l-open"))
                {
                    if (p.detail.onCollapse)
                        p.detail.onCollapse(item, $(".l-grid-detailpanel-inner:first", nextrow)[0]);
                    row.next("tr.l-grid-detailpanel").hide();
                    $(src.detailbtn).removeClass("l-open");
                }
                else
                {
                    var nextrow = row.next("tr.l-grid-detailpanel");
                    if (nextrow.length > 0)
                    {
                        nextrow.show();
                        if (p.detail.onExtend)
                            p.detail.onExtend(item, $(".l-grid-detailpanel-inner:first", nextrow)[0]);
                        $(src.detailbtn).addClass("l-open");
                        g.trigger('SysGridHeightChanged');
                        return;
                    }
                    $(src.detailbtn).addClass("l-open");
                    var frozenColNum = 0;
                    for (var i = 0; i < g.columns.length; i++)
                        if (g.columns[i].frozen) frozenColNum++;
                    var detailRow = $("<tr class='l-grid-detailpanel'><td><div class='l-grid-detailpanel-inner' style='display:none'></div></td></tr>");
                    var detailFrozenRow = $("<tr class='l-grid-detailpanel'><td><div class='l-grid-detailpanel-inner' style='display:none'></div></td></tr>");
                    detailRow.attr("id", g.id + "|detail|" + rowid);
                    g.detailrows = g.detailrows || [];
                    g.detailrows.push(detailRow[0]);
                    g.detailrows.push(detailFrozenRow[0]);
                    var detailRowInner = $("div:first", detailRow);
                    detailRowInner.parent().attr("colSpan", g.columns.length - frozenColNum);
                    row.eq(0).after(detailRow);
                    if (frozenColNum > 0)
                    {
                        detailFrozenRow.find("td:first").attr("colSpan", frozenColNum);
                        row.eq(1).after(detailFrozenRow);
                    }
                    if (p.detail.onShowDetail)
                    {
                        p.detail.onShowDetail(item, detailRowInner[0], function ()
                        {
                            g.trigger('SysGridHeightChanged');
                        });
                        $("div:first", detailFrozenRow).add(detailRowInner).show().height(p.detail.height || p.detailHeight);
                    }
                    else if (p.detail.render)
                    {
                        detailRowInner.append(p.detail.render());
                        detailRowInner.show();
                    }
                    g.trigger('SysGridHeightChanged');
                }
            }
            else if (src.groupbtn)
            {
                var grouprow = $(src.grouprow);
                var opening = true;
                if ($(src.groupbtn).hasClass("l-grid-group-togglebtn-close"))
                {
                    $(src.groupbtn).removeClass("l-grid-group-togglebtn-close");

                    if (grouprow.hasClass("l-grid-grouprow-last"))
                    {
                        $("td:first", grouprow).width('auto');
                    }
                }
                else
                {
                    opening = false;
                    $(src.groupbtn).addClass("l-grid-group-togglebtn-close");
                    if (grouprow.hasClass("l-grid-grouprow-last"))
                    {
                        $("td:first", grouprow).width(g.gridtablewidth);
                    }
                }
                var currentRow = grouprow.next(".l-grid-row,.l-grid-totalsummary-group,.l-grid-detailpanel");
                while (true)
                {
                    if (currentRow.length == 0) break;
                    if (opening)
                    {
                        currentRow.show();
                        //如果是明细展开的行，并且之前的状态已经是关闭的，隐藏之
                        if (currentRow.hasClass("l-grid-detailpanel") && !currentRow.prev().find("td.l-grid-row-cell-detail:first span.l-grid-row-cell-detailbtn:first").hasClass("l-open"))
                        {
                            currentRow.hide();
                        }
                    }
                    else
                    {
                        currentRow.hide();
                    }
                    currentRow = currentRow.next(".l-grid-row,.l-grid-totalsummary-group,.l-grid-detailpanel");
                }
                g.trigger('SysGridHeightChanged');
            }
            else if (src.groupsbtn)
            {
                var grouprow = $(src.grouprow);
                var opening = true;
                if ($(src.groupsbtn).hasClass("l-grid-groups-togglebtn-close"))
                {
                    $(src.groupsbtn).removeClass("l-grid-groups-togglebtn-close");

                    if (grouprow.hasClass("l-grid-grouprow-last"))
                    {
                        $("td:first", grouprow).width('auto');
                    }
                }
                else
                {
                    opening = false;
                    $(src.groupsbtn).addClass("l-grid-groups-togglebtn-close");
                    if (grouprow.hasClass("l-grid-grouprow-last"))
                    {
                        $("td:first", grouprow).width(g.gridtablewidth);
                    }
                }
                var parentKey = grouprow.attr("groupKey");
                var currentRow = grouprow.next();
                while (currentRow.length>0)
                {
                    if (currentRow.attr("groupKey")&&currentRow.attr("groupKey").indexOf(parentKey)!=0&&(!currentRow.hasClass("l-grid-row"))) break;
                    if (opening)
                    {
                        currentRow.show();
                        //如果是明细展开的行，并且之前的状态已经是关闭的，隐藏之
                        if (currentRow.hasClass("l-grid-detailpanel") && !currentRow.prev().find("td.l-grid-row-cell-detail:first span.l-grid-row-cell-detailbtn:first").hasClass("l-open"))
                        {
                            currentRow.hide();
                        }
                        if(currentRow.attr("groupKey")&&currentRow.attr("groupKey").indexOf(parentKey)==0){
                            $(".l-grid-groups-togglebtn",currentRow).removeClass("l-grid-groups-togglebtn-close")
                            $(".l-grid-group-togglebtn",currentRow).removeClass("l-grid-group-togglebtn-close")
//                            currentRow.find(".l-grid-groups-togglebtn").addClass("l-grid-groups-togglebtn-close");
                        }
                    }
                    else
                    {
                        currentRow.hide();
                        if(currentRow.attr("groupKey")&&currentRow.attr("groupKey").indexOf(parentKey)==0){
                            currentRow.find(".l-grid-groups-togglebtn").addClass("l-grid-groups-togglebtn-close");
                            currentRow.find(".l-grid-group-togglebtn").addClass("l-grid-group-togglebtn-close");
                        }
                    }

                    currentRow = currentRow.next();
                }
                g.trigger('SysGridHeightChanged');
            }
            //树 - 伸展/收缩节点
            else if (src.treelink)
            {
                g.toggle(src.data);
            }
            else if (src.row && g.enabledCheckbox()) //复选框选择行
            {
                //复选框
                var selectRowButtonOnly = p.selectRowButtonOnly ? true : false;
                if (p.enabledEdit) selectRowButtonOnly = true;
                if (src.checkbox || !selectRowButtonOnly)
                {

                    if(p.singleSelect){
                        var rows = g.getSelectedRows();
                        for(i=0;i<rows.length;i++){
                            g.unselect(rows[i]);
                        }
                    }
                    var row = $(src.row);
                    var uncheck = row.hasClass("l-selected");
                    if (g.trigger('beforeCheckRow', [!uncheck, src.data, src.data['__id'], src.row]) == false)
                        return false;
                    var met = uncheck ? 'unselect' : 'select';
                    g[met](src.data);
                    if (p.tree && p.autoCheckChildren)
                    {
                        var children = g.getChildren(src.data, true);
                        for (var i = 0, l = children.length; i < l; i++)
                        {
                            g[met](children[i]);
                        }
                    }
                    g.trigger('checkRow', [!uncheck, src.data, src.data['__id'], src.row]);
                }
                if (!src.checkbox && src.cell && p.enabledEdit && p.clickToEdit)
                {
                    g._applyEditor(src.cell);
                }
            }
            else if (src.row && !g.enabledCheckbox())
            {
                if (src.cell && p.enabledEdit && p.clickToEdit)
                {
                    g._applyEditor(src.cell);
                }

                //选择行
                if ($(src.row).hasClass("l-selected"))
                {
                    if (!p.allowUnSelectRow)
                    {
                        $(src.row).addClass("l-selected-again");
                        return;
                    }
                    g.unselect(src.data);
                }
                else
                {
                    g.select(src.data);
                }
            }
            else if (src.toolbar)
            {
                if (src.first)
                {
                    if (g.trigger('toFirst', [g.element]) == false) return false;
                    g.changePage('first');
                }
                else if (src.prev)
                {
                    if (g.trigger('toPrev', [g.element]) == false) return false;
                    g.changePage('prev');
                }
                else if (src.next)
                {
                    if (g.trigger('toNext', [g.element]) == false) return false;
                    g.changePage('next');
                }
                else if (src.last)
                {
                    if (g.trigger('toLast', [g.element]) == false) return false;
                    g.changePage('last');
                }
                else if (src.load)
                {
                    if ($("span", src.load).hasClass("l-disabled")) return false;
                    if (g.trigger('reload', [g.element]) == false) return false;
                    if (p.url && g.isDataChanged && !confirm(p.isContinueByDataChanged))
                        return false;
                    g.loadData(p.where);
                }else if(src.add){
                    var rows = g.getSelectedRows();
                    var columns = ",";
                    if(p.copyColumns){
                        columns + p.copyColumns + ",";
                    }else{
                        $(g.columns).each(function(){
                            if(this.editor){
                                columns += this.name +",";
                            }
                        });
                    }
                    var newRows = [];
                    if(rows.length>0){
                        $(rows).each(function(index,row){
                            var rowData = jQuery.extend(true,{}, row);
                            $(g.formatRecord(rowData));
                            var newRow = {};
                            for(var key in row){
                                if(columns.indexOf(","+key+",")>=0){
                                    newRow[key] = row[key];
                                }
                            }
                            if(row[p.statusName]!=="add"){
                                g.unselect(row);
                            }
                            newRows.push(newRow);
                        });
                    }else{
                        newRows.push({});
                    }
                    g.addDataRows(newRows);
                }
            }
        },
        isComplexEditor:function(editor){
            return editor&&(editor.editParm.column.editor.type == "grid"||editor.editParm.column.editor.type == "date" );
        },
        endComPlexEditor:function(editor){
            if(editor&&editor.editor&&editor.editor.box){
                if(editor.editor.box.selectBox){
                    return !editor.editor.box.selectBox.is(":visible");
                }else if(g.editor.editor.box.dateeditor){
                    return  !g.editor.editor.box.dateeditor.is(":visible");
                }
            }
            return false
        },
        select: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var rowid = rowdata['__id'];
            var rowobj = g.getRowObj(rowid);
            g.selectWithoutTrigger(rowParm);
            g.trigger('selectRow', [rowdata, rowid, rowobj]);
        },
        selectWithoutTrigger:function(rowParm){

            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var rowid = rowdata['__id'];
            var rowobj = g.getRowObj(rowid);
            var rowobj1 = g.getRowObj(rowid, true);
            if (!g.enabledCheckbox() && !g.ctrlKey) //单选
            {
                for (var i in g.selected)
                {
                    var o = g.selected[i];
                    if (o['__id'] in g.records)
                    {
                        $(g.getRowObj(o)).removeClass("l-selected l-selected-again");
                        if (g.enabledFrozen())
                            $(g.getRowObj(o, true)).removeClass("l-selected l-selected-again");
                    }
                }
                g.selected = [];
            }
            if (rowobj) $(rowobj).addClass("l-selected");
            if (rowobj1) $(rowobj1).addClass("l-selected");
            g.selected[g.selected.length] = rowdata;
        },
        unselect: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            var rowid = rowdata['__id'];
            var rowobj = g.getRowObj(rowid);
            var rowobj1 = g.getRowObj(rowid, true);
            $(rowobj).removeClass("l-selected l-selected-again");
            if (g.enabledFrozen())
                $(rowobj1).removeClass("l-selected l-selected-again");
            g._removeSelected(rowdata);
            g.trigger('unSelectRow', [rowdata, rowid, rowobj]);
        },
        /**
         * 跳转到下一个Cell中
         * @private
         */
        _toNextCell:function(rowIndex,colmunIndex){
            var g = this, p = this.options;
            g.endEdit();
            var cell;
            for(var i= colmunIndex+1;i< g.columns.length;i++){
                var column = g.columns[i];
                if (column.editor&&column.editor.type && p.editors[column.editor.type]){
                    cell = g.getCellObj(rowIndex,i);
                    break;
                }
            }
            //下一行
            if(!cell && rowIndex< g.rows.length-1){
                for(var j = 0;j< g.columns.length-1;j++){
                    var column = g.columns[j];
                    if (column.editor&&column.editor.type && p.editors[column.editor.type]){
                        cell = g.getCellObj(rowIndex+1,j);
                        break;
                    }
                }
            }
            if(cell){
                g._applyEditor(cell);
            }

        },
        /**
         * 跳转到上一个Cell中
         * @param rowIndex
         * @param colmunIndex
         * @private
         */
        _toPrevCell:function(rowIndex,colmunIndex){
            var g = this, p = this.options;
            g.endEdit();
            var cell;
            for(var i = colmunIndex-1;i>=0;i--){
                var column = g.columns[i];
                if (column.editor&&column.editor.type && p.editors[column.editor.type]){
                    cell = g.getCellObj(rowIndex,i);
                    break;
                }
            }
            //上一行
            if(!cell && rowIndex>0){
                for(var j = g.columns.length-1;j>=0;j--){
                    var column = g.columns[j];
                    if (column.editor&&column.editor.type && p.editors[column.editor.type]){
                        cell = g.getCellObj(rowIndex-1,j);
                        break;
                    }
                }
            }
            if(cell){
                g._applyEditor(cell);
            }

        },
        /**
         * 编辑下一行
         * @param rowIndex
         * @param colmunIndex
         * @private
         */
        _toNextRow:function(rowIndex,colmunIndex){
            var g = this, p = this.options;
            g.endEdit();
            if( rowIndex< g.rows.length-1){
                var cell = g.getCellObj(rowIndex+1,colmunIndex);
                g._applyEditor(cell);
            }
        },
        /**
         * 编辑上一行
         * @param rowIndex
         * @param colmunIndex
         * @private
         */
        _toPrevRow:function(rowIndex,colmunIndex){
            var g = this, p = this.options;
            g.endEdit();
            if(rowIndex>0){
                var cell = g.getCellObj(rowIndex-1,colmunIndex);
                g._applyEditor(cell);
            }
        },

        /**
         * xml 处理
         * @param str
         */
        _xmlToHtml:function(str){
            if(str&&typeof str=="string"){
                str = str.replace(/</g,"&lt;");
                str = str.replace(/>/g,"&gt;");
            }
            return str;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 判断是否被选中 。
         * @name   juiceGrid#isSelected
         * @param  {Object} rowParm  rowindex或者rowdata
         * @return {Boolean}
         * @function
         */
        isSelected: function (rowParm)
        {
            var g = this, p = this.options;
            var rowdata = g.getRow(rowParm);
            for (var i in g.selected)
            {
                if (g.selected[i] == rowdata) return true;
            }
            return false;
        },
        _onResize: function ()
        {
            var g = this, p = this.options;
            if (p.height && p.height != 'auto')
            {
                var windowHeight = $(window).height();
                //if(g.windowHeight != undefined && g.windowHeight == windowHeight) return;

                var h = 0;
                var parentHeight = null;
                if (typeof (p.height) == "string" && p.height.indexOf('%') > 0)
                {
                    var gridparent = g.grid.parent();
                    if (p.InWindow)
                    {
                        parentHeight = windowHeight;
                        parentHeight -= parseInt($('body').css('paddingTop'));
                        parentHeight -= parseInt($('body').css('paddingBottom'));
                    }
                    else
                    {
                        parentHeight = gridparent.height();
                    }
                    h = parentHeight * parseFloat(p.height) * 0.01;
                    if (p.InWindow || gridparent[0].tagName.toLowerCase() == "body")
                        h -= (g.grid.offset().top - parseInt($('body').css('paddingTop')));
                }
                else
                {
                    h = parseInt(p.height);
                }

                h += p.heightDiff;
                g.windowHeight = windowHeight;
                g._setHeight(h);
            }
            if (g.enabledFrozen())
            {
                var gridView1Width = g.gridview1.width();
                var gridViewWidth = g.gridview.width();

                g.gridview2.css({
                    width: gridViewWidth - gridView1Width
                });
            }
            $(g.columns).each(function (i, column)
            {
                if(column._percentWidth&&(!column.isrownumber&&!column.ischeckbox)){
//                    g.setColumnWidth(column, column._percentWidth * g.gridview2.width());
                }
            });

            g.trigger('SysGridHeightChanged');
        }
    });
    $.jui.controls.Grid.columns = {
        display:"",
        name:"",
        width:"",
        frozen:"",
        align:"",
        showAsXml:"",
        render:function(){},
        type:"",
        id:"",
        hide:false,
        allowBlank:true,
        editor:{},
        dateFormat:"",
        decimalFormat:"",
        format:function(){}
    };

    $.jui.controls.Grid.editor = {
        data:[],
        valueColumnName:"",
        displayColumnName: "",
        onBeforeOpen:null,
        valueField:"",
        textField: "",
        textWidth: "",
        selectBoxHeight: "",
        selectBoxWidth: "",
        onBeforeEditor:null,
        onAfterEditor:null,
        forceLoad:false,
        onchange:null,
        url:"",
        refType:"",
        onEndEdit:null,
        refId:"",
        type:"",
        width:"",
        height:""
    };

    $.jui.controls.Grid.createParams = function(p,element){
        $.jui.copyProperty(p,p,element);
        //添加columns
        var colmunKey = $.jui.controls.Grid.columns;
        var editorKey = $.jui.controls.Grid.editor;
        var columnWrap =  $(">div[elementType=columns]",element);
        var columns =  $(">div",columnWrap);
        if(columns.length>0){
            p.columns = [];
            columns.each(function(index){
                var column = {};
                var columnElement =  $(columns[index]);

                $.jui.copyProperty(column,colmunKey,columnElement);

                p.columns.push(column);
                //编辑器
                var editorElement =  $(">input",columnElement);
                if(editorElement[0]){
                    var editor = {};
                    $.jui.copyProperty(editor,editorKey,editorElement);
                    editor.type = editorElement.attr("class").replace("jui-","");
                    column.editor = editor;
                }

                if(columnElement.children().length>0){
                    column.columns = [];
                    $.jui.controls.Grid.createParams(column,columnElement);
                }
            });
        }
    };

    $.jui.controls.Grid.prototype.enabledTotal = $.jui.controls.Grid.prototype.isTotalSummary;
    $.jui.controls.Grid.prototype.add = $.jui.controls.Grid.prototype.addRow;
    $.jui.controls.Grid.prototype.update = $.jui.controls.Grid.prototype.updateRow;
    $.jui.controls.Grid.prototype.append = $.jui.controls.Grid.prototype.appendRow;
    $.jui.controls.Grid.prototype.getSelected = $.jui.controls.Grid.prototype.getSelectedRow;
    $.jui.controls.Grid.prototype.getSelecteds = $.jui.controls.Grid.prototype.getSelectedRows;
    $.jui.controls.Grid.prototype.getCheckedRows = $.jui.controls.Grid.prototype.getSelectedRows;
    $.jui.controls.Grid.prototype.getCheckedRowObjs = $.jui.controls.Grid.prototype.getSelectedRowObjs;
    $.jui.controls.Grid.prototype.setOptions = $.jui.controls.Grid.prototype.set;

})(jQuery);