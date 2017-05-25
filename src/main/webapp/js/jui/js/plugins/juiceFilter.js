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
     * @name   juiceFilter
     * @class   juiceFilter是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceFilter &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceFilter = function ()
    {
        return $.jui.run.call(this, "juiceFilter", arguments);
    };

    $.fn.juiceGetFilterManager = function ()
    {
        return $.jui.run.call(this, "juiceGetFilterManager", arguments);
    };

    $.juiceDefaults.Filter = /**@lends juiceFilter#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 字段列表。
         * @default []
         * @type Object
         */
        fields: [],
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 字段类型 - 运算符 的对应关系。
         * @default {}
         * @type Object
         */
        operators: {},
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 自定义输入框(如下拉框、日期)。
         * @default {}
         * @type Object
         */
        editors: {}
    };
    $.juiceDefaults.FilterString = {
        strings: {
            "and": "并且",
            "or": "或者",
            "equal": "相等",
            "notequal": "不相等",
            "startwith": "以..开始",
            "endwith": "以..结束",
            "like": "相似",
            "greater": "大于",
            "greaterorequal": "大于或等于",
            "less": "小于",
            "lessorequal": "小于或等于",
            "in": "包括在...",
            "notin": "不包括...",
            "addgroup": "增加分组",
            "addrule": "增加条件",
            "deletegroup": "删除分组"
        }
    };

    $.juiceDefaults.Filter.operators['string'] =
    $.juiceDefaults.Filter.operators['text'] =
    ["equal", "notequal", "startwith", "endwith", "like", "greater", "greaterorequal", "less", "lessorequal", "in", "notin"];

    $.juiceDefaults.Filter.operators['number'] =
    $.juiceDefaults.Filter.operators['int'] =
    $.juiceDefaults.Filter.operators['float'] =
    $.juiceDefaults.Filter.operators['date'] =
    ["equal", "notequal", "greater", "greaterorequal", "less", "lessorequal", "in", "notin"];

    $.juiceDefaults.Filter.editors['string'] =
    {
        create: function (container, field)
        {
            var input = $("<input type='text'/>");
            container.append(input);
            input.juiceTextBox(field.editor.options || {});
            return input;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置input对象的值。
         * @name  juiceFilter#setValue
         * @param [input] input对象
         * @param [value]  input对象所对应的value值
         * @function
         * @example <b>示 例</b><br>
         *        setValue: function (input, value)
         *        {
         *               input.val(value);
         *        }
         */
        setValue: function (input, value)
        {
            input.val(value);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取input对象的值。
         * @name  juiceFilter#getValue
         * @param [input] input对象
         * @param [value]  input对象所对应的value值
         * @function
         * @return   input.juice(option, value)
         * @example <b>示 例</b><br>
         *           getValue: function (input)
         *           {
         *                 return input.juice('option', 'value');
         *           }
         */
        getValue: function (input)
        {
            return input.juice('option', 'value');
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 调用juice方法，删除元素。
         * @name  juiceFilter#destroy
         * @param [input] input对象
         * @function
         * @return   input.juice(option, value)
         * @example <b>示 例</b><br>
         *           destroy: function (input)
         *           {
         *                 input.juice('destroy');
         *           }
         */
        destroy: function (input)
        {
            input.juice('destroy');
        }
    };

    $.juiceDefaults.Filter.editors['date'] =
    {
        create: function (container, field)
        {
            var input = $("<input type='text'/>");
            container.append(input);
            input.juiceDateEditor(field.editor.options || {});
            return input;
        },
        setValue: function (input, value)
        {
            input.juice('option', 'value', value);
        },
        getValue: function (input, field)
        {
            return input.juice('option', 'value');
        },
        destroy: function (input)
        {
            input.juice('destroy');
        }
    };

    $.juiceDefaults.Filter.editors['number'] =
    {
        create: function (container, field)
        {
            var input = $("<input type='text'/>");
            container.append(input);
            var options = {
                minValue: field.editor.minValue,
                maxValue: field.editor.maxValue
            };
            input.juiceSpinner($.extend(options, field.editor.options || {}));
            return input;
        },
        setValue: function (input, value)
        {
            input.val(value);
        },
        getValue: function (input, field)
        {
            var isInt = field.editor.type == "int";
            if (isInt)
                return parseInt(input.val(), 10);
            else
                return parseFloat(input.val());
        },
        destroy: function (input)
        {
            input.juice('destroy');
        }
    };

    $.juiceDefaults.Filter.editors['combobox'] =
    {
        create: function (container, field)
        {
            var input = $("<input type='text'/>");
            container.append(input);
            var options = {
                data: field.data,
                slide: false,
                valueField: field.editor.valueField || field.editor.valueColumnName,
                textField: field.editor.textField || field.editor.displayColumnName
            };
            $.extend(options, field.editor.options || {});
            input.juiceComboBox(options);
            return input;
        },
        setValue: function (input, value)
        {
            input.juice('option', 'value', value);
        },
        getValue: function (input)
        {
            return input.juice('option', 'value');
        },
        destroy: function (input)
        {
            input.juice('destroy');
        }
    };

    //过滤器组件
    $.jui.controls.Filter = function (element, options)
    {
        $.jui.controls.Filter.base.constructor.call(this, element, options);
    };

    $.jui.controls.Filter.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Filter'
        },
        __idPrev: function ()
        {
            return 'Filter';
        },
        _init: function ()
        {
            $.jui.controls.Filter.base._init.call(this);
        },
        _render: function ()
        {
            var g = this, p = this.options;

            g.set(p);

            //事件：增加分组
            $("#" + g.id + " .addgroup").live('click', function ()
            {
                var jtable = $(this).parent().parent().parent().parent();
                g.addGroup(jtable);
            });
            //事件：删除分组
            $("#" + g.id + " .deletegroup").live('click', function ()
            {
                var jtable = $(this).parent().parent().parent().parent();
                g.deleteGroup(jtable);
            });
            //事件：增加条件
            $("#" + g.id + " .addrule").live('click', function ()
            {
                var jtable = $(this).parent().parent().parent().parent();
                g.addRule(jtable);
            });
            //事件：删除条件
            $("#" + g.id + " .deleterole").live('click', function ()
            {
                var rulerow = $(this).parent().parent();
                g.deleteRule(rulerow);
            });

        },

        //设置字段列表
        _setFields: function (fields)
        {
            var g = this, p = this.options;
            if (g.group) g.group.remove();
            g.group = $(g._bulidGroupTableHtml()).appendTo(g.element);
        },

        //输入框列表
        editors: {},

        //输入框计算器
        editorCounter: 0,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加分组。
         * @name  juiceFilter#addGroup
         * @param [jgroup] jQuery对象(主分组的table dom元素)
         * @function
         * @return   row.find(table,first)
         * @example <b>示 例</b><br>
         *           addGroup: function (jgroup)
         *           {
         *                 ...
         *              return row.find("table:first");
         *           }
         */
        addGroup: function (jgroup)
        {
            var g = this, p = this.options;
            jgroup = $(jgroup || g.group);
            var lastrow = $(">tbody:first > tr:last", jgroup);
            var groupHtmlArr = [];
            groupHtmlArr.push('<tr class="l-filter-rowgroup"><td class="l-filter-cellgroup" colSpan="4">');
            var altering = !jgroup.hasClass("l-filter-group-alt");
            groupHtmlArr.push(g._bulidGroupTableHtml(altering, true));
            groupHtmlArr.push('</td></tr>');
            var row = $(groupHtmlArr.join(''));
            lastrow.before(row);
            return row.find("table:first");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除分组。
         * @name  juiceFilter#deleteGroup
         * @param [group]  对象
         * @function
         * @example <b>示 例</b><br>
         *           deleteGroup: function (group)
         *           {
         *                 ...
         *               $(group).parent().parent().remove();
         *           }
         */
        deleteGroup: function (group)
        {
            var g = this, p = this.options;
            $("td.l-filter-value", group).each(function ()
            {
                var rulerow = $(this).parent();
                $("select.fieldsel", rulerow).unbind();
                g.removeEditor(rulerow);
            });
            $(group).parent().parent().remove();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除编辑器。
         * @name  juiceFilter#removeEditor
         * @param [rulerow]   对象
         * @function
         * @example <b>示 例</b><br>
         *          removeEditor: function (rulerow)
         *           {
         *               var type = $(rulerow).attr("editortype");
         *               ...
         *               $("td.l-filter-value:first", rulerow).html("");
         *           }
         */
        removeEditor: function (rulerow)
        {
            var g = this, p = this.options;
            var type = $(rulerow).attr("editortype");
            var id = $(rulerow).attr("editorid");
            var editor = g.editors[id];
            if (editor) p.editors[type].destroy(editor);
            $("td.l-filter-value:first", rulerow).html("");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置规则。
         * @name  juiceFilter#setData
         * @param [group] 分组数据
         * @param [jgruop] 分组table dom jQuery对象
         * @function
         * @example <b>示 例</b><br>
         *            setData: function (group, jgroup)
         *           {
         *               ...
         *           }
         */
        setData: function (group, jgroup)
        {
            var g = this, p = this.options;
            jgroup = jgroup || g.group;
            var lastrow = $(">tbody:first > tr:last", jgroup);
            jgroup.find(">tbody:first > tr").not(lastrow).remove();
            $("select:first", lastrow).val(group.op);
            if (group.rules)
            {
                $(group.rules).each(function ()
                {
                    var rulerow = g.addRule(jgroup);
                    rulerow.attr("fieldtype", this.type || "string");
                    $("select.opsel", rulerow).val(this.op);
                    $("select.fieldsel", rulerow).val(this.field).trigger('change');
                    var editorid = rulerow.attr("editorid");
                    if (editorid && g.editors[editorid])
                    {
                        var field = g.getField(this.field);
                        p.editors[field.editor.type].setValue(g.editors[editorid], this.value, field);
                    }
                    else
                    {
                        $(":text", rulerow).val(this.value);
                    }
                });
            }
            if (group.groups)
            {
                $(group.groups).each(function ()
                {
                    var subjgroup = g.addGroup(jgroup);
                    g.setData(this, subjgroup);
                });
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加一个条件。
         * @name  juiceFilter#addRule
         * @param [jgruop] 分组table dom jQuery对象
         * @function
         * @return  rulerow
         * @example <b>示 例</b><br>
         *        addRule: function (jgroup)
         *           {
         *               ...
         *           }
         */
        addRule: function (jgroup)
        {
            var g = this, p = this.options;
            jgroup = jgroup || g.group;
            var lastrow = $(">tbody:first > tr:last", jgroup);
            var rulerow = $(g._bulidRuleRowHtml());
            lastrow.before(rulerow);
            if (p.fields.length)
            {
                //如果第一个字段启用了自定义输入框
                g.appendEditor(rulerow, p.fields[0]);
            }

            //事件：字段列表改变时
            $("select.fieldsel", rulerow).bind('change', function ()
            {
                var jopsel = $(this).parent().next().find("select:first");
                var fieldName = $(this).val();
                var field = g.getField(fieldName);
                //字段类型处理
                var fieldType = field.type || "string";
                var oldFieldtype = rulerow.attr("fieldtype");
                if (fieldType != oldFieldtype)
                {
                    jopsel.html(g._bulidOpSelectOptionsHtml(fieldType));
                    rulerow.attr("fieldtype", fieldType);
                }
                //当前的编辑器
                var editorType = null;
                //上一次的编辑器
                var oldEditorType = rulerow.attr("editortype");
                if (g.enabledEditor(field)) editorType = field.editor.type;
                if (oldEditorType)
                {
                    //如果存在旧的输入框 
                    g.removeEditor(rulerow);
                }
                if (editorType)
                {
                    //如果当前选择的字段定义了输入框
                    g.appendEditor(rulerow, field);
                } else
                {
                    rulerow.removeAttr("editortype").removeAttr("editorid");
                    $("td.l-filter-value:first", rulerow).html('<input type="text" class="valtxt" />');
                }
            });
            return rulerow;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除一个条件。
         * @name  juiceFilter#deleteRule
         * @param [rulerow] 分组 对象
         * @function
         * @example <b>示 例</b><br>
         *         deleteRule: function (rulerow)
         *           {
         *             $("select.fieldsel", rulerow).unbind();
         *             this.removeEditor(rulerow);
         *              $(rulerow).remove();
         *           }
         */
        deleteRule: function (rulerow)
        {
            $("select.fieldsel", rulerow).unbind();
            this.removeEditor(rulerow);
            $(rulerow).remove();
        },

        //附加一个输入框
        appendEditor: function (rulerow, field)
        {
            var g = this, p = this.options;
            if (g.enabledEditor(field))
            {
                var cell = $("td.l-filter-value:first", rulerow).html("");
                var editor = p.editors[field.editor.type];
                g.editors[++g.editorCounter] = editor.create(cell, field);
                rulerow.attr("editortype", field.editor.type).attr("editorid", g.editorCounter);
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取分组数据。
         * @name  juiceFilter#getData
         * @param [group] 分组 对象
         * @function
         * @return groupData  返回分组对象数据
         * @example <b>示 例</b><br>
         *           getData: function (group)
         *           {
         *                ...
         *                return groupData;
         *           }
         */
        getData: function (group)
        {
            var g = this, p = this.options;
            group = group || g.group;

            var groupData = {};

            $("> tbody > tr", group).each(function (i, row)
            {
                var rowlast = $(row).hasClass("l-filter-rowlast");
                var rowgroup = $(row).hasClass("l-filter-rowgroup");
                if (rowgroup)
                {
                    var groupTable = $("> td:first > table:first", row);
                    if (groupTable.length)
                    {
                        if (!groupData.groups) groupData.groups = [];
                        groupData.groups.push(g.getData(groupTable));
                    }
                }
                else if (rowlast)
                {
                    groupData.op = $(".groupopsel:first", row).val();
                }
                else
                {
                    var fieldName = $("select.fieldsel:first", row).val();
                    var field = g.getField(fieldName);
                    var op = $(".opsel:first", row).val();
                    var value = g._getRuleValue(row, field);
                    var type = $(row).attr("fieldtype") || "string";
                    if (!groupData.rules) groupData.rules = [];
                    groupData.rules.push({
                        field: fieldName, op: op, value: value, type: type
                    });
                }
            });

            return groupData;
        },

        _getRuleValue: function (rulerow, field)
        {
            var g = this, p = this.options;
            var editorid = $(rulerow).attr("editorid");
            var editortype = $(rulerow).attr("editortype");
            var editor = g.editors[editorid];
            if (editor)
                return p.editors[editortype].getValue(editor, field);
            return $(".valtxt:first", rulerow).val();
        },

        //判断某字段是否启用自定义的输入框  
        enabledEditor: function (field)
        {
            var g = this, p = this.options;
            if (!field.editor || !field.editor.type) return false;
            return (field.editor.type in p.editors);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 根据fieldName 获取 字段。
         * @name  juiceFilter#getField
         * @param [fieldname]   字段名
         * @function
         * @return null
         * @example <b>示 例</b><br>
         *          getField: function (fieldname)
         *           {
         *                ...
         *                return null;
         *           }
         */
        //
        getField: function (fieldname)
        {
            var g = this, p = this.options;
            for (var i = 0, l = p.fields.length; i < l; i++)
            {
                var field = p.fields[i];
                if (field.name == fieldname) return field;
            }
            return null;
        },

        //获取一个分组的html
        _bulidGroupTableHtml: function (altering, allowDelete)
        {
            var g = this, p = this.options;
            var tableHtmlArr = [];
            tableHtmlArr.push('<table cellpadding="0" cellspacing="0" border="0" class="l-filter-group');
            if (altering)
                tableHtmlArr.push(' l-filter-group-alt');
            tableHtmlArr.push('"><tbody>');
            tableHtmlArr.push('<tr class="l-filter-rowlast"><td class="l-filter-rowlastcell" align="right" colSpan="4">');
            //and or
            tableHtmlArr.push('<select class="groupopsel">');
            tableHtmlArr.push('<option value="and">' + p.strings['and'] + '</option>');
            tableHtmlArr.push('<option value="or">' + p.strings['or'] + '</option>');
            tableHtmlArr.push('</select>');

            //add group
            tableHtmlArr.push('<input type="button" value="' + p.strings['addgroup'] + '" class="addgroup">');
            //add rule
            tableHtmlArr.push('<input type="button" value="' + p.strings['addrule'] + '" class="addrule">');
            if (allowDelete)
                tableHtmlArr.push('<input type="button" value="' + p.strings['deletegroup'] + '" class="deletegroup">');

            tableHtmlArr.push('</td></tr>');

            tableHtmlArr.push('</tbody></table>');
            return tableHtmlArr.join('');
        },

        //获取字段值规则的html
        _bulidRuleRowHtml: function (fields)
        {
            var g = this, p = this.options;
            fields = fields || p.fields;
            var rowHtmlArr = [];
            var fieldType = fields[0].type || "string";
            rowHtmlArr.push('<tr fieldtype="' + fieldType + '"><td class="l-filter-column">');
            rowHtmlArr.push('<select class="fieldsel">');
            for (var i = 0, l = fields.length; i < l; i++)
            {
                var field = fields[i];
                rowHtmlArr.push('<option value="' + field.name + '"');
                if (i == 0) rowHtmlArr.push(" selected ");
                rowHtmlArr.push('>');
                rowHtmlArr.push(field.display);
                rowHtmlArr.push('</option>');
            }
            rowHtmlArr.push("</select>");
            rowHtmlArr.push('</td>');

            rowHtmlArr.push('<td class="l-filter-op">');
            rowHtmlArr.push('<select class="opsel">');
            rowHtmlArr.push(g._bulidOpSelectOptionsHtml(fieldType));
            rowHtmlArr.push('</select>');
            rowHtmlArr.push('</td>');
            rowHtmlArr.push('<td class="l-filter-value">');
            rowHtmlArr.push('<input type="text" class="valtxt" />');
            rowHtmlArr.push('</td>');
            rowHtmlArr.push('<td>');
            rowHtmlArr.push('<div class="l-icon-cross deleterole"></div>');
            rowHtmlArr.push('</td>');
            rowHtmlArr.push('</tr>');
            return rowHtmlArr.join('');
        },

        //获取一个运算符选择框的html
        _bulidOpSelectOptionsHtml: function (fieldType)
        {
            var g = this, p = this.options;
            var ops = p.operators[fieldType];
            var opHtmlArr = [];
            for (var i = 0, l = ops.length; i < l; i++)
            {
                var op = ops[i];
                opHtmlArr[opHtmlArr.length] = '<option value="' + op + '">';
                opHtmlArr[opHtmlArr.length] = p.strings[op];
                opHtmlArr[opHtmlArr.length] = '</option>';
            }
            return opHtmlArr.join('');
        }


    });

})(jQuery);