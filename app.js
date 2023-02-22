const DISPLAY_UPDATE = 100
const POLL_TIME = 1

function clicksPerSecond(startTime, clicks) {
    return clicks > 1 ? clicks / ((new Date() - startTime) / 1000) : 0.0
}

function buttonPressed(button) {
    if (typeof button === "object") return button.pressed
    return button === 1.0
}

const gpConnectionState = document.querySelector(".gp-connection-state")
const cpsValue = document.querySelector(".cps-value")
const buttonSelect = document.getElementById("button-select")

window.addEventListener("gamepadconnected", (e) => {
    // var gamepads = navigator.getGamepads
    //     ? navigator.getGamepads()
    //     : navigator.webkitGetGamepads
    //     ? navigator.webkitGetGamepads
    //     : []

    let clicks = 0
    let startInterval = new Date()

    let prevState = 0,
        currState = 0
    let lastClickDate = new Date()
    let isTimeOut = false

    gpConnectionState.textContent = "🟢 Gamepad Connected"

    setInterval(() => {
        button = navigator.getGamepads()[e.gamepad.index].buttons[
            buttonSelect.value
        ]

        // Check if button was pressed
        currState = buttonPressed(button)
        if (currState && currState !== prevState) {
            clicks++
            lastClickDate = new Date()

            if (isTimeOut) {
                startInterval = new Date()
                isTimeOut = false
            }
        }
        prevState = currState

        // Reset if (clicktime * e) passes
        if (
            new Date() - lastClickDate >
            (1 / clicksPerSecond(startInterval, clicks)) * 2718
        ) {
            isTimeOut = true
            clicks = 0
        }
    }, POLL_TIME)

    // Update displayed cps every 100ms
    setInterval(() => {
        cpsValue.textContent = clicksPerSecond(startInterval, clicks).toFixed(2)
    }, DISPLAY_UPDATE)
})
window.addEventListener("gamepaddisconnected", (e) => {
    gpConnectionState.textContent = "❌Gamepad Disconnected"
})
