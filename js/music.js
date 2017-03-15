/**
 * Created by ricky on 2017/3/7.
 */
// 音乐测试数据
var musicList = [
    {
        src: 'http://cloud.hunger-valley.com/music/ifyou.mp3',
        title: 'IF YOU',
        auther: 'Big Bang'
    },
    {
        src: 'http://cloud.hunger-valley.com/music/玫瑰.mp3',
        title: '玫瑰',
        auther: '贰佰'
    }
]


// 定义基本变量
var $audio = $('#audio');//音乐
var $play = $('#btn-play');//播放按钮
var $next = $('#btn-next');//下一曲
var $prev = $('#btn-prev');//上一曲
var $musicImg = $('.music-pic');//音乐封面
var $musicName = $('.music-name>p');//音乐名称
var $musicSinger = $('.music-singer>p');//音乐歌手

var $speedNow = $('.speed .speed-now');//歌曲当前进度条
var $speed = $('.speed');//音乐总进度条
var $totalTime = $('#totalTime');//歌曲总时间
var $currentTime = $('#currentTime')//当前歌曲时间
var $love = $('#love1');//点赞按钮
var $random = $('#random1');//循环还是不循环

var $voiceBar = $('#voice-bar')// 音量调节
var $voicedBar = $('#voiced-bar')// 目前音量

var $lyric = $('.lyric');//歌词


// 初始化设置
// 是否自动循环
$audio[0].loop = false;
// 是否自动播放
$audio[0].autoplay = true;

// 初始化音量
$audio[0].volume = 0.5;

$voicedBar.css({
    'width': '50%'
})


//-------歌曲更新播放------

$audio.on('timeupdate', function(){
    totalTime();
    currentTime();
    // setInterval(currentTime(),1000);
    musicProcess();

})


//-------音乐点击进度条播放--------
$speed.on('click',function (e) {
    mouseMusicProcess(e);
})

//-------声音控制点击-------
$voiceBar.on('click',function (e) {
    mouseVoiceProcess(e);
})

//---------是否单曲循环----------
$random.on('click',function () {
    if ($audio[0].loop){
        $audio[0].loop = false;
        // $random.find('i').removeClass('fa-random').addClass('fa-gg-circle');
        $random.removeClass('fa-gg-circle').addClass('fa-random');
    }
    else {
        $audio[0].loop = true;
        // $random.find('i').removeClass('fa-gg-circle').addClass('fa-random');
        $random.removeClass('fa-random').addClass('fa-gg-circle');
    }
})


//---------歌曲头像旋转。判断歌曲在播放----------
$audio.on('playing',function () {
    $musicImg.css({
        'animation': 'xuanzhuan 20s linear infinite'
    })
    $play.find('i').removeClass('fa-play').addClass('fa-pause');

})
$audio.on('pause',function () {
    $musicImg.css({
        'animation': 'none'
    })
    $play.find('i').removeClass('fa-pause').addClass('fa-play');

})




// -------------基本功能------------

//------------播放，暂停------------
$play.on('click',function () {
    if($audio[0].paused){
        $audio[0].play();
        // $play.find('i').removeClass('fa-play').addClass('fa-pause');

    }else {
        $audio[0].pause();
        // $play.find('i').removeClass('fa-pause').addClass('fa-play');
    }

})

//------下一首-------
$next.on('click',function () {
    playNext();
})


//---------下一首函数--------
function playNext() {
    getSong()

}



//---------Ajax获取音乐-------
function getSong(){
    $.ajax({
        url: 'http://api.jirengu.com/fm/getSong.php',
        dataType: 'jsonp',
        type: 'get',
        data: {
            'channel':4
        }
    }).done(function (result) {
        console.log(result);

        lyric = result.song["0"].lrc;
        console.log(lyric)
        getLrc(lyric)

        handleMusic(result);

        $totalTime.text('00:00');
        $currentTime.text('00:00');
    })
}

//如果没有歌词，就“显示无歌词，请静静聆听”

//---------处理歌曲信息---------
function handleMusic(result) {
    $audio.attr('src',result.song["0"].url);
    $musicSinger.text(result.song["0"].artist);
    $musicImg.css({
        'background-image': 'url('+result.song["0"].picture+')',
        'background-size': 'cover',
        'background-position': 'center'
    });
    $musicName.text(result.song["0"].title)
}



//----------显示总歌曲时间----------
function totalTime() {
    var sc = $audio[0].duration;
    console.log(sc)
    var min = parseInt(sc / 60);
    var second = parseInt(sc % 60);
    if(second < 10){
        $totalTime.text( '0'+min+':'+'0'+second)
    }else if(second > 10 && second < 60){
        $totalTime.text( '0'+min+':'+second)
    }else{
        second %= 60
        if(second < 10){
            $totalTime.text( '0'+min+':'+'0'+second)
        }else{
            $totalTime.text( '0'+min+':'+second)
        }
    }
}
//---------显示当前歌曲时间-------------
function currentTime() {
    var sc = $audio[0].currentTime;
    console.log(sc);
    var min = parseInt(sc / 60);
    var second = parseInt(sc % 60);
    if(second < 10){
        $currentTime.text( '0'+min+':'+'0'+second)
    }else if(second > 10 && second < 60){
        $currentTime.text( '0'+min+':'+second)
    }else{
        second %= 60
        if(second < 10){
            $currentTime.text( '0'+min+':'+'0'+second)
        }else{
            $currentTime.text( '0'+min+':'+second)
        }
    }

}

//----------音乐进度动态显示-----------
function musicProcess() {
    var totalTime = $audio[0].duration,
        currentTime = $audio[0].currentTime;
    $speedNow.css({
        'width': (currentTime/totalTime)*100 + '%'
    })
    //自动播放下一首歌曲
    if ($audio[0].currentTime === $audio[0].duration && !$audio[0].loop) {
        playNext();
    }
}

//-------鼠标控制音乐进度--------
function mouseMusicProcess(e){
    var X = e.offsetX;
    $audio[0].currentTime = X/$speed.width()*$audio[0].duration;
    $speedNow.css({
        'width': X
    })
}


//鼠标控制音量
function mouseVoiceProcess(e) {
    var volume = $audio[0].volume,
        controlBarLen = $voiceBar.width(),
        X =  e.offsetX;
    $audio[0].volume = X/controlBarLen;
    $voicedBar.width((X/controlBarLen)*100+'%');
}


//点赞按钮
$love.on('click',function () {
    $love.css({
        'color': '#f00'
    })
})


// ----------处理歌词----------
function getLrc(lrcUrl){
    if(lrcUrl){
        $.ajax({
            url: lrcUrl,
            type: 'get',
            dataType: 'text'
        }).done(function(text){
            handlerLyc(text)
        })
    }
}
var $lyricItem = $('.lyric-item');
var $lyricItemLi = $('.lyric-item li')
function handlerLyc(text){
    var lyric = text.split('\n'),
        result = [],
        reg = /(\d{2}:{1}\d{2}.{1}\d{2})+/g;
    $lyricItem.html('')
    lyric.forEach(function(e, i, a){
        if(reg.test(lyric[i]) && lyric[i].match(reg).length === 1){
            var a = [];
            a[0] = lyric[i].match(reg)[0];
            a[1] = lyric[i].substring(lyric[i].lastIndexOf(']')+1, lyric[i].length);
            result.push(a)
        }else if(reg.test(lyric[i]) && lyric[i].match(reg).length > 1){
            lyric[i].match(reg).forEach(function(e1, i1, a1){
                var b = [];
                b.push(lyric[i].match(reg)[i1]);
                b.push(lyric[i].substring(lyric[i].lastIndexOf(']')+1, lyric[i].length));
                result.push(b);
            })
        }
    })
    result.forEach(function(e2, i2, a2){
        a2[i2][0] = parseFloat(a2[i2][0].substring(3, a2[i2][0].length))+parseInt(a2[i2][0])*60;
    })
    result = result.sort(function(a, b){
        return a[0] - b[0];
    })
    result.forEach(function(e3, i3, a3){
        var $li = $('<li>' + result[i3][1] + '</li>');
        $lyricItem.append($li)
    })

    $audio.on('timeupdate', function(){
        for(var x = 0; x < result.length; x++){
            if($(this)[0].currentTime > result[x][0]){
                $lyricItem.css({
                    'top': -x*40
                })
                $lyricItem.children().eq(x).css({
                    'color': 'red'
                })
                var $now = $lyricItem.children();
                if(result[x+1] !== undefined){
                    if($(this)[0].currentTime - result[x][0] > result[x+1][0] - result[x][0]){
                        $now.eq(x).css({
                            'color': 'black'
                        })
                    }
                }
            }
        }
    })
}


