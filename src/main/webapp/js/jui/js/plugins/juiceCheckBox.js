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
     * @name   juiceCheckBox
     * @class   juiceCheckBox是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceCheckBox &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceCheckBox = function (options)
    {
        return $.jui.run.call(this, "juiceCheckBox", arguments);
    };
    $.fn.juiceGetCheckBoxManager = function ()
    {
        return $.jui.run.call(this, "juiceGetCheckBoxManager", arguments);
    };
    $.juiceDefaults.CheckBox =  /**@lends juiceCheckBox#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表示已经禁用的输入域(框)。
         * @default  false
         * @type  Boolean
         */
        disabled: false
    };

    $.juiceMethos.CheckBox = {};

    $.jui.controls.CheckBox = function (element, options)
    {
        $.jui.controls.CheckBox.base.constructor.call(this, element, options);
    };
    $.jui.controls.CheckBox.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'CheckBox';
        },
        __idPrev: function ()
        {
            return 'CheckBox';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.CheckBox;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.input = $(g.element);
            g.link = $('<a class="l-checkbox"></a>');
            g.wrapper = g.input.addClass('l-hidden').wrap('<div class="l-checkbox-wrapper"></div>').parent();
            g.wrapper.prepend(g.link);
            g.link.click(function ()
            {
                if (g.input.attr('disabled')) { return false; }
                if (p.disabled) return false;
                if (g.trigger('beforeClick', [g.element]) == false) return false; 
                if ($(this).hasClass("l-checkbox-checked"))
                {
                    g._setValue(false);
                }
                else
                {
                    g._setValue(true);
                }
                g.input.trigger("change");
            });
            g.wrapper.hover(function ()
            {
                if (!p.disabled)
                    $(this).addClass("l-over");
            }, function ()
            {
                $(this).removeClass("l-over");
            });
            this.set(p);
            this.updateStyle();
        },
        _setCss: function (value)
        {
            this.wrapper.css(value);
        },
        _setValue: function (value)
        {
            var g = this, p = this.options;
            if (!value)
            {
                g.input[0].checked = false;
                g.link.removeClass('l-checkbox-checked');
            }
            else
            {
                g.input[0].checked = true;
                g.link.addClass('l-checkbox-checked');
            }
        },
        _setDisabled: function (value)
        {
            if (value)
            {
                this.input.attr('disabled', true);
                this.wrapper.addClass("l-disabled");
            }
            else
            {
                this.input.attr('disabled', false);
                this.wrapper.removeClass("l-disabled");
            }
        },
        _getValue: function ()
        {
            return this.element.checked;
        },
        updateStyle: function ()
        {
            if (this.input.attr('disabled'))
            {
                this.wrapper.addClass("l-disabled");
                this.options.disabled = true;
            }
            if (this.input[0].checked)
            {
                this.link.addClass('l-checkbox-checked');
            }
            else
            {
                this.link.removeClass('l-checkbox-checked');
            }
        }
    });
})(jQuery);