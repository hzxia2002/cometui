
function changeTheme(){
    $("#myTheme").attr("href","js/jui/skins/Blue/css/jui-all.css");

    var iframes = $("iframe");
    iframes.each(function(i){
        if(iframes[i].contentWindow.$&&iframes[i].contentWindow.$("#myTheme"))
        iframes[i].contentWindow.$("#myTheme").attr("href","js/jui/skins/Blue/css/jui-all.css");
    });
}