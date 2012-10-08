/*0d812f16cc26c90a3b93b5d4ff8dd44fe0b9e0c7*/Ext.define("Judge.view.Articles",{id:"ArticlesView",extend:"Ext.dataview.NestedList",xtype:"articles",requires:["Ext.carousel.Carousel"],config:{title:"Статьи",iconCls:"star",listConfig:{itemTpl:'<div class="judge-list-item"><tpl if="img"><img src="{img}"/></tpl><small>{description}</small><h4>{title}</h4></div>'},updateTitleText:false,detailCard:{xtype:"carousel",scrollable:{direction:"vertical",directionLock:true},styleHtmlContent:true,indicator:false}}});Ext.define("Judge.view.About",{id:"AboutView",extend:"Ext.dataview.NestedList",xtype:"about",config:{title:"Информация",iconCls:"info",listConfig:{itemTpl:'<div class="judge-list-item"><tpl if="img"><img src="{img}"/></tpl><h4>{title}</h4><small>{description}</small></div>'},updateTitleText:false,detailCard:{xtype:"container",scrollable:{direction:"vertical",directionLock:true},styleHtmlContent:true}}});Ext.define("Judge.view.NewsList",{extend:"Ext.dataview.NestedList",xtype:"newslist",id:"newsList",requires:["Ext.carousel.Carousel"],config:{title:"Новости",iconCls:"time",listConfig:{itemTpl:'<div class="judge-list-item"><tpl if="img"><img src="{img}"/></tpl><h4>{title}</h4><small>{description}</small></div>'},updateTitleText:false,detailCard:{xtype:"carousel",scrollable:{direction:"vertical",directionLock:true},styleHtmlContent:true,indicator:false}}});Ext.define("Judge.model.LoginModel",{extend:"Ext.data.Model",config:{fields:["name","password","uniqkey"]}});Ext.define("Judge.controller.FileProvider",{config:{appDirectory:"magazines",fileExt:".txt",objectToWrite:undefined,getFileErrorCallback:undefined,createFile:true,isWriteAccess:false,fileName:undefined,writeCallback:undefined,readCallback:undefined},fileSystemError:function(){var a=Ext.Viewport.getComponent("loading");if(a){a.hide()}Ext.Msg.alert("Информация","Ошибка в доступе к файловой системе. Убедитесь в наличии свободного места.")},deleteFile:function(a){this.processFile(a)},processFile:function(a){var d=this;if(window.LocalFileSystem){window.requestFileSystem(window.LocalFileSystem.PERSISTENT,0,e,this.fileSystemError)}function e(f){f.root.getDirectory(d.appDirectory,{create:true,exclusive:false},g,d.fileSystemError);function g(h){h.getFile(d.fileName+d.fileExt,{create:d.createFile,exclusive:false},c,b)}}function b(){d.getFileErrorCallback?d.getFileErrorCallback():d.fileSystemError()}function c(f){if(a){f.remove(function(){a.call()});return}d.isWriteAccess?d.writeFile.call(d,f):d.readFile.call(d,f)}},readFile:function(c){var b=this;var a=new FileReader();a.onloadend=function(d){if(b.readCallback){b.readCallback(d)}};a.readAsText(c)},writeFile:function(c){var b=this;c.createWriter(a,this.fileSystemError);function a(d){d.onwriteend=function(e){if(b.writeCallback){b.writeCallback()}};d.write(b.objectToWrite)}},constructor:function(b){for(var a in b){this.config[a]=b[a]}for(var c in this.config){this[c]=this.config[c]}this.config=null;return this}});Ext.define("Judge.view.Login",{extend:"Ext.form.Panel",id:"LoginPanel",xtype:"login",requires:["Ext.TitleBar","Ext.form.FieldSet","Ext.field.Email","Ext.field.Password","Judge.model.LoginModel"],config:{title:"Вход",scrollable:true,items:[{xtype:"fieldset",title:"Вход",instructions:"Для входа в систему введите логин и нажмите вход",items:[{xtype:"emailfield",label:"Логин",placeHolder:"email@example.com",name:"user",required:true,id:"txtEmail"}]},{xtype:"container",layout:"hbox",items:[{xtype:"button",text:"Вход",ui:"confirm",flex:1,id:"btnSubmit"},{xtype:"spacer",flex:1},{xtype:"button",text:"Отмена",flex:1,id:"btnCancel"}]}]}});Ext.define("Judge.view.Register",{extend:"Ext.form.Panel",id:"RegisterPanel",xtype:"register",requires:["Ext.TitleBar","Ext.form.FieldSet","Ext.field.Email","Ext.field.Password","Judge.model.LoginModel"],config:{title:"Регистрация",scrollable:{direction:"vertical"},items:[{xtype:"fieldset",title:"Регистрация",instructions:"Для регистрации в системе введите Ваше имя, e-mail и номер телефона",items:[{xtype:"textfield",label:"Имя",placeHolder:"Имя",name:"regName",required:true,id:"txtRegName",labelWidth:"35%"},{xtype:"emailfield",label:"E-mail",placeHolder:"email@example.com",name:"regEmail",required:true,id:"txtRegEmail",labelWidth:"35%"},{xtype:"textfield",label:"Телефон",placeHolder:"Телефон",name:"regPhone",required:true,id:"txtRegPhone",labelWidth:"35%"}]},{xtype:"fieldset",title:"Номера журналов",instructions:"Выберите номера журнала и нажмите Регистрация",id:"regNumbers",items:[]},{xtype:"container",layout:"hbox",items:[{xtype:"button",text:"Регистрация",ui:"confirm",flex:4,id:"btnRegister"},{xtype:"spacer",flex:1},{xtype:"button",text:"Отмена",flex:4,id:"btnRegisterCancel"}]}]}});Ext.define("Judge.view.MagazineContainer",{extend:"Ext.Container",xtype:"magazinecontainer",requires:["Ext.data.Store","Ext.Carousel"],id:"MagazineContainer",config:{layout:"card",title:"Журналы",items:[{xtype:"carousel",id:"magazines",indicator:false,layout:"fit"}]}});Ext.define("Judge.model.EntryModel",{extend:"Ext.data.Model",config:{fields:["id","title","headline","content"],proxy:{type:"ajax",url:"http://evestnik.by/export.html",reader:{type:"json"}}}});Ext.define("Judge.model.ListModel",{extend:"Ext.data.Model",config:{fields:["id","pagetitle","description","img","content","data"],hasMany:{model:"Judge.model.ListItemModel",name:"data"},proxy:{type:"ajax",url:"http://evestnik.by/export.html",reader:{type:"json"}}}});Ext.define("Judge.model.ListItemModel",{extend:"Ext.data.Model",config:{fields:["id","title","description","img","content",{name:"leaf",type:"boolean"},"list","downloaded"],belongsTo:"Judge.model.ListModel",hasMany:{model:"Judge.model.ListItemModel",name:"list"}}});Ext.define("Judge.controller.LoginController",{extend:Ext.app.Controller,requires:["Judge.model.LoginModel"],config:{refs:{panelMagazine:"#magazinePanel",loginForm:"#LoginPanel",btnSubmit:"#btnSubmit",btnCancel:"#btnCancel",txtEmail:"#txtEmail",btnRegister:"#btnRegister",btnRegisterCancel:"#btnRegisterCancel",txtRegEmail:"#txtRegEmail",txtRegName:"#txtRegName",txtRegPhone:"#txtRegPhone"},control:{btnSubmit:{tap:"onSubmit"},btnCancel:{tap:"onCancel"},btnRegister:{tap:"onRegister"},btnRegisterCancel:{tap:"onRegisterCancel"}}},loadMagazinesList:function(){var a=this;if(navigator.network&&navigator.network.connection&&navigator.network.connection.type!=Connection.NONE){Ext.Ajax.request({url:"http://evestnik.by/list.html",success:function(c){var e=JSON.parse(c.responseText);var b=Ext.getCmp("regNumbers");for(var d=0;d<e.length;d++){if(e[d].id){b.add({xtype:"checkboxfield",label:e[d].title,labelWidth:"65%",value:e[d].id})}}},failure:function(){Ext.Msg.alert("Информация","Ошибка подключения при получении журналов.")}})}else{Ext.Msg.alert("Информация","Невозможно получить список журналов. Отсутствует подключение к интернету.")}},emailValidator:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,onSubmit:function(){var a=this;if(navigator.network&&navigator.network.connection&&navigator.network.connection.type!=Connection.NONE){Ext.Ajax.request({url:"http://evestnik.by/user.html",method:"POST",params:{key:device.uuid},success:function(c){var b=parseInt(c.responseText);if(b&&b>0){var d=a.getApplication().getController("MagazineContainerController");d.loggedIn=b;d.loadData()}else{Ext.Msg.alert("Информация","Вы не зарегистрированы либо аккаунт не активирован.");a.loadMagazinesList();a.getPanelMagazine().setActiveItem(1)}},failure:function(){Ext.Msg.alert("Информация","Вход невозможен. Ошибка подключения.");a.getApplication().getController("MagazineContainerController").loadData()}})}else{Ext.Msg.alert("Информация","Вход невозможен. Отсутствует подключение к интернету.");a.getApplication().getController("MagazineContainerController").loadData()}},onCancel:function(){var a=this.getApplication().getController("MagazineContainerController");a.loggedIn=0;a.loadData();this.getPanelMagazine().setActiveItem(1)},onRegister:function(){var d=this;var c=this.getTxtRegEmail().getValue();var e=this.getTxtRegName().getValue();var b=this.getTxtRegPhone().getValue();var a=[];Ext.each(Ext.getCmp("regNumbers").getItems().items,function(g,f,h){if(h[f].getValue&&h[f].getValue()){a.push(h[f].getSubmitValue())}});if(this.emailValidator.test(c)&&e&&b){if(a.length<=0){Ext.Msg.alert("Информация","Выберите номера журнала.");return}if(navigator.network&&navigator.network.connection&&navigator.network.connection.type!=Connection.NONE){Ext.Ajax.request({url:"http://evestnik.by/order_ok.html",method:"POST",params:{email:c,name:e,tel:b,key:device.uuid,"a[]":a},success:function(f){if(f.responseText=="1"){Ext.Msg.alert("Информация","Регистрация прошла успешно. Ожидайте активации аккаунта.");d.getApplication().getController("MagazineContainerController").loadData();d.getPanelMagazine().setActiveItem(0)}else{Ext.Msg.alert("Информация","Регистрация невозможна. Ошибка регистрации.")}},failure:function(){Ext.Msg.alert("Информация","Регистрация невозможна. Ошибка подключения.")}})}else{Ext.Msg.alert("Информация","Регистрация невозможна. Отсутствует подключение к интернету.")}}else{Ext.Msg.alert("Информация","Введите имя, e-mail и номер телефона.")}},onRegisterCancel:function(){this.getApplication().getController("MagazineContainerController").loadData();this.getPanelMagazine().setActiveItem(0)}});Ext.define("Judge.view.Magazine",{extend:"Ext.Container",xtype:"magazines",requires:["Judge.view.Login","Judge.view.Register","Judge.view.MagazineContainer"],id:"magazinePanel",config:{layout:"card",title:"Журнал",iconCls:"bookmarks",items:[{xtype:"magazinecontainer"},{xtype:"register"}]}});Ext.define("Judge.view.Main",{id:"MainView",extend:"Ext.tab.Panel",requires:["Judge.view.Articles","Judge.view.Magazine","Judge.view.About","Judge.view.NewsList"],fullscreen:true,config:{tabBarPosition:"bottom",items:[{xtype:"magazines"},{xtype:"articles"},{xtype:"newslist"},{xtype:"about"}]}});Ext.define("Judge.controller.ListBaseController",{extend:"Ext.app.Controller",requires:["Judge.model.EntryModel","Judge.model.ListModel","Judge.model.ListItemModel"],config:{refs:{listView:""},control:{listView:{itemtap:"onItemTap"}}},listModelId:undefined,getDetailsCardContent:function(a){return a.data.content},postLaunch:function(b,a){},buildStore:function(b,a){b.setStore(Ext.create("Ext.data.TreeStore",{model:"Judge.model.ListItemModel",defaultRootProperty:"list",root:{list:a,leaf:false}}))},launch:function(){this.callParent(arguments);this.loadData()},loadData:function(){var b=this.getListView();var c=this.listModelId;if(!c){throw"You should specify you model id in derrived class to retrive appropriate data from service!"}var a=this;this.loadModel("Judge.model.ListModel",c,function(d){a.processProperties(d.data.data);a.buildStore(b,d.data.data);a.on({postLaunch:a.postLaunch});a.fireEvent("postLaunch",b,d.data.data)})},processProperties:function(b){var a=this;Ext.each(b,function(e,d,f){if(f[d].id){if(f[d].title==""){f[d].title=f[d].pagetitle}f[d].leaf=(f[d].leaf=="1");var c=f[d].list;if(c){a.processProperties(c)}}else{Ext.Array.remove(f,e)}})},loadModel:function(b,d,a){if(navigator.network&&navigator.network.connection&&navigator.network.connection.type!=Connection.NONE){try{Ext.ModelMgr.getModel(b).load(d,{success:a,failure:function(){Ext.Msg.alert("Информация","Произошла ошибка загрузки данных. Повторите попытку позже.")}})}catch(c){Ext.Msg.alert("Информация","Ошибка загрузки данных. Повторите попытку позже.")}finally{}}},onItemTap:function(h,g,a,c,b){if(b.get("leaf")==true){var f=h.getDetailCard();var e=b.get("id");var d=this;this.loadModel("Judge.model.EntryModel",e,function(i){f.setHtml(d.getDetailsCardContent(i))})}}});Ext.define("Judge.controller.AboutController",{extend:"Judge.controller.ListBaseController",config:{refs:{listView:"#AboutView"}},listModelId:176});Ext.define("Judge.controller.MagazineContainerController",{extend:"Judge.controller.ListBaseController",requires:["Judge.controller.FileProvider"],config:{refs:{viewContainer:"#MagazineContainer",magazineList:"#magazines"},control:{}},listModelId:179,currentMagazineId:undefined,loggedIn:0,currentArticles:{},loadData:function(){var f=Ext.Viewport.getComponent("loading");if(f!=null){f.show()}this.currentArticles={};var e=this.listModelId;var c=this;if(!e){throw"You should specify you model id in derrived class to retrive appropriate data from service!"}var d;if(navigator.network&&navigator.network.connection&&navigator.network.connection.type!=Connection.NONE){this.loadModel("Judge.model.ListModel",e,function(g){c.processProperties(g.data.data);d=c.processStoreData(g.data.data,false);a()})}else{a()}function b(h){if(h){var g=JSON.parse(h.target.result);if(d&&d.length>0){Ext.each(d,function(j,i,k){Ext.each(g,function(n,m,l){if(k[i].id==l[m].id){k[i].downloaded=true;return false}})})}else{Ext.each(g,function(j,i,k){k[i].downloaded=true});d=g}}if(d&&d.length>0){c.buildStore(d)}else{Ext.Msg.alert("Информация","Данная опция Вам недоступна.")}if(f!=null){f.hide()}}function a(){Ext.create("Judge.controller.FileProvider",{isWriteAccess:false,readCallback:b,fileName:"all",createFile:false,getFileErrorCallback:b}).processFile()}},writeAllFile:function(c){var e=this;Ext.create("Judge.controller.FileProvider",{isWriteAccess:false,readCallback:d,fileName:"all",createFile:false,getFileErrorCallback:b}).processFile();function a(f){Ext.create("Judge.controller.FileProvider",{isWriteAccess:true,fileName:"all",createFile:f,objectToWrite:JSON.stringify(c),getFileErrorCallback:null,readCallback:null,writeCallback:function(){e.fireEvent("writeallfinish")}}).processFile()}function b(){c=[c];a(true)}function d(f){var g=JSON.parse(f.target.result);g.push(c);c=g;a(false)}},processArticles:function(e,b,d,a){var c=this;Ext.each(e,function(g,f,h){if(h[f].leaf==true){b.push({id:h[f].id,title:h[f].title,description:d,content:a?h[f].content:""});return}c.processArticles(h[f].data||h[f].list,b,d==""?h[f].title:">"+h[f].title,a)})},processStoreData:function(d,b){var a=[];var c=this;Ext.each(d,function(f,e,h){a.push({id:h[e].id,title:h[e].title,img:h[e].img});var g=[];c.processArticles(h[e].data||h[e].list,g,"",b);a[a.length-1].data=g});return a},ordered:null,tryLoad:function(c,a,b){function d(e){for(var f in e){if(e[f]==b){c.onAvailableTap(b,null,null,null,true);return}}Ext.Msg.alert("Информация","Данный журнал Вам не доступен.")}if(c.ordered){d(c.ordered)}else{Ext.Ajax.request({url:"http://evestnik.by/user_order.html?id="+a,success:function(e){c.ordered=JSON.parse(e.responseText);d(c.ordered)},failure:function(){Ext.Msg.alert("Информация","Невозможно получить информацию о подписке")}})}setTimeout(function(){Ext.get("mag-"+b).removeCls("pressed")},200)},buildStore:function(c){var a=this.getMagazineList();var b=this;Ext.each(c,function(g,f,h){var e=new Ext.XTemplate('<div class="magazine-cover"><p>{title}</p><img align="left" src="{img}"></img><tpl if="!downloaded"><span id="mag-{id}" class="download-btn">Скачать</span></tpl></div>');var d=Ext.create("Ext.Container",{scrollable:{direction:"vertical",directionLock:true},layout:"vbox",items:[{xtype:"container",height:"290px",html:e.apply({img:h[f].img,title:h[f].title,downloaded:h[f].downloaded,id:h[f].id}),listeners:{tap:function(j){var i=Ext.get("mag-"+h[f].id);i.addCls("pressed");b.tryLoad(b,b.loggedIn,h[f].id)},element:"element",delegate:"span.download-btn"}},{xtype:"dataview",itemTpl:'<div class="judge-list-item"><tpl if="img"><img src="{img}"/></tpl><small>{description}</small><h4>{title}</h4></div>',scrollable:false,styleHtmlContent:true,listeners:{initialize:function(){Ext.each(h[f].data,function(j,l,k){if(!b.currentArticles[h[f].id]){b.currentArticles[h[f].id]=[]}b.currentArticles[h[f].id].push(k[l].id)});this.setStore(Ext.create("Ext.data.Store",{model:"Judge.model.ListItemModel",data:h[f].data}))},itemtap:function(j,l,m,i,k){b.onAvailableTap(h[f].id,h[f].title,i.get("id"),i.get("title"))}}}]});a.insert(f,d)});a.setActiveItem(0)},prepareTitle:function(b,a){return b},openArticle:function(c,f,a,e){var d=this;var g=Ext.Viewport.getComponent("loading");Ext.create("Judge.controller.FileProvider",{isWriteAccess:false,readCallback:b,fileName:c,createFile:false,getFileErrorCallback:null}).processFile();function b(k){var j=k.target.result;var i=d.getViewContainer();var h=Ext.create("Ext.Container",{id:"magazineArticleEntryWrapper",layout:"card",listeners:{deactivate:function(){Ext.getCmp("magazineArticlesCarousel").suspendEvents();this.destroy()}},scrollable:{direction:"vertical",directionLock:true},items:[{docked:"top",xtype:"titlebar",ui:"light",inline:true,title:d.prepareTitle(f,e),items:[{xtype:"button",iconCls:"reply",iconMask:true,listeners:{tap:function(){i.setActiveItem(0)}}}]},{xtype:"carousel",layout:"fit",cls:"magazineArticleEntry",indicator:false,id:"magazineArticlesCarousel",listeners:{initialize:function(){var l=this;l.removeAll();Ext.each(d.currentArticles[a],function(n,m,o){if(o[m]!=c){l.insert(m,{scrollable:{direction:"vertical",directionLock:true}})}else{l.insert(m,{html:j+'<div class="sw"><a class="fb" target="_blank"  href="http://www.facebook.com/sharer.php?u=http://www.evestnik.by&t='+e+'"></a><a class="vk" target="_blank"  href="http://vkontakte.ru/share.php?url=http://www.evestnik.by&title='+e+'"></a><a class="tw" target="_blank"  href="https://twitter.com/share?url=http://www.evestnik.by&text='+e+'"></a></div>',scrollable:{direction:"vertical",directionLock:true}});l.setActiveItem(m)}})},activeitemchange:function(n,q,o,p){if(o){if(g!=null){g.show()}o.setHtml("");var m=n.getActiveIndex();Ext.create("Judge.controller.FileProvider",{isWriteAccess:false,readCallback:l,fileName:d.currentArticles[a][m],createFile:false,getFileErrorCallback:null}).processFile();function l(r){n.getActiveItem().setHtml(r.target.result+'<div class="sw"><a class="fb" target="_blank" href="http://www.facebook.com/sharer.php?u=http://www.evestnik.by&t='+e+'"></a><a class="vk" target="_blank"  href="http://vkontakte.ru/share.php?url=http://www.evestnik.by&title='+e+'"></a><a class="tw" target="_blank"  href="https://twitter.com/share?url=http://www.evestnik.by&text='+e+'"></a></div>');if(g!=null){g.hide()}}}}}}]});if(g!=null){g.hide()}i.add(h);i.setActiveItem(1)}},launch:function(){this.getApplication().getController("LoginController").onSubmit()},onAvailableTap:function(a,g,c,f,e){var d=this;var h=Ext.Viewport.getComponent("loading");if(h!=null){h.show()}if(e){b()}else{Ext.create("Judge.controller.FileProvider",{isWriteAccess:false,readCallback:b,fileName:"all",createFile:false,getFileErrorCallback:b}).processFile()}function b(k){var j=false;if(k){var i=JSON.parse(k.target.result);Ext.each(i,function(m,l,n){if(a==n[l].id){j=true;return false}})}if(!j){if(!e){if(h!=null){h.hide()}Ext.Msg.alert("Информация","Журнал не скачан. Сперва скачайте журнал, если он доступен для Вашей подписки.");return}d.on("writeallfinish",function(){var l=Ext.get("mag-"+a);if(l){l.dom.parentNode.removeChild(l.dom)}if(h!=null){h.hide()}Ext.Msg.alert("Завершено.","Журнал скачан!")},d,{single:true});d.writeFile(a)}else{d.openArticle(c,g,a,f)}}},writeMagazines:function(b,a){var c=this;Ext.create("Judge.controller.FileProvider",{objectToWrite:b[a].content,isWriteAccess:true,writeCallback:d,fileName:b[a].id,createFile:true,getFileErrorCallback:null}).processFile();function d(){a=a+1;if(b.length==a){c.fireEvent("writemagazinesfinish");return}else{c.writeMagazines(b,a)}}},writeFile:function(b){var a=this;if(navigator.network&&navigator.network.connection&&navigator.network.connection.type!=Connection.NONE){Ext.Ajax.request({ignoreload:true,url:"http://evestnik.by/export.html",urlParams:{id:b},success:function(d){var c=a.processStoreData([JSON.parse(d.responseText)],true)[0];a.on("writemagazinesfinish",function(){var e=Ext.Viewport.getComponent("loading");if(e!=null){e.show()}Ext.each(c.data,function(g,f,h){h[f].content=""});a.writeAllFile(c)},a,{single:true});a.writeMagazines(c.data,0)}})}else{Ext.Msg.alert("Информация","Невозможно скачать журнал. Отсутствует подключение к интернету.")}}});Ext.define("Judge.controller.ListCarouselController",{extend:"Judge.controller.ListBaseController",config:{refs:{listView:""},control:{listView:{itemtap:"onItemTap"}}},onCarouselIndexChange:function(a,e,b,c){if(e.getHtml()==""){var d=this;var f=e.getId();this.loadModel("Judge.model.EntryModel",f,function(g){e.setHtml(d.getDetailsCardContent(g))})}},postLaunch:function(e,a){if(a){var d=e.getDetailCard();var c=this;d.on({activeitemchange:c.onCarouselIndexChange,scope:this});for(var b=0;b<a.length;b++){d.insert(b,{xtype:"panel",layout:"card",scrollable:{direction:"vertical",directionLock:true},html:"",id:a[b].id})}}},onItemTap:function(a,f,e,b,h){if(h.get("leaf")==true){var i=a.getDetailCard();var c=i.getItems().items[e];if(c.getHtml()==""){var g=h.get("id");var d=this;this.loadModel("Judge.model.EntryModel",g,function(j){c.setHtml(d.getDetailsCardContent(j));i.setActiveItem(e)})}else{i.setActiveItem(e)}}}});Ext.define("Judge.controller.NewsController",{extend:"Judge.controller.ListCarouselController",config:{refs:{listView:"#newsList",xtype:"newslist",autoCreate:true}},listModelId:174});Ext.define("Judge.controller.ArticlesController",{extend:"Judge.controller.ListCarouselController",config:{refs:{listView:"#ArticlesView",xtype:"articles",autoCreate:true}},listModelId:175});Ext.application({name:"Judge",isIconPrecomposed:true,views:["Main"],controllers:["NewsController","ArticlesController","LoginController","AboutController","MagazineContainerController"],phoneStartupScreen:"resources/loading/Homescreen.jpg",tabletStartupScreen:"resources/loading/Homescreen~ipad.jpg",launch:function(){Ext.fly("appLoadingIndicator").destroy();if(Ext.os.is.Tablet){Ext.get("app_css").dom.href="resources/css/appTablet.css"}Ext.MessageBox.YESNO[0].text=GlobalMessages.No;Ext.MessageBox.YESNO[1].text=GlobalMessages.Yes;var a=Ext.create("Ext.LoadMask",{message:GlobalMessages.LoadingData,id:"loading"});Ext.Viewport.add(a);a.hide();if(navigator.network&&navigator.network.connection){if(navigator.network.connection.type==Connection.NONE){Ext.Msg.alert(GlobalMessages.ErrorTitle,GlobalMessages.NoInetOfflineMode)}else{Ext.Ajax.on("beforerequest",function(){a.show()});Ext.Ajax.on("requestcomplete",function(g,d,e,f){if(e.ignoreload){return}a.hide()});Ext.Ajax.on("requestexception",function(){a.hide()})}}Ext.Viewport.add(Ext.create("Judge.view.Main"));function c(){Ext.Msg.confirm(GlobalMessages.ExitTitle,GlobalMessages.ExitPrompt,function(d){if(d=="yes"){navigator.app.exitApp()}})}function b(){var e=Ext.getCmp("MainView").getActiveItem();var d=e.getId();if(d=="AboutView"||d=="ArticlesView"||d=="newsList"){if(e._backButton._hidden){c()}else{e.onBackTap()}}else{if(d=="magazinePanel"){var f=e.getActiveItem();var g=f.getId();if(g=="RegisterPanel"){c()}else{if(g=="MagazineContainer"){if(f.getActiveItem().getId()=="magazines"){c()}else{f.setActiveItem(Ext.getCmp("magazines"))}}}}}}document.addEventListener("backbutton",b,false)},onUpdated:function(){window.location.reload()}});