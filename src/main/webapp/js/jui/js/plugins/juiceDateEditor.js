/**
* jQuery jui 1.0
* 
* http://www.baosight.com
*
* 
*/
(function ($)
{
    $.fn.juiceDateEditor = function ()
    {
        return $.jui.run.call(this, "juiceDateEditor", arguments);
    };

    $.fn.juiceGetDateEditorManager = function ()
    {
        return $.jui.run.call(this, "juiceGetDateEditorManager", arguments);
    };

    $.juiceDefaults.DateEditor = {
        format: "yyyy-MM-dd hh:mm",
        showTime: false,
        onChangeDate: false,
        /**
         * absolute选择框是否在附加到body,并绝对定位
         */
        absolute: true
    };
    $.juiceDefaults.DateEditorString = {
        dayMessage: ["日", "一", "二", "三", "四", "五", "六"],
        monthMessage: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        todayMessage: "今天",
        clearMessage: "清空",
        closeMessage: "关闭"
    };
    $.juiceMethos.DateEditor = {};

    $.jui.controls.DateEditor = function (element, options)
    {
        $.jui.controls.DateEditor.base.constructor.call(this, element, options);
    };
    $.jui.controls.DateEditor.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'DateEditor';
        },
        __idPrev: function ()
        {
            return 'DateEditor';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.DateEditor;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            if (!p.showTime && p.format.indexOf(" hh:mm") > -1)
                p.format = p.format.replace(" hh:mm", "");
            if (!p.showTime && p.format.indexOf(" HH:mm") > -1)
                p.format = p.format.replace(" HH:mm", "");
            if (this.element.tagName.toLowerCase() != "input" || this.element.type != "text")
                return;
            g.inputText = $(this.element);


            var clearButtonId = g.inputText[0].id + "_clearButton";
            var todayButtonId = g.inputText[0].id + "_todayButton";
            var clearButton = $("<input id='" + clearButtonId + "' type='button' class='l-button-minier' value='" + $.juiceDefaults.DateEditorString.clearMessage + "'>");
            var todayButton = $("<input id='" + todayButtonId+ "' type='button' class='l-button-minier' value='" + $.juiceDefaults.DateEditorString.todayMessage + "'>");


            $(document).on('click', "#" + clearButtonId, function(e) {
                g.inputText.val("");
                g.inputText.data('DateTimePicker').hide();
            });

            $(document).on('click', "#" + todayButtonId, function(e) {

                var d = new Date();
                d.setHours(0,0,0,0);

                g.inputText.val(g.getFormatDate(d));
                g.inputText.data('DateTimePicker').hide();
            });

            var buttonsGroup = $("<li style='text-align: center;'>").append(clearButton).append(todayButton);

            var c_options = {
                collapse:true,
                locale:"zh-cn",
                "extends":buttonsGroup
            };

            if(p.format){
                c_options.format = p.format.toUpperCase().replace(":MM", ":mm");
            }
                

            g.inputText.datetimepicker(c_options);
            

            if (!g.inputText.hasClass("l-text-field"))
                g.inputText.addClass("l-text-field");
            g.link = $('<div class="l-trigger"><div class="l-trigger-icon"></div></div>');
            g.text = g.inputText.wrap('<div class="l-text l-text-date"></div>').parent();
            g.text.append('<div class="l-text-l"></div><div class="l-text-r"></div>');
            g.text.append(g.link);
            //添加个包裹，
            g.textwrapper = g.text.wrap('<div class="l-text-wrapper"></div>').parent();
         
            var nowDate = new Date();
            g.now = {
                year: nowDate.getFullYear(),
                month: nowDate.getMonth() + 1, //注意这里
                day: nowDate.getDay(),
                date: nowDate.getDate(),
                hour: nowDate.getHours(),
                minute: nowDate.getMinutes()
            };
            //当前的时间
            g.currentDate = {
                year: nowDate.getFullYear(),
                month: nowDate.getMonth() + 1,
                day: nowDate.getDay(),
                date: nowDate.getDate(),
                hour: nowDate.getHours(),
                minute: nowDate.getMinutes()
            };

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
                g.inputText.focus();
                // todo
            });
            //不可用属性时处理
            if (p.disabled)
            {
                g.inputText.attr("readonly", "readonly");
                g.text.addClass('l-text-disabled');
            }
            //初始值
            if (p.initValue)
            {
                g.inputText.val(p.initValue);
            }
         
            g.inputText.change(function ()
            {
                g.onTextChange();
            }).blur(function ()
            {
                g.text.removeClass("l-text-focus");
            }).focus(function ()
            {
                g.text.addClass("l-text-focus");
            });
            g.text.hover(function ()
            {
                g.text.addClass("l-text-over");
            }, function ()
            {
                g.text.removeClass("l-text-over");
            });
            //LEABEL 支持
            if (p.label)
            {
                g.labelwrapper = g.textwrapper.wrap('<div class="l-labeltext"></div>').parent();
                g.labelwrapper.prepend('<div class="l-text-label" style="float:left;"><p style="display: table-cell;vertical-align: middle;line-height: normal;">' + p.label + ':&nbsp;</p></div>');
                g.textwrapper.css('float', 'left');
                if (!p.labelWidth)
                {
                    p.labelWidth = $('.l-text-label', g.labelwrapper).outerWidth();
                } else
                {
                    $('.l-text-label', g.labelwrapper).outerWidth(p.labelWidth);
                }
                $('.l-text-label', g.labelwrapper).width(p.labelWidth);
                $('.l-text-label', g.labelwrapper).height(g.text.height());
                g.labelwrapper.append('<br style="clear:both;" />');
                if (p.labelAlign)
                {
                    $('.l-text-label', g.labelwrapper).css('text-align', p.labelAlign);
                }
                g.textwrapper.css({ display: 'inline' });
                g.labelwrapper.width(g.text.outerWidth() + p.labelWidth + 2);
            }

            g.set(p);
        },
        destroy: function ()
        {
            if (this.textwrapper) this.textwrapper.remove();
            if (this.dateeditor) this.dateeditor.remove();
            this.options = null;
            $.jui.remove(this);
        },
        getFormatDate: function (date)
        {
            var g = this, p = this.options;
            if (date == "NaN") return null;
            var format = p.format;
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            }
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
        },
        _setHeight: function (value)
        {
            var g = this;
            if (value > 4)
            {
                g.text.css({ height: value });
                g.inputText.css({ height: value });
                g.textwrapper.css({ height: value });
            }
        },
        _setWidth: function (value)
        {
            var g = this;
            if (value > 30)
            {
                g.text.css({ width: value });
                g.inputText.css({ width: value });
                g.textwrapper.css({ width: value });
            }
        },
        _setValue: function (value)
        {
            var g = this;
            if (!value) g.inputText.val('');
            if (typeof value == "string")
            {
                g.inputText.val(value);
            }
            else if (typeof value == "object")
            {
                if (value instanceof Date)
                {
                    g.inputText.val(g.getFormatDate(value));
                    // g.onTextChange();
                }
            }
        },
        _getValue: function ()
        {
            var g = this;
            if(g.inputText.data('DateTimePicker').date())
                return g.inputText.data('DateTimePicker').date()._d;
            else 
                return null;
        },
        setEnabled: function ()
        {
            var g = this, p = this.options;
            this.inputText.removeAttr("readonly");
            this.text.removeClass('l-text-disabled');
            p.disabled = false;
        },
        setDisabled: function ()
        {
            var g = this, p = this.options;
            this.inputText.attr("readonly", "readonly");
            this.text.addClass('l-text-disabled');
            p.disabled = true;
        }
    });


})(jQuery);