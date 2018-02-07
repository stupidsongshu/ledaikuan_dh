<template>
	<div class="survey no-header">
		<div class="survey-home page page-current" v-show="surveyProcess === 0">
			<div class="content">
				<div class="head_bg"></div>
					<p class="desc">
						在您通过审核之前还需要完成一份调查问卷哦<br/>
						请您认真如实填写，尽快完成<br/>
						否则将会影响您的借款结果<br/>
					</p>
					<a class="startEdit" @click="startEdit" v-if="getQuestionnaireStatus">立即填写</a>
					<a class="startEdit" @click="reGetQuestionnaire" v-if="!getQuestionnaireStatus">重新获取</a>
			</div>
		</div>

		<!-- 其他的单个page内联页（如果有） -->
		<div class="page page1" v-show="surveyProcess === 1">
			<div class="head_bg"></div>
			<div class="quetions-wrap">
				<ul class="quetion"></ul>
				<div class="btns">
					<button id="prev" class="prev">上一题</button>
					<button id="next" class="next active">下一题</button>
				</div>
			</div>
			<div class="submit">
				<button id="submit">立即提交</button>
			</div>
		</div>

		<div id="pageSuccess" class="page resultPage" v-show="surveyProcess === 2">
			<div class="content">
				<div class="head_bg"></div>
				<div class="result"></div>
				<p>您的调查问卷通过啦~</p>
				<button id="pageSuccessButton" class="IKnow">我知道啦</button>
			</div>
		</div>
		<div id="pageError" class="page resultPage error" v-show="surveyProcess === 3">
			<div class="content">
				<div class="head_bg"></div>
				<div class="result"></div>
				<p>您的调查问卷没有通过审核</p>
				<button id="pageFailButton" class="IKnow">我知道啦</button>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import { MessageBox } from 'mint-ui'

export default {
	data() {
		return {
			// 获取调查问卷是否成功
			getQuestionnaireStatus: true,
			// surveyProcess 0默认首页 1正在答题 2通过 3未通过
			surveyProcess: 0,
			quetions: {
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
			},
			survey: {
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
			}
		}
	},
	mounted() {
		let that = this
		this.$nextTick(() => {
			$(function() {
				that.getQuestionnaire()
			})
		})
	},
	methods: {
		//点击开始答题：记录开始时间
		startEdit() {
			this.survey.appActionList[0].actionTime = (new Date()).getTime()
			MessageBox.alert('请认真填写您的调查问卷信息，填写有误将导致您的审核失败！', '').then(action => {
				if (action === 'confirm') {
					this.surveyProcess = 1
					this.survey.questionActionRecord[0].start = (new Date()).getTime();
				}
			})
		},
		reGetQuestionnaire() {
			this.getQuestionnaire()
		},
		getQuestionnaire () {
			let that = this

			let common_params = this.$store.state.common.common_params
			let call = 'Acct.questionnaire'
			let timestamp = new Date().getTime()
			let sign = this.getSign(call, timestamp)
			let paramString = JSON.stringify({
				ua: common_params.ua,
				call: call,
				args: {
					customerId: common_params.customerId
				},
				sign: sign,
				timestamp: timestamp
			})

			this.loading('正在加载问卷...')
			this.$http.post(this.$store.state.common.common_api, paramString).then(res => {
				that.closeLoading()
				if (res.data.returnCode === '000000') {
					that.getQuestionnaireStatus = true
					let obj = {
						questtionNaire: res.data.response
					}
					that.loadQuestions(obj);//初始化问题:测试
					that.survey.appActionList[0].actionTime = (new Date()).getTime();//初始化答题开始的时间
					that.survey.questionActionRecord[0].start = (new Date()).getTime();//初始化第一题开始时间
				} else {
					that.getQuestionnaireStatus = false
					that.toast({
						message: res.data.returnMsg
					})
				}
			}).catch(err => {
				that.getQuestionnaireStatus = false
			})
		},
		loadQuestions(quetions) {
			let that = this

			$('.quetion').empty();
			var questionList = quetions.questtionNaire.paperList[0].questionList;
			var questionNum = questionList.length;

			for(var i=0; i<questionNum; i++){
				var questionItem = '<li no="'+i+'"><p>'+(i+1)+'.'+questionList[i].content+'</p><ul></ul></li>';
				var choiceList = questionList[i].choiceList;
				var type = '';
				$('.quetion').append(questionItem);
				this.survey.questionActionRecord.push({start:'', end:''});
				this.survey.questionActionList.push({
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
				this.survey.questionActionList[i].questionId = questionList[i].questionId;
			}
			$('.quetion').children('li').eq(0).addClass('active').attr('index','first');
			$('.quetion').children('li').eq(i-1).attr('index','last');

			this.survey.actionRecord.questtionNaireCommit.surveyCode = quetions.questtionNaire.surveyCode;
			this.survey.actionRecord.questtionNaireCommit.papeResultList[0].paperId = quetions.questtionNaire.paperList[0].paperId;
			//console.log(survey.questionActionRecord);

			// fix css rules not work
			$('.quetion>li').hide()
			$('.quetion>li.active').show()

			//点击下一题操作
			$('#next').on('click',function(){
				var _this = this;
				if($('.quetion>.active').attr('index') !== 'last'){
					var checked = $('.quetion>.active input:checked').val();
					if(!checked){
						MessageBox.alert('该题尚未完成，请选择答案！', '')
						return;
					}
					var endTime = (new Date()).getTime();
					var queNo = parseInt($('.quetion>.active').attr('no'));
					that.survey.questionActionRecord[queNo].end = (new Date()).getTime();

					// $('.quetion>.active').removeClass('active').next('li').addClass('active');
					$('.quetion>.active').removeClass('active').hide().next('li').addClass('active').show()

					if($('.quetion>.active').attr('index') != 'first'){
						that.survey.questionActionRecord[queNo+1].start = (new Date()).getTime();
						$('#prev').addClass('active');
					}
					if($('.quetion>.active').attr('index') == 'last'){
						$(_this).removeClass('active');
					}
				}
			})

			//点击上一题操作
			$('#prev').on('click',function(){
				var _this = this;
				if($('.quetion>.active').attr('index') != 'first'){
					// $('.quetion>.active').removeClass('active').prev('li').addClass('active');
					$('.quetion>.active').removeClass('active').hide().prev('li').addClass('active').show()
					if($('.quetion>.active').attr('index') != 'last'){
						$('#next').addClass('active');
					}
					if($('.quetion>.active').attr('index') == 'first'){
						$(_this).removeClass('active');
					}
				}
			})

			//点击问题选项操作
			$('.quetion [type=radio]').on('click',function(){
				console.log('点击了');
				var queNo = parseInt($(this).attr('name').substr(-1));
				var trackListLen = that.survey.questionActionList[queNo-1].actionTrackList.length;
				var current = '';
				if(trackListLen!=0){
					current = that.survey.questionActionList[queNo-1].actionTrackList[trackListLen-1].questionAnswer;
				}
				var _thisValue = $(this).val();
				if(current != _thisValue){
					that.survey.questionActionList[queNo-1].actionTrackList.push({"questionAnswer":_thisValue,"seqNo":(trackListLen+1)});
					that.survey.questionActionList[queNo-1].questionAnswer = $(this).val();
				}
				//console.log(queNo);
				//console.log(survey.questionActionList.length);
				if(queNo === that.survey.questionActionList.length){
					$('#submit').show();
				}
			})

			//提交操作
			$('#submit').on('click',function(){
				var len = that.survey.questionActionList.length;
				that.survey.appActionList[1].actionTime = (new Date()).getTime();//设置结束时间
				that.survey.questionActionRecord[len-1].end = (new Date()).getTime();
				//console.log(survey.appActionList);
				//console.log(survey.questionActionRecord);
				that.submit();
			})
		},
		submit() {
			// var que1 = $('.quetion [name=que1]:checked').val();
			// var que2 = $('.quetion [name=que2]:checked').val();
			// var que3 = $('.quetion [name=que3]:checked').val();
			// var que4 = $('.quetion [name=que4]:checked').val();
			// var que5 = $('.quetion [name=que5]:checked').val();
			// console.log(que1, que2, que3, que4, que5)
			// if(!(que1 && que2 && que3 && que4 && que5)){
			// 	MessageBox.alert('您有尚未完成的题目，请选择', '');
			// 	return;
			// }

			this.loading('正在提交答案...');
			var totalTime = this.survey.appActionList[1].actionTime - this.survey.appActionList[0].actionTime;
			var appActionList = [
				{"actionStatus":0,"actionTime":""},
				{"actionStatus":1,"actionTime":""}
			];
			appActionList[0].actionTime = this.format(new Date(this.survey.appActionList[0].actionTime));
			appActionList[1].actionTime = this.format(new Date(this.survey.appActionList[1].actionTime));
			this.survey.actionRecord.questtionNaireCommit.papeResultList[0].totalTime = Math.round(totalTime/1000);

			for(var i=0;i<this.survey.questionActionList.length;i++){
				this.survey.questionActionList[i].spendTime = Math.round((this.survey.questionActionRecord[i].end - this.survey.questionActionRecord[i].start)/1000);
			}

			this.survey.actionRecord.questtionNaireCommit.papeResultList[0].appActionList = appActionList;
			this.survey.actionRecord.questtionNaireCommit.papeResultList[0].questionActionList = this.survey.questionActionList;

			let questionNaireCommit = this.survey.actionRecord.questtionNaireCommit
			console.log(questionNaireCommit)
			let common_params = this.$store.state.common.common_params
			let call = 'Acct.naireCommit'
			let timestamp = new Date().getTime()
			let sign = this.getSign(call, timestamp)
			let paramString = JSON.stringify({
				ua: common_params.ua,
				call: call,
				args: {
					customerId: common_params.customerId,
					questionNaireCommit: questionNaireCommit
				},
				sign: sign,
				timestamp: timestamp
			})

			this.$http.post(this.store.state.common.common_api, paramString).then(res => {
				this.closeLoading()
				if (res.data.returnCode === '000000') {
					this.surveyProcess = 2
				} else {
					this.surveyProcess = 3
				}
			})
		},
		format(date) {
			var year = date.getFullYear(),
				month = ('0'+(date.getMonth()+1)).substr(-2,2),
				day = ('0'+date.getDate()).substr(-2,2),
				hour = ('0'+date.getHours()).substr(-2,2),
				minute = ('0'+date.getMinutes()).substr(-2,2),
				second = ('0'+date.getSeconds()).substr(-2,2);
			var datetime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
			return datetime;
		}
	}
}
</script>

<style scoped lang="stylus">
	@import '../../assets/css/survey.styl'
</style>
