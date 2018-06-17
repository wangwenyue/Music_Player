var log = console.log.bind(console)

var e = (selector) => {
    var element = document.querySelector(selector)
    if (element == null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}

var es = (selector) => {
    var elements = document.querySelectorAll(selector)
    if (elements.length == 0) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

var bindEvent = (element, eventName, callback) => {

    element.addEventListener(eventName, callback)
}

var bindAll = (selector, eventName, callback) => {
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

var bindEventCanplay = (audio) => {

    audio.addEventListener('canplay', function() {
        audio.play()
    })
}

// var bindSongs = (songs) => {
//
//     bindAll('.kfc-song', 'click', (event) => {
//         let target = event.target
//         let ele = e('#id-audio-player')
//         ele.src = target.dataset.path
//         let index = target.dataset.index
//         // log('现在的 index', index)
//         bindCheckSongs(index, songs)
//     })
// }
//
// var bindCheckSongs = (index, songs) => {
//
//     bindAll('.kfc-check', 'click', (event) => {
//         let self = event.target
//         let offset = Number(self.dataset.offset)
//
//         index = (songs.length + Number(index) + offset) % songs.length
//         // log('现在的 index', index)
//         let audio = e('#id-audio-player')
//         audio.src = songs[index]
//     })
// }
//
// var bindChoice = (audio, songs) => {
//
//     bindAll('.kfc-choice', 'click', (event) => {
//         selectMode(audio, songs)
//     })
// }
//
// var selectMode = (audio, songs) => {
//
//     let self = event.target
//     let mode = self.dataset.mode
//     if (mode == 'single') {
//         log('single mode selected')
//         callback = singleMode
//     } else if (mode == 'random') {
//         log('random mode selected')
//         callback = randomMode
//     }
//     audio.addEventListener('ended', () => {
//         callback(audio, songs)
//     })
// }
//
// var singleMode = (audio) => {
//
//     log('单曲循环')
//     audio.play()
// }
//
// var randomMode = (audio, songs) => {
//
//     log('随机播放')
//     let song = choice(songs)
//     audio.src = song
//     audio.play()
// }
//
// var choice = (songs) => {
//
//     let a = Math.random()
//     let randomIndex = parseInt(a * (songs.length))
//     return songs[randomIndex]
// }

var addClass = (element, classname) => {

    if (element.classList)
        element.classList.add(classname)
    else
        element.className += ' ' + classname
}

var removeClass = (classname, element) => {

    let cn = element.className
    let rxp = new RegExp("\\s?\\b" + classname + "\\b", "g")
    cn = cn.replace(rxp, '')
    element.className = cn
}

var progressBarEl = e('#progress-bar')
var controlsPlayEl = e('#controls-play')

var play = () => {
    addClass(progressBarEl, "play")
    addClass(controlsPlayEl, "play")
}

var bindPlay = function () {
    log('点击了play按钮')
    let play = e('.icon-play')
    play.addEventListener('click', () => {
        addClass(progressBarEl, "play")
        addClass(controlsPlayEl, "play")
        log('开始播放')
        let player = e('#id-audio-player')
        player.play()
    })
}

var bindPause = function () {
    var pause = e('#kfc-button-pause')
    pause.addEventListener('click', function(){
        log('停止播放')
        var player = e('#id-audio-player')
        player.pause()
    })
}

var __main = () => {

    let a = e('#id-audio-player')
    let songs = ['./songs/1.mp3', './songs/2.mp3', './songs/3.mp3']
    // bindSongs(songs)
    bindPlay()
    bindEventCanplay(a)
    // bindChoice(a, songs)
}

__main()
