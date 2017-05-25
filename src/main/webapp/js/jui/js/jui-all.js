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

})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
* 
*/

(function ($)
{
    /**
     * @name   juiceDrag
     * @class   juiceDrag是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceDrag &nbsp;API 注解说明</font></h3>
     */
    var l = $.jui;

    $.fn.juiceDrag = function (options)
    {
        return l.run.call(this, "juiceDrag", arguments,
        {
            idAttrName: 'juidragid', hasElement: false, propertyToElemnt: 'target'
        }
        );
    };

    $.fn.juiceGetDragManager = function ()
    {
        return l.run.call(this, "juiceGetDragManager", arguments,
        {
            idAttrName: 'juidragid', hasElement: false, propertyToElemnt: 'target'
        });
    };

    $.juiceDefaults.Drag = /**@lends juiceDrag#*/{
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  开始拖动事件。
         * @default  false
         * @type  Boolean
         */
        onStartDrag: false,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  拖动事件。
         * @default  false
         * @type boolean
         */
        onDrag: false,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  停止拖动事件。
         * @default  false
         * @type boolean
         */
        onStopDrag: false,
        handler: null,
        //代理 拖动时的主体,可以是'clone'或者是函数,放回jQuery 对象
        proxy: true,
        revert: false,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  用于创建自定义动画的。
         * @default  false
         * @type boolean
         * @example <b>示 例</b><br>
         *     // 在一个动画中同时应用三种类型的效果
         *        $("#go").click(function(){
         *           $("#block").animate({
         *                width: "90%",
         *                height: "100%",
         *                fontSize: "10em",
         *                borderWidth: 10
         *                }, 1000 );
         *        });
         */
        animate: true,
        onRevert: null,
        onEndRevert: null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  接收区域 jQuery对象或者jQuery选择字符。
         * @default  null
         * @type   Object
         **/
        receive: null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  进入拖动区域。
         * @default  null
         * @type Object
         **/
        onDragEnter: null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  在区域移动。
         * @default  null
         * @type Object
         **/
        onDragOver: null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  离开区域。
         * @default  null
         * @type Object
         **/
        onDragLeave: null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  在区域释放。
         * @default  null
         * @type Object
         **/
        onDrop: null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  表示已经禁用的输入域(框)。
         * @default  false
         * @type Boolean
         **/
        disabled: false,
        proxyX: null,     //代理相对鼠标指针的位置,如果不设置则对应target的left
        proxyY: null
    };


    l.controls.Drag = function (options)
    {
        l.controls.Drag.base.constructor.call(this, null, options);
    };

    l.controls.Drag.juiceExtend(l.core.UIComponent, {
        __getType: function ()
        {
            return 'Drag';
        },
        __idPrev: function ()
        {
            return 'Drag';
        },
        _render: function ()
        {
            var g = this, p = this.options;
            this.set(p);
            g.cursor = "move";
            g.handler.css('cursor', g.cursor);
            g.handler.bind('mousedown.drag', function (e)
            {
                if (p.disabled) return;
                if (e.button == 2) return;
                g._start.call(g, e);
            }).bind('mousemove.drag', function ()
            {
                if (p.disabled) return;
                g.handler.css('cursor', g.cursor);
            });
        },
        _rendered: function ()
        {
            this.options.target.juidragid = this.id;
        },
        _start: function (e)
        {
            var g = this, p = this.options;
            if (g.reverting) return;
            if (p.disabled) return;
            g.current = {
                target: g.target,
                left: g.target.offset().left,
                top: g.target.offset().top,
                startX: e.pageX || e.screenX,
                startY: e.pageY || e.clientY
            };
            if (g.trigger('startDrag', [g.current, e]) == false) return false;
            g.cursor = "move";
            g._createProxy(p.proxy, e);
            //代理没有创建成功
            if (p.proxy && !g.proxy) return false;
            (g.proxy || g.handler).css('cursor', g.cursor);
            $(document).bind("selectstart.drag", function () { return false; });
            $(document).bind('mousemove.drag', function ()
            {
                g._drag.apply(g, arguments);
            });
            l.draggable.dragging = true;
            $(document).bind('mouseup.drag', function ()
            {
                l.draggable.dragging = false;
                g._stop.apply(g, arguments);
            });
        },
        _drag: function (e)
        {
            var g = this, p = this.options;
            if (!g.current) return;
            var pageX = e.pageX || e.screenX;
            var pageY = e.pageY || e.screenY;
            g.current.diffX = pageX - g.current.startX;
            g.current.diffY = pageY - g.current.startY;
            (g.proxy || g.handler).css('cursor', g.cursor);
            if (g.receive)
            {
                g.receive.each(function (i, obj)
                {
                    var receive = $(obj);
                    var xy = receive.offset();
                    if (pageX > xy.left && pageX < xy.left + receive.width()
                    && pageY > xy.top && pageY < xy.top + receive.height())
                    {
                        if (!g.receiveEntered[i])
                        {
                            g.receiveEntered[i] = true;
                            g.trigger('dragEnter', [obj, g.proxy || g.target, e]);
                        }
                        else
                        {
                            g.trigger('dragOver', [obj, g.proxy || g.target, e]);
                        }
                    }
                    else if (g.receiveEntered[i])
                    {
                        g.receiveEntered[i] = false;
                        g.trigger('dragLeave', [obj, g.proxy || g.target, e]);
                    }
                });
            }
            if (g.hasBind('drag'))
            {
                if (g.trigger('drag', [g.current, e]) != false)
                {
                    g._applyDrag();
                }
                else
                {
                    g._removeProxy();
                }
            }
            else
            {
                g._applyDrag();
            }
        },
        _stop: function (e)
        {
            var g = this, p = this.options;
            $(document).unbind('mousemove.drag');
            $(document).unbind('mouseup.drag');
            $(document).unbind("selectstart.drag");
            if (g.receive)
            {
                g.receive.each(function (i, obj)
                {
                    if (g.receiveEntered[i])
                    {
                        g.trigger('drop', [obj, g.proxy || g.target, e]);
                    }
                });
            }
            if (g.proxy)
            {
                if (p.revert)
                {
                    if (g.hasBind('revert'))
                    {
                        if (g.trigger('revert', [g.current, e]) != false)
                            g._revert(e);
                        else
                            g._removeProxy();
                    }
                    else
                    {
                        g._revert(e);
                    }
                }
                else
                {
                    g._applyDrag(g.target);
                    g._removeProxy();
                }
            }
            g.cursor = 'move';
            g.trigger('stopDrag', [g.current, e]);
            g.current = null;
            g.handler.css('cursor', g.cursor);
        },
        _revert: function (e)
        {
            var g = this;
            g.reverting = true;
            g.proxy.animate({
                left: g.current.left,
                top: g.current.top
            }, function ()
            {
                g.reverting = false;
                g._removeProxy();
                g.trigger('endRevert', [g.current, e]);
                g.current = null;
            });
        },
        _applyDrag: function (applyResultBody)
        {
            var g = this, p = this.options;
            applyResultBody = applyResultBody || g.proxy || g.target;
            var cur = {}, changed = false;
            var noproxy = applyResultBody == g.target;
            if (g.current.diffX)
            {
                if (noproxy || p.proxyX == null)
                    cur.left = g.current.left + g.current.diffX;
                else
                    cur.left = g.current.startX + p.proxyX + g.current.diffX;
                changed = true;
            }
            if (g.current.diffY)
            {
                if (noproxy || p.proxyY == null)
                    cur.top = g.current.top + g.current.diffY;
                else
                    cur.top = g.current.startY + p.proxyY + g.current.diffY;
                changed = true;
            }
            if (applyResultBody == g.target && g.proxy && p.animate)
            {
                g.reverting = true;
                applyResultBody.animate(cur, function ()
                {
                    g.reverting = false;
                });
            }
            else
            {
                applyResultBody.css(cur);
            }
        },
        _setReceive: function (receive)
        {
            this.receiveEntered = {};
            if (!receive) return;
            if (typeof receive == 'string')
                this.receive = $(receive);
            else
                this.receive = receive;
        },
        _setHandler: function (handler)
        {
            var g = this, p = this.options;
            if (!handler)
                g.handler = $(p.target);
            else
                g.handler = (typeof handler == 'string' ? $(handler, p.target) : handler);
        },
        _setTarget: function (target)
        {
            this.target = $(target);
        },
        _setCursor: function (cursor)
        {
            this.cursor = cursor;
            (this.proxy || this.handler).css('cursor', cursor);
        },
        _createProxy: function (proxy, e)
        {
            if (!proxy) return;
            var g = this, p = this.options;
            if (typeof proxy == 'function')
            {
                g.proxy = proxy.call(this.options.target, g, e);
            }
            else if (proxy == 'clone')
            {
                g.proxy = g.target.clone().css('position', 'absolute');
                g.proxy.appendTo('body');
            }
            else
            {
                g.proxy = $("<div class='l-draggable'></div>");
                g.proxy.width(g.target.width()).height(g.target.height())
                g.proxy.attr("dragid", g.id).appendTo('body');
            }
            g.proxy.css({
                left: p.proxyX == null ? g.current.left : g.current.startX + p.proxyX,
                top: p.proxyY == null ? g.current.top : g.current.startY + p.proxyY
            }).show();
        },
        _removeProxy: function ()
        {
            var g = this;
            if (g.proxy)
            {
                g.proxy.remove();
                g.proxy = null;
            }
        }

    });

})(jQuery);/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{
    $.fn.juiceResizable = function (options)
    {
        return $.jui.run.call(this, "juiceResizable", arguments,
        {
            idAttrName: 'juiresizableid', hasElement: false, propertyToElemnt: 'target'
        });
    };

    $.fn.juiceGetResizableManager = function ()
    {
        return $.jui.run.call(this, "juiceGetResizableManager", arguments,
        {
            idAttrName: 'juiresizableid', hasElement: false, propertyToElemnt: 'target'
        });
    };


    $.juiceDefaults.Resizable = {
        handles: 'n, e, s, w, ne, se, sw, nw',
        maxWidth: 2000,
        maxHeight: 2000,
        minWidth: 20,
        minHeight: 20,
        scope: 3,
        animate: false,
        onStartResize: function (e) { },
        onResize: function (e) { },
        onStopResize: function (e) { },
        onEndResize: null
    };

    $.jui.controls.Resizable = function (options)
    {
        $.jui.controls.Resizable.base.constructor.call(this, null, options);
    };

    $.jui.controls.Resizable.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Resizable';
        },
        __idPrev: function ()
        {
            return 'Resizable';
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.target = $(p.target);
            g.set(p);

            g.target.mousemove(function (e)
            {
                if (p.disabled) return;
                g.dir = g._getDir(e);
                if (g.dir)
                    g.target.css('cursor', g.dir + '-resize');
                else if (g.target.css('cursor').indexOf('-resize') > 0)
                    g.target.css('cursor', 'default');
                if (p.target.juidragid)
                {
                    var drag = $.jui.get(p.target.juidragid);
                    if (drag && g.dir)
                    {
                        drag.set('disabled', true);
                    } else if (drag)
                    {
                        drag.set('disabled', false);
                    }
                }
            }).mousedown(function (e)
            {
                if (p.disabled) return;
                if (g.dir)
                {
                    g._start(e);
                }
            });
        },
        _rendered: function ()
        {
            this.options.target.juiresizableid = this.id;
        },
        _getDir: function (e)
        {
            var g = this, p = this.options;
            var dir = '';
            var xy = g.target.offset();
            var width = g.target.width();
            var height = g.target.height();
            var scope = p.scope;
            var pageX = e.pageX || e.screenX;
            var pageY = e.pageY || e.screenY;
            if (pageY >= xy.top && pageY < xy.top + scope)
            {
                dir += 'n';
            }
            else if (pageY <= xy.top + height && pageY > xy.top + height - scope)
            {
                dir += 's';
            }
            if (pageX >= xy.left && pageX < xy.left + scope)
            {
                dir += 'w';
            }
            else if (pageX <= xy.left + width && pageX > xy.left + width - scope)
            {
                dir += 'e';
            }
            if (p.handles == "all" || dir == "") return dir;
            if ($.inArray(dir, g.handles) != -1) return dir;
            return '';
        },
        _setHandles: function (handles)
        {
            if (!handles) return;
            this.handles = handles.replace(/(\s*)/g, '').split(',');
        },
        _createProxy: function ()
        {
            var g = this;
            g.proxy = $('<div class="l-resizable"></div>');
            g.proxy.width(g.target.width()).height(g.target.height())
            g.proxy.attr("resizableid", g.id).appendTo('body');
        },
        _removeProxy: function ()
        {
            var g = this;
            if (g.proxy)
            {
                g.proxy.remove();
                g.proxy = null;
            }
        },
        _start: function (e)
        {
            var g = this, p = this.options;
            g._createProxy();
            g.proxy.css({
                left: g.target.offset().left,
                top: g.target.offset().top,
                position: 'absolute'
            });
            g.current = {
                dir: g.dir,
                left: g.target.offset().left,
                top: g.target.offset().top,
                startX: e.pageX || e.screenX,
                startY: e.pageY || e.clientY,
                width: g.target.width(),
                height: g.target.height()
            };
            $(document).bind("selectstart.resizable", function () { return false; });
            $(document).bind('mouseup.resizable', function ()
            {
                g._stop.apply(g, arguments);
            });
            $(document).bind('mousemove.resizable', function ()
            {
                g._drag.apply(g, arguments);
            });
            g.proxy.show();
            g.trigger('startResize', [g.current, e]);
        },
        changeBy: {
            t: ['n', 'ne', 'nw'],
            l: ['w', 'sw', 'nw'],
            w: ['w', 'sw', 'nw', 'e', 'ne', 'se'],
            h: ['n', 'ne', 'nw', 's', 'se', 'sw']
        },
        _drag: function (e)
        {
            var g = this, p = this.options;
            if (!g.current) return;
            if (!g.proxy) return;
            g.proxy.css('cursor', g.current.dir == '' ? 'default' : g.current.dir + '-resize');
            var pageX = e.pageX || e.screenX;
            var pageY = e.pageY || e.screenY;
            g.current.diffX = pageX - g.current.startX;
            g.current.diffY = pageY - g.current.startY;
            g._applyResize(g.proxy);
            g.trigger('resize', [g.current, e]);
        },
        _stop: function (e)
        {
            var g = this, p = this.options;

            if (g.hasBind('stopResize'))
            {
                if (g.trigger('stopResize', [g.current, e]) != false)
                    g._applyResize();
            }
            else
            {
                g._applyResize();
            }
            g._removeProxy();
            g.trigger('endResize', [g.current, e]);
            $(document).unbind("selectstart.resizable");
            $(document).unbind('mousemove.resizable');
            $(document).unbind('mouseup.resizable');
        },
        _applyResize: function (applyResultBody)
        {
            var g = this, p = this.options;
            var cur = {
                left: g.current.left,
                top: g.current.top,
                width: g.current.width,
                height: g.current.height
            };
            var applyToTarget = false;
            if (!applyResultBody)
            {
                applyResultBody = g.target;
                applyToTarget = true;
                if (!isNaN(parseInt(g.target.css('top'))))
                    cur.top = parseInt(g.target.css('top'));
                else
                    cur.top = 0;
                if (!isNaN(parseInt(g.target.css('left'))))
                    cur.left = parseInt(g.target.css('left'));
                else
                    cur.left = 0;
            }
            if ($.inArray(g.current.dir, g.changeBy.l) > -1)
            {
                cur.left += g.current.diffX;
                g.current.diffLeft = g.current.diffX;

            }
            else if (applyToTarget)
            {
                delete cur.left;
            }
            if ($.inArray(g.current.dir, g.changeBy.t) > -1)
            {
                cur.top += g.current.diffY;
                g.current.diffTop = g.current.diffY;
            }
            else if (applyToTarget)
            {
                delete cur.top;
            }
            if ($.inArray(g.current.dir, g.changeBy.w) > -1)
            {
                cur.width += (g.current.dir.indexOf('w') == -1 ? 1 : -1) * g.current.diffX;
                g.current.newWidth = cur.width;
            }
            else if (applyToTarget)
            {
                delete cur.width;
            }
            if ($.inArray(g.current.dir, g.changeBy.h) > -1)
            {
                cur.height += (g.current.dir.indexOf('n') == -1 ? 1 : -1) * g.current.diffY;
                g.current.newHeight = cur.height;
            }
            else if (applyToTarget)
            {
                delete cur.height;
            }
            if (applyToTarget && p.animate)
                applyResultBody.animate(cur);
            else
                applyResultBody.css(cur);
        }
    });



})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
* 
*/
(function ($)
{
    /**
     * @name   juiceLayout
     * @class   juiceLayout是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceLayout &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceLayout = function (options)
    {
        return $.jui.run.call(this, "juiceLayout", arguments);
    };

    $.fn.juiceGetLayoutManager = function ()
    {
        return $.jui.run.call(this, "juiceGetLayoutManager", arguments);
    };


    $.juiceDefaults.Layout = /**@lends juiceLayout#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 顶部布局高度。
         * @default 50
         * @type Number
         */
        topHeight: 50,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 底部布局高度。
         * @default 50
         * @type Number
         */
        bottomHeight: 50,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 左边布局宽度。
         * @default 110
         * @type Number
         */
        leftWidth: 110,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 中间布局宽度。
         * @default 300
         * @type Number
         */
        centerWidth: 300,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 右边布局宽度。
         * @default 170
         * @type Number
         */
        rightWidth: 170,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否以窗口的高度为准 height设置为百分比时可用,为true时可用，为false时不可用。
         * @default true
         * @type Boolean
         */
        InWindow: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度补差。
         * @default 0
         * @type Number
         */
        heightDiff: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度。
         * @default 100%
         * @type String
         */
        height: '100%',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变高度。
         * @default null
         * @type event
         */
        onHeightChanged: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 初始化时，左边是否展开/收缩：为true时，隐藏，为false时不隐藏。
         * @default false
         * @type Boolean
         */
        isLeftCollapse: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 初始化时 右边是否展开/收缩：为true时，隐藏，为false时不隐藏。
         * @default false
         * @type Boolean
         */
        isRightCollapse: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许 左边展开/收缩：为true时，隐藏，为false时不隐藏。
         * @default true
         * @type Boolean
         */
        allowLeftCollapse: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许 右边展开/收缩：为true时，隐藏，为false时不隐藏。
         * @default true
         * @type Boolean
         */
        allowRightCollapse: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许 左边可以调整大小：为true时，允许左边可以调整大小，为false时不允许。
         * @default true
         * @type Boolean
         */
        allowLeftResize: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许 右边可以调整大小：为true时，允许右边可以调整大小，为false时不允许。
         * @default true
         * @type Boolean
         */
        allowRightResize: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许头部可以调整大小：为true时，允许头部可以调整大小，为false时不允许。
         * @default true
         * @type Boolean
         */
        allowTopResize: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许 底部可以调整大小：为true时，允许 底部可以调整大小，为false时不允许。
         * @default true
         * @type Boolean
         */
        allowBottomResize: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 间隔。
         * @default 3
         * @type Number
         */
        space: 1,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 调整大小结束事件。
         * @default null
         * @type event
         */
        onEndResize: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 调整左侧宽度时的最小允许宽度。
         * @default 80
         * @type Number
         */
        minLeftWidth: 80,
        /**
         * resize 结束事件
         */
        onAfterResize:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 调整右侧宽度时的最小允许宽度。
         * @default 80
         * @type Number
         */
        minRightWidth: 80
    };

    $.juiceMethos.Layout = {};

    $.jui.controls.Layout = function (element, options)
    {
        $.jui.controls.Layout.base.constructor.call(this, element, options);
    };
    $.jui.controls.Layout.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Layout';
        },
        __idPrev: function ()
        {
            return 'Layout';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Layout;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.layout = $(this.element);
            g.layout.addClass("l-layout");
            g.width = g.layout.width();
            //top
            if ($("> div[position=top]", g.layout).length > 0)
            {
                g.top = $("> div[position=top]", g.layout).wrap('<div class="l-layout-top" style="top:0px;"></div>').parent();
                g.top.content = $("> div[position=top]", g.top);
                if (!g.top.content.hasClass("l-layout-content"))
                    g.top.content.addClass("l-layout-content");
                g.topHeight = p.topHeight;
                if (g.topHeight)
                {
                    g.top.height(g.topHeight);
                }
            }
            //bottom
            if ($("> div[position=bottom]", g.layout).length > 0)
            {
                g.bottom = $("> div[position=bottom]", g.layout).wrap('<div class="l-layout-bottom"></div>').parent();
                g.bottom.content = $("> div[position=bottom]", g.bottom);
                if (!g.bottom.content.hasClass("l-layout-content"))
                    g.bottom.content.addClass("l-layout-content");

                g.bottomHeight = p.bottomHeight;
                if (g.bottomHeight)
                {
                    g.bottom.height(g.bottomHeight);
                }
                //set title
                var bottomtitle = g.bottom.content.attr("title");
                if (bottomtitle)
                {
                    g.bottom.header = $('<div class="l-layout-header"></div>');
                    g.bottom.prepend(g.bottom.header);
                    g.bottom.header.html(bottomtitle);
                    g.bottom.content.attr("title", "");
                }
            }
            //left
            if ($("> div[position=left]", g.layout).length > 0)
            {
                g.left = $("> div[position=left]", g.layout).wrap('<div class="l-layout-left" style="left:0px;"></div>').parent();
                g.left.header = $('<div class="l-layout-header"><div class="l-layout-header-toggle fa fa-angle-double-left "></div><div class="l-layout-header-inner"></div></div>');
                g.left.prepend(g.left.header);
                g.left.header.toggle = $(".l-layout-header-toggle", g.left.header);
                g.left.content = $("> div[position=left]", g.left);
                if (!g.left.content.hasClass("l-layout-content"))
                    g.left.content.addClass("l-layout-content");
                if (!p.allowLeftCollapse) $(".l-layout-header-toggle", g.left.header).remove();
                //set title
                var lefttitle = g.left.content.attr("title");
                if (lefttitle)
                {
                    g.left.content.attr("title", "");
                    $(".l-layout-header-inner", g.left.header).html(lefttitle);
                }
                //set width
                g.leftWidth = p.leftWidth;
                if (g.leftWidth)
                    g.left.width(g.leftWidth);
            }
            //center
            if ($("> div[position=center]", g.layout).length > 0)
            {
                g.center = $("> div[position=center]", g.layout).wrap('<div class="l-layout-center" ></div>').parent();
                g.center.content = $("> div[position=center]", g.center);
                g.center.content.addClass("l-layout-content");
                //set title
                var centertitle = g.center.content.attr("title");
                if (centertitle)
                {
                    g.center.content.attr("title", "");
                    g.center.header = $('<div class="l-layout-header"></div>');
                    g.center.prepend(g.center.header);
                    g.center.header.html(centertitle);
                }
                //set width
                g.centerWidth = p.centerWidth;
                if (g.centerWidth)
                    g.center.width(g.centerWidth);
            }
            //right
            if ($("> div[position=right]", g.layout).length > 0)
            {
                g.right = $("> div[position=right]", g.layout).wrap('<div class="l-layout-right"></div>').parent();

                g.right.header = $('<div class="l-layout-header"><div class="l-layout-header-toggle  fa fa-angle-double-right"></div><div class="l-layout-header-inner"></div></div>');
                g.right.prepend(g.right.header);
                g.right.header.toggle = $(".l-layout-header-toggle", g.right.header);
                if (!p.allowRightCollapse) $(".l-layout-header-toggle", g.right.header).remove();
                g.right.content = $("> div[position=right]", g.right);
                if (!g.right.content.hasClass("l-layout-content"))
                    g.right.content.addClass("l-layout-content");

                //set title
                var righttitle = g.right.content.attr("title");
                if (righttitle)
                {
                    g.right.content.attr("title", "");
                    $(".l-layout-header-inner", g.right.header).html(righttitle);
                }
                //set width
                g.rightWidth = p.rightWidth;
                if (g.rightWidth)
                    g.right.width(g.rightWidth);
            }
            //lock
            g.layout.lock = $("<div class='l-layout-lock'></div>");
            g.layout.append(g.layout.lock);
            //DropHandle
            g._addDropHandle();

            //Collapse
            g.isLeftCollapse = p.isLeftCollapse;
            g.isRightCollapse = p.isRightCollapse;
            g.leftCollapse = $('<div class="l-layout-collapse-left" style="display: none; "><div class="l-layout-collapse-left-toggle fa fa-angle-double-right"></div></div>');
            g.rightCollapse = $('<div class="l-layout-collapse-right" style="display: none; "><div class="l-layout-collapse-right-toggle fa fa-angle-double-left"></div></div>');
            g.layout.append(g.leftCollapse).append(g.rightCollapse);
            g.leftCollapse.toggle = $("> .l-layout-collapse-left-toggle", g.leftCollapse);
            g.rightCollapse.toggle = $("> .l-layout-collapse-right-toggle", g.rightCollapse);
            g._setCollapse();
            //init
            g._bulid();
            $(window).resize(function ()
            {
                g._onResize();
            });
            g.set(p);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置左边框，如果可能，边框会合并为一个单一的边框。会忽略 border-spacing 和 empty-cells 属性。
         * @name  juiceLayout#setLeftCollapse
         * @param [isCollapse]  是否对边框进行调整
         * @function
         */
        setLeftCollapse: function (isCollapse)
        {
            var g = this, p = this.options;
            if (!g.left) return false;
            g.isLeftCollapse = isCollapse;
            if (g.isLeftCollapse)
            {
                g.leftCollapse.show();
                g.leftDropHandle && g.leftDropHandle.hide();
                g.left.hide();
            }
            else
            {
                g.leftCollapse.hide();
                g.leftDropHandle && g.leftDropHandle.show();
                g.left.show();
            }
            g._onResize();
            g.trigger("afterResize",g.centerWidth,g.rightWidth);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置右边框，如果可能，边框会合并为一个单一的边框。会忽略 border-spacing 和 empty-cells 属性。
         * @name  juiceLayout#setRightCollapse
         * @param [isCollapse]  是否对边框进行调整
         * @function
         */
        setRightCollapse: function (isCollapse)
        {
            var g = this, p = this.options;
            if (!g.right) return false;
            g.isRightCollapse = isCollapse;
            g._onResize();
            if (g.isRightCollapse)
            {
                g.rightCollapse.show();
                g.rightDropHandle && g.rightDropHandle.hide();
                g.right.hide();
            }
            else
            {
                g.rightCollapse.hide();
                g.rightDropHandle && g.rightDropHandle.show();
                g.right.show();
            }
            g._onResize();
            g.trigger("afterResize",g.centerWidth,g.rightWidth);
        },
        _bulid: function ()
        {
            var g = this, p = this.options;
            $("> .l-layout-left .l-layout-header,> .l-layout-right .l-layout-header", g.layout).hover(function ()
            {
                $(this).addClass("l-layout-header-over");
            }, function ()
            {
                $(this).removeClass("l-layout-header-over");

            });
            $(".l-layout-header-toggle", g.layout).hover(function ()
            {
                $(this).addClass("l-layout-header-toggle-over");
            }, function ()
            {
                $(this).removeClass("l-layout-header-toggle-over");

            });
            $(".l-layout-header-toggle", g.left).click(function ()
            {
                g.setLeftCollapse(true);
            });
            $(".l-layout-header-toggle", g.right).click(function ()
            {
                g.setRightCollapse(true);
            });
            //set top
            g.middleTop = 0;
            if (g.top)
            {
                g.middleTop += g.top.height();
                // g.middleTop += parseInt(g.top.css('borderTopWidth'));
                // g.middleTop += parseInt(g.top.css('borderBottomWidth'));
                g.middleTop += p.space;
            }
            if (g.left)
            {
                g.left.css({ top: g.middleTop });
                g.leftCollapse.css({ top: g.middleTop });
            }
            if (g.center) g.center.css({ top: g.middleTop });
            if (g.right)
            {
                g.right.css({ top: g.middleTop });
                g.rightCollapse.css({ top: g.middleTop });
            }
            //set left
            if (g.left) g.left.css({ left: 0 });
            g._onResize();
            g._onResize();
        },
        _setCollapse: function ()
        {
            var g = this, p = this.options;
            g.leftCollapse.hover(function ()
            {
                $(this).addClass("l-layout-collapse-left-over");
            }, function ()
            {
                $(this).removeClass("l-layout-collapse-left-over");
            });
            g.leftCollapse.toggle.hover(function ()
            {
                $(this).addClass("l-layout-collapse-left-toggle-over");
            }, function ()
            {
                $(this).removeClass("l-layout-collapse-left-toggle-over");
            });
            g.rightCollapse.hover(function ()
            {
                $(this).addClass("l-layout-collapse-right-over");
            }, function ()
            {
                $(this).removeClass("l-layout-collapse-right-over");
            });
            g.rightCollapse.toggle.hover(function ()
            {
                $(this).addClass("l-layout-collapse-right-toggle-over");
            }, function ()
            {
                $(this).removeClass("l-layout-collapse-right-toggle-over");
            });
            g.leftCollapse.toggle.click(function ()
            {
                g.setLeftCollapse(false);
            });
            g.leftCollapse.click(function ()
            {
                g.setLeftCollapse(false);
            });
            g.rightCollapse.toggle.click(function ()
            {
                g.setRightCollapse(false);
            });
            g.rightCollapse.click(function ()
            {
                g.setRightCollapse(false);
            });
            if (g.left && g.isLeftCollapse)
            {
                g.leftCollapse.show();
                g.leftDropHandle && g.leftDropHandle.hide();
                g.left.hide();
            }
            if (g.right && g.isRightCollapse)
            {
                g.rightCollapse.show();
                g.rightDropHandle && g.rightDropHandle.hide();
                g.right.hide();
            }
        },
        _addDropHandle: function ()
        {
            var g = this, p = this.options;
            if (g.left && p.allowLeftResize)
            {
                g.leftDropHandle = $("<div class='l-layout-drophandle-left'></div>");
                g.layout.append(g.leftDropHandle);
                g.leftDropHandle && g.leftDropHandle.show();
                g.leftDropHandle.mousedown(function (e)
                {
                    g._start('leftresize', e);
                });
            }
            if (g.right && p.allowRightResize)
            {
                g.rightDropHandle = $("<div class='l-layout-drophandle-right'></div>");
                g.layout.append(g.rightDropHandle);
                g.rightDropHandle && g.rightDropHandle.show();
                g.rightDropHandle.mousedown(function (e)
                {
                    g._start('rightresize', e);
                });
            }
            if (g.top && p.allowTopResize)
            {
                g.topDropHandle = $("<div class='l-layout-drophandle-top'></div>");
                g.layout.append(g.topDropHandle);
                g.topDropHandle.show();
                g.topDropHandle.mousedown(function (e)
                {
                    g._start('topresize', e);
                });
            }
            if (g.bottom && p.allowBottomResize)
            {
                g.bottomDropHandle = $("<div class='l-layout-drophandle-bottom'></div>");
                g.layout.append(g.bottomDropHandle);
                g.bottomDropHandle.show();
                g.bottomDropHandle.mousedown(function (e)
                {
                    g._start('bottomresize', e);
                });
            }
            g.draggingxline = $("<div class='l-layout-dragging-xline'></div>");
            g.draggingyline = $("<div class='l-layout-dragging-yline'></div>");
            g.layout.append(g.draggingxline).append(g.draggingyline);
        },
        _setDropHandlePosition: function ()
        {
            var g = this, p = this.options;
            if (g.leftDropHandle)
            {
                g.leftDropHandle.css({ left: g.left.width() + parseInt(g.left.css('left')), height: g.middleHeight, top: g.middleTop });
            }
            if (g.rightDropHandle)
            {
                g.rightDropHandle.css({ left: parseInt(g.right.css('left')) - p.space, height: g.middleHeight, top: g.middleTop });
            }
            if (g.topDropHandle)
            {
                g.topDropHandle.css({ top: g.top.height() + parseInt(g.top.css('top')), width: g.top.width() });
            }
            if (g.bottomDropHandle)
            {
                g.bottomDropHandle.css({ top: parseInt(g.bottom.css('top')) - p.space, width: g.bottom.width() });
            }
        },
        _onResize: function ()
        { 
            var g = this, p = this.options;
            var oldheight = g.layout.height();
            //set layout height 
            var h = 0;
            var windowHeight = $(window).height();
            var parentHeight = null;
            if (typeof (p.height) == "string" && p.height.indexOf('%') > 0)
            {
                var layoutparent = g.layout.parent();
                if (p.InWindow || layoutparent[0].tagName.toLowerCase() == "body")
                {
                    parentHeight = windowHeight;
                    parentHeight -= parseInt($('body').css('paddingTop'));
                    parentHeight -= parseInt($('body').css('paddingBottom'));
                }
                else
                {
                    parentHeight = layoutparent.height();
                }
                h = parentHeight * parseFloat(p.height) * 0.01;
                if (p.InWindow || layoutparent[0].tagName.toLowerCase() == "body")
                    h -= (g.layout.offset().top - parseInt($('body').css('paddingTop')));
            }
            else
            {
                h = parseInt(p.height);
            }
            h += p.heightDiff;
            g.layout.height(h);
            g.layoutHeight = g.layout.height();
            g.middleWidth = g.layout.width();
            g.middleHeight = g.layout.height();
            if (g.top)
            {
                g.middleHeight -= g.top.height();
                // g.middleHeight -= parseInt(g.top.css('borderTopWidth'));
                // g.middleHeight -= parseInt(g.top.css('borderBottomWidth'));
                g.middleHeight -= p.space;
            }
            if (g.bottom)
            {
                g.middleHeight -= g.bottom.height();
                // g.middleHeight -= parseInt(g.bottom.css('borderTopWidth'));
                // g.middleHeight -= parseInt(g.bottom.css('borderBottomWidth'));
                g.middleHeight -= p.space;
            }
            // specific
            // why ?
            // g.middleHeight -= 2;

            if (g.hasBind('heightChanged') && g.layoutHeight != oldheight)
            {
                g.trigger('heightChanged', [{ layoutHeight: g.layoutHeight, diff: g.layoutHeight - oldheight, middleHeight: g.middleHeight}]);
            }

            if (g.center)
            {
                g.centerWidth = g.middleWidth;
                if (g.left)
                {
                    if (g.isLeftCollapse)
                    {
                        g.centerWidth -= g.leftCollapse.width();
                        // g.centerWidth -= parseInt(g.leftCollapse.css('borderLeftWidth'));
                        // g.centerWidth -= parseInt(g.leftCollapse.css('borderRightWidth'));
                        g.centerWidth -= parseInt(g.leftCollapse.css('left'));
                        g.centerWidth -= p.space;
                    }
                    else
                    {
                        g.centerWidth -= g.leftWidth;
                        // g.centerWidth -= parseInt(g.left.css('borderLeftWidth'));
                        // g.centerWidth -= parseInt(g.left.css('borderRightWidth'));
                        g.centerWidth -= parseInt(g.left.css('left'));
                        g.centerWidth -= p.space;
                    }
                }
                if (g.right)
                {
                    if (g.isRightCollapse)
                    {
                        g.centerWidth -= g.rightCollapse.width();
                        // g.centerWidth -= parseInt(g.rightCollapse.css('borderLeftWidth'));
                        // g.centerWidth -= parseInt(g.rightCollapse.css('borderRightWidth'));
                        g.centerWidth -= parseInt(g.rightCollapse.css('right'));
                        g.centerWidth -= p.space;
                    }
                    else
                    {
                        g.centerWidth -= g.rightWidth;
                        // g.centerWidth -= parseInt(g.right.css('borderLeftWidth'));
                        // g.centerWidth -= parseInt(g.right.css('borderRightWidth'));
                        g.centerWidth -= p.space;
                    }
                }
                g.centerLeft = 0;
                if (g.left)
                {
                    if (g.isLeftCollapse)
                    {
                        g.centerLeft += g.leftCollapse.width();
                        // g.centerLeft += parseInt(g.leftCollapse.css('borderLeftWidth'));
                        // g.centerLeft += parseInt(g.leftCollapse.css('borderRightWidth'));
                        g.centerLeft += parseInt(g.leftCollapse.css('left'));
                        g.centerLeft += p.space;
                    }
                    else
                    {
                        g.centerLeft += g.left.width();
                        // g.centerLeft += parseInt(g.left.css('borderLeftWidth'));
                        // g.centerLeft += parseInt(g.left.css('borderRightWidth'));
                        g.centerLeft += p.space;
                    }
                }
                g.center.css({ left: g.centerLeft });
                g.center.width(g.centerWidth);
                g.center.height(g.middleHeight);
                var contentHeight = g.middleHeight;
                if (g.center.header) contentHeight -= g.center.header.height();
                g.center.content.height(contentHeight);
            }
            if (g.left)
            {
                g.leftCollapse.height(g.middleHeight);
                g.left.height(g.middleHeight);
            }
            if (g.right)
            {
                g.rightCollapse.height(g.middleHeight);
                g.right.height(g.middleHeight);
                //set left
                g.rightLeft = 0;

                if (g.left)
                {
                    if (g.isLeftCollapse)
                    {
                        g.rightLeft += g.leftCollapse.width();
                        // g.rightLeft += parseInt(g.leftCollapse.css('borderLeftWidth'));
                        // g.rightLeft += parseInt(g.leftCollapse.css('borderRightWidth'));
                        g.rightLeft += p.space;
                    }
                    else
                    {
                        g.rightLeft += g.left.width();
                        // g.rightLeft += parseInt(g.left.css('borderLeftWidth'));
                        // g.rightLeft += parseInt(g.left.css('borderRightWidth'));
                        g.rightLeft += parseInt(g.left.css('left'));
                        g.rightLeft += p.space;
                    }
                }
                if (g.center)
                {
                    g.rightLeft += g.center.width();
                    // g.rightLeft += parseInt(g.center.css('borderLeftWidth'));
                    // g.rightLeft += parseInt(g.center.css('borderRightWidth'));
                    g.rightLeft += p.space;
                }
                g.right.css({ left: g.rightLeft });
            }
            if (g.bottom)
            {
                g.bottomTop = g.layoutHeight - g.bottom.height() - 2;
                g.bottom.css({ top: g.bottomTop });
            }
            g._setDropHandlePosition();

        },
        _start: function (dragtype, e)
        {
            var g = this, p = this.options;
            g.dragtype = dragtype;
            if (dragtype == 'leftresize' || dragtype == 'rightresize')
            {
                g.xresize = { startX: e.pageX };
                g.draggingyline.css({ left: e.pageX - g.layout.offset().left, height: g.middleHeight, top: g.middleTop }).show();
                $('body').css('cursor', 'col-resize');
            }
            else if (dragtype == 'topresize' || dragtype == 'bottomresize')
            {
                g.yresize = { startY: e.pageY };
                g.draggingxline.css({ top: e.pageY - g.layout.offset().top, width: g.layout.width() }).show();
                $('body').css('cursor', 'row-resize');
            }
            else
            {
                return;
            }

            g.layout.lock.width(g.layout.width());
            g.layout.lock.height(g.layout.height());
            g.layout.lock.show();
            if ($.browser.msie || $.browser.safari) $('body').bind('selectstart', function () { return false; }); // 不能选择

            $(document).bind('mouseup', function ()
            {
                g._stop.apply(g, arguments);
            });
            $(document).bind('mousemove', function ()
            {
                g._drag.apply(g, arguments);
            });
        },
        _drag: function (e)
        {
            var g = this, p = this.options;
            if (g.xresize)
            {
                g.xresize.diff = e.pageX - g.xresize.startX;
                g.draggingyline.css({ left: e.pageX - g.layout.offset().left });
                $('body').css('cursor', 'col-resize');
            }
            else if (g.yresize)
            {
                g.yresize.diff = e.pageY - g.yresize.startY;
                g.draggingxline.css({ top: e.pageY - g.layout.offset().top });
                $('body').css('cursor', 'row-resize');
            }
        },
        _stop: function (e)
        {
            var g = this, p = this.options;
            var diff;
            if (g.xresize && g.xresize.diff != undefined)
            {
                diff = g.xresize.diff;
                if (g.dragtype == 'leftresize')
                {
                    if (p.minLeftWidth)
                    {
                        if (g.leftWidth + g.xresize.diff < p.minLeftWidth)
                            return;
                    }
                    g.leftWidth += g.xresize.diff;
                    g.left.width(g.leftWidth);
                    if (g.center)
                        g.center.width(g.center.width() - g.xresize.diff).css({ left: parseInt(g.center.css('left')) + g.xresize.diff });
                    else if (g.right)
                        g.right.width(g.left.width() - g.xresize.diff).css({ left: parseInt(g.right.css('left')) + g.xresize.diff });
                }
                else if (g.dragtype == 'rightresize')
                {
                    if (p.minRightWidth)
                    {
                        if (g.rightWidth - g.xresize.diff < p.minRightWidth)
                            return;
                    }
                    g.rightWidth -= g.xresize.diff;
                    g.right.width(g.rightWidth).css({ left: parseInt(g.right.css('left')) + g.xresize.diff });
                    if (g.center)
                        g.center.width(g.center.width() + g.xresize.diff);
                    else if (g.left)
                        g.left.width(g.left.width() + g.xresize.diff);
                }
            }
            else if (g.yresize && g.yresize.diff != undefined)
            {
                diff = g.yresize.diff;
                if (g.dragtype == 'topresize')
                {
                    g.top.height(g.top.height() + g.yresize.diff);
                    g.middleTop += g.yresize.diff;
                    g.middleHeight -= g.yresize.diff;
                    if (g.left)
                    {
                        g.left.css({ top: g.middleTop }).height(g.middleHeight);
                        g.leftCollapse.css({ top: g.middleTop }).height(g.middleHeight);
                    }
                    if (g.center) g.center.css({ top: g.middleTop }).height(g.middleHeight);
                    if (g.right)
                    {
                        g.right.css({ top: g.middleTop }).height(g.middleHeight);
                        g.rightCollapse.css({ top: g.middleTop }).height(g.middleHeight);
                    }
                }
                else if (g.dragtype == 'bottomresize')
                {
                    g.bottom.height(g.bottom.height() - g.yresize.diff);
                    g.middleHeight += g.yresize.diff;
                    g.bottomTop += g.yresize.diff;
                    g.bottom.css({ top: g.bottomTop });
                    if (g.left)
                    {
                        g.left.height(g.middleHeight);
                        g.leftCollapse.height(g.middleHeight);
                    }
                    if (g.center) g.center.height(g.middleHeight);
                    if (g.right)
                    {
                        g.right.height(g.middleHeight);
                        g.rightCollapse.height(g.middleHeight);
                    }
                }
            }
            g.trigger('endResize', [{
                direction: g.dragtype ? g.dragtype.replace(/resize/, '') : '',
                diff: diff
            }, e]);
            g.trigger("afterResize",g.centerWidth,g.rightWidth);
            g._setDropHandlePosition();
            g.draggingxline.hide();
            g.draggingyline.hide();
            g.xresize = g.yresize = g.dragtype = false;
            g.layout.lock.hide();
            if ($.browser.msie || $.browser.safari)
                $('body').unbind('selectstart');
            $(document).unbind('mousemove', g._drag);
            $(document).unbind('mouseup', g._stop);
            $('body').css('cursor', '');

        }
    });

})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
* 
*/
(function ($)
{
    $.fn.juiceAccordion = function (options)
    {
        return $.jui.run.call(this, "juiceAccordion", arguments);
    };

    $.fn.juiceGetAccordionManager = function ()
    {
        return $.jui.get(this);
    };
    /**
     * @name   juiceAccordion
     * @class    juiceAccordion是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceAccordion &nbsp;API 注解说明</font></h3>
     */
    $.juiceDefaults.Accordion = /**@lends juiceAccordion#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  抽屉布局的高度，可取值为'auto'（每个抽屉的高度分别由抽屉的内容决定），可以取值为'fit'，表示适应父容器的大小（height:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给height属性。
         * @default 0
         * @type Number
         */
        height: 0,
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 动画滑动速度，默认为“normal”。
         * @default normal
         * @type String
         */
        speed: "normal",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   是否自动改变高度。true表示随窗体的高度改变而改变，false则不随高度改变而改变。 这里默认的是false。
         */
        changeHeightOnResize: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  高度补差  初始值为0.
         * @default 0
         * @type Number
         *
         */
        heightDiff: 0
    };
    $.juiceMethos.Accordion = {};

    $.jui.controls.Accordion = function (element, options)
    {
        $.jui.controls.Accordion.base.constructor.call(this, element, options);
    };
    $.jui.controls.Accordion.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Accordion';
        },
        __idPrev: function ()
        {
            return 'Accordion';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Accordion;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.accordion = $(g.element);
            if (!g.accordion.hasClass("l-accordion-panel")) g.accordion.addClass("l-accordion-panel");
            var selectedIndex = 0;
            if ($("> div[lselected=true]", g.accordion).length > 0)
                selectedIndex = $("> div", g.accordion).index($("> div[lselected=true]", g.accordion));

            $("> div", g.accordion).each(function (i, box)
            {
                var header = $('<div class="l-accordion-header"><div class="l-accordion-toggle"></div><div class="l-accordion-header-inner"></div></div>');
                if (i == selectedIndex) {
                    // TODO 需要进一步完善
                    header.addClass("l-accordion-header-open");
                    $(".l-accordion-toggle", header).addClass("l-accordion-toggle-open");
                }
                if ($(box).attr("title"))
                {
                    $(".l-accordion-header-inner", header).html($(box).attr("title"));
                    $(box).attr("title", "");
                }
                $(box).before(header);
                if (!$(box).hasClass("l-accordion-content")) $(box).addClass("l-accordion-content");
            });

            //add Even
            $(".l-accordion-toggle", g.accordion).each(function ()
            {
                if (!$(this).hasClass("l-accordion-toggle-open") && !$(this).hasClass("l-accordion-toggle-close"))
                {
                    $(this).addClass("l-accordion-toggle-close");
                }
                if ($(this).hasClass("l-accordion-toggle-close"))
                {
                    $(this).parent().next(".l-accordion-content:visible").hide();
                }
            });
            $(".l-accordion-header", g.accordion).hover(function ()
            {
                $(this).addClass("l-accordion-header-over");
            }, function ()
            {
                $(this).removeClass("l-accordion-header-over");
            });
            $(".l-accordion-toggle", g.accordion).hover(function ()
            {
                if ($(this).hasClass("l-accordion-toggle-open"))
                    $(this).addClass("l-accordion-toggle-open-over");
                else if ($(this).hasClass("l-accordion-toggle-close"))
                    $(this).addClass("l-accordion-toggle-close-over");
            }, function ()
            {
                if ($(this).hasClass("l-accordion-toggle-open"))
                    $(this).removeClass("l-accordion-toggle-open-over");
                else if ($(this).hasClass("l-accordion-toggle-close"))
                    $(this).removeClass("l-accordion-toggle-close-over");
            });
            $(">.l-accordion-header", g.accordion).click(function ()
            {
                var togglebtn = $(".l-accordion-toggle:first", this);
                if (togglebtn.hasClass("l-accordion-toggle-close"))
                {
                    var siblings = $(this).siblings(".l-accordion-header");
                    siblings.each(function(i){
                        if($(siblings[i]).hasClass("l-accordion-header-open")){
                            $(siblings[i]).removeClass("l-accordion-header-open");
                        }
                    });
                    togglebtn.removeClass("l-accordion-toggle-close")
                    .removeClass("l-accordion-toggle-close-over l-accordion-toggle-open-over");
                    togglebtn.addClass("l-accordion-toggle-open");
                    $(this).addClass("l-accordion-header-open");
                    $(this).next(".l-accordion-content")
                    .show(p.speed)
                    .siblings(".l-accordion-content:visible").hide(p.speed);
                    $(this).siblings(".l-accordion-header").find(".l-accordion-toggle").removeClass("l-accordion-toggle-open").addClass("l-accordion-toggle-close");
                }
                else
                {
                    togglebtn.removeClass("l-accordion-toggle-open")
                    .removeClass("l-accordion-toggle-close-over l-accordion-toggle-open-over")
                    .addClass("l-accordion-toggle-close");
                    $(this).next(".l-accordion-content").hide(p.speed);
                }
            });
            //init
            g.headerHoldHeight = 0;
            $("> .l-accordion-header", g.accordion).each(function ()
            {
                g.headerHoldHeight += $(this).height();
            });
            if (p.height && typeof (p.height) == 'string' && p.height.indexOf('%') > 0)
            {
                g.onResize();
                if (p.changeHeightOnResize)
                {
                    $(window).resize(function ()
                    {
                        g.onResize();
                    });
                }
            }
            else
            {
                if (p.height)
                {
                    g.height = p.heightDiff + p.height;
                    g.accordion.height(g.height);
                    g.setHeight(p.height);
                }
                else
                {
                    g.header = g.accordion.height();
                }
            }

            g.set(p);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onresize 事件会在窗口或框架被调整大小时发生。
         * @name  juiceAccordion#onResize
         * @event
         * @example   <b>示例:</b> <br>
         *           onResize: function (){
         *               ...
         *           }
         */
        onResize: function ()
        {
            var g = this, p = this.options;
            if (!p.height || typeof (p.height) != 'string' || p.height.indexOf('%') == -1) return false;
            //set accordion height
            if (g.accordion.parent()[0].tagName.toLowerCase() == "body")
            {
                var windowHeight = $(window).height();
                windowHeight -= parseInt(g.layout.parent().css('paddingTop'));
                windowHeight -= parseInt(g.layout.parent().css('paddingBottom'));
                g.height = p.heightDiff + windowHeight * parseFloat(g.height) * 0.01;
            }
            else
            {
                g.height = p.heightDiff + (g.accordion.parent().height() * parseFloat(p.height) * 0.01);
            }
            g.accordion.height(g.height);
            g.setContentHeight(g.height - g.headerHoldHeight);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置高度。
         * @name  juiceAccordion#setHeight
         * @function
         * @param  height
         * height - 关于高度的参数。
         * @example   <b>示例:</b> <br>
         *          setHeight: function (height){
         *           var g = this, p = this.options;
         *            g.accordion.height(height);
         *           height -= g.headerHoldHeight;
         *           $("> .l-accordion-content", g.accordion).height(height);
         *           }
         */
        setHeight: function (height)
        {
            var g = this, p = this.options;
            g.accordion.height(height);
            height -= g.headerHoldHeight;
            $("> .l-accordion-content", g.accordion).height(height);
        }
    });


})(jQuery);﻿/**
 *  @fileOverview  jQuery jui 1.0
 *
 *  @author  <a href="http://jui.com">xhz&&tcg</a>
 *
 */
(function ($) {
    $.fn.juiceTree = function (options) {
        return $.jui.run.call(this, "juiceTree", arguments);
    };

    $.fn.juiceGetTreeManager = function () {
        return $.jui.run.call(this, "juiceGetTreeManager", arguments);
    };

    /**
     * @name   juiceTree
     * @class   juiceTree是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceTree &nbsp;API 注解说明</font></h3>
     */
    $.juiceDefaults.Tree = /**@lends juiceTree#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取数据源url。
         * @default ""
         * @type String
         */
        url:"",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   数据源。
         * @default null
         * @type Object
         */
        data:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  复选框,默认值为false。
         * @default false
         * @type Boolean
         */
        checkbox:false,
        autoCheckboxEven:true,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  父节点图标，默认为folder 图标。
         * @default  folder
         * @type String
         */
        parentIcon:'folder',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  子节点图标。
         * @default leaf
         * @type String
         */
        childIcon:'leaf',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  文本域名称。
         * @default text
         * @type String
         */
        textFieldName:'text',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  树节点参数属性。
         * @default ['id', 'url', 'uid', 'type']
         * @type String
         */
        attribute:['id', 'url', 'uid', 'type'],
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否显示line,true为显示，false为不显示。
         * @default true
         * @type Boolean
         */
        treeLine:true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  节点宽度，默认是90px。
         * @default 90
         * @type Number
         */
        nodeWidth:90,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  状态名称“__status”。
         * @default __status
         * @type String
         */
        statusName:'__status',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否子节点的判断函数。
         * @default null
         * @type Object
         */
        isLeaf:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否单选，默认是“false”，不单选,否则，单选。
         * @default false
         * @type Boolean
         */
        single:false,
        /**
         *@name  juiceTree#onBeforeExpand
         *@desc    树节点展开前触发事件。  onBeforeExpand: function () { }
         *@event
         *@param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *              onBeforeExpand: function(nodeData){ ... }
         *           };
         */
        onBeforeExpand:function () {
        },
        /**
         *@name   juiceTree#onContextmenu
         *@desc    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右键菜单触发事件。   onContextmenu: function () { }
         *@event
         */
        onContextmenu:function () {
        },
        /**
         *@name   juiceTree#onExpand
         *@desc     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点展开后触发事件。    onExpand: function () { }
         *@event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onExpand: function(nodeData){ ... }
         *          };
         */
        onExpand:function () {
        },
        /**
         *@name  juiceTree#onBeforeCollapse
         *@desc    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点收缩前触发事件。   onBeforeCollapse: function () { }
         *@event
         *@param  nodeData
         *nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *           onBeforeCollapse: function(nodeData){ ... }
         *          };
         */
        onBeforeCollapse:function () {
        },
        /**
         *@name  juiceTree#onCollapse
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点收缩后触发事件。   onCollapse: function () { }
         *@event
         *@param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onCollapse: function(nodeData){ ... }
         *          };
         */
        onCollapse:function () {
        },
        /**
         *@name   juiceTree#onBeforeSelect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选择前触发事件。   onBeforeSelect: function () { }
         *@event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onBeforeSelect: function(nodeData){ ... }
         *          };
         */
        onBeforeSelect:function () {
        },
        /**
         *@name   juiceTree#onSelect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选择后触发事件。 onSelect: function () { }
         *@event
         * @param  nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onSelect: function(nodeData){ ... }
         *          };
         */
        onSelect:function () {
        },
        /**
         *@name   juiceTree#onBeforeCancelSelect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点取消选择前触发事件。   onBeforeCancelSelect: function () { }
         * @event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onBeforeCancelSelect: function(nodeData){ ... }
         *          };
         */
        onBeforeCancelSelect:function () {
        },
        /**
         *@name   juiceTree#onCancelselect
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点取消选择前触发事件。   onCancelselect: function () { }
         * @event
         * @param  nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onCancelselect: function(nodeData){ ... }
         *          };
         */
        onCancelselect:function () {
        },
        /**
         *@name   juiceTree#onCheck
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选中后触发事件。   onCheck: function () { }
         *@event
         * @param nodeData
         * nodeData - 树节点的json对象
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onCheck: function(nodeData){ ... }
         *          };
         */
        onCheck:function () {
        },
        /**
         *@name   juiceTree#onSuccess
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点远程装载成功后触发事件。   onSuccess: function () { }
         *@event
         * @param data
         * data - 装载成功后获取的数据json.
         *@example   <b>示例:</b> <br>
         *        $.juiceDefaults.Tree = {
         *            onSuccess: function(data){ ... }
         *          };
         */
        onSuccess:function () {
        },
        /**
         *@name   juiceTree#onError
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;远程更新数据异常后执行的方法 .错误信息为jQuery.ajax返回的异常信息，可参考jQuery.ajax官方文档。  onError: function () { }
         *@event
         *@param xmlHttpRequest,textStatus,errorThrown,event
         *  xmlHttpRequest - XMLHttpRequest 对象
         *  textStatus - 错误信息
         *  errorThrown - （可选）捕获的异常对象
         *  event - jQuery.Event对象
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *                  onError:function(xmlHttpRequest,textStatus,errorThrown,event){
         *                           alert('error occured');
         *                       }
         *                  };
         */
        onError:function () {
        },
        /**
         *@name   juiceTree#onClick
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单击树节点触发事件。    onClick: function () { }
         *@event
         * @param data
         * nodeData - 树节点的json对象 event - jQuery.Event对象
         *@example   <b>示例:</b> <br>
         *         $("#tree").omTree({
         *            onClick: function(nodeData, event){ ... }
         *          });
         */
        onClick:function () {
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  节点id。
         * @default  id
         * @type String
         */
        idFieldName:'id',
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  父节点id名称。
         * @default  null
         * @type Object
         */
        parentIDFieldName:null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根节点id的值。
         * @default  0
         * @type Number
         */
        topParentIDValue:0,
        /**
         *@name   juiceTree#onBeforeAppend
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据前事件，可以通过return false取消操作。    onBeforeAppend: function () { }
         *@event
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onBeforeAppend: function(){ ... return false; }
         *          };
         */
        onBeforeAppend:function () {
        },
        /**
         *@name   juiceTree#onAppend
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据时事件，对数据进行预处理以后进行加载。    onAppend: function () { }
         *@event
         *@example   <b>示例:</b> <br>
         *         $.juiceDefaults.Tree = {
         *            onAppend: function(){ ... return false; }
         *          };
         */
        onAppend:function () {
        },



        /**
         *@name   juiceTree#onAfterAppend
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据完事件。    onAfterAppend: function () { }
         *@event
         */
        onAfterAppend:function () {
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否以动画的形式显示，true，以动画的形式显示；false，不以动画的形式显示。
         * @default  0
         * @type Number
         */
        slide:true,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根节点id的值。
         * @default  0
         * @type Number
         */
        iconFieldName:'icon',
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否允许拖拽，false，不允许;true,为允许。
         * @default  false
         * @type Boolean
         */
        nodeDraggable:false,
        nodeDraggingRender:null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  是否点击展开/收缩 按钮时才有效。
         * @default  true
         * @type Boolean
         */
        btnClickToToggleOnly:true
    };

    //接口方法扩展   预留接口方法扩展，可供用户自行扩展
    /**
     * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;juiceMethos.Tree,预留接口方法扩展，可供用户自行扩展。
     * @name  juiceTree#Tree
     * @function
     */
    $.juiceMethos.Tree = $.juiceMethos.Tree || {};

    $.jui.controls.Tree = function (element, options)
    {
        $.jui.controls.Tree.base.constructor.call(this, element, options);
    };
    $.jui.controls.Tree.juiceExtend($.jui.core.UIComponent, {
        _extendMethods: function ()
        {
            return $.juiceMethos.Tree;
        },
        _init: function ()
        {
            $.jui.controls.Tree.base._init.call(this);
            var g = this, p = this.options;
            this._copyProperty(p, $(this.element));
            if (p.single) p.autoCheckboxEven = false;
        },
        _render:function () {
            var g = this, p = this.options;
            g.set(p, true);
            g.tree = $(g.element);
            g.tree.addClass('l-tree');
            g.sysAttribute = ['isexpand', 'ischecked', 'href', 'style'];
            g.loading = $("<div class='l-tree-loading'></div>");
            g.tree.after(g.loading);
            g.data = [];
            g.maxOutlineLevel = 1;
            g.treedataindex = 0;
            g._applyTree();
            g._setTreeEven();

            g.set(p, false);
        },
        _setTreeLine:function (value) {
            if (value) this.tree.removeClass("l-tree-noline");
            else this.tree.addClass("l-tree-noline");
        },
        _setUrl:function (url) {
            if (url) this.loadData(null, url);
        },
        _setData:function (data) {
            if (data) this.append(null, data);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置树所对应的静态数据。
         * @name  juiceTree#setData
         * @function
         * @param data
         * data - 树节点的json对象
         * @example   <b>示例:</b> <br>
         *        (function ($) {
         *            setData: function(data){
         *                  this.set('data', data);
         *            }
         *        })(jQuery);
         */
        setData:function (data) {
            this.set('data', data);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取setData中的数据data。
         * @name  juiceTree#getData
         * @function
         * @param data
         * data - 树节点的json对象
         * @return data  返回当前获取的数据
         * @example   <b>示例:</b> <br>
         *         (function ($) {
         *            getData: function(data){
         *                  return this.data);
         *            }
         *        })(jQuery);
         */
        getData:function () {
            return this.data;
        },

        getRoot:function(){
            var g = this;
            var node = {};
            node.data = g._getDataNodeByTreeDataIndex(g.data, "0");
            return node;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否包含子节点。
         * @name  juiceTree#hasChildren
         * @function
         * @param treenodedata
         * treenodedata - 树节点的json对象
         * @return  <b>data</b>  返回true 或 false
         * @example   <b>示例:</b> <br>
         *         (function ($) {
         *            hasChildren: function(treenodedata){
         *            ...
         *            return treenodedata.children ? true : false;
         *            }
         *          })(jQuery);
         */
        hasChildren:function (treenodedata) {
            if (this.options.isLeaf) return this.options.isLeaf(treenodedata);
            if("isLeaf" in treenodedata)  return (treenodedata.isLeaf!="true"&&treenodedata.isLeaf!=true);
            return treenodedata.children ? true : false;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取父节点数据。
         * @name  juiceTree#getParent
         * @function
         * @param treenode,level
         * treenode - 树节点对象
         * level -节点层级
         * @return  返回树节点数据
         * @example   <b>示例:</b> <br>
         *         (function ($) {
         *           getParent:function (treenode, level) {
         *            ...
         *            return "";
         *            }
         *           })(jQuery);
         */
        getParent:function (treenode, level) {
            var g = this;
            treenode = g.getNodeDom(treenode);
            var parentTreeNode = g.getParentTreeItem(treenode, level);
            if (!parentTreeNode) return null;
            var parentIndex = $(parentTreeNode).attr("treedataindex");
            return g._getDataNodeByTreeDataIndex(null,parentIndex);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取父节点。
         * @name  juiceTree#getParentTreeItem
         * @function
         * @param treenode,level
         * treenode - 树节点对象
         * level -节点层级
         * @return  返回父节点信息
         * @example   <b>示例:</b> <br>
         *          (function ($) {
         *           getParentTreeItem:function (treenode, level) {
         *            ...
         *            return "";
         *            }
         *           })(jQuery);
         */
        getParentTreeItem:function (treenode, level) {
            var g = this;
            treenode = g.getNodeDom(treenode);
            var treeitem = $(treenode);
            if (treeitem.parent().hasClass("l-tree"))
                return null;
            if (level == undefined) {
                if (treeitem.parent().parent("li").length == 0)
                    return null;
                return treeitem.parent().parent("li")[0];
            }
            var currentLevel = parseInt(treeitem.attr("outlinelevel"));
            var currenttreeitem = treeitem;
            for (var i = currentLevel - 1; i >= level; i--) {
                currenttreeitem = currenttreeitem.parent().parent("li");
            }
            return currenttreeitem[0];
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取所有被勾选或未被勾选节点的JSON数据对象集合。
         * @name  juiceTree#getChecked
         * @function
         * @return <b>nodes</b> 返回一个nodes数组
         * @example   <b>示例:</b> <br>
         *       (function ($) {
         *           getChecked:function () {
         *            ...
         *            return nodes;
         *            }
         *          })(jQuery);
         */
        getChecked:function () {
            var g = this, p = this.options;
            if (!this.options.checkbox) return null;
            var nodes = [];
            $(".l-checkbox-checked", g.tree).parent().parent("li").each(function () {
                var treedataindex = parseInt($(this).attr("treedataindex"));
                nodes.push({ target:this, data:g._getDataNodeByTreeDataIndex(g.data, treedataindex) });
            });
            $(".l-checkbox-incomplete", g.tree).parent().parent("li").each(function () {
                var treedataindex = parseInt($(this).attr("treedataindex"));
                nodes.push({ target:this, data:g._getDataNodeByTreeDataIndex(g.data, treedataindex) });
            });
            return nodes;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取被选中的节点的JSON数据对象。
         * @name  juiceTree#getSelected
         * @function
         * @return
         * @example   <b>示例:</b> <br>
         *      (function ($) {
         *           getSelected:function () {
         *            ...
         *            return "";
         *            }
         *        })(jQuery);
         */
        getSelected:function () {
            var g = this, p = this.options;
            var node = {};
            node.target = $(".l-selected", g.tree).parent().parent("li")[0];
            if (node.target) {
                var treedataindex = parseInt($(node.target).attr("treedataindex"));
                node.data = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                return node;
            }
            return null;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;升级为父节点级别。
         * @name  juiceTree#upgrade
         * @function
         * @param treeNode
         * treeNode - 树节点对象
         * @example   <b>示例:</b> <br>
         *      (function ($) {
         *           upgrade:function (treeNode) {
         *            ...
         *            }
         *        })(jQuery);
         */
        upgrade:function (treeNode) {
            var g = this, p = this.options;
            $(".lineBtn", treeNode).each(function () {
                $(this).removeAttr("class").addClass("switch").addClass("btnbox").addClass("root_open");
            });
            $("." + g._getChildNodeClassName(), treeNode).each(function () {
                $(this)
                    .removeClass(g._getChildNodeClassName())
                    .removeClass("l-box")
                    .addClass("ico_open")
                    .addClass("btnbox")
                    .addClass(g._getParentNodeClassName(true));
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;降级为叶节点级别。
         * @name  juiceTree#demotion
         * @function
         * @param treeNode
         * treeNode - 树节点对象
         * @example   <b>示例:</b> <br>
         *      (function ($) {
         *           demotion:function (treeNode) {
         *            ...
         *            }
         *        })(jQuery);
         */
        demotion:function (treeNode) {
            var g = this, p = this.options;
            if (!treeNode && treeNode[0].tagName.toLowerCase() != 'li') return;
            var islast = $(treeNode).hasClass("l-last");
            $(".roots_open", treeNode).each(function () {
                $(this).removeClass("roots_open")
                    .addClass(islast ? "bottom_docu" : "center_docu");
            });
            $(".l-expandable-close", treeNode).each(function () {
                $(this).removeClass("roots_close")
                    .addClass(islast ? "bottom_docu" : "center_docu");
            });
            $("." + g._getParentNodeClassName(true), treeNode).each(function () {
                $(this)
                    .removeClass(g._getParentNodeClassName(true))
                    .addClass(g._getChildNodeClassName());
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收缩所有的树节点。
         * @name  juiceTree#collapseAll
         * @function
         * @example   <b>示例:</b> <br>
         *   //将所有的树节点收缩
         *    $('#myTree').omTree('collapseAll');
         */
        collapseAll:function () {
            var g = this, p = this.options;
            $(".roots_open", g.tree).click();
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;展开所有的树节点。
         * @name  juiceTree#expandAll
         * @function
         * @example   <b>示例:</b> <br>
         *   //将所有的树节点收缩
         *    $('#myTree').omTree('expandAll');
         */
        expandAll:function () {
            var g = this, p = this.options;
            $(".roots_close", g.tree).click();
        },
        /**
         *@name   juiceTree#onLoad
         *@desc   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;树节点选择前触发事件。   onLoad:function (node, data) { }
         *@event
         * @param node,data
         * node - 树节点对象
         * data - 树节点的数据
         *@example   <b>示例:</b> <br>
         *          onLoad:function (node, data)
         *          {
         *              ...
         *          };
         */
        onLoad:function (node, data) {
            if (!data) return;
            this.loading.hide();
            this.append(node, data);
            if (node) {
                node.isLoaded = true;
            }
            this.trigger('success', [data]);
        },
        onError:function (textStatus, errorThrown) {
            try {
                g.loading.hide();
                g.trigger('error', [XMLHttpRequest, textStatus, errorThrown]);
            }
            catch (e) {

            }
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求服务器,加载数据。
         * @name  juiceTree#loadData
         * @function
         * @param node,url,param
         * node - 树节点对象
         * url - 数据源url
         */
        loadData:function (node, url, param) {
            var g = this, p = this.options;
            p.url = url;
            g.loading.show();
            var ajaxtype = param ? "post" : "get";
            param = param || [];
//            p.params = param;
            if(g.initParams){
                g.initParams(p,node);
            }
            p.param = p.param||{};
            $.extend(p.param,node);
            //请求服务器
            $.jui.loadData(g, node);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;清空当前对象。
         * @name  juiceTree#clear
         * @function
         */
        clear:function () {
            var g = this, p = this.options;
            //g.tree.html("");
            $("> li", g.tree).each(function () {
                g.remove(this);
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;获取节点Dom属性。
         * @name  juiceTree#getNodeDom
         * @function
         * @param [nodeParm] 节点所属类型
         * @return nodeParm
         */
        getNodeDom:function (nodeParm) {
            var g = this, p = this.options;
            if (nodeParm == null) return nodeParm;
            if (typeof (nodeParm) == "string" || typeof (nodeParm) == "number") {
                return $("li[treedataindex=" + nodeParm + "]", g.tree).get(0);
            }
            else if (typeof (nodeParm) == "object" && 'treedataindex' in nodeParm) //nodedata
            {
                return g.getNodeDom(nodeParm['treedataindex']);
            }
            return nodeParm;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除树节点。
         * @name  juiceTree#remove
         * @function
         * @param [treeNode] 树节点
         */
        remove:function (treeNode) {
            var g = this, p = this.options;
            treeNode = g.getNodeDom(treeNode);
            var treedataindex = parseInt($(treeNode).attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            if (treenodedata) g._setTreeDataStatus([treenodedata], 'delete');
            var parentNode = g.getParentTreeItem(treeNode);
            //复选框处理
            if (p.checkbox) {
                g._setParentCheckboxStatus($(treeNode));
            }
            $(treeNode).remove();
            g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
        },
        _updateStyle:function (ul) {
            var g = this, p = this.options;
            var itmes = $(" > li", ul);
            var treeitemlength = itmes.length;
            if (!treeitemlength) return;
            //遍历设置子节点的样式
            itmes.each(function (i, item) {
                if (i == 0 && !$(this).hasClass("l-first"))
                    $(this).addClass("l-first");
                if (i == treeitemlength - 1 && !$(this).hasClass("l-last"))
                    $(this).addClass("l-last");
                if (i == 0 && i == treeitemlength - 1)
                    $(this).addClass("l-onlychild");
                $("> div .center_docu,> div .bottom_docu", this)
                    .removeClass("center_docu bottom_docu")
                    .addClass(i == treeitemlength - 1 ? "bottom_docu" : "center_docu");
                g._setTreeItem(this, { isLast:i == treeitemlength - 1 });
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更改树节点数据。
         * @name  juiceTree#update
         * @function
         * @param   domnode, newnodedata
         *   &nbsp;&nbsp;&nbsp; domnode - 原始节点数据；
         *   &nbsp;&nbsp;&nbsp; newnodedata - 更改后节点数据；
         */
        //@param [domnode] dom节点(li)、节点数据 或者节点 dataindex
        update:function (domnode, newnodedata) {
            var g = this, p = this.options;
            domnode = g.getNodeDom(domnode);
            var treedataindex = parseInt($(domnode).attr("treedataindex"));
            nodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            var children = $(".l-selected span", domnode).children();
            for (var attr in newnodedata) {
                nodedata[attr] = newnodedata[attr];
                if (attr == p.textFieldName) {
                    $(".l-selected span", domnode).html("").append(children).append(newnodedata[attr]);
                }
            }
        },

        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;增加节点集合。
         * @name  juiceTree#append
         * @function
         * @param [newdata] 数据集合 Array
         * @param [parentNode] dom节点(li)、节点数据 或者节点 dataindex
         * @param [nearNode] 附加到节点的上方/下方(非必填)
         * @param [isAfter] 附加到节点的下方(非必填)
         */
        append:function (parentNode, newdata, nearNode, isAfter) {
            var g = this, p = this.options;

            parentNode = g.getNodeDom(parentNode);
            if (g.trigger('beforeAppend', [parentNode, newdata]) == false) return false;
            if (!newdata || !newdata.length) return false;
            if (p.idFieldName && p.parentIDFieldName)
                newdata = g.arrayToTree(newdata, p.idFieldName, p.parentIDFieldName);
            g._addTreeDataIndexToData(newdata);
            g._setTreeDataStatus(newdata, 'add');
            if (nearNode != null) {
                nearNode = g.getNodeDom(nearNode);
            }
            g.trigger('append', [parentNode, newdata])
            g._appendData(parentNode, newdata);
            if (parentNode == null)//增加到根节点
            {
                var gridhtmlarr = g._getTreeHTMLByData(newdata, 1, [], false);
                gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
                if (nearNode != null) {
                    $(nearNode)[isAfter ? 'after' : 'before'](gridhtmlarr.join(''));
                    g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
                }
                else {
                    //remove last node class
                    if ($("> li:last", g.tree).length > 0)
                        g._setTreeItem($("> li:last", g.tree)[0], { isLast:false });
                    g.tree.append(gridhtmlarr.join(''));
                }
                $(".l-body", g.tree).hover(function () {
                    $(this).addClass("l-over");
                }, function () {
                    $(this).removeClass("l-over");
                });

                g._upadteTreeWidth();
                g.trigger('afterAppend', [parentNode, newdata]);
                return;
            }
            var treeitem = $(parentNode);
            var outlineLevel = parseInt(treeitem.attr("outlinelevel"));

            var hasChildren = $("> ul", treeitem).length > 0;
            if (!hasChildren) {
                if(treeitem.hasClass("l-last")){
                    treeitem.append("<ul class='l-children'></ul>");
                }else{
                    treeitem.append("<ul class='l-children l-line'></ul>");
                }
                //设置为父节点
                g.upgrade(parentNode);
            }
            var isLast = [];
            for (var i = 1; i <= outlineLevel - 1; i++) {
                var currentParentTreeItem = $(g.getParentTreeItem(parentNode, i));
                isLast.push(currentParentTreeItem.hasClass("l-last"));
            }
            isLast.push(treeitem.hasClass("l-last"));
            var gridhtmlarr = g._getTreeHTMLByData(newdata, outlineLevel + 1, isLast, true);
            gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
            if (nearNode != null) {
                $(nearNode)[isAfter ? 'after' : 'before'](gridhtmlarr.join(''));
                g._updateStyle(parentNode ? $("ul:first", parentNode) : g.tree);
            }
            else {
                //remove last node class
                if ($("> .l-children > li:last", treeitem).length > 0)
                    g._setTreeItem($("> .l-children > li:last", treeitem)[0], { isLast:false });
                $(">.l-children", parentNode).append(gridhtmlarr.join(''));
            }
            g._upadteTreeWidth();
            $(">.l-children .l-body", parentNode).hover(function () {
                $(this).addClass("l-over");
            }, function () {
                $(this).removeClass("l-over");
            });
            g.trigger('afterAppend', [parentNode, newdata]);
        },
        _getDataLength:function(parent,datas,length,l){
            var g = this,p=this.options;
            var maxlevel = g.maxOutlineLevel;
            length = length||0;

            $(datas).each(function(i,item){
                if(item.text){
                    var strLength = item.text.replace(/[^\x00-\xff]/g, '__').length;
                    if(length<strLength){
                        length = strLength;
                    }
                }
                if(parent){
                    item.level = parent.level+1;
                }else{
                    item.level = 1;
                }
                if(item.children){
                    length = g._getDataLength(item,item.children,length);
                }
            });
            return length;
        },

        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消选择对象。
         * @name  juiceTree#cancelSelect
         * @function
         * @param [nodeParm] dom节点(li)、节点数据 或者节点 dataindex
         */
        cancelSelect:function (nodeParm) {
            var g = this, p = this.options;
            var domNode = g.getNodeDom(nodeParm);
            var treeitem = $(domNode);
            var treedataindex = parseInt(treeitem.attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            var treeitembody = $(">div:first", treeitem);
            if (p.checkbox)
                $(".l-checkbox", treeitembody).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
            else
                treeitembody.find("a:first").removeClass("l-selected");
            g.trigger('cancelSelect', [
                { data:treenodedata, target:treeitem[0]}
            ]);
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择节点。
         * @name  juiceTree#selectNode
         * @function
         * @param [selectNodeParm] 条件函数、Dom节点或ID值
         */
        //选择节点(参数：条件函数、Dom节点或ID值)
        selectNode:function (selectNodeParm) {
            var g = this, p = this.options;
            var clause = null;
            if (typeof (selectNodeParm) == "function") {
                clause = selectNodeParm;
            }
            else if (typeof (selectNodeParm) == "object") {
                var treeitem = $(selectNodeParm);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                var treeitembody = $(">div:first", treeitem);
                if (p.checkbox)
                    $(".l-checkbox", treeitembody).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
                else
                    treeitembody.find("a:first").addClass("l-selected");

                g.trigger('select', [
                    { data:treenodedata, target:treeitem[0]}
                ]);
                return;
            }
            else {
                /**
                 * @ignore
                 */
                clause = function (data) {
                    if (!data[p.idFieldName]) return false;
                    return data[p.idFieldName].toString() == selectNodeParm.toString();
                };
            }
            $("li", g.tree).each(function () {
                var treeitem = $(this);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                if (clause(treenodedata, treedataindex)) {
                    g.selectNode(this);
                }
                else {
                    g.cancelSelect(this);
                }
            });
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过id来获取文本内容。
         * @name  juiceTree#getTextByID
         * @function
         * @param [id]  id值。
         */
        getTextByID:function (id) {
            var g = this, p = this.options;
            var data = g.getDataByID(id);
            if (!data) return null;
            return data[p.textFieldName];
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过id来获取相应数据。
         * @name  juiceTree#getDataByID
         * @function
         * @param [id]  id值。
         */
        getDataByID:function (id) {
            var g = this, p = this.options;
            var data = null;
            $("li", g.tree).each(function () {
                if (data) return;
                var treeitem = $(this);
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                if (treenodedata[p.idFieldName].toString() == id.toString()) {
                    data = treenodedata;
                }
            });
            return data;
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;将ID、ParentID这种数据格式转换为树格式。
         * @name  juiceTree#arrayToTree
         * @function
         * @param [data]  数据。
         * @param [id]  当前节点id值。
         * @param [pid]  父节点id。
         */
        arrayToTree:function (data, id, pid)
        {
            if (!data || !data.length) return [];
            var targetData = [];                    //存储数据的容器(返回)
            var records = {};
            var itemLength = data.length;           //数据集合的个数
            for (var i = 0; i < itemLength; i++) {
                var o = data[i];
                records[o[id]] = o;
            }
            for (var i = 0; i < itemLength; i++) {
                var currentData = data[i];
                var parentData = records[currentData[pid]];
                if (!parentData) {
                    targetData.push(currentData);
                    continue;
                }
                parentData.children = parentData.children || [];
                parentData.children.push(currentData);
                if(parentData.ischecked&&!currentData.ischecked){
                    parentData.halfchecked = true;
                }
            }
            return targetData;
        },
        //根据数据索引获取数据
        _getDataNodeByTreeDataIndex:function (data, treedataindex) {
            var g = this, p = this.options;
            data = data||g.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].treedataindex == treedataindex)
                    return data[i];
                if (data[i].children) {
                    var targetData = g._getDataNodeByTreeDataIndex(data[i].children, treedataindex);
                    if (targetData) return targetData;
                }
            }
            return null;
        },
        //设置数据状态
        _setTreeDataStatus:function (data, status) {
            var g = this, p = this.options;
            $(data).each(function () {
                this[p.statusName] = status;
                if (this.children) {
                    g._setTreeDataStatus(this.children, status);
                }
            });
        },
        //设置data 索引
        _addTreeDataIndexToData:function (data) {
            var g = this, p = this.options;
            $(data).each(function () {
                if (this.treedataindex != undefined) return;
                this.treedataindex = g.treedataindex++;
                if (this.children) {
                    g._addTreeDataIndexToData(this.children);
                }
            });
        },
        _addToNodes:function (data) {
            var g = this, p = this.options;
            g.nodes = g.nodes || [];
            if ($.inArray(data, g.nodes) == -1)
                g.nodes.push(data);
            if (data.children) {
                $(data.children).each(function (i, item) {
                    g._addToNodes(item);
                });
            }
        },
        //添加项到g.data
        _appendData:function (treeNode, data) {
            var g = this, p = this.options;

            var treedataindex = parseInt($(treeNode).attr("treedataindex"));
            var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            if (g.treedataindex == undefined) g.treedataindex = 0;
            if (treenodedata && treenodedata.children == undefined) treenodedata.children = [];
            $(data).each(function (i, item) {
                if (treenodedata)
                    treenodedata.children[treenodedata.children.length] = item;
                else
                    g.data[g.data.length] = item;
                g._addToNodes(item);
            });
        },
        _setTreeItem:function (treeNode, options) {
            var g = this, p = this.options;
            if (!options) return;
            treeNode = g.getNodeDom(treeNode);
            var treeItem = $(treeNode);
            var outlineLevel = parseInt(treeItem.attr("outlinelevel"));
            if (options.isLast != undefined) {
                if (options.isLast == true) {
                    treeItem.removeClass("l-last").addClass("l-last");
                    $("> div .center_docu", treeItem).removeClass("center_docu").addClass("bottom_docu");
                    $(">.l-children", treeItem)
                        .removeClass("l-line");
                }
                else if (options.isLast == false) {
                    treeItem.removeClass("l-last");
                    $("> div .bottom_docu", treeItem).removeClass("bottom_docu").addClass("center_docu");
                    $(">.l-children", treeItem)
                        .removeClass("l-line")
                        .addClass("l-line");
                }
            }
        },
        _upadteTreeWidth:function () {
            var g = this, p = this.options;
            var treeWidth = g.maxOutlineLevel * 22;
            if (p.checkbox) treeWidth += 22;
            if (p.parentIcon || p.childIcon) treeWidth += 22;
            p.nodeWidth = g._getDataLength(null,g.data);
            treeWidth += p.nodeWidth;
//            g.tree.width(treeWidth);
        },
        _getChildNodeClassName:function () {
            var g = this, p = this.options;
            return 'l-tree-icon-' + p.childIcon;
        },
        _getParentNodeClassName:function (isOpen) {
            var g = this, p = this.options;
            var nodeclassname = 'l-tree-icon-' + p.parentIcon;
            if (isOpen) nodeclassname += '-open';
            return nodeclassname;
        },
        //根据data生成最终完整的tree html
        _getTreeHTMLByData:function (data, outlineLevel, isLast, isExpand,isLastUl) {
            var g = this, p = this.options;
            if (g.maxOutlineLevel < outlineLevel)
                g.maxOutlineLevel = outlineLevel;
            isLast = isLast || [];
            outlineLevel = outlineLevel || 1;
            var treehtmlarr = [];
            var ulStr = "<ul class='l-children";
            if(!isLastUl){ulStr += " l-line"; }
            if(!isExpand){ulStr +="' style='display:none"; }
            ulStr +=" '>";
            treehtmlarr.push(ulStr);
            for (var i = 0; i < data.length; i++) {
                var isFirst = i == 0;
                var isLastCurrent = i == data.length - 1;
                var isExpandCurrent = true;
                var o = data[i];
                var strLength = o.text.replace(/[^\x00-\xff]/g, '__').length;
                if (!o.isexpand || o.isexpand == false || o.isexpand == "false") isExpandCurrent = false;

                treehtmlarr.push('<li ');
                if (o.treedataindex != undefined)
                    treehtmlarr.push('treedataindex="' + o.treedataindex + '" ');
                if (isExpandCurrent)
                    treehtmlarr.push('isexpand=' + o.isexpand + ' ');
                treehtmlarr.push('outlinelevel=' + outlineLevel + ' ');
                //增加属性支持
                for (var j = 0; j < g.sysAttribute.length; j++) {
                    if ($(this).attr(g.sysAttribute[j]))
                        data[dataindex][g.sysAttribute[j]] = $(this).attr(g.sysAttribute[j]);
                }
                for (var j = 0; j < p.attribute.length; j++) {
                    if (o[p.attribute[j]])
                        treehtmlarr.push(p.attribute[j] + '="' + o[p.attribute[j]] + '" ');
                }

                //css class
                treehtmlarr.push('class="');
                isFirst && treehtmlarr.push('l-first ');
                isLastCurrent && treehtmlarr.push('l-last ');
                isFirst && isLastCurrent && treehtmlarr.push('l-onlychild ');
                treehtmlarr.push('"');
                treehtmlarr.push('>');
                treehtmlarr.push("<div class='l-body'>");
                if (g.hasChildren(o)) {
                    var openClass = isLastCurrent?"root_open":"roots_open";
                    var closeClass = isLastCurrent?"root_close":"roots_close";
                    //if (isExpandCurrent)treehtmlarr.push("<button type='button'  title='' class='switch btnbox "+openClass+"'></button>");
                    if (isExpandCurrent)treehtmlarr.push('<i class="icon-folder switch ace-icon tree-minus '+openClass+'"></i>');
                    else treehtmlarr.push('<i class="icon-folder switch tree-plus ace-icon '+closeClass+'"></i>');
                    //else treehtmlarr.push("<button type='button'  title='' class='switch btnbox "+closeClass+"'></button>");
                } else {
                    if(isLastCurrent)treehtmlarr.push('<button  class="lineBtn btnbox bottom_docu"  type="button" />');
                    else treehtmlarr.push('<button type="button"  class="lineBtn btnbox center_docu"  type="button" />');
                }
                //添加 checkbox
                if (p.checkbox) {
                    if(o.halfchecked)
                        treehtmlarr.push('<button type="button"  class="l-box l-checkbox l-checkbox-incomplete"></button>');
                    else if (o.ischecked)
                        treehtmlarr.push('<button type="button"  class="l-box l-checkbox l-checkbox-checked"></button>');
                    else
                        treehtmlarr.push('<button type="button"  class="l-box l-checkbox l-checkbox-unchecked"></button>');
                }
                treehtmlarr.push('<a class="node-text" title="'+ o[p.textFieldName]+'">');
                treehtmlarr.push('<span>') ;
                if (g.hasChildren(o)) {
                    if (p.parentIcon) {

                        //node icon
                        if (isExpandCurrent) {
//                            treehtmlarr.push('<button  class="ico_open" id="treeDemo_1_ico" type="button" />');
                            treehtmlarr.push('<button type="button"  class="ico_open btnbox ');
                            treehtmlarr.push(g._getParentNodeClassName(p.parentIcon ? true : false) + " ");
                            if (p.iconFieldName && o[p.iconFieldName])
                                treehtmlarr.push('l-tree-icon-none');
                            treehtmlarr.push('">');
                            if (p.iconFieldName && o[p.iconFieldName])
                                treehtmlarr.push('<img src="' + o[p.iconFieldName] + '" />');
                            treehtmlarr.push('</button>');
                        } else {
//                            treehtmlarr.push('<button  class="ico_close" id="treeDemo_1_ico" type="button" />');
                            treehtmlarr.push('<button type="button"  class="ico_close btnbox ');
                            treehtmlarr.push(g._getParentNodeClassName(p.parentIcon ? true : false) + " ");
                            if (p.iconFieldName && o[p.iconFieldName])
                                treehtmlarr.push('l-tree-icon-none');
                            treehtmlarr.push('">');
                            if (p.iconFieldName && o[p.iconFieldName])
                                treehtmlarr.push('<img src="' + o[p.iconFieldName] + '" />');
                            treehtmlarr.push('</button>');
                        }
                    }
                }
                else {
                    if (p.childIcon) {
                        //node icon
//                        treehtmlarr.push('<button  class="l-box l-tree-icon-leaf"  type="button" />');
                        treehtmlarr.push('<button class="l-box  ');
                        treehtmlarr.push(g._getChildNodeClassName() + " ");
                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('l-tree-icon-none');
                        treehtmlarr.push('">');
                        if (p.iconFieldName && o[p.iconFieldName])
                            treehtmlarr.push('<img src="' + o[p.iconFieldName] + '" />');
                        treehtmlarr.push('</button>');
                    }
                }
                treehtmlarr.push(o[p.textFieldName] + '</span></a>');
                treehtmlarr.push('</div>');
                if (g.hasChildren(o)) {
                    var isLastNew = [];
                    for (var k = 0; k < isLast.length; k++) {
                        isLastNew.push(isLast[k]);
                    }
                    isLastNew.push(isLastCurrent);
                    if (o.children) {
                        treehtmlarr.push(g._getTreeHTMLByData(o.children, outlineLevel + 1, isLastNew, isExpandCurrent,isLastCurrent).join(""));
                    }
                }
                treehtmlarr.push('</li>');
            }
            treehtmlarr.push("</ul>");
            return treehtmlarr;

        },
        //根据简洁的html获取data
        _getDataByTreeHTML:function (treeDom) {
            var g = this, p = this.options;
            var data = [];
            $("> li", treeDom).each(function (i, item) {
                var dataindex = data.length;
                data[dataindex] =
                {
                    treedataindex:g.treedataindex++
                };
                data[dataindex][p.textFieldName] = $("> span,> a", this).html();
                for (var j = 0; j < g.sysAttribute.length; j++) {
                    if ($(this).attr(g.sysAttribute[j]))
                        data[dataindex][g.sysAttribute[j]] = $(this).attr(g.sysAttribute[j]);
                }
                for (var j = 0; j < p.attribute.length; j++) {
                    if ($(this).attr(p.attribute[j]))
                        data[dataindex][p.attribute[j]] = $(this).attr(p.attribute[j]);
                }
                if ($("> ul", this).length > 0) {
                    data[dataindex].children = g._getDataByTreeHTML($("> ul", this));
                }
            });
            return data;
        },
        _getNodeStyle:function(node){

        },
        _applyTree:function () {
            var g = this, p = this.options;
            g.data = g._getDataByTreeHTML(g.tree);
            var gridhtmlarr = g._getTreeHTMLByData(g.data, 1, [], true);
            gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
            g.tree.html(gridhtmlarr.join(''));
            g._upadteTreeWidth();
            $(".l-body", g.tree).hover(function () {
                $(this).addClass("l-over");
            }, function () {
                $(this).removeClass("l-over");
            });
        },
        _applyTreeEven:function (treeNode) {
            var g = this, p = this.options;
            $("> .l-body", treeNode).hover(function () {
                $(this).addClass("l-over");
            }, function () {
                $(this).removeClass("l-over");
            });
        },
        _getSrcElementByEvent:function (e) {
            var g = this;
            var obj = (e.target || e.srcElement);
            var tag = obj.tagName.toLowerCase();
            var jobjs = $(obj).parents().add(obj);
            var fn = function (parm) {
                for (var i = jobjs.length - 1; i >= 0; i--) {
                    if ($(jobjs[i]).hasClass(parm)) return jobjs[i];
                }
                return null;
            };
            if (jobjs.index(this.element) == -1) return { out:true };
            var r = {
                tree:fn("l-tree"),
                node:fn("l-body"),
                checkbox:fn("l-checkbox"),
                icon:fn("l-tree-icon"),
                text:tag == "span"
            };
            if (r.node) {
                var treedataindex = parseInt($(r.node).parent().attr("treedataindex"));
                r.data = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
            }
            return r;
        },
        _setTreeEven:function () {
            var g = this, p = this.options;
            if (g.hasBind('contextmenu')) {
                g.tree.bind("contextmenu", function (e) {
                    var obj = (e.target || e.srcElement);
                    var treeitem = null;
                    if ( obj.tagName.toLowerCase() == "span")
                        treeitem = $(obj).parent().parent().parent();
                    else if ($(obj).hasClass("switch")||$(obj).hasClass("l-checkbox")){
                        treeitem = $(obj).parent().parent();
                    }else if($(obj).has("l-body")){
                        treeitem = $(obj).parent();
                    }
                    else if( obj.tagName.toLowerCase() == "li")
                        treeitem = $(obj);
                    if (!treeitem) return;
                    var treedataindex = parseInt(treeitem.attr("treedataindex"));
                    var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                    return g.trigger('contextmenu', [
                        { data:treenodedata, target:treeitem[0] },
                        e
                    ]);
                });
            }
            g.tree.click(function (e) {
                var obj = (e.target || e.srcElement);
                $(obj).blur();
                var treeitem = null;
                if ( obj.tagName.toLowerCase() == "span")
                    treeitem = $(obj).parent().parent().parent();
                else if ($(obj).hasClass("switch")||$(obj).hasClass("l-checkbox")){
                    treeitem = $(obj).parent().parent();
                }
                if (!treeitem) return;
                var treedataindex = parseInt(treeitem.attr("treedataindex"));
                var treenodedata = g._getDataNodeByTreeDataIndex(g.data, treedataindex);
                var treeitembtn = $("i.switch:first", treeitem);
                var clickOnTreeItemBtn = $(obj).hasClass("roots_open") || $(obj).hasClass("roots_close")|| $(obj).hasClass("root_open") || $(obj).hasClass("root_close");
                if (!$(obj).hasClass("l-checkbox") && !clickOnTreeItemBtn) {
                    if ($("a:first", treeitem).hasClass("l-selected")) {
                        if (g.trigger('beforeCancelSelect', [
                            { data:treenodedata, target:treeitem[0]}
                        ]) == false)
                            return false;

                        $("a:first", treeitem).removeClass("l-selected");
                        g.trigger('cancelSelect', [
                            { data:treenodedata, target:treeitem[0]}
                        ]);
                    }
                    else {
                        if (g.trigger('beforeSelect', [
                            { data:treenodedata, target:treeitem[0]}
                        ]) == false)
                            return false;
                        $("a", g.tree).removeClass("l-selected");
                        $("a:first", treeitem).addClass("l-selected");
                        g.trigger('select', [
                            { data:treenodedata, target:treeitem[0]}
                        ])
                    }
                }
                //chekcbox even
                if ($(obj).hasClass("l-checkbox")) {
                    if (p.autoCheckboxEven) {
                        //状态：未选中
                        if ($(obj).hasClass("l-checkbox-unchecked")) {
                            $(obj).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
                            $(".l-children .l-checkbox", treeitem)
                                .removeClass("l-checkbox-incomplete l-checkbox-unchecked")
                                .addClass("l-checkbox-checked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                true
                            ]);
                        }
                        //状态：选中
                        else if ($(obj).hasClass("l-checkbox-checked")) {
                            $(obj).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                            $(".l-children .l-checkbox", treeitem)
                                .removeClass("l-checkbox-incomplete l-checkbox-checked")
                                .addClass("l-checkbox-unchecked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                false
                            ]);
                        }
                        //状态：未完全选中
                        else if ($(obj).hasClass("l-checkbox-incomplete")) {
                            $(obj).removeClass("l-checkbox-incomplete").addClass("l-checkbox-checked");
                            $(".l-children .l-checkbox", treeitem)
                                .removeClass("l-checkbox-incomplete l-checkbox-unchecked")
                                .addClass("l-checkbox-checked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                true
                            ]);
                        }
                        g._setParentCheckboxStatus(treeitem);
                    }
                    else {
                        //状态：未选中
                        if ($(obj).hasClass("l-checkbox-unchecked")) {
                            $(obj).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
                            //是否单选
                            if (p.single) {
                                $(".l-checkbox", g.tree).not(obj).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                            }
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                true
                            ]);
                        }
                        //状态：选中
                        else if ($(obj).hasClass("l-checkbox-checked")) {
                            $(obj).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                            g.trigger('check', [
                                { data:treenodedata, target:treeitem[0] },
                                false
                            ]);
                        }
                    }
                }

                //状态：已经张开
                else if ((treeitembtn.hasClass("roots_open")||treeitembtn.hasClass("root_open")) && (!p.btnClickToToggleOnly || clickOnTreeItemBtn)) {
                    if (g.trigger('beforeCollapse', [
                        { data:treenodedata, target:treeitem[0]}
                    ]) == false)
                        return false;
                    if(treeitembtn.hasClass("roots_open"))treeitembtn.removeClass("roots_open").addClass("roots_close").removeClass("tree-minus").addClass("tree-plus");;
                    if(treeitembtn.hasClass("root_open"))treeitembtn.removeClass("root_open").addClass("root_close").removeClass("tree-minus").addClass("tree-plus");;
                    treeitembtn.parent().find(".ico_open:first").removeClass("ico_open").addClass("ico_close");
                    if (p.slide)
                        $("> .l-children", treeitem).slideToggle('fast');
                    else
                        $("> .l-children", treeitem).toggle();
                    $("> a ." + g._getParentNodeClassName(true), treeitem)
                        .removeClass(g._getParentNodeClassName(true))
                        .addClass(g._getParentNodeClassName());
                    g.trigger('collapse', [
                        { data:treenodedata, target:treeitem[0]}
                    ]);
                }
                //状态：没有张开
                else if ((treeitembtn.hasClass("roots_close")||treeitembtn.hasClass("root_close")) && (!p.btnClickToToggleOnly || clickOnTreeItemBtn)) {
                    if (g.trigger('beforeExpand', [
                        { data:treenodedata, target:treeitem[0]}
                    ]) == false)
                        return false;
                    if( treeitembtn.hasClass("root_close"))treeitembtn.removeClass("root_close").
                    addClass("root_open").removeClass("tree-plus").addClass("tree-minus");
                    if( treeitembtn.hasClass("roots_close"))treeitembtn.removeClass("roots_close").addClass("roots_open").removeClass("tree-plus").addClass("tree-minus");
                    treeitembtn.parent().find(".ico_close:first").removeClass("ico_close").addClass("ico_open");
                    var callback = function () {
                        g.trigger('expand', [
                            { data:treenodedata, target:treeitem[0]}
                        ]);
                    };
//
                    if (!treenodedata.isLoaded && p.url) {
                        $("> .l-children", treeitem).toggle();
                        callback();
                        g.loadData(treenodedata, p.url, treenodedata);
                    } else if (p.slide) {
                        $("> .l-children", treeitem).slideToggle('fast', callback);
                    }
                    else {
                        $("> .l-children", treeitem).toggle();
                        callback();
                    }
                    $("> div ." + g._getParentNodeClassName(), treeitem)
                        .removeClass(g._getParentNodeClassName())
                        .addClass(g._getParentNodeClassName(true));
                }
                g.trigger('click', [
                    { data:treenodedata, target:treeitem[0]}
                ]);
            });

            //节点拖拽支持
            if ($.fn.juiceDrag && p.nodeDraggable) {
                g.nodeDroptip = $("<div class='l-drag-nodedroptip' style='display:none'></div>").appendTo('body');
                g.tree.juiceDrag({ revert:true, animate:false,
                    proxyX:20, proxyY:20,
                    proxy:function (draggable, e) {
                        var src = g._getSrcElementByEvent(e);
                        if (src.node) {
                            var content = "dragging";
                            if (p.nodeDraggingRender) {
                                content = p.nodeDraggingRender(draggable.draggingNodes, draggable, g);
                            }
                            else {
                                content = "";
                                var appended = false;
                                for (var i in draggable.draggingNodes) {
                                    var node = draggable.draggingNodes[i];
                                    if (appended) content += ",";
                                    content += node.text;
                                    appended = true;
                                }
                            }
                            var proxy = $("<div class='l-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div>" + content + "</div>").appendTo('body');
                            return proxy;
                        }
                    },
                    onRevert:function () {
                        return false;
                    },
                    onRendered:function () {
                        this.set('cursor', 'default');
                        g.children[this.id] = this;
                    },
                    onStartDrag:function (current, e) {
                        if (e.button == 2) return false;
                        this.set('cursor', 'default');
                        var src = g._getSrcElementByEvent(e);
                        if (src.checkbox) return false;
                        if (p.checkbox) {
                            var checked = g.getChecked();
                            this.draggingNodes = [];
                            for (var i in checked) {
                                this.draggingNodes.push(checked[i].data);
                            }
                            if (!this.draggingNodes || !this.draggingNodes.length) return false;
                        }
                        else {
                            this.draggingNodes = [src.data];
                        }
                        this.draggingNode = src.data;
                        this.set('cursor', 'move');
                        g.nodedragging = true;
                        this.validRange = {
                            top:g.tree.offset().top,
                            bottom:g.tree.offset().top + g.tree.height(),
                            left:g.tree.offset().left,
                            right:g.tree.offset().left + g.tree.width()
                        };
                    },
                    onDrag:function (current, e) {
                        var nodedata = this.draggingNode;
                        if (!nodedata) return false;
                        var nodes = this.draggingNodes ? this.draggingNodes : [nodedata];
                        if (g.nodeDropIn == null) g.nodeDropIn = -1;
                        var pageX = e.pageX;
                        var pageY = e.pageY;
                        var visit = false;
                        var validRange = this.validRange;
                        if (pageX < validRange.left || pageX > validRange.right
                            || pageY > validRange.bottom || pageY < validRange.top) {

                            g.nodeDropIn = -1;
                            g.nodeDroptip.hide();
                            this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes l-drop-add").addClass("l-drop-no");
                            return;
                        }
                        for (var i = 0, l = g.nodes.length; i < l; i++) {
                            var nd = g.nodes[i];
                            var treedataindex = nd['treedataindex'];
                            if (nodedata['treedataindex'] == treedataindex) visit = true;
                            if ($.inArray(nd, nodes) != -1) continue;
                            var isAfter = visit ? true : false;
                            if (g.nodeDropIn != -1 && g.nodeDropIn != treedataindex) continue;
                            var jnode = $("li[treedataindex=" + treedataindex + "]", g.tree);
                            var offset = jnode.offset();
                            var range = {
                                top:offset.top,
                                bottom:offset.top + jnode.height(),
                                left:g.tree.offset().left,
                                right:g.tree.offset().left + g.tree.width()
                            };
                            if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom) {
                                var lineTop = offset.top;
                                if (isAfter) lineTop += jnode.height();
                                g.nodeDroptip.css({
                                    left:range.left,
                                    top:lineTop,
                                    width:range.right - range.left
                                }).show();
                                g.nodeDropIn = treedataindex;
                                g.nodeDropDir = isAfter ? "bottom" : "top";
                                if (pageY > range.top + 7 && pageY < range.bottom - 7) {
                                    this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-yes").addClass("l-drop-add");
                                    g.nodeDroptip.hide();
                                    g.nodeDropInParent = true;
                                }
                                else {
                                    this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-add").addClass("l-drop-yes");
                                    g.nodeDroptip.show();
                                    g.nodeDropInParent = false;
                                }
                                break;
                            }
                            else if (g.nodeDropIn != -1) {
                                g.nodeDropIn = -1;
                                g.nodeDropInParent = false;
                                g.nodeDroptip.hide();
                                this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes  l-drop-add").addClass("l-drop-no");
                            }
                        }
                    },
                    onStopDrag:function (current, e) {
                        var nodes = this.draggingNodes;
                        g.nodedragging = false;
                        if (g.nodeDropIn != -1) {
                            for (var i = 0; i < nodes.length; i++) {
                                var children = nodes[i].children;
                                if (children) {
                                    nodes = $.grep(nodes, function (node, i) {
                                        var isIn = $.inArray(node, children) == -1;
                                        return isIn;
                                    });
                                }
                            }
                            for (var i in nodes) {
                                var node = nodes[i];
                                if (g.nodeDropInParent) {
                                    g.remove(node);
                                    g.append(g.nodeDropIn, [node]);
                                }
                                else {
                                    g.remove(node);
                                    g.append(g.getParent(g.nodeDropIn), [node], g.nodeDropIn, g.nodeDropDir == "bottom")
                                }
                            }
                            g.nodeDropIn = -1;
                        }
                        g.nodeDroptip.hide();
                        this.set('cursor', 'default');
                    }
                });
            }
        },
        //递归设置父节点的状态
        _setParentCheckboxStatus:function (treeitem) {
            var g = this, p = this.options;
            //当前同级别或低级别的节点是否都选中了
            var isCheckedComplete = $(".l-checkbox-unchecked", treeitem.parent()).length == 0;
            //当前同级别或低级别的节点是否都没有选中
            var isCheckedNull = $(".l-checkbox-checked", treeitem.parent()).length == 0;
            if (isCheckedComplete) {
                treeitem.parent().parent().find(".l-checkbox")
                    .removeClass("l-checkbox-unchecked l-checkbox-incomplete")
                    .addClass("l-checkbox-checked");
            }
            else if (isCheckedNull) {
                treeitem.parent().parent().find(">div .l-checkbox")
                    .removeClass("l-checkbox-checked l-checkbox-incomplete")
                    .addClass("l-checkbox-unchecked");
            }
            else {
                treeitem.parent().parent().find(">div .l-checkbox")
                    .removeClass("l-checkbox-unchecked l-checkbox-checked")
                    .addClass("l-checkbox-incomplete");
            }
            if (treeitem.parent().parent("li").length > 0)
                g._setParentCheckboxStatus(treeitem.parent().parent("li"));
        }
    });


})(jQuery);﻿/**
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




})(jQuery);﻿/**
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
})(jQuery);﻿/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 *
 */
(function ($)
{
    /**
     * @name   juiceComboBox
     * @class   juiceComboBox是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceComboBox &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceComboBox = function (options)
    {
        return $.jui.run.call(this, "juiceComboBox", arguments);
    };

    $.fn.juiceGetComboBoxManager = function ()
    {
        return $.jui.run.call(this, "juiceGetComboBoxManager", arguments);
    };

    $.juiceDefaults.ComboBox = /**@lends juiceComboBox#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否调整大小，true为调整，false为不调整。
         * @default true
         * @type Boolean
         */
        resize: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度设置。
         * @default ""
         * @type String
         */
        width:"",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否多选，true为多选，false为不多选。
         * @default  false
         * @type Boolean
         */
        isMultiSelect: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否选择复选框。
         * @default  false
         * @type Boolean
         */
        isShowCheckBox: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表格状态。
         * @default  false
         * @type Boolean
         */
        columns: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 下拉框宽度。
         * @default  0
         * @type Number
         */
        selectBoxWidth: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 下拉框高度。
         * @default  0
         * @type Number
         */
        selectBoxHeight: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择前事件。
         * @default  false
         * @type Boolean
         */
        onBeforeSelect: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择值事件。
         * @default  null
         * @type   Object
         */
        onSelected: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 输入值。
         * @default  null
         * @type   Object
         */
        initValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 输入文本。
         * @default  ""
         * @type   String
         */
        initText: "",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 文本宽度。
         * @default  0
         * @type   Number
         */
        textWidth:0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 域值。
         * @default  id
         * @type   String
         */
        valueField: 'id',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 文本域。
         * @default  text
         * @type   String
         */
        textField: 'text',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; id值。
         * @default  null
         * @type   String
         */
        valueFieldID: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否以动画的形式显示,true为以动画显示，false则表示不以动画显示。
         * @default  false
         * @type   Boolean
         */
        slide: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 以";"分割字符串。
         * @default  false
         * @type   Boolean
         */
        split: ";",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据。
         * @default  null
         * @type   Object
         */
        data: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 下拉框以树的形式显示，tree的参数跟juiceTree的参数一致。
         * @default  null
         * @type   Object
         */
        tree: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否只选择叶子。
         * @default  null
         * @type   Object
         */
        treeLeafOnly: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 表格。
         * @default  null
         * @type   Object
         */
        grid: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; grid过滤。
         * @default  false
         * @type   Object
         */
        gridFilter:true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 类型。
         * @default  null
         * @type   Object
         */
        refType:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; id。
         * @default  null
         * @type   Object
         */
        refId:null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 开始调整窗口大小时触发事件。
         * @default  null
         * @type   Object
         */
        onStartResize: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 结束调整窗口大小时触发事件。
         * @default  null
         * @type   Object
         */
        onEndResize: null,
        hideOnLoseFocus: true,
        forceLoad: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据源URL(需返回JSON)。
         * @default  ""
         * @type   String
         */
        url: "",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 操作成功时触发事件。
         * @default  null
         * @type   Object
         */
        onSuccess: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 操作失败时触发事件。
         * @default  null
         * @type   Object
         */
        onError: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 打开下拉框前事件，可以通过return false来阻止继续操作，利用这个参数可以用来调用其他函数，比如打开一个新窗口来选择值。
         * @default  null
         * @type   Object
         */
        onBeforeOpen: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 文本框显示html函数。
         * @default  null
         * @type   Object
         */
        render: null,

        /**
         * 树节点初始化值
         * @default  ""
         * @type   String
         */
        valuePrefix:"",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择框是否在附加到body,并绝对定位。
         * @default  true
         * @type   Boolean
         */
        absolute: true,

        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 缺省值。
         */
        defaultValue: null,

        /**
         * 编辑之后
         */
        onEndEdit:null,

        onBeforeEditor:null,

        joinStr:""
    };

    //扩展方法
    $.juiceMethos.ComboBox = $.juiceMethos.ComboBox || {};


    $.jui.controls.ComboBox = function (element, options)
    {
        $.jui.controls.ComboBox.base.constructor.call(this, element, options);
    };
    $.jui.controls.ComboBox.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'ComboBox';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.ComboBox;
        },

        _init: function ()
        {
            $.jui.controls.ComboBox.base._init.call(this);
            var p = this.options;
            this._copyProperty(p,$(this.element));
            p.width = p.textWidth ||p.width;
            //弹出树
            if(p.refType=="tree"&&p.refId){
                var tree = {};
                $.extend(tree,$.juiceDefaults.Tree,this.options.tree);
                this._copyProperty(tree,$("#" + p.refId));
                this.options.tree =tree;
            }
            //弹出grid
            if(p.refType=="grid"&&p.refId){
                var grid = {};
                $.extend(grid,$.juiceDefaults.Grid,this.options.grid);
                $.jui.controls.Grid.createParams(grid,$("#" + p.refId));
                this.options.grid = grid;
            }
            //自定义宽度
            if (p.columns)
            {
                p.isShowCheckBox = true;
            }
            if (p.isMultiSelect)
            {
                p.isShowCheckBox = true;
            }
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.data = p.data;
            g.inputText = null;
            g.select = null;
            g.textFieldID = "";
            g.valueFieldID = "";
            g.valueField = null; //隐藏域(保存值)
            //文本框初始化
            if (this.element.tagName.toLowerCase() == "input")
            {
//                this.element.readOnly = true;
                g.inputText = $(this.element);
                g.textFieldID = this.element.id;
            }
            else if (this.element.tagName.toLowerCase() == "select")
            {
                $(this.element).hide();
                g.select = $(this.element);
                p.isMultiSelect = false;
                p.isShowCheckBox = false;
                g.textFieldID = this.element.id + "_txt";
                g.inputText = $('<input type="text" readonly="true"/>');
                g.inputText.attr("id", g.textFieldID).insertAfter($(this.element));
            } else
            {
                //不支持其他类型
                return;
            }
            if (g.inputText[0].name == undefined) g.inputText[0].name = g.textFieldID;
            //隐藏域初始化
            g.valueField = null;
            if (p.valueFieldID)
            {
                g.valueField = $("#" + p.valueFieldID + ":input");
                if (g.valueField.length == 0) g.valueField = $('<input type="hidden"/>');
                g.valueField[0].id = g.valueField[0].name = p.valueFieldID;
            }
            else
            {
                g.valueField = $('<input type="hidden"/>');
                g.valueField[0].id = g.valueField[0].name = g.textFieldID + "_val";
            }
            if (g.valueField[0].name == undefined) g.valueField[0].name = g.valueField[0].id;
            //开关
            g.link = $('<div class="l-trigger"><div class="l-trigger-icon"></div></div>');
            //下拉框
            g.selectBox = $('<div class="l-box-select"><div class="l-box-select-inner"><table cellpadding="0" cellspacing="0" border="0" class="l-box-select-table"></table></div></div>');

            g.selectBox.table = $("table:first", g.selectBox);
            //外层
            g.wrapper = g.inputText.wrap('<div class="l-text l-text-combobox"></div>').parent();

            g.wrapper.append('<div class="l-text-l"></div><div class="l-text-r"></div>');
            g.wrapper.append(g.link);
            //添加个包裹，
            g.textwrapper = g.wrapper.wrap('<div class="l-text-wrapper"></div>').parent();

            if (p.absolute)
                g.selectBox.appendTo('body').addClass("l-box-select-absolute");
            else
                g.textwrapper.append(g.selectBox);

            g.textwrapper.append(g.valueField);
            g.inputText.addClass("l-text-field");
            if (p.isShowCheckBox && !g.select)
            {
                $("table", g.selectBox).addClass("l-table-checkbox");
            } else
            {
                p.isShowCheckBox = false;
                $("table", g.selectBox).addClass("l-table-nocheckbox");
            }
            //开关 事件
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
                if (g.trigger('beforeOpen') == false) return false;
                g._toggleSelectBox(g.selectBox.is(":visible"));
            });
            g.inputText.click(function ()
            {
                if (p.disabled) return;
                if (g.trigger('beforeOpen') == false) return false;
                g._toggleSelectBox(g.selectBox.is(":visible"));
            }).blur(function ()
            {
                if (p.disabled) return;
                g.wrapper.removeClass("l-text-focus");
                g.link.removeClass("l-trigger-hover");
            }).focus(function ()
            {
                if (p.disabled) return;
                g.wrapper.addClass("l-text-focus");
                g.link.addClass("l-trigger-hover");
            });
            g.wrapper.hover(function ()
            {
                if (p.disabled) return;
                g.wrapper.addClass("l-text-over");
                g.link.addClass("l-trigger-hover");
            }, function ()
            {
                if (p.disabled) return;
                g.wrapper.removeClass("l-text-over");
                g.link.removeClass("l-trigger-hover");
            });
            g.resizing = false;
            g.selectBox.hover(null, function (e)
            {
//                if (p.hideOnLoseFocus && g.selectBox.is(":visible") && !g.boxToggling && !g.resizing&&p.isMultiSelect)
//                {
//                    g._toggleSelectBox(true);
//                }
            });
            var itemsleng = $("tr", g.selectBox.table).length;
            if (!p.selectBoxHeight && itemsleng < 8) p.selectBoxHeight = itemsleng * 30;
            if (p.selectBoxHeight)
            {
                g.selectBox.height(p.selectBoxHeight);
            }
            //下拉框内容初始化
            g.bulidContent();

            g.set(p);

            //下拉框宽度、高度初始化
            if (p.selectBoxWidth)
            {
                g.selectBox.width(p.selectBoxWidth);
            }
            else
            {
                g.selectBox.css('width', g.wrapper.css('width'));
            }
            this. _setEvent();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除当前ComboBox。
         * @name  juiceComboBox#destroy
         * @function
         * @example   <b>示例:</b> <br>
         *  destroy: function ()
         *        {
         *            if (this.wrapper) this.wrapper.remove();
         *            if (this.selectBox) this.selectBox.remove();
         *                this.options = null;
         *            $.jui.remove(this);
         *        }
         */
        destroy: function ()
        {
            if (this.wrapper) this.wrapper.remove();
            if (this.selectBox) this.selectBox.remove();
            this.options = null;
            $.jui.remove(this);
        },
        _setDisabled: function (value)
        {
            //禁用样式
            if (value)
            {
                this.wrapper.addClass('l-text-disabled');
            } else
            {
                this.wrapper.removeClass('l-text-disabled');
            }
        },
        _setLable: function (label)
        {
            var g = this, p = this.options;
            if (label)
            {
                if (g.labelwrapper)
                {
                    g.labelwrapper.find(".l-text-label:first").html(label + ':&nbsp');
                }
                else
                {
                    g.labelwrapper = g.textwrapper.wrap('<div class="l-labeltext"></div>').parent();
                    g.labelwrapper.prepend('<div class="l-text-label" style="float:left;display:inline;">' + label + ':&nbsp</div>');
                    g.textwrapper.css('float', 'left');
                }
                if (!p.labelWidth)
                {
                    p.labelWidth = $('.l-text-label', g.labelwrapper).outerWidth();
                }
                else
                {
                    $('.l-text-label', g.labelwrapper).outerWidth(p.labelWidth);
                }
                $('.l-text-label', g.labelwrapper).width(p.labelWidth);
                $('.l-text-label', g.labelwrapper).height(g.wrapper.height());
                g.labelwrapper.append('<br style="clear:both;" />');
                if (p.labelAlign)
                {
                    $('.l-text-label', g.labelwrapper).css('text-align', p.labelAlign);
                }
                g.textwrapper.css({ display: 'inline' });
                g.labelwrapper.width(g.wrapper.outerWidth() + p.labelWidth + 2);
            }
        },
        _setWidth: function (value)
        {
            var g = this;
            if (value > 20)
            {
                g.wrapper.css({ width: value });
                g.inputText.css({ width: value});
                g.textwrapper.css({ width: value });
            }
        },
        _setHeight: function (value)
        {
            var g = this;
            if (value > 10)
            {
                g.wrapper.height(value);
                g.inputText.height(value - 2);
                g.link.height(value - 4);
                g.textwrapper.css({ width: value });
            }
        },
        _setResize: function (resize)
        {
            //调整大小支持
            if (resize && $.fn.juiceResizable)
            {
                var g = this;
                g.selectBox.juiceResizable({ handles: 'se,s,e', onStartResize: function ()
                {
                    g.resizing = true;
                    g.trigger('startResize');
                }
                    , onEndResize: function ()
                    {
                        g.resizing = false;
                        if (g.trigger('endResize') == false)
                            return false;
                    }
                });
                g.selectBox.append("<div class='l-btn-nw-drop'></div>");
            }
        },
        //查找Text,适用多选和单选
        findTextByValue: function (value)
        {
            var g = this, p = this.options;
            if (value === undefined) return "";
            var texts = "";
            var contain = function (checkvalue)
            {
                if(value==checkvalue||(!value&&!checkvalue)){
                    return true;
                }
                var targetdata = value?value.toString().split(p.split):[];
                for (var i = 0; i < targetdata.length; i++)
                {
                    if (targetdata[i] == checkvalue) return true;
                }
                return false;
            };
            $(g.data).each(function (i, item)
            {
                var val = item[p.valueField];
                var txt = item[p.textField];
                if (contain(val))
                {
                    texts += txt + p.split;
                }
            });
            if (texts.length > 0) texts = texts.substr(0, texts.length - 1);
            return texts;
        },
        //查找Value,适用多选和单选
        findValueByText: function (text)
        {
            var g = this, p = this.options;
            if (!text && text == "") return "";
            var contain = function (checkvalue)
            {
                var targetdata = text.toString().split(p.split);
                for (var i = 0; i < targetdata.length; i++)
                {
                    if (targetdata[i] == checkvalue) return true;
                }
                return false;
            };
            var values = "";
            $(g.data).each(function (i, item)
            {
                var val = item[p.valueField];
                var txt = item[p.textField];
                if (contain(txt))
                {
                    values += val + p.split;
                }
            });
            if (values.length > 0) values = values.substr(0, values.length - 1);
            return values;
        },
        removeItem: function ()
        {
        },
        insertItem: function ()
        {
        },
        addItem: function ()
        {

        },
        _setValue: function (value)
        {
            var g = this, p = this.options;
            this.initValue = value;
            var text = g.findTextByValue(value);
            if (p.tree)
            {
                g.selectValueByTree(value);
            }else if(p.grid){
                g.selectValueByGrid(value);
            }else if (!p.isMultiSelect){
                g._changeValue(value, text);
                $("tr[value=" + value?value:"" + "] td", g.selectBox).addClass("l-selected");
                $("tr[value!=" + value?value:"" + "] td", g.selectBox).removeClass("l-selected");
            } else
            {
                g._changeValue(value, text);
                var targetdata = value?value.toString().split(p.split):[];
                $("table.l-table-checkbox :checkbox", g.selectBox).each(function () { this.checked = false; });
                for (var i = 0; i < targetdata.length; i++)
                {
                    $("table.l-table-checkbox tr[value=" + targetdata[i] + "] :checkbox", g.selectBox).each(function () { this.checked = true; });
                }
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置所选值。
         * @name  juiceComboBox#selectValue
         * @param [value] 传递选中的部分的值
         * @function
         */
        selectValue: function (value)
        {
            this._setValue(value);
        },
        bulidContent: function ()
        {
            var g = this, p = this.options;
            this.clearContent();
            if (g.select)
            {
                g.setSelect();
            }
            else if (g.data&&!p.forceLoad)
            {
                g.setData(g.data);
            }
            else if (p.tree)
            {
                g.setTree(p.tree);
            }
            else if (p.grid)
            {
                g.setGrid(p.grid);
            }
            else if (p.url)
            {
                g.setUrl(p.url);
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加载数据源。
         * @name  juiceComboBox#load
         * @param [url] 数据源url
         * @param [reLoad] 重新加载
         * @function
         */
        load:function(url,reLoad){
            var g = this, p = this.options;
            if(reLoad){
                g.setUrl(url);
            }else{
                g.setData(g.data);
            }
        } ,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;封装数据源。
         * @name  juiceComboBox#setUrl
         * @param [url] 数据源url
         * @function
         */
        setUrl:function(url){
            var g = this, p = this.options;
            p.url = url;
            $.ajax({
                type: 'post',
                url: p.url,
                cache: false,
                dataType: 'json',
                success: function (data)
                {
                    if(g.dataTransform){
                        data = g.dataTransform(data,p);
                    }
                    g.data = data;
                    if(p.defaultValue){
                        g.data.reverse().push(eval("("+p.defaultValue+")"));
                        g.data.reverse();
                    }
                    g.setData(g.data);
                    g._setValue(g.initValue||p.initValue);
                    g.trigger('success', [g.data]);
                },
                error: function (XMLHttpRequest, textStatus)
                {
                    g.trigger('error', [XMLHttpRequest, textStatus]);
                }
            });
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;清空文本信息。
         * @name  juiceComboBox#clearContent
         * @function
         */
        clearContent: function ()
        {
            var g = this, p = this.options;
            $("table", g.selectBox).html("");
            //g.inputText.val("");
            //g.valueField.val("");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置所选值。
         * @name  juiceComboBox#setSelect
         * @function
         */
        setSelect: function ()
        {
            var g = this, p = this.options;
            g.data = g.data||[];
            this.clearContent();
            $('option', g.select).each(function (i)
            {
                var item = {};
                var val = $(this).val();
                var txt = $(this).html();
                var tr = $("<tr><td index='" + i + "' value='" + val + "'>" + txt + "</td>");
                $("table.l-table-nocheckbox", g.selectBox).append(tr);
                $("td", tr).hover(function ()
                {
                    $(this).addClass("l-over");
                }, function ()
                {
                    $(this).removeClass("l-over");
                });
                item[p.valueField] = val;
                item[p.textField] = txt;
                //添加值以便form加载
                g.data.push(item);
            });
            $('td:eq(' + g.select[0].selectedIndex + ')', g.selectBox).each(function ()
            {
                if ($(this).hasClass("l-selected"))
                {
                    g.selectBox.hide();
                    return;
                }
                $(".l-selected", g.selectBox).removeClass("l-selected");
                $(this).addClass("l-selected");
                if (g.select[0].selectedIndex != $(this).attr('index') && g.select[0].onchange)
                {
                    g.select[0].selectedIndex = $(this).attr('index'); g.select[0].onchange();
                }
                var newIndex = parseInt($(this).attr('index'));
                g.select[0].selectedIndex = newIndex;
                g.select.trigger("change");
                g.selectBox.hide();
                var value = $(this).attr("value");
                var text = $(this).html();
                if (p.render)
                {
                    g.inputText.val(p.render(value, text));
                }
                else
                {
                    g.inputText.val(text);
                }
            });
            g._addClickEven();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对数据data进行封装。
         * @name  juiceComboBox#setData
         * @param [data] 数据data
         * @function
         */
        setData: function (data)
        {
            var g = this, p = this.options;
            this.clearContent();
            if (!data || !data.length) return;
            if (g.data != data) g.data = data;
            if (p.columns)
            {
                g.selectBox.table.headrow = $("<tr class='l-table-headerow'><td width='18px'></td></tr>");
                g.selectBox.table.append(g.selectBox.table.headrow);
                g.selectBox.table.addClass("l-box-select-grid");
                for (var j = 0; j < p.columns.length; j++)
                {
                    var headrow = $("<td columnindex='" + j + "' columnname='" + p.columns[j].name + "'>" + p.columns[j].header + "</td>");
                    if (p.columns[j].width)
                    {
                        headrow.width(p.columns[j].width);
                    }
                    g.selectBox.table.headrow.append(headrow);

                }
            }
            for (var i = 0; i < data.length; i++)
            {
                var val = data[i][p.valueField];
                var txt = data[i][p.textField];
                if(p.joinStr&&(val!=null&&val!="")&&(txt!=null&&txt!="")){
                    txt = val + p.joinStr + txt;
                }
                if (!p.columns)
                {
                    val = val||"";
                    $("table.l-table-checkbox", g.selectBox).append("<tr value='" + val + "'><td style='width:18px;'  index='" + i + "' value='" + val + "' text='" + txt + "' ><input type='checkbox' /></td><td index='" + i + "' value='" + val + "' align='left'>" + txt + "</td>");
                    $("table.l-table-nocheckbox", g.selectBox).append("<tr value='" + val + "'><td index='" + i + "' value='" + val + "' align='left'>" + txt + "</td>");
                } else
                {
                    var tr = $("<tr value='" + val + "'><td style='width:18px;'  index='" + i + "' value='" + (val?val:"") + "' text='" + txt + "' ><input type='checkbox' /></td></tr>");
                    $("td", g.selectBox.table.headrow).each(function ()
                    {
                        var columnname = $(this).attr("columnname");
                        if (columnname)
                        {
                            var td = $("<td>" + data[i][columnname] + "</td>");
                            tr.append(td);
                        }
                    });
                    g.selectBox.table.append(tr);
                }
            }
            //自定义复选框支持
//            if (p.isShowCheckBox && $.fn.juiceCheckBox)
//            {
//                $("table input:checkbox", g.selectBox).juiceCheckBox();
//            }
            $(".l-table-checkbox input:checkbox", g.selectBox).change(function ()
            {
                if (this.checked && g.hasBind('beforeSelect'))
                {
                    var parentTD = null;
                    if ($(this).parent().get(0).tagName.toLowerCase() == "div")
                    {
                        parentTD = $(this).parent().parent();
                    } else
                    {
                        parentTD = $(this).parent();
                    }
                    if (parentTD != null && g.trigger('beforeSelect', [parentTD.attr("value"), parentTD.attr("text")]) == false)
                    {
                        g.selectBox.slideToggle("fast");
                        return false;
                    }
                }
                if (!p.isMultiSelect)
                {
                    if (this.checked)
                    {
                        $("input:checked", g.selectBox).not(this).each(function ()
                        {
                            this.checked = false;
                            $(".l-checkbox-checked", $(this).parent()).removeClass("l-checkbox-checked");
                        });
                        g.selectBox.slideToggle("fast");
                    }
                }
                g._checkboxUpdateValue();
            });
            $("table.l-table-nocheckbox td", g.selectBox).hover(function ()
            {
                $(this).addClass("l-over");
            }, function ()
            {
                $(this).removeClass("l-over");
            });
            g._addClickEven();
            //选择项初始化
            g._dataInit();
        },
        //树
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 对tree对象的相关操作。
         * @name  juiceComboBox#setTree
         * @param [tree] 一个对象
         * @function
         */
        setTree: function (tree)
        {
            var g = this, p = this.options;
            this.clearContent();
            g.selectBox.table.remove();
            if (tree.checkbox != false)
            {
                tree.onCheck = function ()
                {
                    var nodes = g.treeManager.getChecked();
                    var value = [];
                    var text = [];
                    $(nodes).each(function (i, node)
                    {
                        if (p.treeLeafOnly && node.data.children) return;
                        value.push(node.data[p.valueField]);
                        text.push(node.data[p.textField]);

                    });
                    g._changeValue(value.join(p.split), text.join(p.split));
                };
            }
            else
            {
                tree.onClick = function(node){
                    if(this.getSelected()&&(node.data.id == this.getSelected().data.id)){
                        g.selectBox.hide();
                    }
                };
                tree.onBeforeSelect = function(node){
                    var g = this;
                    if (p.treeLeafOnly && g.hasChildren(node.data)) {
                        return false;
                    }
                } ;
                tree.onSelect = function (node){
                    var value = node.data[p.valueField];
                    var text = node.data[p.textField];
                    g._changeValue(value, text);
                };
                tree.onCancelSelect = function (node)
                {
                    g._changeValue("", "");
                };
            }
            tree.onAfterAppend = function (domnode, nodedata)
            {
                if (!g.treeManager) return;
                var value = null;

                if (g.valueField.val() != "") value = g.valueField.val();
                else if (p.initValue) value = p.initValue;
                g.selectValueByTree(value);
            };
            g.tree = $("<ul></ul>");
            g.selectBox.css("overflow","auto");
            $("div:first", g.selectBox).append(g.tree);
            g.tree.juiceTree(tree);
            g.treeManager = g.tree.juiceGetTreeManager();
        },
        selectValueByTree: function (value)
        {
            var g = this, p = this.options;
            if (value != null)
            {
                var text = "";
                var valuelist = value.toString().split(p.split);
                $(valuelist).each(function (i, item)
                {
                    g.treeManager.selectNode(p.valuePrefix+item.toString());
                    text += g.treeManager.getTextByID(item);
                    if (i < valuelist.length - 1) text += p.split;
                });
                text = (text&&text!="null")?text:p.initText;

                g._changeValue(value, text);
            }
        },
        //表格
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  对Grid。进行相关操作。
         * @name  juiceComboBox#setGrid
         * @param [grid] 一个对象
         * @function
         */
        setGrid: function (grid)
        {
            var g = this, p = this.options;
            this.clearContent();
            g.selectBox.table.remove();
            g.grid = $("div:first", g.selectBox);
            grid.columnWidth = grid.columnWidth || 120;
            grid.width = "100%";
            grid.height = "100%";
            grid.heightDiff = +2;
            grid.InWindow = false;
            p.hideOnLoseFocus = false;
            if (grid.checkbox != false)
            {
                grid.onCheckAllRow =  function (checked,grid,datas)
                {
                    var value = g.getValue()? g.getValue().split(p.split):[];
                    var text = g.getLabel()? g.getLabel().split(p.split):[];
                    if(checked){
                        var rowsdata = g.gridManager.getCheckedRows();
                        $(rowsdata).each(function (i, rowdata)
                        {
                            if(value.indexOf(rowdata[p.valueField]+"")<0){
                                value.push(rowdata[p.valueField]);
                                text.push(rowdata[p.textField]);
                            }
                        });
                    }else{
                        $(datas).each(function (i, rowdata)
                        {
                            var index = value.indexOf(rowdata[p.valueField]+"");
                            if(index>=0){
                                value.splice(index,1);
                                text.splice(index,1);
                            }
                        });
                    }

                    g._changeValue(value.join(p.split), text.join(p.split));
                    g.trigger("EndEdit");
                };
                grid.onCheckRow = function (checked,rowdata) {
                    var value = g.getValue() ? g.getValue().split(p.split) : [];
                    var text = g.getLabel() ? g.getLabel().split(p.split) : [];
                    if (checked) {
                        if(value.indexOf(rowdata[p.valueField]+"")<0){
                            value.push(rowdata[p.valueField]);
                            text.push(rowdata[p.textField]);
                        }
                    }else{
                        var index = value.indexOf(rowdata[p.valueField]+"");
                        if(index>=0){
                            value.splice(index,1);
                            text.splice(index,1);
                        }
                    }
                    g._changeValue(value.join(p.split), text.join(p.split));
                    g.trigger("EndEdit");
                };
                grid.onAfterShowData = function(){
                    var rows = g.gridManager.rows;
                    var value = g.getValue() ? g.getValue().split(p.split) : [];
                    $(rows).each(function (i, rowdata)
                    {
                        var index = value.indexOf(rowdata[p.valueField]+"");
                        if(index>=0){
                            g.gridManager.select(rowdata);
                        }
                    });
                };
                //                g.gridManager.bind('CheckAllRow', onCheckRow);
//                g.gridManager.bind('CheckRow', onCheckRow);
            }
            else
            {
                grid.onSelectRow = function (rowdata, rowobj, index)
                {
                    var value = rowdata[p.valueField];
                    var text = rowdata[p.textField];
                    g._changeValue(value, text);
                    g.selectedRow = rowdata;
                    g.selectBox.hide();
                    g.trigger("EndEdit");
                };
                grid.onUnSelectRow= function (rowdata, rowobj, index)
                {
                    g._changeValue("", "");
                    g.selectBox.hide();
                    g.trigger("EndEdit");
                };
            }
            g.gridManager = g.grid.juiceGrid(grid);

            g.bind('show', function ()
            {
                if (g.gridManager)
                {
                    g.gridManager._updateFrozenWidth();
                    if(p.gridFilter){
                        g.oldValue=g.inputText.val();
                        g.gridManager.options.parms = [];
                        g.gridManager.options.parms.push({name:p.textField,value:g.inputText.val()});
                        g.gridManager.options.page=g.gridManager.options.newPage = 1;
                        g.gridManager.loadData(true);
                    }
                }
            });
            g.bind('endResize', function ()
            {
                if (g.gridManager)
                {
                    g.gridManager._updateFrozenWidth();
                    g.gridManager.setHeight(g.selectBox.height());
                }
            });
            g.oldValue="";

            //绑定输入事件
            if(p.gridFilter){
                g.inputText.bind("keyup",function(e){
                    if(e.keyCode==38||e.keyCode==40||e.keyCode==13){
                        return;
                    }
                    if(g.oldValue===g.inputText.val()){
                        return;
                    }
                    if(g.selectBox.is(":hidden")){
                        g._toggleSelectBox(false);
                    }
                    g.oldValue=g.inputText.val();
                    g.gridManager.options.parms = [];
                    g.gridManager.options.parms.push({name:p.textField,value:g.inputText.val()});
                    g.gridManager.options.page=g.gridManager.options.newPage = 1;
                    g.gridManager.loadData(true);
                });
                g.inputText.bind("keydown",function(e){
                    if(e.keyCode==40){
                        if(g.selectBox.is(":hidden")){
                            g._toggleSelectBox(false);
                        }
                    }
                });
            }
        },
        selectValueByGrid: function (value)
        {
            var g = this, p = this.options;
            if (value != null)
            {
                var text = p.initText;
                var records = g.gridManager.getData();
                $(records).each(function(i,record){
                    if(value==record[p.valueField]){
                        text = record[p.textField] ;
                    }
                });
                g._changeValue(value, text);
            }
        },
        _getValue: function ()
        {
            return $(this.valueField).val();
        },
        getValue: function ()
        {
            //获取值
            return this._getValue();
        },
        _getLabel: function ()
        {
            return $(this.element).val();
        },
        getLabel: function ()
        {
            return this._getLabel();
        },
        updateStyle: function ()
        {
            var g = this, p = this.options;
            g._dataInit();
        },
        _dataInit: function ()
        {
            var g = this, p = this.options;
            var value = null;

            if (p.initValue != null && p.initText)
            {
                g._changeValue(p.initValue, p.initText);
            }
            //根据值来初始化
            else if (p.initValue != null)
            {
                value = p.initValue;
                if (p.tree)
                {
                    if(value)
                        g.selectValueByTree(value);
                }
                else
                {
                    var text = g.findTextByValue(value);
                    g._changeValue(value, text);
                }
            }
            //根据文本来初始化
            else if (p.initText != null)
            {
                value = g.findValueByText(p.initText);
                g._changeValue(value, p.initText);
            }
            else if (g.valueField.val() != "")
            {
                value = g.valueField.val();
                if (p.tree)
                {
                    if(value)
                        g.selectValueByTree(value);
                }
                else
                {
                    var text = g.findTextByValue(value);
                    g._changeValue(value, text);
                }
            }
            if (!p.isShowCheckBox && value != null)
            {
                $("table tr", g.selectBox).find("td:first").each(function ()
                {
                    if (value == $(this).attr("value"))
                    {
                        $(this).addClass("l-selected");
                    }
                });
            }
            if (p.isShowCheckBox && value != null)
            {
                $(":checkbox", g.selectBox).each(function ()
                {
                    var parentTD = null;
                    var checkbox = $(this);
                    if (checkbox.parent().get(0).tagName.toLowerCase() == "div")
                    {
                        parentTD = checkbox.parent().parent();
                    } else
                    {
                        parentTD = checkbox.parent();
                    }
                    if (parentTD == null) return;
                    var valuearr = value.toString().split(p.split);
                    $(valuearr).each(function (i, item)
                    {
                        if (item == parentTD.attr("value"))
                        {
                            $(".l-checkbox", parentTD).addClass("l-checkbox-checked");
                            checkbox[0].checked = true;
                        }
                    });
                });
            }
        },
        _onClick:function(e){
            var obj = (e.target || e.srcElement);
            var jobjs = $(obj).parents().add(obj);
            if (jobjs.index(this.element) == -1&&jobjs.index(this.link)==-1&&jobjs.index(this.selectBox)==-1) {
                if(this.selectBox.is(":visible"))this.selectBox.hide();
            };
//            alert(this.selectBox.is(":visible"))
//
        },
        _setEvent:function(){
            var g = this;
            $(document).bind("click.combox", function (e)
            {
                g._onClick.call(g, e);
            });
            $(document).bind("keydown.combox", function (e)
            {
                if(!g.selectBox.is(":hidden")){
                    if(e.keyCode==38){
                        if( g.gridManager){
                            if(!g.gridManager.getSelected()){
                                g.gridManager.selectWithoutTrigger(0);
                            }else{
                                g.gridManager.moveSelectRow(g.gridManager.getSelected(),1);
                            }
                        }

                    }else if(e.keyCode==40){
                        if(!g.gridManager.getSelected()){
                            g.gridManager.selectWithoutTrigger(0);
                        }else{
                            g.gridManager.moveSelectRow(g.gridManager.getSelected(),-1);
                        }
                    }else if(e.keyCode==13){
                        if(g.gridManager.getSelected()) {
                            g.gridManager.select(g.gridManager.getSelected());
                        }
                    }
                }
            });
        } ,
        //设置值到 文本框和隐藏域
        _changeValue: function (newValue, newText)
        {
            var g = this, p = this.options;
            g.valueField.val(newValue);
            newText = newText||p.initText;
            if (p&&p.render)
            {
                g.inputText.val(p.render(newValue, newText));
            }
            else
            {
                g.inputText.val(newText);
            }
            g.selectedValue = newValue;
            g.selectedText = newText;
            g.inputText.trigger("change").focus();
            g.trigger('selected', [newValue, newText]);
        },
        //更新选中的值(复选框)
        _checkboxUpdateValue: function ()
        {
            var g = this, p = this.options;
            var valueStr = "";
            var textStr = "";
            $("input:checked", g.selectBox).each(function ()
            {
                var parentTD = null;
                if ($(this).parent().get(0).tagName.toLowerCase() == "div")
                {
                    parentTD = $(this).parent().parent();
                } else
                {
                    parentTD = $(this).parent();
                }
                if (!parentTD) return;
                valueStr += parentTD.attr("value") + p.split;
                textStr += parentTD.attr("text") + p.split;
            });
            if (valueStr.length > 0) valueStr = valueStr.substr(0, valueStr.length - 1);
            if (textStr.length > 0) textStr = textStr.substr(0, textStr.length - 1);
            g._changeValue(valueStr, textStr);
        },
        _addClickEven: function ()
        {
            var g = this, p = this.options;
            //选项点击
            $(".l-table-nocheckbox td", g.selectBox).click(function ()
            {
                var value = $(this).attr("value");
                var index = parseInt($(this).attr('index'));
                var text = $(this).html();
                if (g.hasBind('beforeSelect') && g.trigger('beforeSelect', [value, text]) == false)
                {
                    if (p.slide) g.selectBox.slideToggle("fast");
                    else g.selectBox.hide();
                    return false;
                }
                if ($(this).hasClass("l-selected"))
                {
                    if (p.slide) g.selectBox.slideToggle("fast");
                    else g.selectBox.hide();
                    return;
                }
                $(".l-selected", g.selectBox).removeClass("l-selected");
                $(this).addClass("l-selected");
                if (g.select)
                {
                    if (g.select[0].selectedIndex != index)
                    {
                        g.select[0].selectedIndex = index;
                        g.select.trigger("change");
                    }
                }
                if (p.slide)
                {
                    g.boxToggling = true;
                    g.selectBox.hide("fast", function ()
                    {
                        g.boxToggling = false;
                    })
                } else g.selectBox.hide();
                g._changeValue(value, text);
            });
        },
        updateSelectBoxPosition: function ()
        {
            var g = this, p = this.options;
            if (p.absolute)
            {
                g.selectBox.css({ left: g.wrapper.offset().left, top: g.wrapper.offset().top + 1 + g.wrapper.outerHeight() });
            }
            else
            {
                var topheight = g.wrapper.offset().top - $(window).scrollTop();
                var selfheight = g.selectBox.height() + textHeight + 4;
                if (topheight + selfheight > $(window).height() && topheight > selfheight)
                {
                    g.selectBox.css("marginTop", -1 * (g.selectBox.height() + textHeight + 5));
                }
            }
        },
        _toggleSelectBox: function (isHide)
        {
            var g = this, p = this.options;
            var textHeight = g.wrapper.height();
            g.boxToggling = true;
            if (isHide)
            {
                if (p.slide)
                {
                    g.selectBox.slideToggle('fast', function ()
                    {
                        g.boxToggling = false;
                    });
                }
                else
                {
                    g.selectBox.hide();
                    g.boxToggling = false;
                }
            }
            else
            {
                g.updateSelectBoxPosition();
                if (p.slide)
                {
                    g.selectBox.slideToggle('fast', function ()
                    {
                        g.boxToggling = false;
                        if (!p.isShowCheckBox && $('td.l-selected', g.selectBox).length > 0)
                        {
                            var offSet = ($('td.l-selected', g.selectBox).offset().top - g.selectBox.offset().top);
                            $(".l-box-select-inner", g.selectBox).animate({ scrollTop: offSet });
                        }
                    });
                }
                else
                {
                    g.selectBox.show();
                    g.boxToggling = false;
                    if (!g.tree && !g.grid && !p.isShowCheckBox && $('td.l-selected', g.selectBox).length > 0)
                    {
                        var offSet = ($('td.l-selected', g.selectBox).offset().top - g.selectBox.offset().top);
                        $(".l-box-select-inner", g.selectBox).animate({ scrollTop: offSet });
                    }
                    if(g.selectBox.offset().left+g.selectBox.width()>document.body.clientWidth){
                        g.selectBox.css("left",document.body.clientWidth-g.selectBox.width()-30)
                    }
//                    if(g.selectBox.offset().left+g.selectBox.width()>document.body.clientWidth){
//                        document.body.scrollTo(100,500);
//                    }
                }
            }
            g.isShowed = g.selectBox.is(":visible");
            g.trigger('toggle', [isHide]);
            g.trigger(isHide ? 'hide' : 'show');
        }
    });

    $.jui.controls.ComboBox.prototype.setValue = $.jui.controls.ComboBox.prototype.selectValue;
    //设置文本框和隐藏控件的值
    $.jui.controls.ComboBox.prototype.setInputValue = $.jui.controls.ComboBox.prototype._changeValue;


})(jQuery);﻿/**
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
})(jQuery);﻿/**
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


})(jQuery);﻿/**
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
        format: "yyyy-MM-dd HH:mm",
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


            var c_options = {
                collapse:true,
                locale:"zh-cn"
            };

            if(p.format)
                c_options.format = p.format.toUpperCase().replace(":MM", ":mm");

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


})(jQuery);﻿/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 *
 */

(function ($)
{
    /**
     * @name   juiceDialog
     * @class   juiceDialog是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceDialog &nbsp;API 注解说明</font></h3>
     */
    var l = $.jui;

    //全局事件
    $(".l-dialog-btn").on('mouseover', function ()
    {
        $(this).addClass("l-dialog-btn-over");
    }).on('mouseout', function ()
        {
            $(this).removeClass("l-dialog-btn-over");
        });
    $(".l-dialog-tc .l-dialog-close").on('mouseover', function ()
    {
        $(this).addClass("l-dialog-close-over");
    }).on('mouseout', function ()
        {
            $(this).removeClass("l-dialog-close-over");
        });


    $.juiceDialog = function ()
    {
        return l.run.call(null, "juiceDialog", arguments, { isStatic: true });
    };

    //dialog 图片文件夹的路径 预加载
    $.jui.DialogImagePath = "../../js/jui/skins/Aqua/images/win/";

    function prevImage(paths)
    {
        for (var i in paths)
        {
            $('<img />').attr('src', l.DialogImagePath + paths[i]);
        }
    }
    //prevImage(['dialog.gif', 'dialog-winbtns.gif', 'dialog-bc.gif', 'dialog-tc.gif']);

    $.juiceDefaults.Dialog = /**@lends juiceDialog#*/  {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 给dialog附加css样式。
         * @default null
         * @type Object
         */
        cls: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 给dialog附加id。
         * @default null
         * @type String
         */
        id: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 按钮集合。
         * @default null
         * @type Object
         */
        buttons: null,
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按钮显示位置 ，默认右对齐
         * @default right
         * @type String
         */
        buttonAlign:"right",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否拖动,为true表示拖动，false表示不拖动。
         * @default true
         * @type Boolean
         */
        isDrag: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度。
         * @default 360
         * @type  Number
         */
        width: 360,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度。
         * @default 80
         * @type  Number
         */
        height: 100,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 内容。
         * @default ''
         * @type  String
         */
        content: '',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 目标对象，指定它将以appendTo()的方式载入。
         * @default null
         * @type  Object
         */
        target: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 目标页url，默认以iframe的方式载入。
         * @default null
         * @type  String
         */
        url: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否以load()的方式加载目标页的内容。
         * @default false
         * @type  Boolean
         */
        load: false,
        onLoaded: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 类型 warn、success、error、question。
         * @default none
         * @type  String
         */
        type: 'none',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 位置left。
         * @default 0
         * @type  Number
         */
        left: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 位置top。
         * @default 0
         * @type  Number
         */
        top: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否模态对话框,为true时表示是，为false则不是。
         * @default true
         * @type  Boolean
         */
        modal: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 创建iframe时 作为iframe的name和id 。
         * @default null
         * @type  String
         */
        name: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否调整大小,为true时表示是，为false则不是。
         * @default false
         * @type  Boolean
         */
        isResize: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许关闭,为true时表示允许，为false则不允许。
         * @default false
         * @type  Boolean
         */
        allowClose: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 打开一个子窗口。
         * @default null
         * @type  Object
         */
        opener: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否给URL后面加上值为new Date().getTime()的参数，如果需要指定一个参数名即可。
         * @default null
         * @type  Object
         */
        timeParmName: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 回车时是否关闭dialog,为true时关闭，false时不关闭。
         * @default false
         * @type  Boolean
         */
        closeWhenEnter: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 关闭对话框时是否只是隐藏，还是销毁对话框。
         * @default true
         * @type  Boolean
         */
        isHidden: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 初始化时是否马上显示,为true时马上显示，为false时不马上显示。
         * @default true
         * @type  Boolean
         */
        show: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 头部提示。
         * @default 提示
         * @type  String
         */
        title: '提示',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示最大化按钮，为true时显示最大化按钮，为false时不显示。
         * @default false
         * @type  Boolean
         */
        showMax: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示收缩窗口按钮，为true时显示收缩窗口按钮，为false时不显示。
         * @default false
         * @type  Boolean
         */
        showToggle: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示最小化按钮，为true时显示最小化按钮，为false时不显示。
         * @default false
         * @type  Boolean
         */
        showMin: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否以动画的形式显示，为true时以动画的形式显示，为false时不以动画的形式显示。
         * @default false
         * @type  Boolean
         */
        slide: $.browser.msie ? false : true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 在固定的位置显示, 可以设置的值有n, e, s, w, ne, se, sw, nw。
         * @default null
         * @type  Object
         */
        fixedType: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 显示类型,可以设置为slide(固定显示时有效)。
         * @default null
         * @type   Object
         */
        showType: null  ,
        /**
         * 垂直位置  top,middle,bottom
         */
        valign:"middle"
    };
    $.juiceDefaults.DialogString =  /**@lends juiceDialog#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提示文本标题。
         * @default 提示
         * @type   String
         */
        titleMessage: '提示',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提示文本确定。
         * @default 确定
         * @type   String
         */
        ok: '确定',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提示文本是。
         * @default 是
         * @type   String
         */
        yes: '是',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提示文本否。
         * @default 否
         * @type   String
         */
        no: '否',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提示文本取消。
         * @default 取消
         * @type   String
         */
        cancel: '取消',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 提示文本正在等待中,请稍候...
         * @default 正在等待中,请稍候...
         * @type   String
         */
        waittingMessage: '正在等待中,请稍候...',

        // 自动控制弹出框高度。如果打开，则不可改变高度
        autoHeight: true
    };

    $.juiceMethos.Dialog = $.juiceMethos.Dialog || {};


    l.controls.Dialog = function (options)
    {
        l.controls.Dialog.base.constructor.call(this, null, options);
    };
    l.controls.Dialog.juiceExtend(l.core.Win, {
        __getType: function ()
        {
            return 'Dialog';
        },
        __idPrev: function ()
        {
            return 'Dialog';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Dialog;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.set(p, true);
            var dialog = $('<div class="l-dialog"><table class="l-dialog-table" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="l-dialog-tc"><div class="l-dialog-tc-inner"><div class="l-dialog-icon"></div><div class="l-dialog-title"></div><div class="l-dialog-winbtns"><div class="l-dialog-winbtn l-dialog-close"></div></div></div></td></tr><tr><td class="l-dialog-cc"><div class="l-dialog-body"><div class="l-dialog-image"></div> <div class="l-dialog-content"></div><div class="l-dialog-buttons"><div class="l-dialog-buttons-inner"></div></td></tr></tbody></table></div>');
//            var dialog = $('<div class="l-dialog"><table class="l-dialog-table" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="l-dialog-tc"><div class="l-dialog-tc-inner"><div class="l-dialog-icon"></div><div class="l-dialog-title"></div><div class="l-dialog-winbtns"><div class="l-dialog-winbtn l-dialog-close"></div></div></div></td></tr><tr><td class="l-dialog-cc"><div class="l-dialog-body"><div class="l-dialog-image"></div><div class="l-dialog-content"></div><div class="l-dialog-buttons"><div class="l-dialog-buttons-inner"></div></div></div></td></tr></tbody></table></div>');
            $('body').append(dialog);
            g.dialog = dialog;
            g.element = dialog[0];
            g.dialog.body = $(".l-dialog-body:first", g.dialog);
            g.dialog.header = $(".l-dialog-tc-inner:first", g.dialog);
            g.dialog.winbtns = $(".l-dialog-winbtns:first", g.dialog.header);
            g.dialog.buttons = $(".l-dialog-buttons:first", g.dialog);
            g.dialog.content = $(".l-dialog-content:first", g.dialog);
            g.set(p, false);

            if (p.allowClose == false) $(".l-dialog-close", g.dialog).remove();
            if (p.target || p.url || p.type == "none")
            {
                p.type = null;
                g.dialog.addClass("l-dialog-win");
            }
            if (p.cls) g.dialog.addClass(p.cls);
            if (p.id) g.dialog.attr("id", p.id);
            //设置锁定屏幕、拖动支持 和设置图片
            g.mask();
            if (p.isDrag)
                g._applyDrag();
            if (p.isResize)
                g._applyResize();
            if (p.type)
                g._setImage();
            else
            {
                $(".l-dialog-image", g.dialog).remove();
                g.dialog.content.addClass("l-dialog-content-noimage");
            }
            if (!p.show)
            {
                g.unmask();
                g.dialog.hide();
            }
            //设置主体内容
            if (p.target)
            {
                g.dialog.content.prepend(p.target);
                $(p.target).show();
            }
            else if (p.url)
            {
                if (p.timeParmName)
                {
                    p.url += p.url.indexOf('?') == -1 ? "?" : "&";
                    p.url += p.timeParmName + "=" + new Date().getTime();
                }
                if (p.load)
                {
                    g.dialog.body.load(p.url, function ()
                    {
                        g._saveStatus();
                        g.trigger('loaded');
                    });
                }
                else
                {
                    g.jiframe = $("<iframe frameborder='0' style='overflow: hidden;height: 99.8%'></iframe>");
                    var framename = p.name ? p.name : "juicewindow" + new Date().getTime();
                    g.dialog.content.css("overflow","hidden");
                    g.jiframe.attr("name", framename);
                    g.jiframe.attr("id", framename);
                    g.dialog.content.prepend(g.jiframe);
                    g.dialog.content.addClass("l-dialog-content-nopadding");
                    setTimeout(function ()
                    {
                        g.jiframe.attr("src", p.url);
                        g.frame = window.frames[g.jiframe.attr("name")];
                    }, 0);
                }
            }
            if (p.opener) g.dialog.opener = p.opener;
            //设置按钮
            if (p.buttons)
            {
                var widths = 0;
                $(p.buttons).each(function (i, item)
                {
                    var btn = $('<div class="l-dialog-btn"><div class="l-dialog-btn-l"></div><div class="l-dialog-btn-r"></div><div class="l-dialog-btn-inner"></div></div>');
                    $(".l-dialog-btn-inner", btn).html(item.text);
                    $(".l-dialog-buttons-inner", g.dialog.buttons).prepend(btn);
                    item.width && btn.width(item.width);
                    widths += btn.width();
                    if(p.buttonAlign == "center"){
                        if(i==(p.buttons.length - 1)){
                            widths += (p.buttons.length - 1)*5;
                            btn.css({"margin-right":(g.dialog.body.width()-widths)/2});
                        }
                    }

                    item.onclick && btn.click(function () { item.onclick(item, g, i) });
                });
            } else
            {
                g.dialog.buttons.remove();
            }
            $(".l-dialog-buttons-inner", g.dialog.buttons).append("<div class='l-clear'></div>");


            $(".l-dialog-title", g.dialog)
                .bind("selectstart", function () { return false; });
            g.dialog.click(function ()
            {
                l.win.setFront(g);
            });

            //设置事件
            $(".l-dialog-tc .l-dialog-close", g.dialog).click(function ()
            {
                if (p.isHidden)
                    g.hide();
                else
                    g.close();
            });
            if (!p.fixedType)
            {
                //位置初始化
                var left = 0;
                var top = 0;
                var width = p.width || g.dialog.width();
                if (p.slide == true) p.slide = 'fast';
                if (p.left) left = p.left;
                else p.left = left = 0.5 * ($(window).width() - width);
                if (p.top != null) top = p.top;
                else p.top = top = 0.5 * ($(window).height() - g.dialog.height()) + $(window).scrollTop() - 10;
                if (left < 0) p.left = left = 0;
                if (top < 0) p.top = top = 0;
                g.dialog.css({ left: left, top: top });
            }
            if (p.valign) {
                var top = 0;
                if (p.valign == "top") {
                    top = 0;
                } else if (p.valign == "bottom") {
                    top = ($(window).height() - g.dialog.height());
                } else {
                    top = ($(window).height() - g.dialog.height()) / 2;
                }
                g.dialog.css({top:top });

            }
            g.show();
            $('body').bind('keydown.dialog', function (e)
            {
                var key = e.which;
                if (key == 13)
                {
                    g.enter();
                }
                else if (key == 27)
                {
                    g.esc();
                }
            });

            g._updateBtnsWidth();
            g._saveStatus();
            g._onReisze();

        },
        _borderX: 12,
        _borderY: 20,
        doMax: function (slide)
        {
            var g = this, p = this.options;
            var width = $(window).width(), height = $(window).height(), left = 0, top = 0;
            if (l.win.taskbar)
            {
                height -= l.win.taskbar.outerHeight();
                if (l.win.top) top += l.win.taskbar.outerHeight();
            }
            if (slide)
            {
                g.dialog.body.animate({ width: width - g._borderX }, p.slide);
                g.dialog.animate({ left: left, top: top }, p.slide);
                g.dialog.content.animate({ height: height - g._borderY - g.dialog.buttons.outerHeight() }, p.slide, function ()
                {
                    g._onReisze();
                });
            }
            else
            {
                g.set({ width: width, height: height, left: left, top: top });
                g._onReisze();
            }
        },
        //最大化
        max: function ()
        {
            var g = this, p = this.options;
            if (g.winmax)
            {
                g.winmax.addClass("l-dialog-recover");
                g.doMax(p.slide);
                if (g.wintoggle)
                {
                    if (g.wintoggle.hasClass("l-dialog-extend"))
                        g.wintoggle.addClass("l-dialog-toggle-disabled l-dialog-extend-disabled");
                    else
                        g.wintoggle.addClass("l-dialog-toggle-disabled l-dialog-collapse-disabled");
                }
                if (g.resizable) g.resizable.set({ disabled: true });
                if (g.draggable) g.draggable.set({ disabled: true });
                g.maximum = true;

                $(window).bind('resize.dialogmax', function ()
                {
                    g.doMax(false);
                });
            }
        },

        //恢复
        recover: function ()
        {
            var g = this, p = this.options;
            if (g.winmax)
            {
                g.winmax.removeClass("l-dialog-recover");
                if (p.slide)
                {
                    g.dialog.body.animate({ width: g._width - g._borderX }, p.slide);
                    g.dialog.animate({ left: g._left, top: g._top }, p.slide);
                    g.dialog.content.animate({ height: g._height - g._borderY - g.dialog.buttons.outerHeight() }, p.slide, function ()
                    {
                        g._onReisze();
                    });
                }
                else
                {
                    g.set({ width: g._width, height: g._height, left: g._left, top: g._top });
                    g._onReisze();
                }
                if (g.wintoggle)
                {
                    g.wintoggle.removeClass("l-dialog-toggle-disabled l-dialog-extend-disabled l-dialog-collapse-disabled");
                }

                $(window).unbind('resize.dialogmax');
            }
            if (this.resizable) this.resizable.set({ disabled: false });
            if (g.draggable) g.draggable.set({ disabled: false });
            g.maximum = false;
        },

        //最小化
        min: function ()
        {
            var g = this, p = this.options;
            var task = l.win.getTask(this);
            if (p.slide)
            {
                g.dialog.body.animate({ width: 1 }, p.slide);
                task.y = task.offset().top + task.height();
                task.x = task.offset().left + task.width() / 2;
                g.dialog.animate({ left: task.x, top: task.y }, p.slide, function ()
                {
                    g.dialog.hide();
                });
            }
            else
            {
                g.dialog.hide();
            }
            g.unmask();
            g.minimize = true;
            g.actived = false;
        },

        active: function ()
        {
            var g = this, p = this.options;
            if (g.minimize)
            {
                var width = g._width, height = g._height, left = g._left, top = g._top;
                if (g.maximum)
                {
                    width = $(window).width();
                    height = $(window).height();
                    left = top = 0;
                    if (l.win.taskbar)
                    {
                        height -= l.win.taskbar.outerHeight();
                        if (l.win.top) top += l.win.taskbar.outerHeight();
                    }
                }
                if (p.slide)
                {
                    g.dialog.body.animate({ width: width - g._borderX }, p.slide);
                    g.dialog.animate({ left: left, top: top }, p.slide);
                }
                else
                {
                    g.set({ width: width, height: height, left: left, top: top });
                }
            }
            g.actived = true;
            g.minimize = false;
            l.win.setFront(g);
            g.show();
        },

        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;展开/收缩dialog。
         * @name  juiceDialog#toggle
         * @function
         * @example   <b>示例:</b> <br>
         *          toggle: function (){
         *           var g = this, p = this.options;
         *           if (!g.wintoggle) return;
         *           if (g.wintoggle.hasClass("l-dialog-extend"))
         *            g.extend();
         *          else
         *            g.collapse();
         *            }
         */
        toggle: function ()
        {

            var g = this, p = this.options;
            if (!g.wintoggle) return;
            if (g.wintoggle.hasClass("l-dialog-extend"))
                g.extend();
            else
                g.collapse();
        },

        //收缩
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收缩dialog。
         * @name  juiceDialog#collapse
         * @function
         * @example   <b>示例:</b> <br>
         *          collapse: function (){
         *           var g = this, p = this.options;
         *           if (!g.wintoggle) return;
         *           if (p.slide)
         *             g.dialog.content.animate({ height: 1 }, p.slide);
         *          else
         *             g.dialog.content.height(1);
         *             if (this.resizable) this.resizable.set({ disabled: true });
         *            }
         */
        collapse: function ()
        {
            var g = this, p = this.options;
            if (!g.wintoggle) return;
            if (p.slide)
                g.dialog.content.animate({ height: 1 }, p.slide);
            else
                g.dialog.content.height(1);
            if (this.resizable) this.resizable.set({ disabled: true });
        },

        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;展开dialog。
         * @name  juiceDialog#extend
         * @function
         * @example   <b>示例:</b> <br>
         *  extend: function ()
         *      {
         *          var g = this, p = this.options;
         *          if (!g.wintoggle) return;
         *              var contentHeight = g._height - g._borderY - g.dialog.buttons.outerHeight();
         *          if (p.slide)
         *              g.dialog.content.animate({ height: contentHeight }, p.slide);
         *          else
         *              g.dialog.content.height(contentHeight);
         *          if (this.resizable) this.resizable.set({ disabled: false });
         *         }
         */
        extend: function ()
        {
            var g = this, p = this.options;
            if (!g.wintoggle) return;
            var contentHeight = g._height - g._borderY - g.dialog.buttons.outerHeight();
            if (p.slide)
                g.dialog.content.animate({ height: contentHeight }, p.slide);
            else
                g.dialog.content.height(contentHeight);
            if (this.resizable) this.resizable.set({ disabled: false });
        },
        _updateBtnsWidth: function ()
        {
            var g = this;
            var btnscount = $(">div", g.dialog.winbtns).length;
            g.dialog.winbtns.width(22 * btnscount);
        },
        _setLeft: function (value)
        {
            if (!this.dialog) return;
            if (value != null)
                this.dialog.css({ left: value });
        },
        _setTop: function (value)
        {
            if (!this.dialog) return;
            if (value != null)
                this.dialog.css({ top: value });
        },
        _setWidth: function (value)
        {
            if (!this.dialog) return;
            if (value >= this._borderX)
            {
                this.dialog.body.width(value - this._borderX);
            }
        },
        _setHeight: function (value)
        {
            var g = this, p = this.options;

            if(p.autoHeight) return;
            if (!this.dialog) return;
            if (value >= this._borderY)
            {
                var height = value - this._borderY - g.dialog.buttons.outerHeight();
                g.dialog.content.height(height);
            }
        },
        _setShowMax: function (value)
        {
            var g = this, p = this.options;
            if (value)
            {
                if (!g.winmax)
                {
                    g.winmax = $('<div class="l-dialog-winbtn l-dialog-max"></div>').appendTo(g.dialog.winbtns)
                        .hover(function ()
                        {
                            if ($(this).hasClass("l-dialog-recover"))
                                $(this).addClass("l-dialog-recover-over");
                            else
                                $(this).addClass("l-dialog-max-over");
                        }, function ()
                        {
                            $(this).removeClass("l-dialog-max-over l-dialog-recover-over");
                        }).click(function ()
                        {
                            if ($(this).hasClass("l-dialog-recover"))
                                g.recover();
                            else
                                g.max();
                        });
                }
            }
            else if (g.winmax)
            {
                g.winmax.remove();
                g.winmax = null;
            }
            g._updateBtnsWidth();
        },
        _setShowMin: function (value)
        {
            var g = this, p = this.options;
            if (value)
            {
                if (!g.winmin)
                {
                    g.winmin = $('<div class="l-dialog-winbtn l-dialog-min"></div>').appendTo(g.dialog.winbtns)
                        .hover(function ()
                        {
                            $(this).addClass("l-dialog-min-over");
                        }, function ()
                        {
                            $(this).removeClass("l-dialog-min-over");
                        }).click(function ()
                        {
                            g.min();
                        });
                    l.win.addTask(g);
                }
            }
            else if (g.winmin)
            {
                g.winmin.remove();
                g.winmin = null;
            }
            g._updateBtnsWidth();
        },
        _setShowToggle: function (value)
        {
            var g = this, p = this.options;
            if (value)
            {
                if (!g.wintoggle)
                {
                    g.wintoggle = $('<div class="l-dialog-winbtn l-dialog-collapse"></div>').appendTo(g.dialog.winbtns)
                        .hover(function ()
                        {
                            if ($(this).hasClass("l-dialog-toggle-disabled")) return;
                            if ($(this).hasClass("l-dialog-extend"))
                                $(this).addClass("l-dialog-extend-over");
                            else
                                $(this).addClass("l-dialog-collapse-over");
                        }, function ()
                        {
                            $(this).removeClass("l-dialog-extend-over l-dialog-collapse-over");
                        }).click(function ()
                        {
                            if ($(this).hasClass("l-dialog-toggle-disabled")) return;
                            if (g.wintoggle.hasClass("l-dialog-extend"))
                            {
                                if (g.trigger('extend') == false) return;
                                g.wintoggle.removeClass("l-dialog-extend");
                                g.extend();
                                g.trigger('extended');
                            }
                            else
                            {
                                if (g.trigger('collapse') == false) return;
                                g.wintoggle.addClass("l-dialog-extend");
                                g.collapse();
                                g.trigger('collapseed')
                            }
                        });
                }
            }
            else if (g.wintoggle)
            {
                g.wintoggle.remove();
                g.wintoggle = null;
            }
        },
        //按下回车
        enter: function ()
        {
            var g = this, p = this.options;
            var isClose;
            if (p.closeWhenEnter != undefined)
            {
                isClose = p.closeWhenEnter;
            }
            else if (p.type == "warn" || p.type == "error" || p.type == "success" || p.type == "question")
            {
                isClose = true;
            }
            if (isClose)
            {
                g.close();
            }
        },
        esc: function ()
        {

        },
        _removeDialog: function ()
        {
            var g = this, p = this.options;
            if (p.showType && p.fixedType)
            {
                g.dialog.animate({ bottom: -1 * p.height }, function ()
                {
                    g.dialog.remove();
                });
            } else
            {
                g.dialog.remove();
            }
        },
        /**
         *   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;关闭dialog。
         * @name  juiceDialog#close
         * @function
         * @example   <b>示例:</b> <br>
         *         close: function ()
         *         {
         *            var g = this, p = this.options;
         *                 l.win.removeTask(this);
         *                 g.unmask();
         *                 g._removeDialog();
         *                 $('body').unbind('keydown.dialog');
         *         }
         */
        close: function ()
        {
            var g = this, p = this.options;
            l.win.removeTask(this);
            g.unmask();
            g._removeDialog();
            $('body').unbind('keydown.dialog');
        },
        _getVisible: function ()
        {
            return this.dialog.is(":visible");
        },
        _setUrl: function (url)
        {
            var g = this, p = this.options;
            p.url = url;
            if (p.load)
            {
                g.dialog.body.html("").load(p.url, function ()
                {
                    g.trigger('loaded');
                });
            }
            else if (g.jiframe)
            {
                g.jiframe.attr("src", p.url);
            }
        },
        _setContent: function (content)
        {
            this.dialog.content.html(content);
        },
        _setTitle: function (value)
        {
            var g = this; var p = this.options;
            if (value)
            {
                $(".l-dialog-title", g.dialog).html(value);
            }
        },
        _hideDialog: function ()
        {
            var g = this, p = this.options;
            if (p.showType && p.fixedType)
            {
                g.dialog.animate({ bottom: -1 * p.height }, function ()
                {
                    g.dialog.hide();
                });
            } else
            {
                g.dialog.hide();
            }
        },
        hidden: function ()
        {
            var g = this;
            l.win.removeTask(g);
            g.dialog.hide();
            g.unmask();
        },
        show: function ()
        {
            var g = this, p = this.options;
            g.mask();
            if (p.fixedType)
            {
                // showType 只有在南方，西南，东南三个方向时，才应该显示从下往上的动画
                if (p.showType.indexOf("s") >= 0)
                {
                    // top style can not be exists in with bottom!!!

                    g.dialog.css("top", "");
                    g.dialog.css({ bottom: -1 * p.height }).addClass("l-dialog-fixed");
                    g.dialog.show().animate({ bottom: 0 },1000);
                }
                else
                {
                    g.dialog.show("show").css({ bottom: 0 });
                }
            }
            else
            {
                g.dialog.show();
            }
            //前端显示 
            $.jui.win.setFront.juiceDefer($.jui.win, 100, [g]);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;封装数据源。
         * @name  juiceDialog#setUrl
         * @param [url] 数据源url
         * @function
         * * @example   <b>示例:</b> <br>
         *        setUrl: function (url)
         *         {
         *                 this._setUrl(url);
         *         }
         */
        setUrl: function (url)
        {
            this._setUrl(url);
        },
        _saveStatus: function ()
        {
            var g = this;
            g._width = g.dialog.body.width();
            g._height = g.dialog.body.height();
            var top = 0;
            var left = 0;
            if (!isNaN(parseInt(g.dialog.css('top'))))
                top = parseInt(g.dialog.css('top'));
            if (!isNaN(parseInt(g.dialog.css('left'))))
                left = parseInt(g.dialog.css('left'));
            g._top = top;
            g._left = left;
        },
        _applyDrag: function ()
        {
            var g = this, p = this.options;
            if ($.fn.juiceDrag)
                g.draggable = g.dialog.juiceDrag({ handler: '.l-dialog-title', animate: false,
                    onStartDrag: function ()
                    {
                        l.win.setFront(g);
                    },
                    onStopDrag: function ()
                    {
                        if (p.target)
                        {
                            var triggers1 = l.find($.jui.controls.DateEditor);
                            var triggers2 = l.find($.jui.controls.ComboBox);
                            //更新所有下拉选择框的位置
                            $($.merge(triggers1, triggers2)).each(function ()
                            {
                                if (this.updateSelectBoxPosition)
                                    this.updateSelectBoxPosition();
                            });
                        }
                        g._saveStatus();
                    }
                });
        },
        _onReisze: function ()
        {
            var g = this, p = this.options;
            if (p.target)
            {
                var manager = $(p.target).juice();
                if (!manager) manager = $(p.target).find(":first").juice();
                if (!manager) return;
                var contentHeight = g.dialog.content.height();
                var contentWidth = g.dialog.content.width();
                manager.trigger('resize', [{ width: contentWidth, height: contentHeight}]);
            }
        },
        _applyResize: function ()
        {
            var g = this, p = this.options;
            if ($.fn.juiceResizable)
            {
                g.resizable = g.dialog.juiceResizable({
                    onStopResize: function (current, e)
                    {
                        var top = 0;
                        var left = 0;
                        if (!isNaN(parseInt(g.dialog.css('top'))))
                            top = parseInt(g.dialog.css('top'));
                        if (!isNaN(parseInt(g.dialog.css('left'))))
                            left = parseInt(g.dialog.css('left'));
                        if (current.diffLeft)
                        {
                            g.set({ left: left + current.diffLeft });
                        }
                        if (current.diffTop)
                        {
                            g.set({ top: top + current.diffTop });
                        }
                        if (current.newWidth)
                        {
                            g.set({ width: current.newWidth });
                            g.dialog.body.css({ width: current.newWidth - g._borderX });
                        }
                        if (current.newHeight)
                        {
                            g.set({ height: current.newHeight });
                        }
                        g._onReisze();
                        g._saveStatus();
                        return false;
                    }, animate: false
                });
            }
        },
        _setImage: function ()
        {
            var g = this, p = this.options;
            if (p.type)
            {
                if (p.type == 'success' || p.type == 'donne' || p.type == 'ok')
                {
                    $(".l-dialog-image", g.dialog).addClass("l-dialog-image-donne").show();
                    g.dialog.content.css({ paddingLeft: 64 });
                }
                else if (p.type == 'error')
                {
                    $(".l-dialog-image", g.dialog).addClass("l-dialog-image-error").show();
                    g.dialog.content.css({ paddingLeft: 64});
                }
                else if (p.type == 'warn')
                {
                    $(".l-dialog-image", g.dialog).addClass("l-dialog-image-warn").show();
                    g.dialog.content.css({ paddingLeft: 64 });
                }
                else if (p.type == 'question')
                {
                    $(".l-dialog-image", g.dialog).addClass("l-dialog-image-question").show();
                    g.dialog.content.css({ paddingLeft: 64});
                }
            }
        }
    });
    l.controls.Dialog.prototype.hide = l.controls.Dialog.prototype.hidden;



    $.juiceDialog.open = function (p)
    {
        p.autoHeight = false;
        return $.juiceDialog(p);
    };
    $.juiceDialog.close = function ()
    {
        var dialogs = l.find(l.controls.Dialog.prototype.__getType());
        for (var i in dialogs)
        {
            var d = dialogs[i];
            d.destroy.juiceDefer(d, 5);
        }
        l.win.unmask();
    };
    $.juiceDialog.show = function (p)
    {
        var dialogs = l.find(l.controls.Dialog.prototype.__getType());
        if (dialogs.length)
        {
            for (var i in dialogs)
            {
                dialogs[i].show();
                return;
            }
        }
        return $.juiceDialog(p);
    };
    $.juiceDialog.hide = function ()
    {
        var dialogs = l.find(l.controls.Dialog.prototype.__getType());
        for (var i in dialogs)
        {
            var d = dialogs[i];
            d.hide();
        }
    };
    $.juiceDialog.tip = function (options)
    {
        // What the hell below?
        options = $.extend({
            showType: 'slide',
            width: 240,
            modal: false,
            height: 150,
            left:window.availWidth*0.8,
            top:window.availHeight*0.8
        }, options || {});

        $.extend(options, {
            fixedType: 'se',
            type: 'none',
            isDrag: false,
            isResize: false,
            showMax: false,
            showToggle: false,
            showMin: false
        });

        // tip's valign must be "bottom"
        options.valign = "bottom";
        return $.juiceDialog.open(options);
    };
    $.juiceDialog.alert = function (content, title, type, callback)
    {
        content = content || "";
        if (typeof (title) == "function")
        {

            callback = title;
            type = null;
        }
        else if (typeof (type) == "function")
        {
            callback = type;
        }
        var btnclick = function (item, Dialog, index)
        {
            Dialog.close();
            if (callback)
                callback(item, Dialog, index);
        };
        p = {
            content: content,
            top:($(window).height()-150)/2,
            buttons: [{ text: $.juiceDefaults.DialogString.ok, onclick: btnclick}]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        if (typeof (type) == "string" && type != "") p.type = type;

        // What the hell below?

        $.extend(p, {
            showMax: false,
            showToggle: false,
            showMin: false
        });

        return $.juiceDialog(p);
    };

    $.juiceDialog.confirm = function (content, title, callback)
    {
        if (typeof (title) == "function")
        {
            callback = title;
            type = null;
        }
        var btnclick = function (item, Dialog)
        {
            Dialog.close();
            if (callback)
            {
                callback(item.type == 'ok');
            }
        };
        p = {
            type: 'question',
            content: content,
            buttons: [{ text: $.juiceDefaults.DialogString.yes, onclick: btnclick, type: 'ok' }, { text: $.juiceDefaults.DialogString.no, onclick: btnclick, type: 'no'}]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        $.extend(p, {
            showMax: false,
            showToggle: false,
            showMin: false
        });
        return $.juiceDialog(p);
    };
    $.juiceDialog.warning = function (content, title, callback)
    {
        if (typeof (title) == "function")
        {
            callback = title;
            type = null;
        }
        var btnclick = function (item, Dialog)
        {
            Dialog.close();
            if (callback)
            {
                callback(item.type);
            }
        };
        p = {
            type: 'question',
            content: content,
            buttons: [{ text: $.juiceDefaults.DialogString.yes, onclick: btnclick, type: 'yes' }, { text: $.juiceDefaults.DialogString.no, onclick: btnclick, type: 'no' }, { text: $.juiceDefaults.DialogString.cancel, onclick: btnclick, type: 'cancel'}]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        $.extend(p, {
            showMax: false,
            showToggle: false,
            showMin: false
        });
        return $.juiceDialog(p);
    };
    $.juiceDialog.waitting = function (title)
    {
        title = title || $.juiceDefaults.Dialog.waittingMessage;
        return $.juiceDialog.open({ cls: 'l-dialog-waittingdialog', type: 'none', content: '<div style="padding:4px">' + title + '</div>', allowClose: false });
    };
    $.juiceDialog.closeWaitting = function ()
    {
        var dialogs = l.find(l.controls.Dialog);
        for (var i in dialogs)
        {
            var d = dialogs[i];
            if (d.dialog.hasClass("l-dialog-waittingdialog"))
                d.close();
        }
    };
    $.juiceDialog.success = function (content, title, onBtnClick)
    {
        return $.juiceDialog.alert(content, title, 'success', onBtnClick);
    };
    $.juiceDialog.error = function (content, title, onBtnClick)
    {
        return $.juiceDialog.alert(content, title, 'error', onBtnClick);
    };
    $.juiceDialog.warn = function (content, title, onBtnClick)
    {
        return $.juiceDialog.alert(content, title, 'warn', onBtnClick);
    };
    $.juiceDialog.question = function (content, title)
    {
        return $.juiceDialog.alert(content, title, 'question');
    };


    $.juiceDialog.prompt = function (title, value, multi, callback)
    {
        var target = $('<input type="text" class="l-dialog-inputtext"/>');
        var height = 60;

        if (typeof (multi) == "function")
        {
            callback = multi;
        }
        if (typeof (value) == "function")
        {
            callback = value;
        }
        else if (typeof (value) == "boolean")
        {
            multi = value;
        }
        if (typeof (multi) == "boolean" && multi)
        {
            target = $('<textarea class="l-dialog-textarea"></textarea>');
            height = 120;
        }
        if (typeof (value) == "string" || typeof (value) == "int")
        {
            target.val(value);
        }
        var btnclick = function (item, Dialog, index)
        {
            Dialog.close();
            if (callback)
            {
                callback(item.type == 'yes', target.val());
            }
        }

        p = {
            title: title,
            target: target,
            width: 320,
            height: height,
            buttons: [{ text: $.juiceDefaults.DialogString.ok, onclick: btnclick, type: 'yes' }, { text: $.juiceDefaults.DialogString.cancel, onclick: btnclick, type: 'cancel'}]
        };
        return $.juiceDialog(p);
    };


})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
* 
*/
(function ($)
{
    $.fn.juiceEasyTab = function ()
    {
        return $.jui.run.call(this, "juiceEasyTab", arguments);
    };
    $.fn.juiceGetEasyTabManager = function ()
    {
        return $.jui.run.call(this, "juiceGetEasyTabManager", arguments);
    };

    $.juiceDefaults.EasyTab = {};

    $.juiceMethos.EasyTab = {};

    $.jui.controls.EasyTab = function (element, options)
    {
        $.jui.controls.EasyTab.base.constructor.call(this, element, options);
    };
    $.jui.controls.EasyTab.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'EasyTab';
        },
        __idPrev: function ()
        {
            return 'EasyTab';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.EasyTab;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.tabs = $(this.element);
            g.tabs.addClass("l-easytab");
            var selectedIndex = 0;
            if ($("> div[lselected=true]", g.tabs).length > 0)
                selectedIndex = $("> div", g.tabs).index($("> div[lselected=true]", g.tabs));
            g.tabs.ul = $('<ul class="l-easytab-header"></ul>');
            $("> div", g.tabs).each(function (i, box)
            {
                var li = $('<li><span></span></li>');
                if (i == selectedIndex)
                    $("span", li).addClass("l-selected");
                if ($(box).attr("title"))
                    $("span", li).html($(box).attr("title"));
                g.tabs.ul.append(li);
                if (!$(box).hasClass("l-easytab-panelbox")) $(box).addClass("l-easytab-panelbox");
            });
            g.tabs.ul.prependTo(g.tabs);
            //init  
            $(".l-easytab-panelbox:eq(" + selectedIndex + ")", g.tabs).show().siblings(".l-easytab-panelbox").hide();
            //add even 
            $("> ul:first span", g.tabs).click(function ()
            {
                if ($(this).hasClass("l-selected")) return;
                var i = $("> ul:first span", g.tabs).index(this);
                $(this).addClass("l-selected").parent().siblings().find("span.l-selected").removeClass("l-selected");
                $(".l-easytab-panelbox:eq(" + i + ")", g.tabs).show().siblings(".l-easytab-panelbox").hide();
            }).not("l-selected").hover(function ()
            {
                $(this).addClass("l-over");
            }, function ()
            {
                $(this).removeClass("l-over");
            });
            g.set(p);
        }
    });

})(jQuery);/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 *
 */
(function ($)
{
    /**
     * @name   juiceFieldSet
     * @class   juiceFieldSet是属性加载结构类。
     * @namespace  <h3><font color="blue">juiceFieldSet &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceFieldSet = function ()
    {
        return $.jui.run.call(this, "juiceFieldSet", arguments);
    };

    $.juiceDefaults = $.juiceDefaults || {};
    $.juiceDefaults.FieldSet = /**@lends juiceFieldSet#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 控件宽度。
         * @default 0
         * @type Number
         */
        width: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度。
         * @default auto
         * @type Number
         */
        height: "auto",
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 标题。
         * @default ""
         * @type String
         */
        title:""
    };

    //Field布局组件
    $.jui.controls.FieldSet = function (element, options)
    {
        $.jui.controls.FieldSet.base.constructor.call(this, element, options);

    };

    $.jui.controls.FieldSet.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'FieldSet'
        },
        __idPrev: function ()
        {
            return 'FieldSet';
        },
        _init: function ()
        {
            var g = this, p = this.options;
            $.jui.controls.FieldSet.base._init.call(this);
            g._copyProperty(p,$(this.element));
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.field = $(this.element);
            g.field.addClass("l-fieldset");

            var headerArr = [];
            headerArr.push( "<legend class='l-fieldset-header l-fieldset-header-default'>" );
            headerArr.push( "   <div class='l-tool'><img  class='l-tool-toggle l-tool-toggle-default' src='data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='/></div>" );
            headerArr.push( "   <div  class='l-fieldset-header-text'></div>");
            headerArr.push( "   <div  class='l-clear'></div>");
            headerArr.push("</legend>");

            g.header = $(headerArr.join(""));
            g.headerText = $(".l-fieldset-header-text",g.header);
            //内容容器
            g.cotentWrap = $("<div class='l-fieldset-body'></div>");

            g.tool = $(".l-tool",g.header);
            g.cotentWrap.append(g.field.children());
            g.field.prepend(g.header);
            g.field.append(g.cotentWrap);
            g._build();
            delete headerArr;
        },
        _build:function(){
            var g = this, p = this.options;
            g._setTitle();
            g._size();
            g._setEvent();
        } ,
        _setTitle:function(title){
            var g = this, p = this.options;
            p.title = title||p.title||"标题";
            g.headerText.html(p.title);

        },
        _setEvent:function(){
            var g = this, p = this.options;
            g.tool.click(function(){
                if(g.tool.hasClass("l-tool-down-over")){
                    g.tool.removeClass("l-tool-down-over");
                    g.tool.removeClass("l-tool-down");
                    g.tool.addClass("l-tool-over");
                    g.field.removeClass("l-fieldset-collapsed");
                }else{
                    g.tool.addClass("l-tool-down-over");
                    g.tool.removeClass("l-tool-over");
                    g.field.addClass("l-fieldset-collapsed");
                }

            });

            g.tool.hover(function(){
                if(g.tool.hasClass("l-tool-down")){
                    g.tool.addClass("l-tool-down-over");
                    g.tool.remove("l-tool-down");
                }else{
                    g.tool.addClass("l-tool-over");
                }
            },function(){
                if(g.tool.hasClass("l-tool-down-over")){
                    g.tool.addClass("l-tool-down");
                    g.tool.removeClass("l-tool-down-over");
                }else if(g.tool.hasClass("l-tool-over")){
                    g.tool.removeClass("l-tool-over");
                }
            });
        },
        _size:function(){
            var g = this, p = this.options;
            if(p.width)
                g.field.width(p.width);
            
            var titleWidth = p.titleWidth||(p.title?(p.title.length)*14+30:20);
            g.header.width(titleWidth);
        }

    });
})(jQuery);﻿/**
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

})(jQuery);﻿/**
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
                    var rtextRange =esrc.createTextRange();
                    rtextRange.moveStart('character',esrc.value.length);
                    rtextRange.collapse(true);
                    rtextRange.select();
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
})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{
    /**
     * @name   juiceSpinner
     * @class   juiceSpinner 是属性加载结构类。
     * @constructor
     * @description 构造函数。
     * @namespace  <h3><font color="blue">juiceSpinner &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceSpinner = function ()
    {
        return $.jui.run.call(this, "juiceSpinner", arguments);
    };
    $.fn.juiceGetSpinnerManager = function ()
    {
        return $.jui.run.call(this, "juiceGetSpinnerManager", arguments);
    };

    $.juiceDefaults.Spinner =/**@lends juiceSpinner#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 类型 float:浮点数 int:整数 time:时间。
         * @default float
         * @type String
         */
        type: 'float',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否负数,为true时是负数，为false时不为负数。
         * @default true
         * @type  Boolean
         */
        isNegative: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  小数位 type=float时起作用。
         * @default 2
         * @type  Number
         */
        decimalplace: 2,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  每次增加的值。
         * @default  0.1
         * @type  Number
         */
        step: 0.1,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 时间间隔，单位毫秒。
         * @default  50
         * @type  Number
         */
        interval: 50,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 改变值事件。
         * @default  null
         * @type  event
         */
        onChangeValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最小值。
         * @default  null
         * @type  Object
         */
        minValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最大值。
         * @default  null
         * @type  Object
         */
        maxValue: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; disabled 属性可设置或返回是否默认地禁用某个 <option> 元素。
         * @default  false
         * @type  Boolean
         */
        disabled: false,

        // 延迟执行时间。正确的事件执行逻辑是click按照步数+1，长按再持续增加。
        timeout:700
    };

    $.juiceMethos.Spinner = {};

    $.jui.controls.Spinner = function (element, options)
    {
        $.jui.controls.Spinner.base.constructor.call(this, element, options);
    };
    $.jui.controls.Spinner.juiceExtend($.jui.controls.Input, {
        __getType: function ()
        {
            return 'Spinner';
        },
        __idPrev: function ()
        {
            return 'Spinner';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Spinner;
        },
        _init: function ()
        {
            $.jui.controls.Spinner.base._init.call(this);
            var p = this.options;
            if (p.type == 'float')
            {
                p.step = 0.1;
                p.interval = 50;
            } else if (p.type == 'int')
            {
                p.step = 1;
                p.interval = 100;
            } else if (p.type == 'time')
            {
                p.step = 1;
                p.interval = 100;
            }
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.interval = null;
            g.inputText = null;
            g.value = null;
            g.textFieldID = "";
            if (this.element.tagName.toLowerCase() == "input" && this.element.type && this.element.type == "text")
            {
                g.inputText = $(this.element);
                if (this.element.id)
                    g.textFieldID = this.element.id;
            }
            else
            {
                g.inputText = $('<input type="text"/>');
                g.inputText.appendTo($(this.element));
            }
            if (g.textFieldID == "" && p.textFieldID)
                g.textFieldID = p.textFieldID;

            // g.link = $('<div class="l-trigger"><div class="l-spinner-up"><div class="l-spinner-icon"></div></div><div class="l-spinner-split"></div><div class="l-spinner-down"><div class="l-spinner-icon"></div></div></div>');
            g.link = $('<div class="l-trigger"><div class="l-spinner-up"><div class="l-spinner-icon"></div></div><div class="l-spinner-down"><div class="l-spinner-icon"></div></div></div>');
            g.wrapper = g.inputText.wrap('<div class="l-text l-text-spinner"></div>').parent();
            g.wrapper.append('<div class="l-text-l"></div><div class="l-text-r"></div>');
            g.wrapper.append(g.link).after(g.selectBox).after(g.valueField);
            g.link.up = $(".l-spinner-up", g.link);
            g.link.down = $(".l-spinner-down", g.link);
            g.inputText.addClass("l-text-field");

            if (p.disabled)
            {
                g.wrapper.addClass("l-text-disabled");
            }
            //初始化
            if (!g._isVerify(g.inputText.val()))
            {
                g.value = g._getDefaultValue();
                g.inputText.val(g.value);
            }
            //事件
            g.link.up.hover(function ()
            {
                if (!p.disabled)
                    $(this).addClass("l-spinner-up-over");
            }, function ()
            {
                clearInterval(g.interval);
                $(document).unbind("selectstart.spinner");
                $(this).removeClass("l-spinner-up-over");
            }).mousedown(function ()
            {
                if (!p.disabled)
                {
                    g.timeout = setTimeout(function(){
                        g.interval = setInterval(function ()
                        {
                            g._uping.call(g);
                        }, p.interval);
                    },p.timeout);

                    $(document).bind("selectstart.spinner", function () { return false; });
                }
            }).mouseup(function ()
            {
                if(g.interval)
                    clearInterval(g.interval);
                if(g.timeout)
                    clearTimeout(g.timeout);
                g.inputText.trigger("change").focus();
                $(document).unbind("selectstart.spinner");
            }).click(function(){
                if (!p.disabled){
                    g._uping.call(g);
                }
            });

            g.link.down.hover(function ()
            {
                if (!p.disabled)
                    $(this).addClass("l-spinner-down-over");
            }, function ()
            {
                clearInterval(g.interval);
                $(document).unbind("selectstart.spinner");
                $(this).removeClass("l-spinner-down-over");
            }).mousedown(function ()
            {
                if (!p.disabled)
                {
                    g.timeout = setTimeout(function(){
                        g.interval = setInterval(function ()
                        {
                            g._downing.call(g);
                        }, p.interval);
                    },p.timeout);
                   
                    $(document).bind("selectstart.spinner", function () { return false; });
                }
            }).mouseup(function ()
            {
                if(g.interval)
                    clearInterval(g.interval);
                if(g.timeout)
                    clearTimeout(g.timeout);
                g.inputText.trigger("change").focus();
                $(document).unbind("selectstart.spinner");
            }).click(function(){
                if (!p.disabled){
                    g._downing.call(g);
                }
                
            });

            g.inputText.change(function ()
            {
                var value = g.inputText.val();
                g.value = g._getVerifyValue(value);
                g.trigger('changeValue', [g.value]);
                g.inputText.val(g.value);
            }).blur(function ()
            {
                g.wrapper.removeClass("l-text-focus");
            }).focus(function ()
            {
                g.wrapper.addClass("l-text-focus");
            });
            g.wrapper.hover(function ()
            {
                if (!p.disabled)
                    g.wrapper.addClass("l-text-over");
            }, function ()
            {
                g.wrapper.removeClass("l-text-over");
            });
            g.set(p);
        },
        _setWidth: function (value)
        {
            var g = this;
            if (value > 30)
            {
                g.wrapper.css({ width: value });
                g.inputText.css({ width: value });
            }
        },
        _setHeight: function (value)
        {
            var g = this;
            if (value > 10)
            {
                g.wrapper.height(value);
                g.inputText.height(value - 2);
                g.link.height(value - 4);
            }
        },
        _setDisabled: function (value)
        {
            if (value)
            {
                this.wrapper.addClass("l-text-disabled");
            }
            else
            {
                this.wrapper.removeClass("l-text-disabled");
            }
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  设置value值。
         * @name  juiceSpinner#setValue
         * @param [value]  value值
         * @function
         */
        setValue: function (value)
        {
            this.inputText.val(value);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  获取value值。
         * @name  juiceSpinner#getValue
         * @return     this.inputText.val()   inputText的值。
         * @function
         */
        getValue: function ()
        {
            return this.inputText.val();
        },
        _round: function (v, e)
        {
            var g = this, p = this.options;
            var t = 1;
            for (; e > 0; t *= 10, e--);
            for (; e < 0; t /= 10, e++);
            return Math.round(v * t) / t;
        },
        _isInt: function (str)
        {
            var g = this, p = this.options;
            var strP = p.isNegative ? /^-?\d+$/ : /^\d+$/;
            if (!strP.test(str)) return false;
            if (parseFloat(str) != str) return false;
            return true;
        },
        _isFloat: function (str)
        {
            var g = this, p = this.options;
            var strP = p.isNegative ? /^-?\d+(\.\d+)?$/ : /^\d+(\.\d+)?$/;
            if (!strP.test(str)) return false;
            if (parseFloat(str) != str) return false;
            return true;
        },
        _isTime: function (str)
        {
            var g = this, p = this.options;
            var a = str.match(/^(\d{1,2}):(\d{1,2})$/);
            if (a == null) return false;
            if (a[1] > 24 || a[2] > 60) return false;
            return true;

        },
        _isVerify: function (str)
        {
            var g = this, p = this.options;
            if (p.type == 'float')
            {
                if (!g._isFloat(str)) return false;
                var value = parseFloat(str);
                if (p.minValue != undefined && p.minValue > value) return false;
                if (p.maxValue != undefined && p.maxValue < value) return false;
                return true;
            } else if (p.type == 'int')
            {
                if (!g._isInt(str)) return false;
                var value = parseInt(str);
                if (p.minValue != undefined && p.minValue > value) return false;
                if (p.maxValue != undefined && p.maxValue < value) return false;
                return true;
            } else if (p.type == 'time')
            {
                return g._isTime(str);
            }
            return false;
        },
        _getVerifyValue: function (value)
        {
            var g = this, p = this.options;
            var newvalue = null;
            if (p.type == 'float')
            {
                newvalue = g._round(value, p.decimalplace);
            } else if (p.type == 'int')
            {
                newvalue = parseInt(value);
            } else if (p.type == 'time')
            {
                newvalue = value;
            }
            if (!g._isVerify(newvalue))
            {
                return g.value;
            } else
            {
                return newvalue;
            }
        },
        _isOverValue: function (value)
        {
            var g = this, p = this.options;
            if (p.minValue != null && p.minValue > value) return true;
            if (p.maxValue != null && p.maxValue < value) return true;
            return false;
        },
        _getDefaultValue: function ()
        {
            var g = this, p = this.options;
            if (p.type == 'float' || p.type == 'int') { return 0; }
            else if (p.type == 'time') { return "00:00"; }
        },
        _addValue: function (num)
        {
            var g = this, p = this.options;
            var value = g.inputText.val();
            value = parseFloat(value) + num;
            if (g._isOverValue(value)) return;
            g.inputText.val(value);
            g.inputText.trigger("change");
        },
        _addTime: function (minute)
        {
            var g = this, p = this.options;
            var value = g.inputText.val();
            var a = value.match(/^(\d{1,2}):(\d{1,2})$/);
            newminute = parseInt(a[2]) + minute;
            if (newminute < 10) newminute = "0" + newminute;
            value = a[1] + ":" + newminute;
            if (g._isOverValue(value)) return;
            g.inputText.val(value);
            g.inputText.trigger("change");
        },
        _uping: function ()
        {
            var g = this, p = this.options;
            if (p.type == 'float' || p.type == 'int')
            {
                g._addValue(p.step);
            } else if (p.type == 'time')
            {
                g._addTime(p.step);
            }
        },
        _downing: function ()
        {
            var g = this, p = this.options;
            if (p.type == 'float' || p.type == 'int')
            {
                g._addValue(-1 * p.step);
            } else if (p.type == 'time')
            {
                g._addTime(-1 * p.step);
            }
        },
        _isDateTime: function (dateStr)
        {
            var g = this, p = this.options;
            var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            if (d == "NaN") return false;
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        },
        _isLongDateTime: function (dateStr)
        {
            var g = this, p = this.options;
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
            var r = dateStr.match(reg);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6]);
            if (d == "NaN") return false;
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6]);
        }
    });


})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/

(function ($)
{
    /**
     * @name   juiceTip
     * @class   juiceTip 是属性加载结构类。
     * @constructor
     * @desc 构造函数；
     * @namespace  <h3><font color="blue">juiceTip &nbsp;API 注解说明</font></h3>
     */
    //气泡,可以在指定位置显示
    $.juiceTip = function (p)
    {
        return $.jui.run.call(null, "juiceTip", arguments);
    };

    //target：将jui对象ID附加上
    /**
     *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在指定Dom Element右侧显示气泡。
     * @name   juiceTip#juiceTip
     * @param  [options]   所选对象
     * @return     $.jui.get(this, 'juitipid')   jui对象ID
     * @function
     */
    $.fn.juiceTip = function (options)
    {
        this.each(function ()
        {
            var p = $.extend({}, $.juiceDefaults.ElementTip, options || {});
            p.target = p.target || this;
            //如果是自动模式：鼠标经过时显示，移开时关闭
            if (p.auto || options == undefined)
            {
                if (!p.content)
                {
                    p.content = this.title;
                    if (p.removeTitle)
                        $(this).removeAttr("title");
                }
                p.content = p.content || this.title;
                $(this).bind('mouseover.tip', function ()
                {
                    p.x = $(this).offset().left + $(this).width() + (p.distanceX || 0);
                    p.y = $(this).offset().top + (p.distanceY || 0);
                    $.juiceTip(p);
                }).bind('mouseout.tip', function ()
                {

                    var tipmanager = $.jui.managers[this.juitipid];
                    if (tipmanager)
                    {
                        tipmanager.remove();
                    }
                });
            }
            else
            {
                if (p.target.juitipid) return;
                p.x = $(this).offset().left + $(this).width() + (p.distanceX || 0);
                p.y = $(this).offset().top + (p.distanceY || 0);
                p.x = p.x || 0;
                p.y = p.y || 0;
                $.juiceTip(p);
            }
        });
        return $.jui.get(this, 'juitipid');
    };
    /**
     *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;关闭指定在Dom Element(附加了jui对象ID,属性名"juitipid")显示的气泡。
     * @name   juiceTip#juiceHideTip
     * @param  [options]   所选对象
     * @function
     */
    $.fn.juiceHideTip = function (options)
    {
        return this.each(function ()
        {
            var p = options || {};
            if (p.isLabel == undefined)
            {
                //如果是lable，将查找指定的input，并找到jui对象ID
                p.isLabel = this.tagName.toLowerCase() == "label" && $(this).attr("for") != null;
            }
            var target = this;
            if (p.isLabel)
            {
                var forele = $("#" + $(this).attr("for"));
                if (forele.length == 0) return;
                target = forele[0];
            }
            var tipmanager = $.jui.managers[target.juitipid];
            if (tipmanager)
            {
                tipmanager.remove();
            }
        }).unbind('mouseover.tip').unbind('mouseout.tip');
    };


    $.fn.juiceGetTipManager = function ()
    {
        return $.jui.get(this);
    };


    $.juiceDefaults = $.juiceDefaults || {};


    //隐藏气泡
    $.juiceDefaults.HideTip = {};

    //气泡
    $.juiceDefaults.Tip =/**@lends juiceTip#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 内容 。
         * @default null
         * @type Object
         */
        content: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  回调函数 。
         * @default null
         * @type  function
         */
        callback: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度  。
         * @default 150
         * @type   Number
         */
        width: 150,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度  。
         * @default null
         * @type   Object
         */
        height: null,
        x: 0,
        y: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 保存ID到那一个对象(jQuery)(待移除)  。
         * @default null
         * @type   Object
         */
        appendIdTo: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 目标对象 。
         * @default null
         * @type   Object
         */
        target: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否自动模式，如果是，那么：鼠标经过时显示，移开时关闭,并且当content为空时自动读取attr[title] 。
         * @default null
         * @type   Object
         */
        auto: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 自动模式时，默认是否移除掉title 。
         * @default true
         * @type   Boolean
         */
        removeTitle: true
    };

    //在指定Dom Element右侧显示气泡,通过$.fn.juiceTip调用
    $.juiceDefaults.ElementTip = {
        distanceX: 1,
        distanceY: -3,
        auto: null,
        removeTitle: true
    };

    $.juiceMethos.Tip = {};

    $.jui.controls.Tip = function (options)
    {
        $.jui.controls.Tip.base.constructor.call(this, null, options);
    };
    $.jui.controls.Tip.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Tip';
        },
        __idPrev: function ()
        {
            return 'Tip';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Tip;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            var tip = $('<div class="l-verify-tip"><div class="l-verify-tip-corner"></div><div class="l-verify-tip-content"></div></div>');
            g.tip = tip;
            g.tip.attr("id", g.id);
            if (p.content)
            {
                $("> .l-verify-tip-content:first", tip).html(p.content);
                tip.appendTo('body');
            }
            else
            {
                return;
            }
            tip.css({ left: p.x, top: p.y }).show();
            p.width && $("> .l-verify-tip-content:first", tip).width(p.width - 8);
            p.height && $("> .l-verify-tip-content:first", tip).width(p.height);
            eee = p.appendIdTo;
            if (p.appendIdTo)
            {
                p.appendIdTo.attr("juiceTipId", g.id);
            }
            if (p.target)
            {
                $(p.target).attr("juiceTipId", g.id);
                p.target.juitipid = g.id;
            }
            p.callback && p.callback(tip);
            g.set(p);
        },
        _setContent: function (content)
        {
            $("> .l-verify-tip-content:first", this.tip).html(content);
        },
        remove: function ()
        {
            if (this.options.appendIdTo)
            {
                this.options.appendIdTo.removeAttr("juiceTipId");
            }
            if (this.options.target)
            {
                $(this.options.target).removeAttr("juiceTipId");
                this.options.target.juitipid = null;
            }
            this.tip.remove();
        }
    });
})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{
    /**
     * @name   juiceWindow
     * @class   juiceWindow 是属性加载结构类。
     * @constructor
     * @desc 构造函数；
     * @namespace  <h3><font color="blue">juiceWindow &nbsp;API 注解说明</font></h3>
     */
    var l = $.jui;

    l.windowCount = 0;

    $.juiceWindow = function (options)
    {
        return l.run.call(null, "juiceWindow", arguments, { isStatic: true });
    };

    $.juiceWindow.show = function (p)
    {
        return $.juiceWindow(p);
    };

    $.juiceDefaults.Window = /**@lends juiceWindow#*/{
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否关闭当前显示页 。
         * @default true
         * @type Boolean
         */
        showClose: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示最大化按钮 。
         * @default true
         * @type Boolean
         */
        showMax: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示显示/隐藏窗口 。
         * @default true
         * @type Boolean
         */
        showToggle: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示最小化按钮 。
         * @default true
         * @type Boolean
         */
        showMin: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 标题显示 。
         * @default window
         * @type String
         */
        title: 'window',
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否加载页面 。
         * @default false
         * @type Boolean
         */
        load: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 加载页面事件 。
         * @default null
         * @type event
         */
        onLoaded: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否模态窗口 。
         * @default false
         * @type Boolean
         */
        modal: false
    };

    $.juiceMethos.Window = {};

    l.controls.Window = function (options)
    {
        l.controls.Window.base.constructor.call(this, null, options);
    };
    l.controls.Window.juiceExtend(l.core.Win, {
        __getType: function ()
        {
            return 'Window';
        },
        __idPrev: function ()
        {
            return 'Window';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Window;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.window = $('<div class="l-window"><div class="l-window-header"><div class="l-window-header-buttons"><div class="l-window-toggle"></div><div class="l-window-max"></div><div class="l-window-close"></div><div class="l-clear"></div></div><div class="l-window-header-inner"></div></div><div class="l-window-content"></div></div>');
            g.element = g.window[0];
            g.window.content = $(".l-window-content", g.window);
            g.window.header = $(".l-window-header", g.window);
            g.window.buttons = $(".l-window-header-buttons:first", g.window);
            if (p.url)
            {
                if (p.load)
                {
                    g.window.content.load(p.url, function ()
                    {
                        g.trigger('loaded');
                    });
                    g.window.content.addClass("l-window-content-scroll");
                }
                else
                {
                    var iframe = $("<iframe frameborder='0' src='" + p.url + "'></iframe>");
                    var framename = "juiwindow" + l.windowCount++;
                    if (p.name) framename = p.name;
                    iframe.attr("name", framename).attr("id", framename);
                    p.framename = framename;
                    iframe.appendTo(g.window.content);
                    g.iframe = iframe;
                }
            }
            else if (p.content)
            {
                var content = $("<div>" + p.content + "</div>");
                content.appendTo(g.window.content);
            }
            else if (p.target)
            {
                g.window.content.append(p.target);
                p.target.show();
            }



            this.mask();

            g.active();

            $('body').append(g.window);

            g.set({ width: p.width, height: p.height });
            //位置初始化
            var left = 0;
            var top = 0;
            if (p.left != null) left = p.left;
            else p.left = left = 0.5 * ($(window).width() - g.window.width());
            if (p.top != null) top = p.top;
            else p.top = top = 0.5 * ($(window).height() - g.window.height()) + $(window).scrollTop() - 10;
            if (left < 0) p.left = left = 0;
            if (top < 0) p.top = top = 0;


            g.set(p);

            p.framename && $(">iframe", g.window.content).attr('name', p.framename);
            if (!p.showToggle) $(".l-window-toggle", g.window).remove();
            if (!p.showMax) $(".l-window-max", g.window).remove();
            if (!p.showClose) $(".l-window-close", g.window).remove();

            g._saveStatus();

            //拖动支持
            if ($.fn.juiceDrag)
            {
                g.draggable = g.window.drag = g.window.juiceDrag({ handler: '.l-window-header-inner', onStartDrag: function ()
                {
                    g.active();
                }, onStopDrag: function ()
                {
                    g._saveStatus();
                }, animate: false
                });
            }
            //改变大小支持
            if ($.fn.juiceResizable)
            {
                g.resizeable = g.window.resizable = g.window.juiceResizable({
                    onStartResize: function ()
                    {
                        g.active();
                        $(".l-window-max", g.window).removeClass("l-window-regain");
                    },
                    onStopResize: function (current, e)
                    {
                        var top = 0;
                        var left = 0;
                        if (!isNaN(parseInt(g.window.css('top'))))
                            top = parseInt(g.window.css('top'));
                        if (!isNaN(parseInt(g.window.css('left'))))
                            left = parseInt(g.window.css('left'));
                        if (current.diffTop)
                            g.window.css({ top: top + current.diffTop });
                        if (current.diffLeft)
                            g.window.css({ left: left + current.diffLeft });
                        if (current.newWidth)
                            g.window.width(current.newWidth);
                        if (current.newHeight)
                            g.window.content.height(current.newHeight - 28);

                        g._saveStatus();
                        return false;
                    }
                });
                g.window.append("<div class='l-btn-nw-drop'></div>");
            }
            //设置事件 
            $(".l-window-toggle", g.window).click(function ()
            {
                if ($(this).hasClass("l-window-toggle-close"))
                {
                    g.collapsed = false;
                    $(this).removeClass("l-window-toggle-close");
                } else
                {
                    g.collapsed = true;
                    $(this).addClass("l-window-toggle-close");
                }
                g.window.content.slideToggle();
            }).hover(function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', true);
            }, function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', false);
            });
            $(".l-window-close", g.window).click(function ()
            {
                if (g.trigger('close') == false) return false;
                g.window.hide();
                l.win.removeTask(g);
            }).hover(function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', true);
            }, function ()
            {
                if (g.window.drag)
                    g.window.drag.set('disabled', false);
            });
            $(".l-window-max", g.window).click(function ()
            {
                if ($(this).hasClass("l-window-regain"))
                {
                    if (g.trigger('regain') == false) return false;
                    g.window.width(g._width).css({ left: g._left, top: g._top });
                    g.window.content.height(g._height - 28);
                    $(this).removeClass("l-window-regain");
                }
                else
                {
                    if (g.trigger('max') == false) return false;
                    g.window.width($(window).width() - 2).css({ left: 0, top: 0 });
                    g.window.content.height($(window).height() - 28).show();
                    $(this).addClass("l-window-regain");
                }
            });
        },
        _saveStatus: function ()
        {
            var g = this;
            g._width = g.window.width();
            g._height = g.window.height();
            var top = 0;
            var left = 0;
            if (!isNaN(parseInt(g.window.css('top'))))
                top = parseInt(g.window.css('top'));
            if (!isNaN(parseInt(g.window.css('left'))))
                left = parseInt(g.window.css('left'));
            g._top = top;
            g._left = left;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 最小化当前窗口。
         * @name   juiceWindow#min
         * @function
         */
        min: function ()
        {
            this.window.hide();
            this.minimize = true;
            this.actived = false;
        },
        _setShowMin: function (value)
        {
            var g = this, p = this.options;
            if (value)
            {
                if (!g.winmin)
                {
                    g.winmin = $('<div class="l-window-min"></div>').prependTo(g.window.buttons)
                    .click(function ()
                    {
                        g.min();
                    });
                    l.win.addTask(g);
                }
            }
            else if (g.winmin)
            {
                g.winmin.remove();
                g.winmin = null;
            }
        },
        _setLeft: function (value)
        {
            if (value != null)
                this.window.css({ left: value });
        },
        _setTop: function (value)
        {
            if (value != null)
                this.window.css({ top: value });
        },
        _setWidth: function (value)
        {
            if (value > 0)
                this.window.width(value);
        },
        _setHeight: function (value)
        {
            if (value > 28)
                this.window.content.height(value - 28);
        },
        _setTitle: function (value)
        {
            if (value)
                $(".l-window-header-inner", this.window.header).html(value);
        },
        _setUrl: function (url)
        {
            var g = this, p = this.options;
            p.url = url;
            if (p.load)
            {
                g.window.content.html("").load(p.url, function ()
                {
                    if (g.trigger('loaded') == false) return false;
                });
            }
            else if (g.jiframe)
            {
                g.jiframe.attr("src", p.url);
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 隐藏对话框。
         * @name   juiceWindow#hide
         * @function
         */
        hide: function ()
        {
            var g = this, p = this.options;
            this.unmask();
            this.window.hide();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 显示对话框。
         * @name   juiceWindow#show
         * @function
         */
        show: function ()
        {
            var g = this, p = this.options;
            this.mask();
            this.window.show();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除对话框。
         * @name   juiceWindow#remove
         * @function
         */
        remove: function ()
        {
            var g = this, p = this.options;
            this.unmask();
            this.window.remove();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置为最前端显示。
         * @name   juiceWindow#active
         * @function
         */
        active: function ()
        {
            var g = this, p = this.options;
            if (g.minimize)
            {
                var width = g._width, height = g._height, left = g._left, top = g._top;
                if (g.maximum)
                {
                    width = $(window).width();
                    height = $(window).height();
                    left = top = 0;
                    if (l.win.taskbar)
                    {
                        height -= l.win.taskbar.outerHeight();
                        if (l.win.top) top += l.win.taskbar.outerHeight();
                    }
                }
                g.set({ width: width, height: height, left: left, top: top });
            }
            g.actived = true;
            g.minimize = false;
            l.win.setFront(g);
            g.show();
            l.win.setFront(this);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置URL。
         * @name   juiceWindow#setUrl
         * @param [url]  数据源url。
         * @function
         */
        setUrl: function (url)
        {
            return _setUrl(url);
        }
    });

})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{

    $.fn.juiceToolBar = function (options)
    {
        return $.jui.run.call(this, "juiceToolBar", arguments);
    };

    $.fn.juiceGetToolBarManager = function ()
    {
        return $.jui.run.call(this, "juiceGetToolBarManager", arguments);
    };

    $.juiceDefaults.ToolBar = {};

    $.juiceMethos.ToolBar = {};

    $.jui.controls.ToolBar = function (element, options)
    {
        $.jui.controls.ToolBar.base.constructor.call(this, element, options);
    };
    $.jui.controls.ToolBar.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'ToolBar';
        },
        __idPrev: function ()
        {
            return 'ToolBar';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.ToolBar;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.toolBar = $(this.element);
            g.toolBar.addClass("l-toolbar");
            g.set(p);
        },
        _setItems: function (items)
            {
            var g = this,p = this.options;
            var isReverse = (p.align&&p.align=="right");
            $(isReverse?items.reverse():items).each(function (i, item)
            {
                g.addItem(item);
            });
        },
        addItem: function (item)
        {
            var g = this, p = this.options;
            if (item.line)
            {
                var sep = $('<div class="l-bar-separator"></div>');
                g.toolBar.append(sep);            
                if(p.align&&p.align=="right"){
                    sep.css("float","right");
                }
                return;
            }
            var ditem = $('<div class="l-toolbar-item l-panel-btn"></div>');
            g.toolBar.append(ditem);
            if(p.align&&p.align=="right"){
                ditem.css("float","right");
            }
            item.id && ditem.attr("toolbarid", item.id);
            if (item.img)
            {
                ditem.append("<img src='" + item.img + "' />");
                ditem.addClass("l-toolbar-item-hasicon");
            }
            else if (item.icon)
            {
                ditem.append("<div class='l-icon l-icon-" + item.icon + "'></div>");
                ditem.addClass("l-toolbar-item-hasicon");
            }

            ditem.append("<span></span>");

            item.text && $("span:first", ditem).html(item.text);
            item.disable && ditem.addClass("l-toolbar-item-disable");
            item.click && ditem.click(function () { item.click(item); });
            ditem.hover(function ()
            {
                $(this).addClass("l-panel-btn-over");
            }, function ()
            {
                $(this).removeClass("l-panel-btn-over");
            });
        }
    });
})(jQuery);﻿/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 */
(function ($)
{
    /**
     * @name   juiceTab
     * @class   juiceTab 是属性加载结构类。
     * @constructor
     * @description 构造函数。
     * @namespace  <h3><font color="blue">juiceTab &nbsp;API 注解说明</font></h3>
     */
    $.fn.juiceTab = function (options)
    {
        return $.jui.run.call(this, "juiceTab", arguments);
    };

    $.fn.juiceGetTabManager = function ()
    {
        return $.jui.run.call(this, "juiceGetTabManager", arguments);
    };
    /**@lends juiceTab#*/
    $.juiceDefaults.Tab ={
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度。
         * @default null
         * @type Object
         */
        height: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 高度补差。
         * @default 0
         * @type Number
         */
        heightDiff: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否随窗体的改变而改变高度。
         * @default false
         * @type Boolean
         */
        changeHeightOnResize: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否显示右键菜单。
         * @default true
         * @type Boolean
         */
        contextmenu: true,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否双击时关闭。
         * @default false
         * @type Boolean
         */
        dblClickToClose: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 是否允许拖动时改变tab项的位置。
         * @default false
         * @type Boolean
         */
        dragToMove: false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;覆盖tab项前事件，可以通过return false阻止操作  。
         * @default null
         * @type event
         */
        onBeforeOverrideTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;覆盖tab项后事件  。
         * @default null
         * @type event
         */
        onAfterOverrideTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除tab项前事件，可以通过return false阻止操作 。
         * @default null
         * @type event
         */
        onBeforeRemoveTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除tab项后事件 。
         * @default null
         * @type event
         */
        onAfterRemoveTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加tab项前事件，可以通过return false阻止操作 。
         * @default null
         * @type event
         */
        onBeforeAddTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加tab项后事件 。
         * @default null
         * @type event
         */
        onAfterAddTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选择tab项前事件，可以通过return false阻止操作 。
         * @default null
         * @type event
         */
        onBeforeSelectTabItem: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  选择tab项后事件。
         * @default null
         * @type event
         */
        onAfterSelectTabItem: null
    };
    $.juiceDefaults.TabString = {
        closeMessage: "关闭当前页",
        closeOtherMessage: "关闭其他",
        closeAllMessage: "关闭所有",
        reloadMessage: "刷新"
    };

    $.juiceMethos.Tab = {};

    $.jui.controls.Tab = function (element, options)
    {
        $.jui.controls.Tab.base.constructor.call(this, element, options);
    };
    $.jui.controls.Tab.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Tab';
        },
        __idPrev: function ()
        {
            return 'Tab';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Tab;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            if (p.height) g.makeFullHeight = true;
            g.tab = $(this.element);
            g.tab.addClass("l-tab");
            if (p.contextmenu && $.juiceMenu)
            {
                g.tab.menu = $.juiceMenu({ width: 100, items: [
                    { text: p.closeMessage, id: 'close', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    },
                    { text: p.closeOtherMessage, id: 'closeother', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    },
                    { text: p.closeAllMessage, id: 'closeall', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    },
                    { text: p.reloadMessage, id: 'reload', click: function ()
                    {
                        g._menuItemClick.apply(g, arguments);
                    }
                    }
                ]
                });
            }
            g.tab.content = $('<div class="l-tab-content"></div>');
            $("> div", g.tab).appendTo(g.tab.content);
            g.tab.content.appendTo(g.tab);
            g.tab.links = $('<div class="l-tab-links"><ul style="left: 0px; "></ul></div>');
            g.tab.links.prependTo(g.tab);
            g.tab.links.ul = $("ul", g.tab.links);
            var lselecteds = $("> div[lselected=true]", g.tab.content);
            var haslselected = lselecteds.length > 0;
            g.selectedTabId = lselecteds.attr("tabid");
            $("> div", g.tab.content).each(function (i, box)
            {
                var li = $('<li class=""><a></a></li>');
                var contentitem = $(this);
                if (contentitem.attr("title"))
                {
                    $("> a", li).html(contentitem.attr("title"));
                    contentitem.attr("title", "");
                }
                var tabid = contentitem.attr("tabid");
                if (tabid == undefined)
                {
                    tabid = g.getNewTabid();
                    contentitem.attr("tabid", tabid);
                    if (contentitem.attr("lselected"))
                    {
                        g.selectedTabId = tabid;
                    }
                }
                li.attr("tabid", tabid);
                if (!haslselected && i == 0) g.selectedTabId = tabid;
                var showClose = contentitem.attr("showClose");
                if (showClose)
                {
                    li.append("<div class='l-tab-links-item-close'></div>");
                }
                $("> ul", g.tab.links).append(li);
                if (!contentitem.hasClass("l-tab-content-item")) contentitem.addClass("l-tab-content-item");
                if (contentitem.find("iframe").length > 0)
                {
                    var iframe = $("iframe:first", contentitem);
                    if (iframe[0].readyState != "complete")
                    {
                        if (contentitem.find(".l-tab-loading:first").length == 0)
                            contentitem.prepend("<div class='l-tab-loading' style='display:block;'></div>");
                        var iframeloading = $(".l-tab-loading:first", contentitem);
                        iframe.bind('load.tab', function ()
                        {
                            iframeloading.hide();
                        });
                    }
                }
            });
            //init 
            g.selectTabItem(g.selectedTabId);
            //set content height
            if (p.height)
            {
                if (typeof (p.height) == 'string' && p.height.indexOf('%') > 0)
                {
                    g.onResize();
                    if (p.changeHeightOnResize)
                    {
                        $(window).resize(function ()
                        {
                            g.onResize.call(g);
                        });
                    }
                } else
                {
                    g.setHeight(p.height);
                }
            }
            if (g.makeFullHeight)
                g.setContentHeight();
            //add even 
            $("li", g.tab.links).each(function ()
            {
                g._addTabItemEvent($(this));
            });
            g.tab.bind('dblclick.tab', function (e)
            {
                if (!p.dblClickToClose) return;
                g.dblclicking = true;
                var obj = (e.target || e.srcElement);
                var tagName = obj.tagName.toLowerCase();
                if (tagName == "a")
                {
                    var tabid = $(obj).parent().attr("tabid");
                    var allowClose = $(obj).parent().find("div.l-tab-links-item-close").length ? true : false;
                    if (allowClose)
                    {
                        g.removeTabItem(tabid);
                    }
                }
                g.dblclicking = false;
            });

            g.set(p);
        },
        _applyDrag: function (tabItemDom)
        {
            var g = this, p = this.options;
            g.droptip = g.droptip || $("<div class='l-tab-drag-droptip' style='display:none'><div class='l-drop-move-up'></div><div class='l-drop-move-down'></div></div>").appendTo('body');
            var drag = $(tabItemDom).juiceDrag(
                {
                    revert: true, animate: false,
                    proxy: function ()
                    {
                        var name = $(this).find("a").html();
                        g.dragproxy = $("<div class='l-tab-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div></div>").appendTo('body');
                        g.dragproxy.append(name);
                        return g.dragproxy;
                    },
                    onRendered: function ()
                    {
                        this.set('cursor', 'pointer');
                    },
                    onStartDrag: function (current, e)
                    {
                        if (!$(tabItemDom).hasClass("l-selected")) return false;
                        if (e.button == 2) return false;
                        var obj = e.srcElement || e.target;
                        if ($(obj).hasClass("l-tab-links-item-close")) return false;
                    },
                    onDrag: function (current, e)
                    {
                        if (g.dropIn == null)
                            g.dropIn = -1;
                        var tabItems = g.tab.links.ul.find('>li');
                        var targetIndex = tabItems.index(current.target);
                        tabItems.each(function (i, item)
                        {
                            if (targetIndex == i)
                            {
                                return;
                            }
                            var isAfter = i > targetIndex;
                            if (g.dropIn != -1 && g.dropIn != i) return;
                            var offset = $(this).offset();
                            var range = {
                                top: offset.top,
                                bottom: offset.top + $(this).height(),
                                left: offset.left - 10,
                                right: offset.left + 10
                            };
                            if (isAfter)
                            {
                                range.left += $(this).width();
                                range.right += $(this).width();
                            }
                            var pageX = e.pageX || e.screenX;
                            var pageY = e.pageY || e.screenY;
                            if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom)
                            {
                                g.droptip.css({
                                    left: range.left + 5,
                                    top: range.top - 9
                                }).show();
                                g.dropIn = i;
                                g.dragproxy.find(".l-drop-icon").removeClass("l-drop-no").addClass("l-drop-yes");
                            }
                            else
                            {
                                g.dropIn = -1;
                                g.droptip.hide();
                                g.dragproxy.find(".l-drop-icon").removeClass("l-drop-yes").addClass("l-drop-no");
                            }
                        });
                    },
                    onStopDrag: function (current, e)
                    {
                        if (g.dropIn > -1)
                        {
                            var to = g.tab.links.ul.find('>li:eq(' + g.dropIn + ')').attr("tabid");
                            var from = $(current.target).attr("tabid");
                            setTimeout(function ()
                            {
                                g.moveTabItem(from, to);
                            }, 0);
                            g.dropIn = -1;
                            g.dragproxy.remove();
                        }
                        g.droptip.hide();
                        this.set('cursor', 'default');
                    }
                });
            return drag;
        },
        _setDragToMove: function (value)
        {
            if (!$.fn.juiceDrag) return; //需要juiceDrag的支持
            var g = this, p = this.options;
            if (value)
            {
                if (g.drags) return;
                g.drags = g.drags || [];
                g.tab.links.ul.find('>li').each(function ()
                {
                    g.drags.push(g._applyDrag(this));
                });
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 切换两个tab项的位置。
         * @name   juiceTab#moveTabItem
         * @param [fromTabItemID]   其中一个tab项
         * @param [toTabItemID]    另一个tab项
         * @function
         */
        moveTabItem: function (fromTabItemID, toTabItemID)
        {
            var g = this;
            var from = g.tab.links.ul.find(">li[tabid=" + fromTabItemID + "]");
            var to = g.tab.links.ul.find(">li[tabid=" + toTabItemID + "]");
            var index1 = g.tab.links.ul.find(">li").index(from);
            var index2 = g.tab.links.ul.find(">li").index(to);
            if (index1 < index2)
            {
                to.after(from);
            }
            else
            {
                to.before(from);
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置tab按钮(左和右),显示返回true,隐藏返回false。
         * @name   juiceTab#setTabButton
         * @return true|false
         * @function
         */
        setTabButton: function ()
        {
            var g = this, p = this.options;
            var items = $("li", g.tab.links);

            var lastItem = items[items.length-1];
            var lastItemRight = $(lastItem).position().left + $(lastItem).width();

            var mainwidth = g.tab.width();
            if (lastItemRight > mainwidth)
            {
                if($(".l-tab-links-right", g.tab.links).length == 0)
                {
                    g.tab.links.append('<div class="l-tab-links-left"></div><div class="l-tab-links-right"></div>');
                    g.setTabButtonEven();
                }
                return true;
            } else
            {
                g.tab.links.ul.animate({ left: 0 });
                $(".l-tab-links-left,.l-tab-links-right", g.tab.links).remove();
                return false;
            }
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置左右按钮的事件 标签超出最大宽度时，可左右拖动。
         * @name   juiceTab#setTabButtonEven
         * @function
         */
        setTabButtonEven: function ()
        {
            var g = this, p = this.options;

            $(".l-tab-links-left", g.tab.links).hover(function ()
            {
                $(this).addClass("l-tab-links-left-over");
            }, function ()
            {
                $(this).removeClass("l-tab-links-left-over");
            }).click(function ()
                {
                    g.moveToPrevTabItem();
                });
            $(".l-tab-links-right", g.tab.links).hover(function ()
            {
                $(this).addClass("l-tab-links-right-over");
            }, function ()
            {
                $(this).removeClass("l-tab-links-right-over");
            }).click(function ()
                {
                    g.moveToNextTabItem();
                });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 切换到上一个tab。
         * @name   juiceTab#moveToPrevTabItem
         * @function
         */
        moveToPrevTabItem: function ()
        {
            var g = this, p = this.options;
            var btnWitdth = $(".l-tab-links-left", g.tab.links).width();
            
            var currentLeft = g.tab.links.ul.position().left - btnWitdth;

            var items = $("li", g.tab.links);
            for(var i = items.length-1 ; i >=0; i--){
                var item = items[i];
                var itemLeft = $(item).position().left;
                if(itemLeft < (-1*currentLeft)){
                    if(i-1 < 0) return;
                    g.tab.links.ul.animate({ left: (-1*$(items[i-1]).position().left + 15) });
                    return;
                }
            }

            
            
            
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 切换到下一个tab。
         * @name   juiceTab#moveToNextTabItem
         * @function
         */
        moveToNextTabItem: function ()
        {
            var g = this, p = this.options;
            var btnWitdth = $(".l-tab-links-left", g.tab.links).width();
            
            var ulWidth = g.tab.width();
            var currentLeft = g.tab.links.ul.position().left;

            var items = $("li", g.tab.links);

            for(var i = 0; i < items.length; i++){
                var item = items[i];
                var itemLeft = $(item).position().left;
                var itemRight = $(item).position().left + $(item).width();
                if((itemRight + currentLeft) > ulWidth){
                    g.tab.links.ul.animate({ left:(-(itemRight -  ulWidth) - 51)});
                    return;
                }
            }

        },

        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  获取tab item 的数量。
         * @name   juiceTab#getTabItemCount
         * @return int
         * @function
         */
         getTabItemCount: function ()
        {
            var g = this, p = this.options;
            return $("li", g.tab.links.ul).length;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取tab seelcted item 的tabid 。
         * @name   juiceTab#getSelectedTabItemID
         * @return int
         * @function
         */
        getSelectedTabItemID: function ()
        {
            var g = this, p = this.options;
            return $("li.l-selected", g.tab.links.ul).attr("tabid");
        },
        getSelectedTabItem: function ()
        {
            var g = this, p = this.options;
            return $("li.l-selected", g.tab.links.ul);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除选中的tabitem。
         * @name   juiceTab#removeSelectedTabItem
         * @function
         */
        removeSelectedTabItem: function ()
        {
            var g = this, p = this.options;
            g.removeTabItem(g.getSelectedTabItemID());
        },
        //覆盖选择的tabitem
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 覆盖选中的Tab项 。
         * @name   juiceTab#overrideSelectedTabItem
         * @param [options] 选中的项
         * @function
         */
        overrideSelectedTabItem: function (options)
        {
            var g = this, p = this.options;
            g.overrideTabItem(g.getSelectedTabItemID(), options);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 覆盖指定的Tab项 。
         * @name   juiceTab#overrideTabItem
         * @param [targettabid]  预覆盖的内容项
         * @param [options]  指定的tab项
         * @function
         */
        overrideTabItem: function (targettabid, options)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeOverrideTabItem', [targettabid]) == false)
                return false;
            var tabid = options.tabid;
            if (tabid == undefined) tabid = g.getNewTabid();
            var url = options.url;
            var content = options.content;
            var target = options.target;
            var text = options.text;
            var showClose = options.showClose;
            var height = options.height;
            //如果已经存在
            if (g.isTabItemExist(tabid))
            {
                return;
            }
            var tabitem = $("li[tabid=" + targettabid + "]", g.tab.links.ul);
            var contentitem = $(".l-tab-content-item[tabid=" + targettabid + "]", g.tab.content);
            if (!tabitem || !contentitem) return;
            tabitem.attr("tabid", tabid);
            contentitem.attr("tabid", tabid);
            if ($("iframe", contentitem).length == 0 && url)
            {
                contentitem.html("<iframe frameborder='0' style='overflow: hidden;'></iframe>");
            }
            else if (content)
            {
                contentitem.html(content);
            }
            $("iframe", contentitem).attr("name", tabid);
            if (showClose == undefined) showClose = true;
            if (showClose == false) $(".l-tab-links-item-close", tabitem).remove();
            else
            {
                if ($(".l-tab-links-item-close", tabitem).length == 0)
                    tabitem.append("<div class='l-tab-links-item-close'></div>");
            }
            if (text == undefined) text = tabid;
            if (height) contentitem.height(height);
            $("a", tabitem).text(text);
            $("iframe", contentitem).attr("src", url);


            g.trigger('afterOverrideTabItem', [targettabid]);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 选中tab项 。
         * @name   juiceTab#selectTabItem
         * @param [tabid] 表格id
         * @function
         */
        selectTabItem: function (tabid)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeSelectTabItem', [tabid]) == false)
                return false;
            g.selectedTabId = tabid;
            $("> .l-tab-content-item[tabid=" + tabid + "]", g.tab.content).show().siblings().hide();
            $("li[tabid=" + tabid + "]", g.tab.links.ul).addClass("l-selected").siblings().removeClass("l-selected");
            g.trigger('afterSelectTabItem', [tabid]);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 移动到最后一个tab 。
         * @name   juiceTab#moveToLastTabItem
         * @function
         */
        moveToLastTabItem: function ()
        {
            var g = this, p = this.options;
            var btnWitdth = $(".l-tab-links-left", g.tab.links).width();
            
            var ulWidth = g.tab.width();
            var currentLeft = g.tab.links.ul.position().left;

            var items = $("li", g.tab.links);
            var lastItem = items[items.length-1];
            var lastItemRight = $(lastItem).position().left + $(lastItem).width();
            if((lastItemRight + currentLeft) > ulWidth){
                g.tab.links.ul.animate({ left:(-(lastItemRight -  ulWidth) - 51)});
                return;
            }

            
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 判断tab是否存在 。
         * @name   juiceTab#isTabItemExist
         * @param  [tabid]  表格id
         * @function
         */
        isTabItemExist: function (tabid)
        {
            var g = this, p = this.options;
            return $("li[tabid=" + tabid + "]", g.tab.links.ul).length > 0;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加一个tab 。
         * @name   juiceTab#addTabItem
         * @param [options]  所选项
         * @function
         */
        addTabItem: function (options)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeAddTabItem', [tabid]) == false)
                return false;
            var tabid = options.tabid;
            if (tabid == undefined) tabid = g.getNewTabid();
            var url = options.url;
            var content = options.content;
            var text = options.text;
            var showClose = options.showClose;
            var height = options.height;
            //如果已经存在
            if (g.isTabItemExist(tabid))
            {
                g.selectTabItem(tabid);
                return;
            }
            var tabitem = $("<li><a></a><div class='l-tab-links-item-close'></div></li>");
            var contentitem = $("<div class='l-tab-content-item'><div class='l-tab-loading' style='display:block;'></div><iframe frameborder='0' style='overflow: hidden;'></iframe></div>");
            var iframeloading = $("div:first", contentitem);
            var iframe = $("iframe:first", contentitem);
            if (g.makeFullHeight)
            {
                var newheight = g.tab.height() - g.tab.links.height();
                contentitem.height(newheight);
            }
            tabitem.attr("tabid", tabid);
            contentitem.attr("tabid", tabid);
            if (url)
            {
                iframe.attr("name", tabid)
                    .attr("id", tabid)
                    .attr("src", url)
                    .bind('load.tab', function ()
                    {
                        iframeloading.hide();
                        if (options.callback)
                            options.callback();
                    });
            }
            else
            {
                iframe.remove();
                iframeloading.remove();
            }
            if (content)
            {
                contentitem.html(content);
            }
            else if (options.target)
            {
                contentitem.append(options.target);
            }
            if (showClose == undefined) showClose = true;
            if (showClose == false) $(".l-tab-links-item-close", tabitem).remove();
            if (text == undefined) text = tabid;
            if (height) contentitem.height(height);
//            $("a", tabitem).text(text);
            $("a", tabitem).html(text);

            g.tab.links.ul.append(tabitem);
            g.tab.content.append(contentitem);
            g.selectTabItem(tabid);
            if (g.setTabButton())
            {
                g.moveToLastTabItem();
            }
            //增加事件
            g._addTabItemEvent(tabitem);
            if (p.dragToMove && $.fn.juiceDrag)
            {
                g.drags = g.drags || [];
                tabitem.each(function ()
                {
                    g.drags.push(g._applyDrag(this));
                });
            }
            g.trigger('afterAddTabItem', [tabid]);
        },
        _addTabItemEvent: function (tabitem)
        {
            var g = this, p = this.options;
            tabitem.click(function ()
            {
                var tabid = $(this).attr("tabid");
                g.selectTabItem(tabid);
            });
            //右键事件支持
            g.tab.menu && g._addTabItemContextMenuEven(tabitem);
            $(".l-tab-links-item-close", tabitem).hover(function ()
            {
                $(this).addClass("l-tab-links-item-close-over");
            }, function ()
            {
                $(this).removeClass("l-tab-links-item-close-over");
            }).click(function ()
                {
                    var tabid = $(this).parent().attr("tabid");
                    g.removeTabItem(tabid);
                });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 移除tab项 。
         * @name   juiceTab#removeTabItem
         * @param  [tabid]  表格id
         * @function
         */
        removeTabItem: function (tabid)
        {
            var g = this, p = this.options;
            if (g.trigger('beforeRemoveTabItem', [tabid]) == false)
                return false;
            var currentIsSelected = $("li[tabid=" + tabid + "]", g.tab.links.ul).hasClass("l-selected");
            if (currentIsSelected)
            {
                $(".l-tab-content-item[tabid=" + tabid + "]", g.tab.content).prev().show();
                $("li[tabid=" + tabid + "]", g.tab.links.ul).prev().addClass("l-selected").siblings().removeClass("l-selected");
            }
            $(".l-tab-content-item[tabid=" + tabid + "]", g.tab.content).remove();
            $("li[tabid=" + tabid + "]", g.tab.links.ul).remove();
            g.setTabButton();
            g.trigger('afterRemoveTabItem', [tabid]);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 增加或缩小Tab内容区域的高度 。
         * @name   juiceTab#addHeight
         * @param [heightDiff]   高度补差
         * @function
         */
        addHeight: function (heightDiff)
        {
            var g = this, p = this.options;
            var newHeight = g.tab.height() + heightDiff;
            g.setHeight(newHeight);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置Tab的高度 。
         * @name   juiceTab#setHeight
         * @param  [height] 高度
         * @function
         */
        setHeight: function (height)
        {
            var g = this, p = this.options;
            g.tab.height(height);
            g.setContentHeight();
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 设置文本框的高度 。
         * @name   juiceTab#setContentHeight
         * @function
         */
        setContentHeight: function ()
        {
            var g = this, p = this.options;
            var newheight = g.tab.height() - g.tab.links.height();
            g.tab.content.height(newheight);
            $("> .l-tab-content-item", g.tab.content).height(newheight);
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取新的tab的id 。
         * @name   juiceTab#getNewTabid
         * @return  int
         * @function
         */
        getNewTabid: function ()
        {
            var g = this, p = this.options;
            g.getnewidcount = g.getnewidcount || 0;
            return 'tabitem' + (++g.getnewidcount);
        },
        //notabid 过滤掉tabid的
        //noclose 过滤掉没有关闭按钮的
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取新的tabid的集合 。
         * @name   juiceTab#getTabidList
         * @return     tabidlist  一个tabidlist集合
         * @function
         */
        getTabidList: function (notabid, noclose)
        {
            var g = this, p = this.options;
            var tabidlist = [];
            $("> li", g.tab.links.ul).each(function ()
            {
                if ($(this).attr("tabid")
                    && $(this).attr("tabid") != notabid
                    && (!noclose || $(".l-tab-links-item-close", this).length > 0))
                {
                    tabidlist.push($(this).attr("tabid"));
                }
            });
            return tabidlist;
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除其他 。
         * @name   juiceTab#removeOther
         * @function
         */
        removeOther: function (tabid, compel)
        {
            var g = this, p = this.options;
            var tabidlist = g.getTabidList(tabid, true);
            $(tabidlist).each(function ()
            {
                g.removeTabItem(this);
            });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 刷新指定的Tab项  。
         * @name   juiceTab#reload
         * @param [tabid]  指定tabid
         * @function
         */
        reload: function (tabid)
        {
            var g = this, p = this.options;
            var contentitem = $(".l-tab-content-item[tabid=" + tabid + "]");
            var iframeloading = $(".l-tab-loading:first", contentitem);
            var iframe = $("iframe:first", contentitem);
            var url = $(iframe).attr("src");
            iframeloading.show();
            iframe.attr("src", url).unbind('load.tab').bind('load.tab', function ()
            {
                iframeloading.hide();
            });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 删除所有  。
         * @name   juiceTab#removeAll
         * @param [compel]
         * @function
         */
        removeAll: function (compel)
        {
            var g = this, p = this.options;
            var tabidlist = g.getTabidList(null, true);
            $(tabidlist).each(function ()
            {
                g.removeTabItem(this);
            });
        },
        onResize: function ()
        {
            var g = this, p = this.options;
            if (!p.height || typeof (p.height) != 'string' || p.height.indexOf('%') == -1) return false;
            //set tab height
            if (g.tab.parent()[0].tagName.toLowerCase() == "body")
            {
                var windowHeight = $(window).height();
                windowHeight -= parseInt(g.tab.parent().css('paddingTop'));
                windowHeight -= parseInt(g.tab.parent().css('paddingBottom'));
                g.height = p.heightDiff + windowHeight * parseFloat(g.height) * 0.01;
            }
            else
            {
                g.height = p.heightDiff + (g.tab.parent().height() * parseFloat(p.height) * 0.01);
            }
            g.tab.height(g.height);
            g.setContentHeight();
        },
        _menuItemClick: function (item)
        {
            var g = this, p = this.options;
            if (!item.id || !g.actionTabid) return;
            switch (item.id)
            {
                case "close":
                    g.removeTabItem(g.actionTabid);
                    g.actionTabid = null;
                    break;
                case "closeother":
                    g.removeOther(g.actionTabid);
                    break;
                case "closeall":
                    g.removeAll();
                    g.actionTabid = null;
                    break;
                case "reload":
                    g.selectTabItem(g.actionTabid);
                    g.reload(g.actionTabid);
                    break;
            }
        },
        _addTabItemContextMenuEven: function (tabitem)
        {
            var g = this, p = this.options;
            tabitem.bind("contextmenu", function (e)
            {
                if (!g.tab.menu) return;
                g.actionTabid = tabitem.attr("tabid");
                g.tab.menu.show({ top: e.pageY, left: e.pageX });
                if ($(".l-tab-links-item-close", this).length == 0)
                {
                    g.tab.menu.setDisabled('close');
                }
                else
                {
                    g.tab.menu.setEnabled('close');
                }
                return false;
            });
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取指定tabid的ItemUrl  。
         * @name   juiceTab#getItemUrl
         * @param [tabid]     指定的tabid
         * @return   $(iframe).attr("src") src属性
         * @function
         */
        getItemUrl: function (tabid)
        {
            var contentitem = $(".l-tab-content-item[tabid=" + tabid + "]");
            var iframe = $("iframe:first", contentitem);
            return $(iframe).attr("src");
        },
        /**
         *&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 获取选定项tab的ItemUrl  。
         * @name   juiceTab#getSelectedItemUrl
         * @return      this.getItemUrl(tabid);  int
         * @function
         */
        getSelectedItemUrl: function ()
        {
            var tabid = this.getSelectedTabItemID();
            return this.getItemUrl(tabid);
        } ,
        getItemByTabId: function (tabid)
        {
            var g = this, p = this.options;
            return $("li[tabid=" + tabid + "]", g.tab.links.ul);
        },
        tabItemLoad:function(tabId,url){
            var contentitem = $(".l-tab-content-item[tabid=" + tabId + "]");
            var iframe = $("iframe:first", contentitem);
             $(iframe).attr("src",url);
        }
    });



})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*
*/
(function ($)
{

    $.juiceMessageBox = function (options)
    {
        return $.jui.run.call(null, "juiceMessageBox", arguments, { isStatic: true });
    };


    $.juiceDefaults.MessageBox = {
        isDrag: true
    };

    $.juiceMethos.MessageBox = {};

    $.jui.controls.MessageBox = function (options)
    {
        $.jui.controls.MessageBox.base.constructor.call(this, null, options);
    };
    $.jui.controls.MessageBox.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'MessageBox';
        },
        __idPrev: function ()
        {
            return 'MessageBox';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.MessageBox;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            var messageBoxHTML = "";
            messageBoxHTML += '<div class="l-messagebox">';
            messageBoxHTML += '        <div class="l-messagebox-lt"></div><div class="l-messagebox-rt"></div>';
            messageBoxHTML += '        <div class="l-messagebox-l"></div><div class="l-messagebox-r"></div> ';
            messageBoxHTML += '        <div class="l-messagebox-image"></div>';
            messageBoxHTML += '        <div class="l-messagebox-title">';
            messageBoxHTML += '            <div class="l-messagebox-title-inner"></div>';
            messageBoxHTML += '            <div class="l-messagebox-close"></div>';
            messageBoxHTML += '        </div>';
            messageBoxHTML += '        <div class="l-messagebox-content">';
            messageBoxHTML += '        </div>';
            messageBoxHTML += '        <div class="l-messagebox-buttons"><div class="l-messagebox-buttons-inner">';
            messageBoxHTML += '        </div></div>';
            messageBoxHTML += '    </div>';
            g.messageBox = $(messageBoxHTML);
            $('body').append(g.messageBox);
            g.messageBox.close = function ()
            {
                g._removeWindowMask();
                g.messageBox.remove();
            };
            //设置参数属性
            p.width && g.messageBox.width(p.width);
            p.title && $(".l-messagebox-title-inner", g.messageBox).html(p.title);
            p.content && $(".l-messagebox-content", g.messageBox).html(p.content);
            if (p.buttons)
            {
                $(p.buttons).each(function (i, item)
                {
                    var btn = $('<div class="l-messagebox-btn"><div class="l-messagebox-btn-l"></div><div class="l-messagebox-btn-r"></div><div class="l-messagebox-btn-inner"></div></div>');
                    $(".l-messagebox-btn-inner", btn).html(item.text);
                    $(".l-messagebox-buttons-inner", g.messageBox).append(btn);
                    item.width && btn.width(item.width);
                    item.onclick && btn.click(function () { item.onclick(item, i, g.messageBox) });
                });
                $(".l-messagebox-buttons-inner", g.messageBox).append("<div class='l-clear'></div>");
            }
            var boxWidth = g.messageBox.width();
            var sumBtnWidth = 0;
            $(".l-messagebox-buttons-inner .l-messagebox-btn", g.messageBox).each(function ()
            {
                sumBtnWidth += $(this).width();
            });
            $(".l-messagebox-buttons-inner", g.messageBox).css({ marginLeft: parseInt((boxWidth - sumBtnWidth) * 0.5) });
            //设置背景、拖动支持 和设置图片
            g._applyWindowMask();
            g._applyDrag();
            g._setImage();

            //位置初始化
            var left = 0;
            var top = 0;
            var width = p.width || g.messageBox.width();
            if (p.left != null) left = p.left;
            else p.left = left = 0.5 * ($(window).width() - width);
            if (p.top != null) top = p.top;
            else p.top = top = 0.5 * ($(window).height() - g.messageBox.height()) + $(window).scrollTop() - 10;
            if (left < 0) p.left = left = 0;
            if (top < 0) p.top = top = 0;
            g.messageBox.css({ left: left, top: top });

            //设置事件
            $(".l-messagebox-btn", g.messageBox).hover(function ()
            {
                $(this).addClass("l-messagebox-btn-over");
            }, function ()
            {
                $(this).removeClass("l-messagebox-btn-over");
            });
            $(".l-messagebox-close", g.messageBox).hover(function ()
            {
                $(this).addClass("l-messagebox-close-over");
            }, function ()
            {
                $(this).removeClass("l-messagebox-close-over");
            }).click(function ()
            {
                g.messageBox.close();
            });
            g.set(p);
        },
        close: function ()
        {
            var g = this, p = this.options;
            this.g._removeWindowMask();
            this.messageBox.remove();
        },
        _applyWindowMask: function ()
        {
            var g = this, p = this.options;
            $(".l-window-mask").remove();
            $("<div class='l-window-mask' style='display: block;'></div>").appendTo($("body"));
        },
        _removeWindowMask: function ()
        {
            var g = this, p = this.options;
            $(".l-window-mask").remove();
        },
        _applyDrag: function ()
        {
            var g = this, p = this.options;
            if (p.isDrag && $.fn.juiceDrag)
                g.messageBox.juiceDrag({ handler: '.l-messagebox-title-inner', animate: false });
        },
        _setImage: function ()
        {
            var g = this, p = this.options;
            if (p.type)
            {
                if (p.type == 'success' || p.type == 'donne')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-donne").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 30 });
                }
                else if (p.type == 'error')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-error").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 30 });
                }
                else if (p.type == 'warn')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-warn").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 30 });
                }
                else if (p.type == 'question')
                {
                    $(".l-messagebox-image", g.messageBox).addClass("l-messagebox-image-question").show();
                    $(".l-messagebox-content", g.messageBox).css({ paddingLeft: 64, paddingBottom: 40 });
                }
            }
        }
    });


    $.juiceMessageBox.show = function (p)
    {
        return $.juiceMessageBox(p);
    };
    $.juiceMessageBox.alert = function (title, content, type, onBtnClick)
    {
        title = title || "";
        content = content || title;
        var onclick = function (item, index, messageBox)
        {
            messageBox.close();
            if (onBtnClick)
                onBtnClick(item, index, messageBox);
        };
        p = {
            title: title,
            content: content,
            buttons: [{ text: '确定', onclick: onclick}]
        };
        if (type) p.type = type;
        return $.juiceMessageBox(p);
    };
    $.juiceMessageBox.confirm = function (title, content, callback)
    {
        var onclick = function (item, index, messageBox)
        {
            messageBox.close();
            if (callback)
            {
                callback(index == 0);
            }
        };
        p = {
            type: 'question',
            title: title,
            content: content,
            buttons: [{ text: '是', onclick: onclick }, { text: '否', onclick: onclick}]
        };
        return $.juiceMessageBox(p);
    };
    $.juiceMessageBox.success = function (title, content, onBtnClick)
    {
        return $.juiceMessageBox.alert(title, content, 'success', onBtnClick);
    };
    $.juiceMessageBox.error = function (title, content, onBtnClick)
    {
        return $.juiceMessageBox.alert(title, content, 'error', onBtnClick);
    };
    $.juiceMessageBox.warn = function (title, content, onBtnClick)
    {
        return $.juiceMessageBox.alert(title, content, 'warn', onBtnClick);
    };
    $.juiceMessageBox.question = function (title, content)
    {
        return $.juiceMessageBox.alert(title, content, 'question');
    };


})(jQuery);﻿/**
* jQuery jui 1.0
* 
* http://jui.com
*  

*/
(function ($)
{
    $.fn.juiceMenuBar = function (options)
    {
        return $.jui.run.call(this, "juiceMenuBar", arguments);
    };
    $.fn.juiceGetMenuBarManager = function ()
    {
        return $.jui.run.call(this, "juiceGetMenuBarManager", arguments);
    };

    $.juiceDefaults.MenuBar = {};

    $.juiceMethos.MenuBar = {};

    $.jui.controls.MenuBar = function (element, options)
    {
        $.jui.controls.MenuBar.base.constructor.call(this, element, options);
    };
    $.jui.controls.MenuBar.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'MenuBar';
        },
        __idPrev: function ()
        {
            return 'MenuBar';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.MenuBar;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.menubar = $(this.element);
            //todo 添加竖形菜单判断
            g.menubar.addClass("l-menu-horizontal");
            if (!g.menubar.hasClass("l-menubar")) g.menubar.addClass("l-menubar ");
            if (p && p.items)
            {
                $(p.items).each(function (i, item)
                {
                    g.addItem(item);
                });
            }
            $(document).click(function ()
            {
                $(".l-panel-btn-selected", g.menubar).removeClass("l-panel-btn-selected");
            });
            g.set(p);
        },
        addItem: function (item)
        {
            var g = this, p = this.options;
            var ditem = $('<div class="l-menubar-item"><span></span><div class="l-menubar-item-down"></div></div>');
            g.menubar.append(ditem);
            item.id && ditem.attr("menubarid", item.id);
            item.text && $("span:first", ditem).html(item.text);
            item.disable && ditem.addClass("l-menubar-item-disable");
            item.click && ditem.click(function () { item.click(item); });
            if (item.menu)
            {
                var menu = $.juiceMenu(item.menu);
                ditem.hover(function ()
                {
                    g.actionMenu && g.actionMenu.hide();
                    var left = $(this).offset().left;
                    var top = $(this).offset().top + $(this).height();
                    menu.show({ top: top, left: left });
                    g.actionMenu = menu;
                    $(this).addClass("l-panel-btn-over l-panel-btn-selected").siblings(".l-menubar-item").removeClass("l-panel-btn-selected");
                }, function ()
                {
                    $(this).removeClass("l-panel-btn-over");
                });

            }
            else
            {
                ditem.hover(function ()
                {
                    $(this).addClass("l-panel-btn-over");
                }, function ()
                {
                    $(this).removeClass("l-panel-btn-over");
                });
                $(".l-menubar-item-down", ditem).remove();
            }

        }
    });

})(jQuery);﻿/**
 * jQuery jui 1.0
 *
 * http://jui.com
 *
 */
(function ($)
{
    /**
     * @name   juiceMenu
     * @class   juiceMenu 是属性加载结构类。
     * @constructor
     * @description 构造函数.
     * @namespace  <h3><font color="blue">juiceMenu &nbsp;API 注解说明</font></h3>
     */
    $.juiceMenu = function (options)
    {
        return $.jui.run.call(null, "juiceMenu", arguments);
    };

    $.juiceDefaults.Menu =/**@lends juiceMenu#*/ {
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 宽度设置。
         * @default 120
         * @type Number
         */
        width: 120,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 顶部距离。
         * @default 0
         * @type Number
         */
        top: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 左边距离。
         * @default 0
         * @type Number
         */
        left: 0,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 元素集合。
         * @default   null
         * @type  Object
         */
        items: null,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  自动关闭。
         * @default   false
         * @type  Boolean
         */
        selfClose:false,
        /**
         *  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  渐变，为true时，渐变，为false时，不渐变。
         * @default   true
         * @type  Boolean
         */
        shadow: true,

        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  "left" or "right"
         * @default   null
         * @type  String
         */
        arrowPosition:null
    };

    $.juiceMethos.Menu = {};

    $.jui.controls.Menu = function (options)
    {
        $.jui.controls.Menu.base.constructor.call(this, null, options);
    };
    $.jui.controls.Menu.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'SysMenu';
        },
        __idPrev: function ()
        {
            return 'SysMenu';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Menu;
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.menuItemCount = 0;
            //全部菜单
            g.menus = {};
            //顶级菜单
            g.menu = g.createMenu();

            g.element = g.menu[0];
            g.menu.css({ top: p.top, left: p.left, width: p.width });

            p.items && $(p.items).each(function (i, item)
            {
                g.addItem(item);
            });
            $(document).bind('click.menu', function (e)
            {
                var obj = (e.target || e.srcElement);
                var jobjs = $(obj).parents().add(obj);
                for (var menuid in g.menus)
                {
                    var menu = g.menus[menuid];
                    if(jobjs.index(menu)!=-1&&$(".l-checkbox",menu.items).length>0){
                        return false;
                    }
                }
                for (var menuid in g.menus)
                {
                    var menu = g.menus[menuid];
                    if (!menu) return;
                    menu.hide();

                    if (menu.shadow) menu.shadow.hide();
                }
            });
            g.set(p);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  显示菜单。
         * @name  juiceMenu#show
         * @param [options]   选项元素
         * @param [menu]      菜单
         * @function
         */
        show: function (options, menu)
        {
            var g = this, p = this.options;
            if (menu == undefined) menu = g.menu;
            if (options && options.left != undefined)
            {
                menu.css({ left: options.left });
            }
            if (options && options.top != undefined)
            {
                menu.css({ top: options.top });
            }
            menu.show();
            g.updateShadow(menu);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  渐变更新。
         * @name  juiceMenu#updateShadow
         * @param [menu]      菜单
         * @function
         */
        updateShadow: function (menu)
        {
            var g = this, p = this.options;
            if (!p.shadow) return;
            menu.shadow.css({
                left: menu.css('left'),
                top: menu.css('top'),
                width: menu.outerWidth(),
                height: menu.outerHeight()
            });
            if (menu.is(":visible"))
                menu.shadow.show();
            else
                menu.shadow.hide();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  隐藏菜单。
         * @name  juiceMenu#hide
         * @param [menu]      菜单
         * @function
         */
        hide: function (menu)
        {
            var g = this, p = this.options;
            if (menu == undefined) menu = g.menu;
            g.hideAllSubMenu(menu);
            menu.hide();
            g.updateShadow(menu);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  用于绑定两个或多个事件处理器函数，以响应被选元素的轮流的 click 事件。
         * @name  juiceMenu#toggle
         * @function
         * @example  <b>示 &nbsp;例 </b> <br>
         *     对表格的切换一个类
         *     jQuery 代码:
         *     $("td").toggle(
         *            function () {
         *                    $(this).addClass("selected");
         *            },
         *            function () {
         *                   $(this).removeClass("selected");
         *            }
         *    );
         */
        toggle: function ()
        {
            var g = this, p = this.options;
            g.menu.toggle();
            g.updateShadow(g.menu);
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根据itemid删除元素。
         * @name  juiceMenu#removeItem
         * @param [itemid]      元素id
         * @function
         */
        removeItem: function (itemid)
        {
            var g = this, p = this.options;
            $("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).remove();
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根据itemid将其设置为可见。
         * @name  juiceMenu#setEnabled
         * @param [itemid]      元素id
         * @function
         */
        setEnabled: function (itemid)
        {
            var g = this, p = this.options;
            $("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).removeClass("l-menu-item-disable");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  根据itemid将其设置为不可见。
         * @name  juiceMenu#setDisabled
         * @param [itemid]      元素id
         * @function
         */
        setDisabled: function (itemid)
        {
            var g = this, p = this.options;
            $("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).addClass("l-menu-item-disable");
        },
        isEnable: function (itemid)
        {
            var g = this, p = this.options;
            return !$("> .l-menu-item[menuitemid=" + itemid + "]", g.menu.items).hasClass("l-menu-item-disable");
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  统计元素的个数。
         * @name  juiceMenu#getItemCount
         * @function
         * @return    $("> .l-menu-item", g.menu.items).length;
         */
        getItemCount: function ()
        {
            var g = this, p = this.options;
            return $("> .l-menu-item", g.menu.items).length;
        },
        /**
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  在菜单中添加元素。
         * @name  juiceMenu#addItem
         * @param [item]   待添加的元素
         * @param [menu]   指定菜单
         * @function
         */
        addItem: function (item, menu)
        {
            var g = this, p = this.options;
            if (!item) return;
            if (menu == undefined) menu = g.menu;
            g._items = g._items||{};

            if (item.line)
            {
                menu.items.append('<div class="l-menu-item-line"></div>');
                return;
            }
            var ditem = $('<div class="l-menu-item"><div class="l-menu-item-text"></div> </div>');

            var itemcount = $("> .l-menu-item", menu.items).length;
            menu.items.append(ditem);
            ditem.attr("juimenutemid", ++g.menuItemCount);
            item.id = (item.id?item.id:"_Menu_"+g.menuItemCount);
            ditem.attr("menuitemid", item.id);
            ditem.attr("parentid",item.parentId||("parent_"+g.menuItemCount));
            ditem.attr("parentMenuId",item.parentMenuId||-1);
            item.checkbox && ditem.prepend('<div>&nbsp;<a class="l-checkbox '+(item.checked?'l-checkbox-checked':'')+'"/></div>');
            item.text && $(">.l-menu-item-text:first", ditem).html(item.text);
            item.icon && ditem.prepend('<div class="l-menu-item-icon l-icon-' + item.icon + '"></div>');
            g._items[item.id] = item;
            if (item.disable || item.disabled)
                ditem.addClass("l-menu-item-disable");
            if (item.children)
            {
                ditem.append('<div class="l-menu-item-arrow"></div>');
                var newmenu = g.createMenu(ditem.attr("juimenutemid"));
                g.menus[ditem.attr("juimenutemid")] = newmenu;
                newmenu.width(p.width);
                newmenu.hover(null, function ()
                {
                    if (!newmenu.showedSubMenu)
                        g.hide(newmenu);
                });
                $(item.children).each(function ()
                {
                    this.parentId = item.id;
                    this.parentMenuId = g.menuItemCount;
                    g.addItem(this, newmenu);
                });
            }
            item.click && ditem.click(function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                if(item.checkbox){
                    var isChecked = $(".l-checkbox",this).hasClass("l-checkbox-checked");
                    var parentContainer = g.getParentItems($(this));
                    var childContainer = g.getChildItems($(this)).reverse();
                    var container = childContainer.concat(parentContainer) ;
                    if(isChecked){
                        $(container.reverse()).each(function(){
                            if($(this).attr("parentMenuId")=="-1"&&$(".l-checkbox-checked",$(this).parent()).length==1){
                                return false;
                            }
                            $(".l-checkbox",this).removeClass("l-checkbox-checked");
                            var childItem = g.getItemById($(this).attr("menuitemid"));
                            childItem.checked = false;
                            childItem.click(childItem, itemcount);
                        });
                    }else{
                        $(container).each(function(){
                            $(".l-checkbox",this).addClass("l-checkbox-checked");
                            var childItem = g.getItemById($(this).attr("menuitemid"));
                            childItem.checked = true;
                            childItem.click(childItem, itemcount);
                        });
                    }
                }else{
                    item.click(item, itemcount,ditem);
                }

            });
            item.dblclick && ditem.dblclick(function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                item.dblclick(item, itemcount);
            });

            var menuover = $("> .l-menu-over:first", menu);
            ditem.hover(function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                var itemtop = $(this).offset().top;
                var top = itemtop - menu.offset().top;
                menuover.css({ top: top });
                g.hideAllSubMenu(menu);
                if (item.children)
                {
                    var juimenutemid = $(this).attr("juimenutemid");
                    if (!juimenutemid) return;
                    if (g.menus[juimenutemid])
                    {
                        g.show({ top: itemtop, left: $(this).offset().left + $(this).width() - 5 }, g.menus[juimenutemid]);
                        menu.showedSubMenu = true;
                    }
                }
            }, function ()
            {
                if ($(this).hasClass("l-menu-item-disable")) return;
                var juimenutemid = $(this).attr("juimenutemid");
                if (item.children)
                {
                    var juimenutemid = $(this).attr("juimenutemid");
                    if (!juimenutemid) return;
                };
            });
        },
        getItemById:function(menuitemid){
            var g = this, p = this.options;
            return g._items[menuitemid];
        },
        getParentItems:function(ditem,container){
            var g = this, p = this.options;
            if(!container){
                container = new Array();
            }
            container.push(ditem);
            var checkedItem = $(".l-checkbox-checked",ditem.parent());
            if(checkedItem.length==1||checkedItem.length==0){
                var parentId = ditem.attr("parentId");
                if(parentId){
                    for(var menuId in g.menus){
                        var parentElement = $("div[menuitemid='"+parentId+"']", g.menus[menuId]);
                        if(parentElement.length>0){
                            g.getParentItems(parentElement,container)
                        }
                    }

                }
            }
            return container;
        },

        getChildItems:function(ditem,container){
            var g = this, p = this.options;
            if(!container){
                container = new Array();
            }
            if(g.menus[ditem.attr("juimenutemid")]){
                var childItem = $(".l-menu-item",g.menus[ditem.attr("juimenutemid")].items);
                if(childItem.length>0) {
                    childItem.each(function(i){
                        container.push($(this));
                        g.getChildItems($(this),container);
                    });
                }
            }
            return container;
        },

        hideAllSubMenu: function (menu)
        {
            var g = this, p = this.options;
            if (menu == undefined) menu = g.menu;
            $("> .l-menu-item", menu.items).each(function ()
            {
                if ($("> .l-menu-item-arrow", this).length > 0)
                {
                    var juimenutemid = $(this).attr("juimenutemid");
                    if (!juimenutemid) return;
                    g.menus[juimenutemid] && g.hide(g.menus[juimenutemid]);
                }
            });
            menu.showedSubMenu = false;
        },
        createMenu: function (parentMenuItemID)
        {
            var g = this, p = this.options;
            var menu = $('<div class="l-menu" style="display:none"><div class="l-menu-yline"></div><div class="l-menu-over"><div class="l-menu-over-l"></div> <div class="l-menu-over-r"></div></div><div class="l-menu-inner"></div></div>');

            if(p.arrowPosition == "left" && (!parentMenuItemID)){
                menu.addClass("l-menu-arrow-left");
            }

            if(p.arrowPosition == "right" && (!parentMenuItemID)){
                menu.addClass("l-menu-arrow-right");
            }

            parentMenuItemID && menu.attr("juiparentmenuitemid", parentMenuItemID);
            menu.items = $("> .l-menu-inner:first", menu);
            menu.appendTo('body');
            if (p.shadow)
            {
                menu.shadow = $('<div class="l-menu-shadow"></div>').insertAfter(menu);
                g.updateShadow(menu);
            }
            menu.hover(null, function ()
            {
                if (!menu.showedSubMenu)
                    $("> .l-menu-over:first", menu).css({ top: -28 });
            });
            if (parentMenuItemID)
                g.menus[parentMenuItemID] = menu;
            else
                g.menus[0] = menu;
            return menu;
        }
    });
    //旧写法保留
    $.jui.controls.Menu.prototype.setEnable = $.jui.controls.Menu.prototype.setEnabled;
    $.jui.controls.Menu.prototype.setDisable = $.jui.controls.Menu.prototype.setDisabled;



})(jQuery);/**
 * @author tcg
 * @class  juicePanel
 * @description UI面板，用于加载页面，表单元素
 */
(function ($)
{
    $.fn.juicePanel = function (options)
    {
        return $.jui.run.call(this, "juicePanel", arguments);
    };

    $.fn.juiceGetPanelManager = function () {
        return $.jui.run.call(this, "juiceGetPanelManager", arguments);
    };

    $.juiceDefaults = $.juiceDefaults || {};
    $.juiceDefaults.Panel = {
        width: "100%",
        height: "auto",
        closeAble: true,
        draggable:true,
        onBeforeClose:null,
        onAfterClose:null,
        top: 0,
        left: 0,
        items: null,
        url:"",
        title:"",
        selfClose:false,
        icon:"",
        shadow: true
    };

    $.juiceMethos.Panel = {};

    $.jui.controls.Panel = function (element,options)
    {
        $.jui.controls.Panel.base.constructor.call(this, element, options);
    };
    $.jui.controls.Panel.juiceExtend($.jui.core.UIComponent, {
        __getType: function ()
        {
            return 'Panel';
        },
        __idPrev: function ()
        {
            return 'Panel';
        },
        _extendMethods: function ()
        {
            return $.juiceMethos.Panel;
        },
        _init:function(){
            $.jui.controls.Panel.base._init.call(this);
            var g = this, p = this.options;
            this._copyProperty(p,$(this.element));
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.content = $(g.element);
            var panelhtmlarr = [];
            panelhtmlarr.push("　　<div class='l-panel'>");
            panelhtmlarr.push("        <div class='l-panel-header'><div class='panel-toggle-default'/><div class='panel-closed-defalut'/><div class='l-panel-icon-default'></div><span class='l-panel-header-text'></span></div>");
            panelhtmlarr.push("        <div class='l-grid-loading'></div>");
            panelhtmlarr.push("        <div class='l-panel-content'></div>");
            panelhtmlarr.push("    </div>");
            g.panel = $(panelhtmlarr.join(""));
            g.panel.insertBefore(g.content);
            g.contantPanel = $(".l-panel-content",g.panel);
            g.contantPanel.append(g.content);

            g._build();
            g._initSize();
            g._setEvent();

        },
        _build:function(){
            var g = this,p = this.options;
            g._initHeader();
            if(p.url){
                g._setUrl(p.url);
            }
        },
        _initHeader:function(){
            var g = this,p = this.options;
            if(p.collapse){
                $(".panel-toggle-default",g.panel).addClass("fa panel-toggle");
            }

            if(p.closeAble){
                $(".panel-closed-defalut",g.panel).addClass("fa panel-closed l-panel-close");
            }else{
                $(".panel-toggle-default",g.panel).css({right:"3px"});
            }
            //设置 标题
            if(p.title){
                $(".l-panel-header-text",g.panel).html(p.title);
            }
            //设置图标
            if(p.icon){
                $(".l-panel-icon-default",g.panel).addClass("fa "+ p.icon);
                $(".l-panel-header-text").css({left:"24px",position:"absolute"});
            }
        },
        _initSize:function(){
            var g = this,p = this.options;
            if(g.content.width()){
                g.contantPanel.width(g.content.width());
                g.panel.width(g.content.width());
            }else{
                g.contantPanel.width(p.width);
                g.panel.width(p.width);
            }
            if(g.content.height()||p.height=="auto"){
                g.contantPanel.height(g.content.height());
            }else{
                g.contantPanel.height(p.height);
            }
        },
        _setEvent:function(){
            var g = this,p = this.options;
            //panel 收缩
            $(".panel-toggle",g.panel).toggle(function(){
                $(".panel-toggle-default",g.panel).addClass("panel-toggle-down");
                g.contantPanel.hide();
            },function(){
                $(".panel-toggle-default",g.panel).removeClass("panel-toggle-down");
                g.contantPanel.show();
            });

            //panel 关闭
            $(".l-panel-close",g.panel).click(function(){
                g.trigger("beforeClose",[]);
                g.panel.remove();
                g.trigger("afterClose",[]);
            });

            $(window).bind("resize.panel", function (e)
            {
                g._onResize.call(g);
            });
        },
        _setWidth:function(value){
            var g = this,p = this.options;
            p.width = value;
            g.panel.width(value);
        },
        setWidth:function(value){
            this._setWidth(value);
        },
        _onResize:function(){
            var g = this,p = this.options;
            g._setWidth(g.panel.parent().width());
        } ,
        _setUrl:function(url){

        }
    })
})(jQuery);﻿/**
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
        }else{
            value = new Date(value);
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
                var border = 1

                g.gridbody.height(h - border * 4);
                g.f.gridbody.height(h - border * 4);
                g.gridview.height(h + gridHeaderHeight - border * 2);
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
                column.isSort = column.isSort == false ? false : true;
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
            if (column.ischeckbox)
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

})(jQuery);﻿/**
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