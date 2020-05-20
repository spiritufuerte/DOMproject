const data = [
    {
        'folder': true,
        'title': 'Pictures',
        'children': [
            {
                'title': 'logo.png'
            },
            {
                'folder': true,
                'title': 'Vacations',
                'children': [
                    {
                        'title': 'spain.jpeg'
                    }
                ]
            }
        ]
    },
    {
        'folder': true,
        'title': 'Desktop',
        'children': [
            {
                'folder': true,
                'title': 'screenshots',
                'children': null
            }
        ]
    },
    {
        'folder': true,
        'title': 'Downloads',
        'children': [
            {
                'folder': true,
                'title': 'JS',
                'children': null
            },
            {
                'title': 'nvm-setup.exe'
            },
            {
                'title': 'node.exe'
            }
        ]
    },
    {
        'title': 'credentials.txt'
    }
];

const rootNode = document.getElementById('root');

// TODO: your code goes here

function drawStructure(element, structure) {
    const ul = document.createElement('ul');
    ul.hidden = element.id !== 'root';
    if (structure) {
        for (let i = 0; i < structure.length; i++) {
            const item = structure[i];
            const li = document.createElement('li');
            li.classList.add(item.folder ? 'folder' : 'file');
            drawItem(li, item);

            if (typeof item.children !== 'undefined') {
                drawStructure(li, item.children);
            }

            ul.append(li);
        }
    }
    element.append(ul);
}

function drawItem(element, item) {
    const div = document.createElement('div');
    div.className = 'wrapper';
    const i = document.createElement('i');
    i.className = 'material-icons';
    i.innerHTML = item.folder ? 'folder' : 'insert_drive_file';

    div.append(i);

    const title = document.createElement('div');
    title.innerHTML = item.title;
    div.append(title);
    element.append(div);
}

drawStructure(rootNode, data);


document.addEventListener('click', function (event) {
    deleteContextmenu();
    const target = getCorrectTarget(event.target);
    if (target && target.classList.contains('folder')) {
        target.classList.toggle('open');
        event.target.parentNode.querySelector('i').innerHTML = target.classList.contains('open')
            ? 'folder_open'
            : 'folder';
    }
});

function getCorrectTarget(target) {
    do {
        if (target.tagName === 'LI') {
            return target;
        }
        target = target.parentNode;
    } while (target);
}

function createContextmenu(element, x, y) {
    deleteContextmenu();
    const div = document.createElement('div');
    div.classList.add(element ? 'active' : 'inactive');
    div.setAttribute('id', 'menu');
    div.style.position = 'absolute';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    const rename = document.createElement('div');
    rename.innerHTML = 'Rename';
    const deleteElement = document.createElement('div');
    deleteElement.innerHTML = 'Delete file';
    if (element) {
        rename.addEventListener('click', function () {
            const title = element.querySelector('.wrapper div');
            title.setAttribute('contenteditable', 'true');
            setTimeout(function () {
                title.focus();
                if(element.classList.contains('folder')) {
                    selectTextRange(title, 0, title.innerHTML.length -1);
                } else {
                    selectTextRange(title, 0, title.innerHTML.lastIndexOf('.')-1);
                }
            }, 0);
            title.addEventListener('blur', function () {
                title.removeAttribute('contenteditable');
            })
        });
        deleteElement.addEventListener('click', function () {
            element.parentNode.removeChild(element);
        });
    }
    div.append(rename);
    div.append(deleteElement);
    rootNode.append(div);
}
function selectTextRange(obj, start, stop) {
    let endNode, startNode = endNode = obj.firstChild

    startNode.nodeValue = startNode.nodeValue.trim();

    const range = document.createRange();
    range.setStart(startNode, start);
    range.setEnd(endNode, stop + 1);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}


document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    const target = getCorrectTarget(event.target);
    createContextmenu(target, event.pageX, event.pageY);

});

function deleteContextmenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        rootNode.removeChild(menu);
    }
}
