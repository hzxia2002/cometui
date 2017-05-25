/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/

(function ($)
{
    /**
     * @name   juiceRadio
     * @class   juiceRadio 是属性加载结构类。
     * @constructor
     * @description 构造函数。
     * @namespace  <h3><font color="blue">juiceRadio &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceRadio = function ()
    {
        return $.jui.run.call(this, "juiceRadio", arguments);
    };

    $.fn.juiceGetRadioManager = function ()
    {
        return $.jui.run.call(this, "juiceGetRadioManager", arguments);
    };

    $.juiceDefaults.Radio = { disabled: false };

    $.juiceMethos.Radio = {};

    $.jui.controls.Radio = function (element, options)
    {
        $.jui.controls.Radio.base.constructor.call(this, element, options);
    };
    $.jui.controls.Radio.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'Radio';
        },
        __idPrev: function ()
        {
            return 'Radio';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Radio;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.input = $(this.element);
            g.link = $('<a href="javascript:void(0)" class="l-radio"></a>');
            g.wrapper = g.input.addClass('l-hidden').wrap('<div class="l-radio-wrapper"></div>').parent();
            g.wrapper.prepend(g.link);
            g.input.change(function ()
            {
                if (this.checked)
                {
                    g.link.addClass('l-radio-checked');
                }
                else
                {
                    g.link.removeClass('l-radio-checked');
                }
                return true;
            });
            g.link.click(function ()
            {
                g._doclick();
            });
            g.wrapper.hover(function ()
            {
                if (!p.disabled)
                    $(this).addClass("l-over");
            }, function ()
            {
                $(this).removeClass("l-over");
            });
            this.element.checked && g.link.addClass('l-radio-checked');

            if (this.element.id)
            {
                $("label[for=" + this.element.id + "]").click(function ()
                {
                    g._doclick();
                });
            }
            g.set(p);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  设置value值。
         * @name  juiceRadio#setValue
         * @param [value]  value值
         * @function
         */
        setValue: function (value)
        {
            var g = this, p = this.options;
            if (!value)
            {
                g.input[0].checked = false;
                g.link.removeClass('l-radio-checked');
            }
            else
            {
                g.input[0].checked = true;
                g.link.addClass('l-radio-checked');
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  获取value值。
         * @name  juiceRadio#getValue
         * @function
         * @return  this.input[0].checked，返回input元素的第一个对象的checked属性;
         * @example <b>示&nbsp;例</b><br>
         *         getValue:function(){
         *               return this.input[0].checked;
         *           }
         */
        getValue: function ()
        {
            return this.input[0].checked;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  设置元素属性为可见。
         * @name  juiceRadio#setEnabled
         * @function
         */
        setEnabled: function ()
        {
            this.input.attr('disabled', false);
            this.wrapper.removeClass("l-disabled");
            this.options.disabled = false;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  设置元素属性为不可见。
         * @name  juiceRadio#setDisabled
         * @function
         */
        setDisabled: function ()
        {
            this.input.attr('disabled', true);
            this.wrapper.addClass("l-disabled");
            this.options.disabled = true;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  更新css样式。
         * @name  juiceRadio#updateStyle
         * @function
         */
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
        },
        _doclick: function ()
        {
            var g = this, p = this.options;
            if (g.input.attr('disabled')) { return false; }
            g.input.trigger('click').trigger('change');
            var formEle;
            if (g.input[0].form) formEle = g.input[0].form;
            else formEle = document;
            $("input:radio[name=" + g.input[0].name + "]", formEle).not(g.input).trigger("change");
            return false;
        }
    });


})(jQuery);