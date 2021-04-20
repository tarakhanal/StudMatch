

export const loginContainerTransition = {
    in: {
        opacity: 1,
        y: '0%',
        x: '0%',
    },
    out: {
        opacity: 0,
        x: '3%',
        y: '0%',
    },
    initial: {
        opacity: 0,
        x: '0%',
        y: '3%',
    }
}

export const popupTransition = {
    in: {
        opacity: 1,
        y: '-50%',
        x: '-50%',
        scale: 1
    },
    out: {
        opacity: 0,
        x: '-50%',
        y: '-45%',
        scale: 0.95
    },
    initial: {
        opacity: 0,
        x: '-50%',
        y: '-45%',
        scale: 0.95
    }
}

export const backdropTransition = {
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    },
    initial: {
        opacity: 0,
    }
}

export const loginContainerTransitionDuration = .25