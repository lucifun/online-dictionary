$(document).ready(function () {

	// var newWords = {'a':1,'b':2,'c':3};
    var newWords = {};
    var newWordsKey = [];

    // 单词输入，实时翻译
    $(".search").keyup(function() {
        var reg = new RegExp("[a-zA-Z]", "gi");
        ($(".search").val() === '')?$(".result").hide():$(".result").show();

        wordCheck($(".search").val(), reg);
    }); 

    // 获得焦点/失去焦点
    $('.search').focus(function () {
        $(this).addClass('isFocus');
    }).blur(function () {
        $(this).addClass('isBlur');
    });


    // 点击按钮加入生词本
    $('.result-btn').on('click',function(){
    	for(var i in newWords){
    		if(i == $(".search").val()){
    			alert('该单词已被添加至生词本');
    			return ;
    		}
    	}
    	addWord($(".search").val());
        crearNewWordsNotebook(newWords);
    });

    // 点击按钮显示生词本
    $('.wordbookbtn').on('click',function() {
        if ($('.wordbookbtn').get(0).value == '显示生词本') {
            showNewWordsNotebook();
        }else{
            closeNewWordsNotebook();
        }
    });

    //点击/关闭按钮单词测试
    $('.testwordsbtn').get(0).onclick = function () {
        if($('.testwordsbtn').get(0).value == '新单词测试'){
            openNewWordsTest();
        }else {
            closeNewWordsTest();
        }
    };


    // 匹配正则，执行相应函数
    var wordCheck = function (inputString, reg) {
        var input = inputString.trim();
        var result = false;
        result = reg.test(input);
        if (!result) {
        	$(".result-translation").text("请输入单词").show();
        	$('.result-btn').attr('disabled',true);
            return;
        }

        var chinese = dictionary["$" + input];
        (chinese != undefined) ? ($(".result-translation").text(chinese).show(),$('.result-btn').attr('disabled',false)) : ($(".result-translation").text("找不到该单词").show(),$('.result-btn').attr('disabled',true));
    }


    // 添加单词
    var addWord = function(data){
        newWords[data] = dictionary["$" + data];
        newWordsKey.push(data);
    }


    // 生词本单词生成
    var crearNewWordsNotebook = function ( newWords) {
        $('.words-table').get(0).innerHTML = '' ;
        for(var i in newWords){
            var newTr = document.createElement('tr');
            $('.words-table').append(newTr);
            var newTd = document.createElement('td');
            newTd.innerHTML = i;
            newTr.append(newTd);
            newTd = document.createElement('td');
            newTd.innerHTML = newWords[i];
            newTr.appendChild(newTd);
        }
        if($('.wordbookbtn').get(0).value == '显示生词本'){
            $('.words-block').css({'display':'none','opacity':'0'});
        }
    }

   //显示生词本
    var showNewWordsNotebook = function () {
        $('.wordbookbtn').attr('disabled','disabled');
        if ($.isEmptyObject(newWords)) {
            alert('生词本为空');
            $('.wordbookbtn').removeAttr('disabled');
            return;
        }
        $('.wordbookbtn').get(0).value = '关闭生词本';
        $('.words-block').css({'display': 'inline-block'});
        $('.words-block').animate({'width': '50%'}, 'slow', 'linear', function () {
            $('.words-block').css({'padding': '0 50px'});
            $('.words-block').animate({'opacity': 1}, 'slow', 'linear',function () {
                $('.wordbookbtn').removeAttr('disabled');
            });
        })

    }

    //关闭生词本
    var closeNewWordsNotebook = function () {
        $('.wordbookbtn').attr('disabled','disabled');
        $('.test-block').css('display','none');
        $('.wordbookbtn').get(0).value = '显示生词本';
        $('.words-block').animate({'opacity': 0}, 'slow', 'linear',function () {
            $('.words-block').css({'padding': '0px'});
            $('.words-block').animate({'width': '0'}, 'slow', 'linear', function () {
                    $('.words-block').css({'display': 'none'});
                    $('.wordbookbtn').removeAttr('disabled');
            });
        })
    }

    //开启新单词测试
    var openNewWordsTest = function () {
        if(newWordsKey.length == 0){
            alert("生词本为空，无法测试，请加入新的单词");
            return ;
        }
        $('.words-table').animate({'opacity':'0'},'slow','linear',function () {
            $('.words-table').html('');
            $('.testwordsbtn').attr('value','退出测试');
            $('.test-block').css('display','block');

            var numTemp = Math.floor(Math.random()*newWordsKey.length);
            // console.log(newWords[newWordsKey[numTemp]]);
            $('.test-tips').text(newWords[newWordsKey[numTemp]]);
            $('.test-btn').get(0).onclick = function (event) {
                event.preventDefault();
                if($('.test-word').get(0).value === newWordsKey[numTemp]) {
                    delete newWords[newWordsKey[numTemp]];
                    newWordsKey.splice(numTemp, 1);
                    // console.log(newWords);
                    // console.log(newWordsKey.length);
                    alert('输入单词正确');
                    if(newWordsKey.length == 0){
                        alert('生词本已空');
                        $('.test-tips').text('');
                        $('.testwordsbtn').trigger('click');
                        return;
                    }
                    numTemp = Math.floor(Math.random()*newWordsKey.length);
                    $('.test-tips').text(newWords[newWordsKey[numTemp]]);
                }else {
                    alert('输入单词错误');
                }

            };
        })
    }

    //关闭新单词测试
    var closeNewWordsTest = function () {
        $('.testwordsbtn').attr('value','新单词测试');
        $('.test-word').get(0).value = '';
        $('.test-block').css('display','none');
        crearNewWordsNotebook(newWords);
        $('.words-table').animate({'opacity':1},'slow','linear');
    }
});

