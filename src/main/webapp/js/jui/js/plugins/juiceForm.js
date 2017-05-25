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
     * @name   juiceForm
     * @class   juiceForm是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceFilter &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceForm = function ()
    {
        return $.jui.run.call(this, "juiceForm", arguments);
    };

    $.juiceDefaults = $.juiceDefaults || {};
    $.juiceDefaults.Form =/**@lends juiceForm#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 控件宽度。
         * @default 180
         * @type Number
         */
        inputWidth: 180,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 标签宽度。
         * @default 90
         * @type Number
         */
        labelWidth: 90,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 间隔宽度。
         * @default 40
         * @type Number
         */
        space: 40,
        rightToken: '：',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源url。
         * @default ""
         * @type String
         */
        url:"",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 标签对齐方式。
         * @default  left
         * @type String
         */
        labelAlign: 'left',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 控件对齐方式。
         * @default  left
         * @type String
         */
        align: 'left',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 字段。
         * @default  []
         * @type Object
         */
        fields: [],
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 创建的表单元素是否附加ID,为true则附加，为false则不添加。
         * @default  true
         * @type Boolean
         */
        appendID: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 生成表单元素ID的前缀。
         * @default  ""
         * @type String
         */
        prefixID: "",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据加载之前调用的方法。
         * @default  null
         * @type function
         */
        beforeLoad:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据加载之后调用的方法。
         * @default  null
         * @type function
         */
        afterLoad:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据转换的方法。
         * @default  null
         * @type function
         */
        dataTransfer:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; json解析函数。
         * @default  $.jui.toJSON
         * @type function
         */
        toJSON: $.jui.toJSON
    };
    /**
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 默认表单编辑器构造器扩展(如果创建的表单效果不满意 建议重载)。
     * @name  juiceForm#editorBulider
     * @param [jinput] 表单元素jQuery对象 比如input、select、textarea
     * @param [params] 表单内元素
     * @function
     */
    $.juiceDefaults.Form.editorBulider = function (jinput,params)
    {
        //这里this就是form的jui对象
        var g = this, p = this.options;
        var inputOptions = {};
        inputOptions = $.extend({},params);
        if (p.inputWidth) inputOptions.width = p.inputWidth;

        var component;
        if (jinput.is("select"))
        {
            jinput.juiceComboBox();
        }
        else if (jinput.is(":text") || jinput.is(":password"))
        {
            var className = jinput.attr("class");
            var ltype = jinput.attr("ltype");
            if(className&&className.indexOf("jui")>=0){
                ltype = className.replace("jui-","");
            }
            switch (ltype)
            {
                case "select":
                case "combobox":
                    component = jinput.juiceComboBox(inputOptions);
                    break;
                case "spinner":
                    component = jinput.juiceSpinner(inputOptions);
                    break;
                case "date":
                    component = jinput.juiceDateEditor(inputOptions);
                    break;
                case "float":
                case "number":
                    inputOptions.number = true;
                    component = jinput.juiceTextBox(inputOptions);
                    break;
                case "money":
                    component = jinput.juiceNumberBox(inputOptions);
                    break;
                case "int":
                case "digits":
                    inputOptions.digits = true;
                default:
                    component = jinput.juiceTextBox(inputOptions);
                    break;
            }
        }
        else if (jinput.is(":radio"))
        {
            component = jinput.juiceRadio(inputOptions);
        }
        else if (jinput.is(":checkbox"))
        {
            component =  jinput.juiceCheckBox(inputOptions);
        }
        else if (jinput.is("textarea"))
        {
            component = jinput.addClass("l-textarea");
        }
        return component;
    };

    //表单组件
    $.jui.controls.Form = function (element, options)
    {
        $.jui.controls.Form.base.constructor.call(this, element, options);
    };

    //接口方法扩展
    $.juiceMethos.Form = $.juiceMethos.Form || {};

    $.jui.controls.Form.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Form'
        },
        __idPrev: function ()
        {
            return 'Form';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Form;
        },
        _init: function ()
        {   var g = this, p = this.options;
            $.jui.controls.Form.base._init.call(this);
            g._copyProperty(p,$(this.element));
            this.editors = {};
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.form = $(this.element);
//            g.form.addClass("l-panle-bg");
            var header = "<div class='l-panel-header '><div class='up-toggle'/><span class='l-panel-header-text'></span></div>";
//            g.formWrap = $("<div class='l-form-wrap'></div>");
            g.header = $(header);
            g.headerTool = $(".up-toggle",g.header);
//            g.form.wrap(g.formWrap);
            //生成jui表单样式
            g.load();
            g.build();
            g.addValidate(true);
        },
        build:function(){
            var g = this;
            g._initHeader();
            g._setEvent();
        },
        _initHeader:function(){
            var g = this,p = this.options;
            if(p.title){
                g.header.insertBefore(g.form);
                $(".l-panel-header-text",g.header).html(p.title);
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 加载相应事件，生成jui表单样式。
         * @name  juiceForm#onLoad
         * @param [params] 表单内元素
         * @param [data] 表单内数据
         * @function
         */
        onLoad:function(params,data){
            var g = this, p = this.options;
            //生成jui表单样式
            $("input[type!='checkbox'][type!='radio'][type!='button'][type!='submit'],select,textarea", g.form).each(function ()
            {
                if(g.editors[$(this).attr("name")]){
                    g.editors[$(this).attr("name")].setValue(data[$(this).attr("valueFieldID")]||data[$(this).attr("name")]||$(this).val());
                }else{
                    if(g.dataTransform){
                        data = g.dataTransform(data);
                    }
                    var value = data[$(this).attr("name")]||data[$(this).attr("valueFieldID")]||$(this).val();
                    $(this).val(value);
                    g.editors[$(this).attr("name")] = p.editorBulider.call(g, $(this),{initValue:value});
                }
            });
            // 处理checkbox 赋值
            var checkData = {};
            $("input:checkbox",g.form).each(function(){
                var name =  $(this).attr("name");
                if((","+data[name]+",").indexOf(","+$(this).val()+",")>=0){
                    $(this).attr("checked",'checked');
                }else if($(this).is(":checked")){

                } else{
                    $(this).removeAttr("checked");
                }
                $(this).juiceCheckBox().setValue($(this).is(":checked"));
            });

            $("input:radio",g.form).each(function(){
                var name =  $(this).attr("name");
                var value = data[name];
                if(($(this).val() == value)){
                    $(this).attr("checked",'checked');
                }else{
                    $(this).removeAttr("checked");
                }
                $(this).juiceRadio().setValue($(this).val() == value);
            });
            //
        },
        load:function(data,params){
            var g = this, p = this.options;
            if(data){
                g.onLoad(params,data);
            }else if(p.url){
                $.jui.loadData(g,params);
            }else{
                g.onLoad(params,{});
            }
        },
        _setEvent:function(){
            var g = this;
            g.headerTool.hover(function(){
                if(g.headerTool.hasClass("down-toggle")){
                    g.headerTool.addClass("down-toggle-over");
                    g.headerTool.removeClass("down-toggle");
                }else{
                    g.headerTool.addClass("up-toggle-over");
                }
            },function(){
                if(g.headerTool.hasClass("down-toggle-over")){
                    g.headerTool.addClass("down-toggle");
                    g.headerTool.removeClass("down-toggle-over");
                }else{
                    g.headerTool.removeClass("up-toggle-over");
                }
            }).click(function(){
                    if(g.headerTool.hasClass("down-toggle-over")){
                        g.headerTool.addClass("up-toggle-over");
                        g.headerTool.removeClass("down-toggle-over");
                        g.form.show();
                    }else{
                        g.headerTool.addClass("down-toggle-over");
                        g.headerTool.removeClass("up-toggle-over");
                        g.form.hide();
                    }
                });
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加表单验证。
         * @name  juiceForm#addValidate
         * @param [isValidate]  是否进行判断验证参数
         * @function
         */
        addValidate:function(isValidate){
            var g = this;
            if(isValidate){
                g.validator = g.form.validate({
                    errorPlacement: function (lable, element){
                        if (element.hasClass("l-textarea")){
                            element.addClass("l-textarea-invalid");
                        }else if (element.hasClass("l-text-field")){
                            element.parent().addClass("l-text-invalid");
                        }
                        $(element).removeAttr("title").juiceHideTip();
                        $(element).attr("title", lable.html()).juiceTip();
                    },
                    success: function (lable)
                    {
                        var element = $("#" + lable.attr("for"));
                        if (element.hasClass("l-textarea")) {
                            element.removeClass("l-textarea-invalid");
                        }else if (element.hasClass("l-text-field")){
                            element.parent().removeClass("l-text-invalid");
                        }
                        $(element).removeAttr("title").juiceHideTip();
                    }
                });
            }
        },
        submit:function(params,isAjax){
            var g = this;
            params = params||{};
            var datas = g.form.serializeArray();
            var callback = null;
            if(params.callback){
                callback = params.callback;
                delete params.callback;
            }
            if(g.initParams){
                g.initParams(params,datas);
            }
            g.datas = datas;
            if(g.validator.form()){
                if(!isAjax){
                    this.form.submit();
                }else{
                    $.ajax({
                        type: 'post',
                        url:g.form.attr("action")||params.url,
                        dataType:"json",
                        data:params,
                        success:function(ret){
                            if(callback){
                                callback.call(g,ret);
                            }
                            g.trigger("afterSubmit",ret);
                        },fail:function(ret){
                            g.trigger("error",ret);
                        }
                    });
                }
            }
        }


    });
})(jQuery);