const {remote, ipcRenderer} = require('electron');
const newwin = remote.require('./newwin.js');
const newWinButton = document.createElement('button');

//remote, BrowserWindow 예제
newWinButton.textContent = '새창 열기';
newWinButton.addEventListener('click', () => newwin.openWindow('newwin'));
document.body.appendChild(newWinButton);

document.body.appendChild(document.createElement('div')); //줄바꿈

//ipcMain과 ipcRender API예제
const ipcButton = document.createElement('button');
ipcButton.textContent='Main Process에 신호보내어 창 최대화';
ipcButton.addEventListener('click', () => {
    ipcRenderer.send('sendMsg', 'WindowMax' );
});
ipcRenderer.on('mainMsg',(event, args)=>{
    alert(args);
});

document.body.appendChild(ipcButton);
