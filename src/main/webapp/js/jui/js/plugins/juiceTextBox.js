/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{
    /**
     * @name   juiceTextBox
     * @class   juiceTextBox 是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceTextBox &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceTextBox = function ()
    {
        return $.jui.run.call(this, "juiceTextBox", arguments);
    };

    $.fn.juiceGetTextBoxManager = function ()
    {
        return $.jui.run.call(this, "juiceGetTextBoxManager", arguments);
    };

    $.juiceDefaults.TextBox = /**@lends juiceTextBox#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变value值事件。
         * @default null
         * @type event
         */
        onChangeValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度。
         * @default null
         * @type Object
         */
        width: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 元素被禁用 。
         * @default false
         * @type Boolean
         */
        disabled: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 初始化值 。
         * @default null
         * @type Object
         */
        value: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 不能为空时的提示 。
         * @default null
         * @type Object
         */
        nullText: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否限定为数字输入框 。
         * @default false
         * @type Boolean
         */
        digits: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否限定为浮点数格式输入框 。
         * @default false
         * @type Boolean
         */
        number: false
    };


    $.jui.controls.TextBox = function (element, options)
    {
        $.jui.controls.TextBox.base.constructor.call(this, element, options);
    };

    $.jui.controls.TextBox.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'TextBox'
        },
        __idPrev: function ()
        {
            return 'TextBox';
        },
        _init: function ()
        {
            $.jui.controls.TextBox.base._init.call(this);
            var g = this, p = this.options;
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
            if (!g.inputText.hasClass("l-text-field"))
                g.inputText.addClass("l-text-field");
            this._setEvent();
            g.set(p);
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
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校对value值；
         * @name   juiceTextBox#checkValue
         * @function
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
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;检查不为空；
         * @name  juiceTextBox#checkNotNull
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
            g.inputText.bind('blur.textBox', function ()
            {
                g.trigger('blur');
                g.checkNotNull();
                g.checkValue();
                g.wrapper.removeClass("l-text-focus");
            }).bind('focus.textBox', function ()
            {
                g.trigger('focus');
                if (p.nullText)
                {
                    if ($(this).hasClass("l-text-field-null"))
                    {
                        $(this).removeClass("l-text-field-null").val("");
                    }
                }
                g.wrapper.addClass("l-text-focus");
            })
            .change(function ()
            { 
                g.trigger('changeValue', [this.value]);
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
                this.inputText.css({ width: value});
            }
        },
        _setHeight: function (value)
        {
            if (value > 10)
            {
                this.wrapper.height(value);
                this.inputText.height(value);
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
                var lable = $('<div class="l-text-label" style="float:left;"><span style="display: table-cell;vertical-align: middle;line-height: normal;">' + value + ':&nbsp</span></div>');
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