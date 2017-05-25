/**
 * jQuery jui
 *
 * http://jui.com
 *
 *
 */
(function ($)
{
    //jui 继承方法
    Function.prototype.juiceExtend = function (parent, overrides)
    {
        if (typeof parent != 'function') return this;
        //保存对父类的引用
        this.base = parent.prototype;
        this.base.constructor = parent;
        //继承
        var f = function () { };
        f.prototype = parent.prototype;
        this.prototype = new f();
        this.prototype.constructor = this;
        //附加属性方法
        if (overrides) $.extend(this.prototype, overrides);
    };
    //延时加载
    Function.prototype.juiceDefer = function (o, defer, args)
    {
        var fn = this;
        return setTimeout(function () { fn.apply(o, args || []); }, defer);
    };

    // 核心对象
    window.juice = $.jui = {
        version: 'V1.0.0',
        managerCount: 0,
        //组件管理器池
        managers: {},
        managerIdPrev: 'jui',
        //错误提示
        error: {
            managerIsExist: '管理器id已经存在'
        },
        getId: function (prev)
        {
            prev = prev || this.managerIdPrev;
            var id = prev + (1000 + this.managerCount);
            this.managerCount++;
            return id;
        },
        add: function (manager)
        {
            if (arguments.length == 2)
            {
                var m = arguments[1];
                m.id = m.id || m.options.id || arguments[0].id;
                this.addManager(m);
                return;
            }
            if (!manager.id) manager.id = this.getId(manager.__idPrev());
            if (this.managers[manager.id])
                throw new Error(this.error.managerIsExist);
            this.managers[manager.id] = manager;
        },
        remove: function (arg)
        {
            if (typeof arg == "string" || typeof arg == "number")
            {
                delete $.jui.managers[arg];
            }
            else if (typeof arg == "object" && arg instanceof $.jui.core.Component)
            {
                delete $.jui.managers[arg.id];
            }
        },
        //获取jui对象
        //1,传入jui ID
        //2,传入Dom Object Array(jQuery)
        get: function (arg, idAttrName)
        {
            idAttrName = idAttrName || "juiid";
            if (typeof arg == "string" || typeof arg == "number")
            {
                return $.jui.managers[arg];
            }
            else if (typeof arg == "object" && arg.length)
            {
                if (!arg[0][idAttrName] && !$(arg[0]).attr(idAttrName)) return null;
                return $.jui.managers[arg[0][idAttrName] || $(arg[0]).attr(idAttrName)];
            }
            return null;
        },
        //根据类型查找某一个对象
        find: function (type)
        {
            var arr = [];
            for (var id in this.managers)
            {
                var manager = this.managers[id];
                if (type instanceof Function)
                {
                    if (manager instanceof type)
                    {
                        arr.push(manager);
                    }
                }
                else if (type instanceof Array)
                {
                    if ($.inArray(manager.__getType(), type) != -1)
                    {
                        arr.push(manager);
                    }
                }
                else
                {
                    if (manager.__getType() == type)
                    {
                        arr.push(manager);
                    }
                }
            }
            return arr;
        },
        //$.fn.juice{Plugin} 和 $.fn.juiceGet{Plugin}Manager
        //会调用这个方法,并传入作用域(this)
        //@parm [plugin]  插件名
        //@parm [args] 参数(数组)
        //@parm [ext] 扩展参数,定义命名空间或者id属性名
        run: function (plugin, args, ext)
        {
            if (!plugin) return;
            ext = $.extend({
                defaultsNamespace: 'juiceDefaults',
                methodsNamespace: 'juiceMethods',
                controlNamespace: 'controls',
                idAttrName: 'juiid',
                isStatic: false,
                hasElement: true,           //是否拥有element主体(比如drag、resizable等辅助性插件就不拥有)
                propertyToElemnt: null      //链接到element的属性名
            }, ext || {});
            plugin = plugin.replace(/^juiceGet/, '');
            plugin = plugin.replace(/^juice/, '');
            if (this == null || this == window || ext.isStatic)
            {
                if (!$.jui.plugins[plugin])
                {
                    $.jui.plugins[plugin] = {
                        fn: $['juice' + plugin],
                        isStatic: true
                    };
                }
                return new $.jui[ext.controlNamespace][plugin]($.extend({}, $[ext.defaultsNamespace][plugin] || {}, $[ext.defaultsNamespace][plugin + 'String'] || {}, args.length > 0 ? args[0] : {}));
            }
            if (!$.jui.plugins[plugin])
            {
                $.jui.plugins[plugin] = {
                    fn: $.fn['juice' + plugin],
                    isStatic: false
                };
            }
            if (/Manager$/.test(plugin)) return $.jui.get(this, ext.idAttrName);
            this.each(function ()
            {
                if (this[ext.idAttrName] || $(this).attr(ext.idAttrName))
                {
                    var manager = $.jui.get(this[ext.idAttrName] || $(this).attr(ext.idAttrName));
                    if (manager && args.length > 0) manager.set(args[0]);
                    //已经执行过 
                    return;
                }
                if (args.length >= 1 && typeof args[0] == 'string') return;
                //只要第一个参数不是string类型,都执行组件的实例化工作
                var options = args.length > 0 ? args[0] : null;
                var p = $.extend({}, $[ext.defaultsNamespace][plugin] || {}
                    , $[ext.defaultsNamespace][plugin + 'String'] || {}, options || {});
                if (ext.propertyToElemnt) p[ext.propertyToElemnt] = this;
                if (ext.hasElement)
                {
                    new $.jui[ext.controlNamespace][plugin](this, p);
                }
                else
                {
                    new $.jui[ext.controlNamespace][plugin](p);
                }
            });
            if (this.length == 0) return null;
            if (args.length == 0) return $.jui.get(this, ext.idAttrName);
            if (typeof args[0] == 'object') return $.jui.get(this, ext.idAttrName);
            if (typeof args[0] == 'string')
            {
                var manager = $.jui.get(this, ext.idAttrName);
                if (manager == null) return;
                if (args[0] == "option")
                {
                    if (args.length == 2)
                        return manager.get(args[1]);  //manager get
                    else if (args.length >= 3)
                        return manager.set(args[1], args[2]);  //manager set
                }
                else
                {
                    var method = args[0];
                    if (!manager[method]) return; //不存在这个方法
                    var parms = Array.apply(null, args);
                    parms.shift();
                    return manager[method].apply(manager, parms);  //manager method
                }
            }
            return null;
        },

        //扩展
        //1,默认参数     
        //2,本地化扩展 
        defaults: {},
        //3,方法接口扩展
        methods: {},
        //命名空间
        //核心控件,封装了一些常用方法
        core: {},
        //命名空间
        //组件的集合
        controls: {},
        //plugin 插件的集合
        plugins: {}
    };


    //扩展对象
    $.juiceDefaults = {};

    //扩展对象
    $.juiceMethos = {};

    //关联起来
    $.jui.defaults = $.juiceDefaults;
    $.jui.methods = $.juiceMethos;

    //获取jui对象
    //@parm [plugin]  插件名,可为空
    $.fn.juice = function (plugin)
    {
        if (plugin)
        {
            return $.jui.run.call(this, plugin, arguments);
        }
        else
        {
            return $.jui.get(this);
        }
    };


    //组件基类
    //1,完成定义参数处理方法和参数属性初始化的工作
    //2,完成定义事件处理方法和事件属性初始化的工作
    $.jui.core.Component = function (options)
    {
        //事件容器
        this.events = this.events || {};
        //配置参数
        this.options = options || {};
        //子组件集合索引
        this.children = {};
    };
    $.extend($.jui.core.Component.prototype, {
        __getType: function ()
        {
            return '$.jui.core.Component';
        },
        __idPrev: function ()
        {
            return 'jui';
        },

        //设置属性
        // arg 属性名    value 属性值 
        // arg 属性/值   value 是否只设置事件
        set: function (arg, value)
        {
            if (!arg) return;
            if (typeof arg == 'object')
            {
                var tmp;
                if (this.options != arg)
                {
                    $.extend(this.options, arg);
                    tmp = arg;
                }
                else
                {
                    tmp = $.extend({}, arg);
                }
                if (value == undefined || value == true)
                {
                    for (var p in tmp)
                    {
                        if (p.indexOf('on') == 0)
                            this.set(p, tmp[p]);
                    }
                }
                if (value == undefined || value == false)
                {
                    for (var p in tmp)
                    {
                        if (p.indexOf('on') != 0)
                            this.set(p, tmp[p]);
                    }
                }
                return;
            }
            var name = arg;
            //事件参数
            if (name.indexOf('on') == 0)
            {
                if (typeof value == 'function')
                    this.bind(name.substr(2), value);
                return;
            }
            this.trigger('propertychange', arg, value);
            if (!this.options) this.options = {};
            this.options[name] = value;
            var pn = '_set' + name.substr(0, 1).toUpperCase() + name.substr(1);
            if (this[pn])
            {
                this[pn].call(this, value);
            }
            this.trigger('propertychanged', arg, value);
        },

        //获取属性
        get: function (name)
        {
            var pn = '_get' + name.substr(0, 1).toUpperCase() + name.substr(1);
            if (this[pn])
            {
                return this[pn].call(this, name);
            }
            return this.options[name];
        },

        hasBind: function (arg)
        {
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (event && event.length) return true;
            return false;
        },

        //触发事件
        //data (可选) Array(可选)传递给事件处理函数的附加参数
        trigger: function (arg, data)
        {
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (!event) return;
            data = data || [];
            if ((data instanceof Array) == false)
            {
                data = [data];
            }
            for (var i = 0; i < event.length; i++)
            {
                var ev = event[i];
                if (ev.handler.apply(ev.context, data) == false)
                    return false;
            }
        },

        //绑定事件
        bind: function (arg, handler, context)
        {
            if (typeof arg == 'object')
            {
                for (var p in arg)
                {
                    this.bind(p, arg[p]);
                }
                return;
            }
            if (typeof handler != 'function') return false;
            var name = arg.toLowerCase();
            var event = this.events[name] || [];
            context = context || this;
            event.push({ handler: handler, context: context });
            this.events[name] = event;
        },

        //取消绑定
        unbind: function (arg, handler)
        {
            if (!arg)
            {
                this.events = {};
                return;
            }
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (!event || !event.length) return;
            if (!handler)
            {
                delete this.events[name];
            }
            else
            {
                for (var i = 0, l = event.length; i < l; i++)
                {
                    if (event[i].handler == handler)
                    {
                        event.splice(i, 1);
                        break;
                    }
                }
            }
        },
        destroy: function ()
        {
            $.jui.remove(this);
        }
    });


    //界面组件基类, 
    //1,完成界面初始化:设置组件id并存入组件管理器池,初始化参数
    //2,渲染的工作,细节交给子类实现
    //@parm [element] 组件对应的dom element对象
    //@parm [options] 组件的参数
    $.jui.core.UIComponent = function (element, options)
    {
        $.jui.core.UIComponent.base.constructor.call(this, options);
        var extendMethods = this._extendMethods();
        if (extendMethods) $.extend(this, extendMethods);
        this.element = element;
        this._init();
        this._preRender();
        this.trigger('render');
        this._render();
        this.trigger('rendered');
        this._rendered();
    };
    $.jui.core.UIComponent.juiceExtend($.jui.core.Component, {
        __getType: function ()
        {
            return '$.jui.core.UIComponent';
        },
        //扩展方法
        _extendMethods: function ()
        {

        },
        _init: function ()
        {
            this.type = this.__getType();
            if (!this.element)
            {
                this.id = this.options.id || $.jui.getId(this.__idPrev());
            }
            else
            {
                this.id = this.options.id || this.element.id || $.jui.getId(this.__idPrev());
            }
            //存入管理器池
            $.jui.add(this);

            if (!this.element) return;

            //读取attr方法,并加载到参数,比如['url']
            var attributes = this.attr();
            if (attributes && attributes instanceof Array)
            {
                for (var i = 0; i < attributes.length; i++)
                {
                    var name = attributes[i];
                    this.options[name] = $(this.element).attr(name);
                }
            }
            //读取jui这个属性，并加载到参数，比如 jui = "width:120,heigth:100"
            var p = this.options;
            if ($(this.element).attr("jui"))
            {
                try
                {
                    var attroptions = $(this.element).attr("jui");
                    if (attroptions.indexOf('{') != 0) attroptions = "{" + attroptions + "}";
                    eval("attroptions = " + attroptions + ";");
                    if (attroptions) $.extend(p, attroptions);
                }
                catch (e) { }
            }
        },
        //预渲染,可以用于继承扩展
        _preRender: function ()
        {

        },
        _copyProperty:function(p,element){
            for(var key  in  p){
                if(element.attr(key)){
                    if(key.indexOf("on")==0){
                        p[key] = eval(element.attr(key));
                    }else if(typeof p[key]=="boolean"){
                        p[key] = eval(element.attr(key));
                    }else{
                        if(element.attr(key).indexOf(";")>=0){
                            p[key] = element.attr(key);
                        }else{
                            p[key] = parseFloat(element.attr(key))?parseFloat(element.attr(key)):element.attr(key) ;
                        }
                    }
                }
            }
        },
        _render: function ()
        {

        },
        _rendered: function ()
        {
            if (this.element)
            {
                $(this.element).attr("juiid", this.id);
            }
        },
        dataTransform:function(data,ui){
            return data;
        },
        //返回要转换成jui参数的属性,比如['url']
        attr: function ()
        {
            return [];
        },
        destroy: function ()
        {
            if (this.element) $(this.element).remove();
            this.options = null;
            $.jui.remove(this);
        }
    });

    $.jui.copyProperty = function(outRet,p,child){
        for(var key in p){
            if(child.attr(key)){
                if(key.indexOf("on")==0){
                    outRet[key] = eval(child.attr(key));
                }else if(typeof p[key]=="string"){
                    if(key.toLowerCase().indexOf("width")>=0||key.toLowerCase().indexOf("height")>=0){
                        outRet[key] = child.attr(key).indexOf("%")>=0?child.attr(key):Number( child.attr(key));
                    }else{
                        outRet[key] = parseFloat(child.attr(key))?parseFloat(child.attr(key)):child.attr(key) ;
                    }
                } else if(typeof p[key]=="boolean"||typeof p[key]=="number"){
                    outRet[key] = eval(child.attr(key));
                }else if(typeof p[key]=="function"||typeof p[key]=="object"){
                    outRet[key] = eval("("+child.attr(key)+")");
                }
            }
        }
    };


    //表单控件基类
    $.jui.controls.Input = function (element, options)
    {
        $.jui.controls.Input.base.constructor.call(this, element, options);
    };

    $.jui.controls.Input.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return '$.jui.controls.Input';
        },
        attr: function ()
        {
            return ['nullText'];
        },
        setValue: function (value)
        {
            return this.set('value', value);
        },
        getValue: function ()
        {
            return this.get('value');
        },
        setEnabled: function ()
        {
            return this.set('disabled', false);
        },
        setDisabled: function ()
        {
            return this.set('disabled', true);
        },
        updateStyle: function ()
        {

        }
    });

    //全局窗口对象
    $.jui.win = {
        //顶端显示
        top: false,

        //遮罩
        mask: function (win)
        {
            function setHeight()
            {
                if (!$.jui.win.windowMask) return;
                var h = $(window).height() + $(window).scrollTop();
                $.jui.win.windowMask.height(h);
            }
            if (!this.windowMask)
            {
                this.windowMask = $("<div class='l-window-mask' style='display: block;'></div>").appendTo('body');
                $(window).bind('resize.juiwin', setHeight);
                $(window).bind('scroll', setHeight);
            }
            this.windowMask.show();
            setHeight();
            this.masking = true;
        },

        //取消遮罩
        unmask: function (win)
        {
            var jwins = $("body > .l-dialog:visible,body > .l-window:visible");
            for (var i = 0, l = jwins.length; i < l; i++)
            {
                var winid = jwins.eq(i).attr("juiid");
                if (win && win.id == winid) continue;
                //获取jui对象
                var winmanager = $.jui.get(winid);
                if (!winmanager) continue;
                //是否模态窗口
                var modal = winmanager.get('modal');
                //如果存在其他模态窗口，那么不会取消遮罩
                if (modal) return;
            }
            if (this.windowMask)
                this.windowMask.hide();
            this.masking = false;
        },

        //显示任务栏
        createTaskbar: function ()
        {
            if (!this.taskbar)
            {
                this.taskbar = $('<div class="l-taskbar"><div class="l-taskbar-tasks"></div><div class="l-clear"></div></div>').appendTo('body');
                if (this.top) this.taskbar.addClass("l-taskbar-top");
                this.taskbar.tasks = $(".l-taskbar-tasks:first", this.taskbar);
                this.tasks = {};
            }
            this.taskbar.show();
            this.taskbar.animate({ bottom: 0 });
            return this.taskbar;
        },

        //关闭任务栏
        removeTaskbar: function ()
        {
            var self = this;
            self.taskbar.animate({ bottom: -32 }, function ()
            {
                self.taskbar.remove();
                self.taskbar = null;
            });
        },
        activeTask: function (win)
        {
            for (var winid in this.tasks)
            {
                var t = this.tasks[winid];
                if (winid == win.id)
                {
                    t.addClass("l-taskbar-task-active");
                }
                else
                {
                    t.removeClass("l-taskbar-task-active");
                }
            }
        },

        //获取任务
        getTask: function (win)
        {
            var self = this;
            if (!self.taskbar) return;
            if (self.tasks[win.id]) return self.tasks[win.id];
            return null;
        },


        //增加任务
        addTask: function (win)
        {
            var self = this;
            if (!self.taskbar) self.createTaskbar();
            if (self.tasks[win.id]) return self.tasks[win.id];
            var title = win.get('title');
            var task = self.tasks[win.id] = $('<div class="l-taskbar-task"><div class="l-taskbar-task-icon"></div><div class="l-taskbar-task-content">' + title + '</div></div>');
            self.taskbar.tasks.append(task);
            self.activeTask(win);
            task.bind('click', function ()
            {
                self.activeTask(win);
                if (win.actived)
                    win.min();
                else
                    win.active();
            }).hover(function ()
                {
                    $(this).addClass("l-taskbar-task-over");
                }, function ()
                {
                    $(this).removeClass("l-taskbar-task-over");
                });
            return task;
        },

        hasTask: function ()
        {
            for (var p in this.tasks)
            {
                if (this.tasks[p])
                    return true;
            }
            return false;
        },

        //移除任务
        removeTask: function (win)
        {
            var self = this;
            if (!self.taskbar) return;
            if (self.tasks[win.id])
            {
                self.tasks[win.id].unbind();
                self.tasks[win.id].remove();
                delete self.tasks[win.id];
            }
            if (!self.hasTask())
            {
                self.removeTaskbar();
            }
        },

        //前端显示
        setFront: function (win)
        {
            var wins = $.jui.find($.jui.core.Win);
            for (var i in wins)
            {
                var w = wins[i];
                if (w == win)
                {
                    $(w.element).css("z-index", "9200");
                    this.activeTask(w);
                }
                else
                {
                    $(w.element).css("z-index", "9100");
                }
            }
        }
    };


    //窗口基类 window、dialog
    $.jui.core.Win = function (element, options)
    {
        $.jui.core.Win.base.constructor.call(this, element, options);
    };

    $.jui.core.Win.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return '$.jui.controls.Win';
        },
        mask: function ()
        {
            if (this.options.modal)
                $.jui.win.mask(this);
        },
        unmask: function ()
        {
            if (this.options.modal)
                $.jui.win.unmask(this);
        },
        min: function ()
        {
        },
        max: function ()
        {
        },
        active: function ()
        {
        }
    });


    $.jui.draggable = {
        dragging: false
    };

    $.jui.resizable = {
        reszing: false
    };

    $.jui.overrideMethod = function(parent,overrides){
        $.extend(parent.prototype, overrides);
    };

    $.jui.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o)
    {
        var f = function (n)
        {
            return n < 10 ? '0' + n : n;
        },
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            quote = function (value)
            {
                escapable.lastIndex = 0;
                return escapable.test(value) ?
                    '"' + value.replace(escapable, function (a)
                    {
                        var c = meta[a];
                        return typeof c === 'string' ? c :
                            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' :
                    '"' + value + '"';
            };
        if (o === null) return 'null';
        var type = typeof o;
        if (type === 'undefined') return undefined;
        if (type === 'string') return quote(o);
        if (type === 'number' || type === 'boolean') return '' + o;
        if (type === 'object')
        {
            if (typeof o.toJSON === 'function')
            {
                return $.jui.toJSON(o.toJSON());
            }
            if (o.constructor === Date)
            {
                return isFinite(this.valueOf()) ?
                    this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z' : null;
            }
            var pairs = [];
            if (o.constructor === Array)
            {
                for (var i = 0, l = o.length; i < l; i++)
                {
                    pairs.push($.jui.toJSON(o[i]) || 'null');
                }
                return '[' + pairs.join(',') + ']';
            }
            var name, val;
            for (var k in o)
            {
                type = typeof k;
                if (type === 'number')
                {
                    name = '"' + k + '"';
                } else if (type === 'string')
                {
                    name = quote(k);
                } else
                {
                    continue;
                }
                type = typeof o[k];
                if (type === 'function' || type === 'undefined')
                {
                    continue;
                }
                val = $.jui.toJSON(o[k]);
                pairs.push(name + ':' + val);
            }
            return '{' + pairs.join(',') + '}';
        }
    };


    $.jui.loadData = function(ui,params){
        var p = ui.options;
        ui.trigger("beforeLoad",p);
        $.ajax({
            type: 'post',
            url: p.url,
            cache: false,
            dataType:p.dataType|| 'json',
            data:p.param||[],
            success: function (data)
            {
                if(ui["dataTransform"]){
                    data = ui["dataTransform"](data);
                }
                ui.onLoad(params,data);
                ui.trigger("afterLoad",data);
            },
            error: function (XMLHttpRequest, textStatus)
            {
                ui.trigger('onError', [XMLHttpRequest, textStatus]);
            }
        });
    };
    var classNames = {
        grid:"grid",
        tree:"tree",
        form:"form",
        tab:"tab",
        button:"button",
        accordion:"accordion",
        checkbox:"checkbox",
        comboBox:"comboBox",
        dateEditor:"dateEditor",
        dialog:"Dialog",
        fieldSet:"fieldSet",
        layout:"layout",
        menu:"menu",
        menubar:"menubar",
        messageBox:"messageBox",
        numberBox:"numberBox",
        panel:"panel"
    };

    $.jui.parse = function(){
        var header = ".jui-";
        $(header+classNames.layout).length>0&&$(header+classNames.layout).juiceLayout();
        $(header+classNames.tab).length>0&&$(header+classNames.tab).juiceTab();
        $(header+classNames.panel).length>0&&$(header+classNames.panel).juicePanel();
        $(header+classNames.menu).length>0&&$(header+classNames.menu).juiceMenu();
        $(header+classNames.menubar).length>0&&$(header+classNames.menubar).juiceMenuBar();
        $(header+classNames.grid).length>0&&$(header+classNames.grid).juiceGrid();
        $(header+classNames.tree).length>0&&$(header+classNames.tree).juiceTree();
        $(header+classNames.fieldSet).length>0&&$(header+classNames.fieldSet).juiceFieldSet();
        $(header+classNames.form).length>0&&$(header+classNames.form).juiceForm();
        $(header+classNames.button).length>0&&$(header+classNames.button).juiceButton();
        if($(header+classNames.form).length==0){
            $(header+classNames.dateEditor).length>0&&$(header+classNames.dateEditor).juiceDateEditor();
            $(header+classNames.comboBox).length>0&&$(header+classNames.comboBox).juiceComboBox();
            $(header+classNames.numberBox).length>0&&$(header+classNames.numberBox).juiceNumberBox();
        }
    };
    $.jui.uitl = {
        FormatString : {
            thousandSeparator:",",
            decimalSeparator:"." ,
            formatCleanRe:/[^\d\.]/g
        } ,
        numberFormat: function(data, formatString,params) {
            if (!formatString) {
                return data;
            }
            if (isNaN(data)) {
                return '';
            }
            if(!params){
                params = {};
            }
            var separator = formatString.match(/([\d][^\d^\.][\d])/g);
            if(separator!=null){
                separator = separator[0].substr(1,1);
            }
            var comma = separator||params["comma"]||this.FormatString.thousandSeparator,
                dec   =   this.FormatString.decimalSeparator,
                neg   = data < 0,
                hasComma,
                psplit;
            data = Math.abs(data);

            hasComma = formatString.indexOf(comma) != -1;
            psplit = formatString.replace( this.FormatString.formatCleanRe, '').split('.');

            if (1 < psplit.length) {
                data = data.toFixed(psplit[1].length);
            } else if(2 < psplit.length) {
            } else {
                data = data.toFixed(0);
            }

            var fnum = data.toString();

            psplit = fnum.split('.');

            if (hasComma) {
                var cnum = psplit[0],
                    parr = [],
                    j    = cnum.length,
                    m    = Math.floor(j / 3),
                    n    = cnum.length % 3 || 3,
                    i;

                for (i = 0; i < j; i += n) {
                    if (i !== 0) {
                        n = 3;
                    }

                    parr[parr.length] = cnum.substr(i, n);
                    m -= 1;
                }
                fnum = parr.join(comma);
                if (psplit[1]) {
                    fnum += dec + psplit[1];
                }
            } else {
                if (psplit[1]) {
                    fnum = psplit[0] + dec + psplit[1];
                }
            }

            if (neg) {
                neg = fnum.replace(/[^1-9]/g, '') !== '';
            }
            return (neg ? '-' : '') + fnum;
//            return (neg ? '-' : '') + formatString.replace(/[\d,?\s?\.?]+/, fnum);
        }
    };
    $.browser = {};
    $.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
    $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());


    $.jui.ajaxQueue = {
        // 管理ajax请求的队列
        requests: new Array(),
        // 把待发送的ajax请求加入队列
        offer: function(options) {
            var _self = this,
                // 对complete，beforeSend方法进行“劫持”，加入队列处理方法poll
                xhrOptions = $.extend({}, options, {
                    // 如果请求完成，发送下一个请求
                    complete: function(jqXHR, textStatus) {
                        if(options.complete)
                            options.complete.call(this, jqXHR, textStatus);
                        _self.poll();
                    },
                    // 如果请求被取消，继续发送下一个请求
                    beforeSend: function(jqXHR, settings) {
                        if(options.beforeSend)
                            var ret = options.beforeSend.call(this, jqXHR, settings);
                        if(ret === false) {
                            _self.poll();
                            return ret;
                        }
                    }
                });
            this.requests.push(xhrOptions);

            if(this.requests.length == 1) {
                $.ajax(xhrOptions);
            }
        },
        // 用FIFO方式发送ajax请求
        poll: function() {
            if(this.isEmpty()) {
                return null;
            }

            var processedRequest = this.requests.shift();
            var nextRequest = this.peek();
            if(nextRequest != null) {
                $.ajax(nextRequest);
            }
            return processedRequest;
        },

        // 返回队列头部的ajax请求
        peek: function() {
            if(this.isEmpty()) {
                return null;
            }
            var nextRequest = this.requests[0];
            return nextRequest;
        },

        // 判断队列是否为空
        isEmpty: function() {
            return this.requests.length == 0;
        }

    }

})(jQuery);