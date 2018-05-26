$(document).ready(function () {
    socialHover({
        target: '.footer',
        trigger: '.social-details li a'
    });
    socialHover({
        target: '.footer',
        trigger: '.footer .logo'
    });
    footerPromotionForm();
    onScrollNav();
    $('body').css('margin-top', $('header').outerHeight());
});

$(window).resize(function(){
    $('body').css('margin-top', $('header').outerHeight());
});

var onScrollNav = function(){
    var isScrolled,
        lastST = 0,
        delta = 5,
        navH = $('header').outerHeight();

    $(window).scroll(function(){
        isScrolled = true;
    });

    setInterval(function(){
        if(isScrolled){
            hasScrolled();
            isScrolled = false;
        }
    }, 50);

    function hasScrolled(){
        var st = $(this).scrollTop();
        if(Math.abs(lastST - st) <= delta) return;
        if(st > lastST && st > navH){
            $('header').css({'top': '-' + navH + 'px'});
        }else {
            if((st + $(window).height()) < $(document).height()){
                $('header').css({'top': '0'});
            }
        }
        lastST = st;
    }
}

var socialHover = function (options) {
    var target = options.target;
    var trigger = options.trigger;
    $(trigger).on("mouseover", function () {
        var allClasses = $(target).attr('class').split(" ");
        var selectedClass = $(this).attr("data-shClass");
        var alteredClass = alterClasses(allClasses, selectedClass);
        $(target).removeClass().addClass(alteredClass);
    });
    $(trigger).on("mouseout", function () {
        var allClasses = $(target).attr('class').split(" ");
        var alteredClass = alterClasses(allClasses);
        $(target).removeClass().addClass(alteredClass);
    });
}
var alterClasses = function (allClasses, selectedClass) {
    var newClasses = [],
        condition;
    for (var i = 0; i < allClasses.length; i++) {
        condition = allClasses[i].search(/sh-+/);
        if (condition !== 0) {
            newClasses.push(allClasses[i]);
        }
    }
    newClasses.push(selectedClass);
    var addClasses = newClasses.join(" ");
    return addClasses;
}

var footerPromotionForm = function () {
    var trigerStart = $("#footer-promotion").find('.btn-start');
    var trigerCancel = $("#footer-promotion").find('.btn-cancel');
    var trigerNext = $("#footer-promotion").find('.btn-next');
    var trigerPrev = $("#footer-promotion").find('.btn-prev');
    var progressBar = $("#footer-promotion").find('.progress');
    var countOfLi = $('.promotion-form').find('.list-form li').length;
    trigerStart.on('click', function (e) {
        e.preventDefault();
        $('.promotion-form').removeClass('hideIt');
        $('.promotion-form').find('.list-form li:nth-child(1)').addClass('current');
    });
    trigerCancel.on('click', function (e) {
        e.preventDefault();
        $('form[name="enquiryForm"]')[0].reset();
        $("#footer-promotion").find('.btn-next').attr("disabled", "disabled");
        $('.promotion-form').addClass('hideIt');
        $('.promotion-form').find('.list-form li').removeClass('current');
        progressBar.css({
            'width': '0',
        });
    });
    trigerNext.on('click', function (e) {
        e.preventDefault();
        var questionNumber = $(this).attr('data-number');
        var dataProgress = $(this).attr('data-progress');
        var btnStatus = $(this).attr('disabled');
        var alertMsg = $(this).attr('data-alertMsg');
        if (btnStatus === 'disabled') {
            alert(alertMsg);
            return false;
        } else {
            $('.promotion-form').find('.list-form li').removeClass('current');
            $('.promotion-form').find('.list-form li:nth-child(' + questionNumber + ')').addClass('current');
            if (questionNumber == countOfLi) {
                progressBar.css({
                    'width': (questionNumber * (100 / countOfLi)) + '%'
                });
            } else {
                progressBar.css({
                    'width': (dataProgress * (100 / countOfLi)) + '%'
                });
            }
        }
    });
    trigerPrev.on('click', function (e) {
        e.preventDefault();
        var questionNumber = $(this).attr('data-number');
        $('.promotion-form').find('.list-form li').removeClass('current');
        $('.promotion-form').find('.list-form li:nth-child(' + questionNumber + ')').addClass('current');
        progressBar.css({
            'width': ((questionNumber * (100 / countOfLi)) - (100 / countOfLi)) + '%'
        });
    });
    validation();
    enquiryFormSubmission();
}
var validation = function () {
    $('#projectDescription').keyup(function () {
        var value = $.trim($(this).val());
        var valueLength = value.length;
        $(this).closest('.form-fields').find('.inputLimit span').html(valueLength);
        if (valueLength < 1) {
            $(this).closest('li').find('.btn-next').attr("disabled", "disabled");
        } else if (valueLength > 200) {
            $(this).closest('li').find('.btn-next').attr("disabled", "disabled");
            $(this).closest('.form-fields').find('.inputLimit span').addClass('limitReached');
        } else {
            $(this).closest('li').find('.btn-next').removeAttr("disabled");
            $(this).closest('.form-fields').find('.inputLimit span').removeClass('limitReached');
        }
    });
    $('.checkbox-custom').on('click', function () {
        var atLeastOneIsChecked = $('input:checkbox').is(':checked');
        if (atLeastOneIsChecked === false) {
            $(this).closest('li').find('.btn-next').attr("disabled", "disabled");
        } else {
            $(this).closest('li').find('.btn-next').removeAttr("disabled");
        }
    });
    $('.form-details').keyup(function () {
        var emptyFields = $('.form-details').filter(function () {
            return $.trim(this.value) === "";
        });
        if (emptyFields.length) {
            $(this).closest('li').find('.btn-next').attr("disabled", "disabled");
        } else {
            $(this).closest('li').find('.btn-next').removeAttr("disabled");
        }
    });
}
var enquiryFormSubmission = function () {
    var submittedSuccessfully = function () {
        var questionNumber = $('.btn-success').attr('data-number');
        $('.promotion-form').find('.list-form li').removeClass('current');
        $('.promotion-form').find('.list-form li:nth-child(' + questionNumber + ')').addClass('current');
        $("#footer-promotion").find('.progress').css({
            'width': '100%'
        });
        $('form[name="enquiryForm"]')[0].reset();
    }
    $('.btn-success').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: 'enquirySend.php',
            data: $('form').serialize(),
            success: function () {
                submittedSuccessfully();
            }
        });
    });
}
