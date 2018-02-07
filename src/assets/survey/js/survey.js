import Vue from 'vue'
import router from '../../../router'
import store from '../../../store/index'
import axios from 'axios'
var vm = new Vue()

var surveyStart = function() {
	var quetions = {
		"questtionNaire":{
			"paperList":[
				{"paperId":"ECEDD0C93CB1425297DFDAC99847E5D4",
				"questionList":[
					{"choiceList":[
						{"choiceId":"A","choiceValue":"500"},
						{"choiceId":"B","choiceValue":"1000"},
						{"choiceId":"C","choiceValue":"1500"},
						{"choiceId":"D","choiceValue":"2000"},
						{"choiceId":"E","choiceValue":"以上皆否"}],
					"content":"请问您信用卡近6个月平均使用额度？",
					"questionId":"BocQue20170707150700011",
					"type":1},
					{"choiceList":[
						{"choiceId":"A","choiceValue":"广东省广州市番禺区"},
						{"choiceId":"B","choiceValue":"dddd6"},
						{"choiceId":"C","choiceValue":"dddd5"},
						{"choiceId":"D","choiceValue":"dddd2"},
						{"choiceId":"E","choiceValue":"以上皆否"}],
					"content":"请问您的户籍地为？",
					"questionId":"BocQue20170707150700012",
					"type":1},
					{"choiceList":[
						{"choiceId":"A","choiceValue":"大专"},
						{"choiceId":"B","choiceValue":"高中及以下"},
						{"choiceId":"C","choiceValue":"职高"},
						{"choiceId":"D","choiceValue":"大学本科"},
						{"choiceId":"E","choiceValue":"以上皆否"}],
					"content":"请问您的学历为？",
					"questionId":"BocQue20170707150700013",
					"type":1},
					{"choiceList":[
						{"choiceId":"A","choiceValue":"常念雁"},
						{"choiceId":"B","choiceValue":"姚新华"},
						{"choiceId":"C","choiceValue":"钱映冬"},
						{"choiceId":"D","choiceValue":"罗平凡"},
						{"choiceId":"E","choiceValue":"以上皆否"}],
					"content":"请问您的配偶为？",
					"questionId":"BocQue20170707150700014",
					"type":1},
					{"choiceList":[
						{"choiceId":"A","choiceValue":"5000"},
						{"choiceId":"B","choiceValue":"4000"},
						{"choiceId":"C","choiceValue":"1500"},
						{"choiceId":"D","choiceValue":"5500"},
						{"choiceId":"E","choiceValue":"以上皆否"}],
					"content":"请问您的消费贷款月还款额？",
					"questionId":"BocQue20170707150700015",
					"type":1}]}],
			"surveyCode":"F5771F62B22243B7BD91D6EE31B1D7C2"},
		"status":1,
		"statusMsg":"成功"
	};

	var survey = {
		url: 'http://xfjr.ledaikuan.cn:9191/MaiMobLoan',
		actionRecord: {//提交参数
			"mobileNo": "",
			"questtionNaireCommit": {
				"papeResultList": [
					{
						"appActionList": [],
						"paperId": "",
						"paperStatus": 1,
						"questionActionList": [],
						"totalTime": 0
					}
				],
				"surveyCode": ""
			}
		},
		appActionList: [//记录答题开始和结束时间
			{"actionStatus":0,"actionTime":""},
			{"actionStatus":1,"actionTime":""}
		],
		questionActionRecord : [],
		questionActionList :[],//记录问题操作记录
		countDown : function(){
			var count = parseInt($('#cover').attr('count'));
			if(count == 0){
				//console.log(count);
				$('#cover').hide();
				$('.modal-button').removeClass('active');
				return;
			}else{
				$('#cover').text(count--).attr('count',count--);
			}
			setTimeout(function() { survey.countDown(); } ,1000);
		},
		init: function(){
			var current = location.hash;
			if(current.indexOf('#page1')>-1){
				history.back();
			}
			//PC端跳转到官网
			if(survey.deviceType()=='pc'){
				//window.location.href = 'http://ledaikuan.cn';
				//return ;
			}

			if(survey.getMobileNo() == ''){
				//没有手机号跳转到官网
				// window.location.href = 'http://ledaikuan.cn';
				// return ;
			}else{
				survey.actionRecord.mobileNo = survey.getMobileNo();//获取手机号码
			}
			//survey.loadQuestions(quetions);//初始化问题:测试
			//初始化问题
			$.showPreloader('正在加载问卷...');

			// survey.doAjaxRequest(survey.url+'/questtion/naire',{"mobileNo":survey.actionRecord.mobileNo},false,function(obj){
			// 	console.log(obj);
			// 	survey.loadQuestions(obj);//初始化问题:测试
			// 	survey.appActionList[0].actionTime = (new Date()).getTime();//初始化答题开始的时间
			// 	survey.questionActionRecord[0].start = (new Date()).getTime();//初始化第一题开始时间
			// });

			let common_params = store.state.common.common_params
			let call = 'Acct.questionnaire'
			let timestamp = new Date().getTime()
			let sign = vm.getSign(call, timestamp)
			let paramString = JSON.stringify({
				ua: common_params.ua,
				call: call,
				args: {
					customerId: common_params.customerId
				},
				sign: sign,
				timestamp: timestamp
			})

			axios.post(store.state.common.common_api, paramString).then(res => {
				if (res.data.returnCode === '000000') {
					$.hidePreloader();
					let obj = {
						questtionNaire: res.data.response
					}
					survey.loadQuestions(obj);//初始化问题:测试
					survey.appActionList[0].actionTime = (new Date()).getTime();//初始化答题开始的时间
					survey.questionActionRecord[0].start = (new Date()).getTime();//初始化第一题开始时间
				} else {
					$.hidePreloader();
					$('#submit').attr('disabled',false);
					let str = res.data.returnMsg
					$.alert(str);
					$('.modal-button').text('确定');
				}
			})

			// if(localStorage.survey){
			// 	var obj = JSON.parse(localStorage.survey);
			// 	survey.appActionList[0].actionTime = obj.actionTime;//初始化答题开始的时间
			// 	survey.questionActionRecord[0].start = obj.firstStartTime;//初始化第一题开始时间
			// 	//console.log(obj);
			// }
			//点击开始答题：记录开始时间
			$('#start').on('click',function(){
				survey.appActionList[0].actionTime = (new Date()).getTime();
				$.alert('请认真填写您的调查问卷信息，填写有误将导致您的审核失败！',function(){
					// $.router.load("#page1");
					router.push({name: 'surveyList'})
					survey.questionActionRecord[0].start = (new Date()).getTime();
					// localStorage.survey = '{"actionTime":'+survey.appActionList[0].actionTime+',"firstStartTime":'+survey.questionActionRecord[0].start+'}';
				});
				$('.modal-buttons').append('<span id="cover" count="3"></span>')
				$('.modal-button').text('我知道啦');
				$('.modal-button').addClass('active');
				survey.countDown();
			});
			//点击下一题操作
			$('#next').on('click',function(){
				var _this = this;
				if($('.quetion>.active').attr('index') != 'last'){
					var checked = $('.quetion>.active input:checked').val();
					if(!checked){
						$.alert('该题尚未完成，请选择答案！');
						$('.modal-button').text('确定');
						return;
					}
					var endTime = (new Date()).getTime();
					var queNo = parseInt($('.quetion>.active').attr('no'));
					survey.questionActionRecord[queNo].end = (new Date()).getTime();

					$('.quetion>.active').removeClass('active').next('li').addClass('active');
					if($('.quetion>.active').attr('index') != 'first'){
						survey.questionActionRecord[queNo+1].start = (new Date()).getTime();
						$('#prev').addClass('active');
					}
					if($('.quetion>.active').attr('index') == 'last'){
						$(_this).removeClass('active');
					}
				}
			});
			//点击上一题操作
			$('#prev').on('click',function(){
				var _this = this;
				if($('.quetion>.active').attr('index') != 'first'){
					$('.quetion>.active').removeClass('active').prev('li').addClass('active');
					if($('.quetion>.active').attr('index') != 'last'){
						$('#next').addClass('active');
					}
					if($('.quetion>.active').attr('index') == 'first'){
						$(_this).removeClass('active');
					}
				}
			});
			//点击问题选项操作
			console.log($('.quetion'))
			console.log($('.quetion li'))
			$('.quetion [type=radio]').on('click',function(){
				console.log('点击了');
				var queNo = parseInt($(this).attr('name').substr(-1));
				var trackListLen = survey.questionActionList[queNo-1].actionTrackList.length;
				var current = '';
				if(trackListLen!=0){
					current = survey.questionActionList[queNo-1].actionTrackList[trackListLen-1].questionAnswer;
				}
				var _thisValue = $(this).val();
				if(current != _thisValue){
					survey.questionActionList[queNo-1].actionTrackList.push({"questionAnswer":_thisValue,"seqNo":(trackListLen+1)});
					survey.questionActionList[queNo-1].questionAnswer = $(this).val();
				}
				//console.log(queNo);
				//console.log(survey.questionActionList.length);
				if(queNo==survey.questionActionList.length){
					$('#submit').show();
				}
			});
			//提交操作
			$('#submit').on('click',function(){
				var len = survey.questionActionList.length;
				survey.appActionList[1].actionTime = (new Date()).getTime();//设置结束时间
				survey.questionActionRecord[len-1].end = (new Date()).getTime();
				//console.log(survey.appActionList);
				//console.log(survey.questionActionRecord);
				survey.submit();
			});
			//调查问卷通过操作
			$('#pageSuccessButton').on('click',function(){
				if(survey.deviceType()=='android'){
					try{
						javascript:jsInterface.checkStatus("1");
					}catch(e){
						$.alert('页面切换失败，请重新登录');
						$('.modal-button').text('确定');
					}
				}else if(survey.deviceType()=='ios'){
					try{
						window.webkit.messageHandlers.jsInterface.postMessage({resultStatus:"1"});
					}catch(e){
						$.alert('页面切换失败，请重新登录');
						$('.modal-button').text('确定');
					}
				}
			});
			//调查问卷失败操作
			$('#pageFailButton').on('click',function(){
				if(survey.deviceType()=='android'){
					try{
						javascript:jsInterface.checkStatus("0");
					}catch(e){
						$.alert('页面切换失败，请重新登录');
						$('.modal-button').text('确定');
					}
				}else if(survey.deviceType()=='ios'){
					try{
						window.webkit.messageHandlers.jsInterface.postMessage({resultStatus:"0"});
					}catch(e){
						$.alert('页面切换失败，请重新登录');
						$('.modal-button').text('确定');
					}
				}

			});
		},
		loadQuestions : function(quetions){
			$('.quetion').empty();
			var questionList = quetions.questtionNaire.paperList[0].questionList;
			var questionNum = questionList.length;

			for(var i=0; i<questionNum; i++){
				var questionItem = '<li no="'+i+'"><p>'+(i+1)+'.'+questionList[i].content+'</p><ul></ul></li>';
				var choiceList = questionList[i].choiceList;
				var type = '';
				$('.quetion').append(questionItem);
				survey.questionActionRecord.push({start:'', end:''});
				survey.questionActionList.push({
					"actionTrackList":[],
					"questionAnswer":"",
					"questionId":"",
					"spendTime":0,
					"type":1
				});

				for(var j=0; j<choiceList.length; j++){
					if(questionList[i].type==1){
						type = 'radio';
					}else{
						type = 'checkbox';
					}
					var choiceItem = '<li><input type="'+type+'" name="que'+(i+1)+'" value="'+choiceList[j].choiceId+'" id="'+choiceList[j].choiceId+(i+1)+'" />'+
									'<label for="'+choiceList[j].choiceId+(i+1)+'">'+choiceList[j].choiceValue+'</label></li>';
					$('.quetion').children('li').eq(i).children('ul').append(choiceItem);
				}
				survey.questionActionList[i].questionId = questionList[i].questionId;
			}
			$('.quetion').children('li').eq(0).addClass('active').attr('index','first');
			$('.quetion').children('li').eq(i-1).attr('index','last');

			survey.actionRecord.questtionNaireCommit.surveyCode = quetions.questtionNaire.surveyCode;
			survey.actionRecord.questtionNaireCommit.papeResultList[0].paperId = quetions.questtionNaire.paperList[0].paperId;
			//console.log(survey.questionActionRecord);
		},
		submit : function(){
			var que1 = $('.quetion [name=que1]:checked').val();
			var que2 = $('.quetion [name=que2]:checked').val();
			var que3 = $('.quetion [name=que3]:checked').val();
			var que4 = $('.quetion [name=que4]:checked').val();
			var que5 = $('.quetion [name=que5]:checked').val();
			if(!(que1 && que2 && que3 && que4 && que5)){
				$.alert('您有尚未完成的题目，请选择');
				$('.modal-button').text('确定');
				return;
			}
			$('#submit').attr('disabled',true);
			$.showPreloader('正在提交答案...');
			var totalTime = survey.appActionList[1].actionTime - survey.appActionList[0].actionTime;
			var appActionList = [
				{"actionStatus":0,"actionTime":""},
				{"actionStatus":1,"actionTime":""}
			];
			appActionList[0].actionTime = survey.format(new Date(survey.appActionList[0].actionTime));
			appActionList[1].actionTime = survey.format(new Date(survey.appActionList[1].actionTime));
			survey.actionRecord.questtionNaireCommit.papeResultList[0].totalTime = Math.round(totalTime/1000);

			for(var i=0;i<survey.questionActionList.length;i++){
				survey.questionActionList[i].spendTime = Math.round((survey.questionActionRecord[i].end - survey.questionActionRecord[i].start)/1000);
			}

			survey.actionRecord.questtionNaireCommit.papeResultList[0].appActionList = appActionList;
			survey.actionRecord.questtionNaireCommit.papeResultList[0].questionActionList = survey.questionActionList;
			//console.log(JSON.stringify(survey.actionRecord));//测试提交
			// survey.jsonAjaxRequest(survey.url+'/questtion/naireCommit',JSON.stringify(survey.actionRecord),false,function(obj){
			// 	if(obj.resultStatus==1){
			// 		$.router.load("#pageSuccess");
			// 	}else{
			// 		$.router.load("#pageError");
			// 	}
			// });

			console.log(survey.actionRecord.questtionNaireCommit)
			return
			let common_params = store.state.common.common_params
			let call = 'Acct.naireCommit'
			let timestamp = new Date().getTime()
			let sign = vm.getSign(call, timestamp)
			let paramString = JSON.stringify({
				ua: common_params.ua,
				call: call,
				args: {
					customerId: common_params.customerId,
					questionNaireCommit: survey.actionRecord.questionNaireCommit
				},
				sign: sign,
				timestamp: timestamp
			})

			axios.post(store.state.common.common_api, paramString).then(res => {
				$.hidePreloader();
				if (res.data.returnCode === '000000') {
					router.push({name: 'surveyResultS'})
				} else {
					router.push({name: 'surveyResultF'})
				}
			})
		},
		format : function(date){
			var year = date.getFullYear(),
				month = ('0'+(date.getMonth()+1)).substr(-2,2),
				day = ('0'+date.getDate()).substr(-2,2),
				hour = ('0'+date.getHours()).substr(-2,2),
				minute = ('0'+date.getMinutes()).substr(-2,2),
				second = ('0'+date.getSeconds()).substr(-2,2);
			var datetime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
			return datetime;
		},
		doAjaxRequest : function(url,parameter,async,callback){
			$.ajax({
				url  : url,
				type : 'post',
				async: async,
				data : parameter,
				success : function(response){
					$.hidePreloader();
					var obj = $.parseJSON(response);
					if(obj.status==1){
						callback(obj);
					}else if(obj.status==-7){
						$('#submit').attr('disabled',false);
						$.alert(obj.msg);
						$('.modal-button').text('确定');
					}else{
						$('#submit').attr('disabled',false);
						$.alert(obj.statusMsg);
						$('.modal-button').text('确定');
					}
				},
				error : function(response){
					$.hidePreloader();
					$('#submit').attr('disabled',false);
					$.hidePreloader();
					var obj = $.parseJSON(response);
					$.alert(obj.msg);
					$('.modal-button').text('确定');
				}
			});
		},
		jsonAjaxRequest : function(url,parameter,async,callback){
			$.ajax({
				url  : url,
				type : 'post',
				async: async,
				contentType: "application/json;charset=utf-8",
				data : parameter,
				success : function(response){
					$.hidePreloader();
					//console.log(response);
					var obj = $.parseJSON(response);
					//console.log(obj);
					if(obj.status==1){
						callback(obj);
					}else if(obj.status==-7){
						$('#submit').attr('disabled',false);
						$.alert(obj.msg);
						$('.modal-button').text('确定');
					}else{
						$('#submit').attr('disabled',false);
						$.alert(obj.statusMsg);
						$('.modal-button').text('确定');
					}
				},
				error : function(response){
					$('#submit').attr('disabled',false);
					$.hidePreloader();
					var obj = $.parseJSON(response);
					$.alert(obj.msg);
					$('.modal-button').text('确定');
				}
			});
		},
		getMobileNo : function(){
			// var urlParams = window.location.search.substring(1);
			// var params = urlParams.split('=');
			// if(params[0]=='mobileNo'){
			// 	return params[1];
			// }else{
			// 	return '';
			// }

			return '15000273724'
		},
		deviceType : function() {
			var browser = {
				version: function () {
					var u = navigator.userAgent;
					var app = navigator.appVersion;
					return {
						trident : u.indexOf('Trident') > -1,
						presto : u.indexOf('Presto') > -1,
						webkit : u.indexOf('AppleWebkit') > -1,
						gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
						mobile : !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
						ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
						android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
						iPhone : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
						iPad : u.indexOf('iPad') > -1,
						webApp : u.indexOf('Safari') == -1
					};
				}(),
				language:(navigator.browserLanguge || navigator.language).toLowerCase()
			}
			if( browser.version.ios || browser.version.iPhone || browser.version.iPad ){
				return 'ios';
			}else if( browser.version.android ){
				return 'android';
			}else{
				return 'pc';
			}
		}
	}

	$(function(){
		survey.init()
		$.init()
		$.config = {router: false}
	})
}

export default {
	surveyStart
}
