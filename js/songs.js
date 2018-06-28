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

////////////////////////////////////////////////////////////////////////

const bindEventCanplay = (player) => {

    player.addEventListener('canplay', function() {
        player.play()
    })
}

const bindPlay = (player) => {

    let playBtn = e('.icon-play')
    playBtn.addEventListener('click', () => {
        let controlsPlayEl = e('#controls-play')
        controlsPlayEl.classList.toggle('play')
        moveByTime(player)
        player.play()
    })
}

const bindPause = (player) => {

    let pauseBtn = e('.icon-pause')
    pauseBtn.addEventListener('click', () => {
        let controlsPlayEl = e('#controls-play')
        controlsPlayEl.classList.toggle('play')
        player.pause()
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

    let isPaused = player.paused
    if (!isPaused) {
        let controlsPlayEl = e('#controls-play')
        controlsPlayEl.classList.add('play')
    }
}

const moveByTime = (audio) => {
    let interval = 1000
    let t = setInterval( () =>{
        updateProgressBar(audio)
    }, interval)
    return t
}

const updateProgressBar = (audio) => {

    let played = e('#progress-bar')

    if (audio.readyState === 0) {
        played.style.width = `0px`
    }  else {
        let current = audio.currentTime
        let duration = audio.duration
        let buffer = audio.buffered
        if (buffer.length > 0) {
            let now = (current / duration) * 100
            played.style.width = `${now}%`
        }

    }
}

const bindCheckSongs = (player, index, songs, songsName) => {

    bindAll('.kfc-check', 'click', (event) => {
        let self = event.target
        let offset = Number(self.dataset.offset)

        index = (songs.length + Number(index) + offset) % songs.length
        index = index == 0 ? 3 : index

        switchSongsInfo(player, index, songs, songsName)
    })
}

const bindChoice = (player, songs, songsName) => {

    bindAll('.kfc-choice', 'click', (event) => {
        let self = event.target
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
        selectMode(player, songs, songsName)
    })
}

const selectMode = (player, songs, songsName) => {

    let modeNow = e('.active')
    let mode = modeNow.dataset.mode
    if (mode == 'single') {
        callback = singleMode
    } else if (mode == 'random') {
        callback = randomMode
    } else if (mode == 'loop') {
        callback = loopMode
    }

    bindEnd(player, songs, songsName, callback)
}

const bindEnd = (player, songs, songsName, callback) => {

    player.addEventListener('ended', () => {
        let day = new Date()
        callback(player, songs, songsName)
    })

}

const singleMode = (player) => {

    player.play()
}

const randomMode = (player, songs, songsName) => {

    let randomNum = Math.random()
    let randomIndex = parseInt(randomNum * (songs.length))

    let bg = e('#bg-before')
    let albumCover = e('#albumCover')
    let songName = e('#title-text')

    bg.style.backgroundImage = `url("./pics/${randomIndex + 1}.jpg")`
    albumCover.style.backgroundImage = `url("./pics/${randomIndex + 1}.jpg")`
    player.src = songs[randomIndex]
    songName.innerHTML = songsName[randomIndex]

    player.play()
}

const loopMode = (player, songs, songsName) => {

    let bg = e('#bg-before')
    let albumCover = e('#albumCover')
    let songName = e('#title-text')

    let reg = /[1-9][0-9]*/g
    let indexNow = Number(bg.style.backgroundImage.match(reg))
    indexNow = indexNow == 3 ? 0 : indexNow

    bg.style.backgroundImage = `url("./pics/${indexNow + 1}.jpg")`
    albumCover.style.backgroundImage = `url("./pics/${indexNow + 1}.jpg")`
    player.src = songs[indexNow]
    songName.innerHTML = songsName[indexNow]

    player.play()
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
    bindEventCanplay(player)
    bindChoice(player, songs, songsName)
}

__main()
