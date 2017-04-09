const {BrowserWindow} = require('electron');
exports.openWindow = (filename) => {
    let win = new BrowserWindow(
        {
            width : 800
            , minWidth:330
            , height :500
            , minHeight: 450
            , icon: __dirname + '/resources/installer/Icon.ico'
            , webPreferences :{ defaultFontSize : 14}
        }
    );
    win.loadURL(`file://${__dirname}/${filename}.html`);
}