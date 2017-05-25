/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 */
(function ($)
{
    /**
     * @name   juiceNumberBox
     * @class   juiceNumberBox 是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceNumberBox &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceNumberBox = function ()
    {
        return $.jui.run.call(this, "juiceNumberBox", arguments);
    };

    $.fn.juiceGetNumberBoxManager = function ()
    {
        return $.jui.run.call(this, "juiceGetNumberBoxManager", arguments);
    };

    $.juiceDefaults.NumberBox =/**@lends juiceNumberBox#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变属性值。
         * @default null
         * @type event
         */
        onChangeValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度设置。
         * @default null
         * @type Object
         */
        width: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; disabled 属性可设置或返回是否默认地禁用某个 <option> 元素。
         * @default false
         * @type Boolean
         */
        disabled: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 初始化值。
         * @default null
         * @type Object
         */
        initValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 不能为空时的提示。
         * @default null
         * @type Object
         */
        nullText: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否限定为数字输入框。
         * @default false
         * @type Boolean
         */
        digits: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否限定为浮点数格式输入框。
         * @default false
         * @type Boolean
         */
        number: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 按","进行分组。
         * @default ,
         * @type String
         */
        groupSeparator: ",",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 按","进行分隔十进位。
         * @default ,
         * @type String
         */
        decimalSeparator: ".",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 进度设置。
         * @default 0
         * @type Number
         */
        precision:0,
        prefix: null,
        suffix: null
    };


    $.jui.controls.NumberBox = function (element, options)
    {
        $.jui.controls.NumberBox.base.constructor.call(this, element, options);
    };

    $.jui.controls.NumberBox.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'NumberBox'
        },
        __idPrev: function ()
        {
            return 'NumberBox';
        },
        _init: function ()
        {
            $.jui.controls.NumberBox.base._init.call(this);
            var g = this, p = this.options;
            g._copyProperty(p,$(g.element));
            if (!p.width)
            {
                p.width = $(g.element).width();
            }
            if ($(this.element).attr("readonly"))
            {
                p.disabled = true;
            }
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.inputText = $(this.element);
            //外层
            g.wrapper = g.inputText.wrap('<div class="l-text"></div>').parent();
            g.wrapper.append('<div class="l-text-l"></div><div class="l-text-r"></div>');
            g.renderText = $('<input type="text"/>');
            g.wrapper.prepend(g.renderText);

            if (!g.renderText.hasClass("l-text-field")){
                g.renderText.addClass("l-text-field");}
            g.inputText.hide();
            this._setEvent();
            g.set(p);
            g.initValue();
            g.checkValue();
        },
        _getValue: function ()
        {
            return this.inputText.val();
        },
        _setNullText: function ()
        {
            this.checkNotNull();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  获取value值。
         * @name  juiceNumberBox#getValue
         * @function
         * @return   this._getValue();
         * @example <b>示&nbsp;例</b><br>
         *         getValue:function(){
         *                return this._getValue();
         *           }
         */
        getValue:function(){
            return this._getValue();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  校对value值。
         * @name  juiceNumberBox#checkValue
         * @function
         * @example <b>示&nbsp;例</b><br>
         *         checkValue: function (){
         *            var g = this, p = this.options;
         *            var v = g.inputText.val();
         *             if (p.number && !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(v) || p.digits && !/^\d+$/.test(v)){
         *                   g.inputText.val(g.value || 0);
         *                     return;
         *                     }
         *             g.value = v;
         *            }
         */
        checkValue: function ()
        {
            var g = this, p = this.options;
            var v = g.inputText.val();
            if (p.number && !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(v) || p.digits && !/^\d+$/.test(v))
            {
                g.inputText.val(g.value || 0);
                return;
            }
            g.value = v;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  初始化value值。
         * @name  juiceNumberBox#initValue
         * @param [value] value值
         * @function
         * @example <b>示&nbsp;例</b><br>
         *         initValue:function(value){
         *               var g = this, p = this.options;
         *               g._setValue(p.initValue);
         *               g.renderText.val(g.getRenderValue());
         *           }
         */
        initValue:function(value){
            var g = this, p = this.options;
            g._setValue(p.initValue);
            g.renderText.val(g.getRenderValue());
        },
        getRenderValue:function(){
            var g = this, p = this.options;
            var value = g._getValue();
            var formatString = "000";
            if(p.groupSeparator){
                formatString = "0"+p.groupSeparator +formatString;
            }
            if(p.precision>0){
                if(p.decimalSeparator){
                    formatString +=p.decimalSeparator;
                }
                for(var i=0;i<p.precision;i++){
                    formatString +="0";
                }
            }

            var formatValue = $.jui.uitl.numberFormat(value,formatString,{comma:p.groupSeparator});
            if(p.prefix){
                formatValue = p.prefix + formatValue;
            }
            if(p.suffix){
                formatValue += p.suffix;
            }
            return formatValue;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  检查不为空。
         * @name  juiceNumberBox#checkNotNull
         * @function
         */
        checkNotNull: function ()
        {
            var g = this, p = this.options;
            if (p.nullText && !p.disabled)
            {
                if (!g.inputText.val())
                {
                    g.inputText.addClass("l-text-field-null").val(p.nullText);
                }
            }
        },
        _setEvent: function ()
        {
            var g = this, p = this.options;
            g.renderText.bind('blur.NumberBox', function ()
            {
                g.trigger('blur');
                g.checkNotNull();
                g.checkValue();
                g._setValue(g.renderText.val());
                g.renderText.val(g.getRenderValue());
                g.wrapper.removeClass("l-text-focus");
            }).bind('focus.NumberBox', function ()
                {
                    if (p.nullText)
                    {
                        if ($(this).hasClass("l-text-field-null"))
                        {
                            $(this).removeClass("l-text-field-null").val("");
                        }
                    }
                    g.trigger('focus');
                    g.renderText.val(g._getValue());
                    var esrc = g.renderText[0];
                    if(esrc==null){
                        esrc=event.srcElement||event.target;
                    }
                    var rtextRange;
                    if(esrc.createTextRange){
                        rtextRange = esrc.createTextRange();
                        rtextRange.moveStart('character',esrc.value.length);
                        rtextRange.collapse(true);
                        rtextRange.select();
                    }else{
                        rtextRange = esrc.setSelectionRange(0,esrc.value.length);
                    }

                    g.wrapper.addClass("l-text-focus");
                })
                .change(function ()
                {
                    g.trigger('changeValue', [this.value]);
                }).bind("keydown",function(e){
                    var code = e.keyCode;
                    if (((code>=48 && code<=57) || (code>=96 && code<=105)||code == 8||code==190||code==46) && e.shiftKey != true){
                        if(e.target.value!=""&&e.target.value.indexOf(".")>0&&code==190){
                            return false;
                        }
                         return true;
                    }else{
                        return false;
                    }
                });
            g.wrapper.hover(function ()
            {
                g.trigger('mouseOver');
                g.wrapper.addClass("l-text-over");
            }, function ()
            {
                g.trigger('mouseOut');
                g.wrapper.removeClass("l-text-over");
            });
        },
        _setDisabled: function (value)
        {
            if (value)
            {
                this.inputText.attr("readonly", "readonly");
                this.wrapper.addClass("l-text-disabled");
            }
            else
            {
                this.inputText.removeAttr("readonly");
                this.wrapper.removeClass('l-text-disabled');
            }
        },
        _setWidth: function (value)
        {
            if (value > 20)
            {
                this.wrapper.css({ width: value });
                this.inputText.css({ width: value - 4 });
            }
        },
        _setHeight: function (value)
        {
            if (value > 10)
            {
                this.wrapper.height(value);
                this.inputText.height(value - 2);
            }
        },
        _setValue: function (value)
        {
            if (value != null)
                this.inputText.val(value);
        },
        _setLabel: function (value)
        {
            var g = this, p = this.options;
            if (!g.labelwrapper)
            {
                g.labelwrapper = g.wrapper.wrap('<div class="l-labeltext"></div>').parent();
                var lable = $('<div class="l-text-label" style="float:left;">' + value + ':&nbsp</div>');
                g.labelwrapper.prepend(lable);
                g.wrapper.css('float', 'left');
                if (!p.labelWidth)
                {
                    p.labelWidth = lable.width();
                }
                else
                {
                    g._setLabelWidth(p.labelWidth);
                }
                lable.height(g.wrapper.height());
                if (p.labelAlign)
                {
                    g._setLabelAlign(p.labelAlign);
                }
                g.labelwrapper.append('<br style="clear:both;" />');
                g.labelwrapper.width(p.labelWidth + p.width + 2);
            }
            else
            {
                g.labelwrapper.find(".l-text-label").html(value + ':&nbsp');
            }
        },
        _setLabelWidth: function (value)
        {
            var g = this, p = this.options;
            if (!g.labelwrapper) return;
            g.labelwrapper.find(".l-text-label").width(value);
        },
        _setLabelAlign: function (value)
        {
            var g = this, p = this.options;
            if (!g.labelwrapper) return;
            g.labelwrapper.find(".l-text-label").css('text-align', value);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  更新css样式。
         * @name  juiceNumberBox#updateStyle
         * @function
         */
        updateStyle: function ()
        {
            var g = this, p = this.options;
            if (g.inputText.attr('disabled') || g.inputText.attr('readonly'))
            {
                g.wrapper.addClass("l-text-disabled");
                g.options.disabled = true;
            }
            else
            {
                g.wrapper.removeClass("l-text-disabled");
                g.options.disabled = false;
            }
            if (g.inputText.hasClass("l-text-field-null") && g.inputText.val() != p.nullText)
            {
                g.inputText.removeClass("l-text-field-null");
            }
            g.checkValue();
        }
    });
})(jQuery);