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
     * @name   juiceButton
     * @class   juiceButton是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceButton &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceButton = function (options)
    {
        return $.jui.run.call(this, "juiceButton", arguments);
    };
    $.fn.juiceGetButtonManager = function ()
    {
        return $.jui.run.call(this, "juiceGetButtonManager", arguments);
    };

    $.juiceDefaults.Button = /**@lends juiceButton#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; button宽度。
         * @default 100
         * @type Number
         */
        width: 100,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; button按钮文本显示内容。
         * @default  Button
         * @type  String
         */
        text: 'Button',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表示已经禁用的输入域(框) 。
         * @default  false
         * @type  Boolean
         */
        disabled: false };

    $.juiceMethos.Button = {};

    $.jui.controls.Button = function (element, options)
    {
        $.jui.controls.Button.base.constructor.call(this, element, options);
    };
    $.jui.controls.Button.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'Button';
        },
        __idPrev: function ()
        {
            return 'Button';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Button;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.button = $(g.element);
            g.button.addClass("l-button");
//            g.button.addClass("l-btn");
            g.button.append('<span></span>');
            p.click && g.button.click(function ()
            {
                if (!p.disabled)
                    p.click();
            });
            g.set(p);
        },
        _setEnabled: function (value)
        {
            if (value)
//                this.button.removeClass("l-btn-disabled");
                this.button.removeClass("l-button-disabled");
        },
        _setDisabled: function (value)
        {
            if (value)
            {
//                this.button.addClass("l-btn-disabled");
                this.button.addClass("l-button-disabled");
                this.options.disabled = true;
            }
        },
        _setWidth: function (value)
        {
            this.button.width(value);
        },
        _setText: function (value)
        {
            $("span", this.button).html(value);
        },
        setValue: function (value)
        {
            this.set('text', value);
        },
        getValue: function ()
        {
            return this.options.text;
        },
        setEnabled: function ()
        {
            this.set('disabled', false);
        },
        setDisabled: function ()
        {
            this.set('disabled', true);
        }
    });




})(jQuery);