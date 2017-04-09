<img src="ASSETS/electron.png" alt="JavaScript">

# Electron API Demo.

Electron API 를 사용해보는 간단한 예제 입니다.

## Menu(Main), shell(Both), dialog(Main) 활용 예제

 ### 메뉴를 생성하고 해당 메뉴에서 몇가지 기능을 실행해 봅니다.

[Menu](https://electron.atom.io/docs/api/menu/) - 어플리케이션의 메뉴를 생성하는 API

[shell](https://electron.atom.io/docs/api/shell/) - file과 url을 사용자의 기본 어플리케이션으로 실행 및 관리해주는 API

[dialog](https://electron.atom.io/docs/api/dialog/) - alert 및 file dialog창 생성 


 1. 아래와 같이 menu.js파일을 생성합니다.
변수 arrMenu에 해당하는 하나의 객체는 MenuItem 객체입니다.

[MenuItem 객체 상세옵션](https://electron.atom.io/docs/api/menu-item/)

**menu.js**

```
const {app, shell, dialog, Menu, BrowserWindow} = require('electron');
const appName = app.getName();

let arrMenu = [
	{
		label: '편집',
		submenu: [
			{
				label: '실행취소',
				role: 'undo'
			},
			{
				label:'다시실행',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label:'잘라내기',
				role: 'cut'
			},
			{
				label:'복사',
				role: 'copy'
			},
			{
				label:'붙여넣기',
				role: 'paste'
			},
			{
				label:'모두선택',
				role: 'selectall'
			},
			{
				label:'삭제',
				role: 'delete'
			}
		]
	},
	{
		label: '창',
		role: 'window',
		submenu: [
			{
				label: '최소화',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: '&닫기',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				type: 'separator'
			},
			{
				role: 'togglefullscreen'
			}
		]
	},

	{
		label: '사이트',
		role: 'help'
	},
	{
		label:'포탈',
		submenu:[
			{
                label: '&네이버'
                ,click() {
                shell.openExternal('http://naver.com');
            	}
			}
		]
	},
    {
        label:'클릭',
        submenu:[
            {
                label: '다이얼로그창을 보여주세요'
                ,click() {
                dialog.showMessageBox({ message: "Electron의 dialog.showMessageBox 창!!",

                    buttons: ["확인"]
                });

                }
            },
            {
                label: '제목에 붉은배경색 칠하기'
                ,click() {
                BrowserWindow.getFocusedWindow().webContents.executeJavaScript('changeColor()');

            }
            }
        ]
    }

];
//Node.js 전역객체 인 process객체를 통해 OS를 구분하여 메뉴를 추가
if (process.platform === 'darwin') {
    arrMenu.unshift({
		label: appName,
		submenu: [
			{
        label:'프로그램 종료',
				role: 'quit'
			}
		]
	});
} else {
    arrMenu.unshift({
		label: '파일',
		submenu: [
			{
				label:'프로그램 종료',
				role: 'quit'
			}
		]
	});
}
// Menu객체를 생성
var menu = Menu.buildFromTemplate(arrMenu);

module.exports = menu;
```

2. Electron Application의 진입인 index.js 파일을 아래와 같이 수정 및 추가 합니다.

**index.js**
```
const {app, BrowserWindow, Menu} = require('electron'); //Menu 추가
const appMenu = require('./menu.js'); //추가
...

app.on('ready', () =>{
   ...
   Menu.setApplicationMenu(appMenu); //메뉴를 설정
});
```

4. 실행 후 메뉴 생성을 확인 하고 메뉴를 눌러 봅니다.

## remote(Renderer), BrowserWindow(Main), ipcMain(Main), ipcRenderer

### Renderer process에서 새창을 생성하고, Main process와 통신해봅니다.

[remote](https://electron.atom.io/docs/api/remote/) : Renderer Process에서 Main Process의 모듈을 사용이 가능하게 해주는 모듈

[BrowserWindow](https://electron.atom.io/docs/api/browser-window/) : 창을 생성하고 컨트롤하는 모듈

[ipcMain](https://electron.atom.io/docs/api/ipc-main/) : Main Process에서 Renderer Process로 비동기적으로 통신하는 모듈

[ipcRenderer](https://electron.atom.io/docs/api/ipc-renderer/) : Renderer process에서 Main Process로 비동기적으로 통신하는 모듈

1. 아래와 같이 newwin.js 를 작성합니다.

**newwin.js**
```
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
```
2. newwin.html파일을 생성합니다.
3. remote.js 파일을 아래와 같이 생성합니다.

**remote.js**
```
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

```
4. index.html파일에 remote.js파일을 포함시킵니다.

**index.html**
```
<script src="remote.js"></script>
```

5. index.js 파일에 아래 코드를 추가합니다.
```
ipcMain.on('sendMsg',(event, args) =>{
       //최대인지 확인후 최대화 또는 최대화 취소
       win.isMaximized() ? win.unmaximize() : win.maximize();
       event.sender.send('mainMsg', 'MainProcess에서 신호보냄');
  });
```

6. 실행 후 화면 안의 버튼을 눌러봅니다.

## [Electron 디버깅 ➤](https://github.com/cionman/05_Electron_Debugging) 


 



