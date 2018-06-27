const log = console.log.bind(console, '#### musicplayer  ')

const e = (selector) => {

    var element = document.querySelector(selector)
    if (element == null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}

const es = (selector) => {

    var elements = document.querySelectorAll(selector)
    if (elements.length == 0) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

const bindEvent = (element, eventName, callback) => {

    element.addEventListener(eventName, callback)
}

const bindAll = (selector, eventName, callback) => {

    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

const bindEventCanplay = (player) => {

    player.addEventListener('canplay', function() {
        player.play()
    })
}

const bindPlay = (player) => {

    let playBtn = e('.icon-play')
    log('绑定开始播放按钮')
    playBtn.addEventListener('click', () => {
        log('开始播放')
        let progressBarEl = e('#progress-bar')
        let controlsPlayEl = e('#controls-play')

        progressBarEl.classList.toggle('play')
        controlsPlayEl.classList.toggle('play')

        player.play()
    })
}

const bindPause = (player) => {

    let pauseBtn = e('.icon-pause')
    log('绑定停止播放按钮')
    pauseBtn.addEventListener('click', () => {
        log('停止播放')
        let progressBarEl = e('#progress-bar')
        let controlsPlayEl = e('#controls-play')

        progressBarEl.classList.toggle('play')
        controlsPlayEl.classList.toggle('play')

        player.pause()
    })
}

const bindCheckSongs = (player, index, songs, songsName) => {

    log('绑定切歌按钮')
    bindAll('.kfc-check', 'click', (event) => {
        log('换歌')
        let self = event.target
        let offset = Number(self.dataset.offset)

        index = (songs.length + Number(index) + offset) % songs.length
        index = index == 0 ? 3 : index
        log(`现在是第${index}首歌`)

        switchSongsInfo(player, index, songs, songsName)
    })
}

const bindChoice = (player, songs, songsName) => {

    log('绑定模式选择成功')
    bindAll('.kfc-choice', 'click', (event) => {
        selectMode(player, songs, songsName)
    })
}

const switchSongsInfo = (player, index, songs, songsName) => {

    let bg = e('#bg-before')
    let albumCover = e('#albumCover')
    let songName = e('#title-text')
    bg.style.backgroundImage = `url("./pics/${index}.jpg")`
    albumCover.style.backgroundImage = `url("./pics/${index}.jpg")`
    player.src = songs[index - 1]
    songName.innerHTML = songsName[index - 1]
    player.play()

    //TODO 进度条与歌曲时间长度没有结合
    //判断是否暂停, 如果没有暂停，则进度条，播放按钮保持不变
    let isPaused = player.paused
    if (!isPaused) {
        let controlsPlayEl = e('#controls-play')
        let progressBarEl = e('#progress-bar')
        controlsPlayEl.classList.add('play')
        progressBarEl.classList.add('play')
    }
}
//TODO 不选择任何模式，播放完一首歌，可暂停按钮 应该变回 可播放按钮
const selectMode = (player, songs, songsName) => {
    //TODO 选模式有点问题
    let self = event.target
    let modeNow = e('.active')
    let mode = self.dataset.mode
    if (mode == 'single') {
        log('single mode selected')
        callback = singleMode
    } else if (mode == 'random') {
        log('random mode selected')
        callback = randomMode
    } else if (mode == 'loop') {
        log('loop mode selected')
        callback = loopMode
    }
    player.addEventListener('ended', () => {
        callback(player, songs, songsName)
    })
}

const singleMode = (player) => {

    log('单曲循环')
    player.play()
}

const randomMode = (player, songs, songsName) => {

    log('随机播放')
    let randomNum = Math.random()
    let randomIndex = parseInt(randomNum * (songs.length))

    let bg = e('#bg-before')
    let albumCover = e('#albumCover')
    let songName = e('#title-text')
    log(`现在是第${randomIndex + 1}首歌`)
    bg.style.backgroundImage = `url("./pics/${randomIndex + 1}.jpg")`
    albumCover.style.backgroundImage = `url("./pics/${randomIndex + 1}.jpg")`
    player.src = songs[randomIndex]
    songName.innerHTML = songsName[randomIndex]

    player.play()
}

const loopMode = (player, songs, songsName) => {

    log('循环播放')
    let bg = e('#bg-before')
    let albumCover = e('#albumCover')
    let songName = e('#title-text')
    //正则提取当前歌曲Index
    let reg = /[1-9][0-9]*/g
    let indexNow = Number(bg.style.backgroundImage.match(reg))
    indexNow = indexNow == 3 ? 0 : indexNow
    log(`现在是第${indexNow + 1}首歌`)
    bg.style.backgroundImage = `url("./pics/${indexNow + 1}.jpg")`
    albumCover.style.backgroundImage = `url("./pics/${indexNow + 1}.jpg")`
    player.src = songs[indexNow]
    songName.innerHTML = songsName[indexNow]

    player.play()
}
////////////////////////////////////////////////////////////////////////////////////

const changeMode = (songs) => {

    bindAll('.kfc-choice', 'click', (event) => {

        let self = event.target
        log('btn now:', self)

        let old = e('.active')
        if (old) {
            old.classList.remove('active')
        }

        let modeIndex = Number(self.dataset.modeindex)

        let nextModeIndex = modeIndex + 1
        if (modeIndex == songs.length - 1) {
            nextModeIndex = 0
        }

        let modeList = es('.kfc-choice')
        for (let i = 0; i < modeList.length; i++) {
            if (modeList[i].dataset.modeindex == nextModeIndex) {
                modeList[i].classList.add('active')
            }
        }
    })
}

const bindEnd = (player) => {

    player.addEventListener('ended', () => {
        let isPaused = player.paused
        if (isPaused) {
            let controlsPlayEl = e('#controls-play')
            let progressBarEl = e('#progress-bar')
            controlsPlayEl.classList.remove('play')
            progressBarEl.classList.remove('play')
        }
    })

}

const __main = () => {

    let player = e('#id-audio-player')
    let songs = ['./songs/1.mp3', './songs/2.mp3', './songs/3.mp3']
    let songsName = [
        '乐游记 // 银临 X 徐梦圆',
        'Love Song // 方大同',
        'Talking Body // Tove Lo',
    ]
    //从1开始，代表第一首歌
    let index = 1
    bindCheckSongs(player, index, songs, songsName)
    bindPlay(player)
    bindPause(player)
    bindEnd(player)
    bindEventCanplay(player)
    bindChoice(player, songs, songsName)
    changeMode(songs)
}

__main()
