CodeMirror.runMode=function(j,f,p,r){var h=CodeMirror.getMode(CodeMirror.defaults,f);var n=p.nodeType==1;var k=(r&&r.tabSize)||CodeMirror.defaults.tabSize;if(n){var d=p,m=[],c=0;p=function(w,u){if(w=="\n"){m.push("<br>");c=0;return}var v="";for(var x=0;;){var e=w.indexOf("\t",x);if(e==-1){v+=CodeMirror.htmlEscape(w.slice(x));c+=w.length-x;break}else{c+=e-x;v+=CodeMirror.htmlEscape(w.slice(x,e));var t=k-c%k;c+=t;for(var s=0;s<t;++s){v+=" "}x=e+1}}if(u){m.push('<span class="cm-'+CodeMirror.htmlEscape(u)+'">'+v+"</span>")}else{m.push(v)}}}var q=CodeMirror.splitLines(j),b=CodeMirror.startState(h);for(var g=0,l=q.length;g<l;++g){if(g){p("\n")}var o=new CodeMirror.StringStream(q[g]);while(!o.eol()){var a=h.token(o,b);p(o.current(),a,g,o.start);o.start=o.pos}}if(n){d.innerHTML=m.join("")}};