const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'warning',
            background: 'orange',
            icon: {
                className: 'material-icons',
                tagName: 'i',
                text: 'warning'
              }
        },
        {
            type: 'error',
            background: 'red',
            icon: {
                className: 'material-icons',
                tagName: 'i',
                text: 'error'
              }
        }
    ],
});