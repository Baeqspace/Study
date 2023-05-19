let body = document.querySelector('body');
let addTest = document.querySelector('.add-test');
let nto = document.querySelector('.new-test-option');
let openEditor = document.querySelector('.open-editor')
let editor = document.querySelector('.editor')
let newTask = document.querySelector('.new-task')
let editorMainArea = document.querySelector('.editor-main-area')
let save = document.querySelector('.save')
let attemptsTotal = document.querySelector('#attemptsTotal')
let openExist = document.querySelector('.open-exist')
let testViewer = document.querySelector('.test-viewer')
let testUpload = document.querySelector('#test-upload')
let checkAnswers = document.querySelector('.check-answers')
let attempts = document.querySelector('.attempts')
let corrects = document.querySelector('.corrects')
let attemptsCorrects = document.querySelector('.attempts-corrects')
let testsContainer = document.querySelector('.tests-container')
let viewerClose = document.querySelector('.viewer-close')
let editorClose = document.querySelector('.editor-close')
let category = document.querySelector('.category')
let categorySelect = document.querySelector('#category-select')
let categoryChoose = document.querySelector('.category-choose')
let reloadButton = document.querySelector('.reload')
let categoriesGrid = document.querySelector('.categories-grid')
let allCategs = document.querySelector('.all-categs')
let coinCount = document.querySelector('.coins')
let forIcons = document.querySelector('.for-icons')
let shopButton = document.querySelector('.shop-button')
let shop = document.querySelector('.shop')
let goods = shop.querySelectorAll('[class^="buy"]')
let style = document.querySelector('style')
let dragAndDrop = document.querySelector('.drag-and-drop')
let coins = 0
if (localStorage.getItem('coins')==null) {
    localStorage.setItem('coins', 0)
} else {
    coins = localStorage.getItem('coins')
}
coinCount.textContent = coins
if (localStorage.getItem('color') != null) {
    style.textContent += '.progress {background-image: linear-gradient(to right,'+ localStorage.getItem('color') + ', ' + localStorage.getItem('color')+ '22' + ', ' + localStorage.getItem('color') + ') !important;} .test100 {background-color:' + localStorage.getItem('color') + '44' +';}'}
if (localStorage.getItem('font') != null) {
    style.textContent += 'body {font-family:'+ localStorage.getItem('font') +';}'}

window.onload=()=>{
    eel.search_tests()
}

function textAutoSize(elem1, elem2, font) {
    if (elem1.clientWidth < elem2.clientWidth || elem1.clientHeight < elem2.clientHeight) {
        elem2.style.width = 'unset'
        elem2.style.overflowWrap = 'unset'
        while ((elem1.clientWidth < elem2.clientWidth || elem1.clientHeight < elem2.clientHeight) && (elem2.clientWidth - elem1.clientWidth > 2 || elem2.clientHeight - elem1.clientHeight > 2)) {
            font--
            elem2.style.fontSize = font + 'px'
        }
    } else {
        while (window.getComputedStyle(elem2)['fontSize'].slice(0, -2) < 24 && (elem1.clientWidth - elem2.clientWidth > 2 && elem1.clientHeight - elem2.clientHeight > 2)) {
            font = window.getComputedStyle(elem2)['fontSize'].slice(0, -2)
            font++
            elem2.style.fontSize = font + 'px'
        }
    }
}

function close_menu(menu, area, mode) {
    setTimeout(()=>{
        area.onclick=()=>{if(mode == 'image'){menu.parentNode.remove()} else{menu.classList.add('hidden');area.onclick=''}}
        menu.onmouseenter=()=>{area.onclick=''}
        menu.onmouseleave=()=>{area.onclick=()=>{if(mode == 'image'){menu.parentNode.remove()} else{menu.classList.add('hidden');area.onclick=''}}}
        }, 200)
}

function enable_menu(test) {
    test.oncontextmenu=(e)=>{
        e.preventDefault()
        if (document.querySelector('.menu') != null) {
            document.querySelector('.menu').remove()
        }
        let text = test.querySelector('.test-text')
        let menu = document.createElement('div')
        menu.classList.add('menu')
        menu.style.top = e.clientY + 'px'
        menu.style.left = e.clientX + 'px'
        menu.textContent = 'Удалить'
        body.append(menu)
        document.onclick=()=>{menu.remove();document.onclick=''}
        menu.onmouseenter=()=>{document.onclick='';menu.onclick=()=>{eel.delete_test(text.textContent);test.remove();menu.remove()}}
        menu.onmouseleave=()=>{menu.onclick='';document.onclick=()=>{menu.remove();document.onclick=''}}
    }
}

let alreadyCategory = []
function check_categs(testCateg) {
    if (alreadyCategory.includes(testCateg)) {
        return
    } else {
        alreadyCategory.push(testCateg)
    }
    let categ = document.createElement('div')
    categ.classList.add('category-unit')
    categ.textContent = testCateg
    categoriesGrid.append(categ)
    categ.onclick=()=>{
        let tests = testsContainer.querySelectorAll('.test')
        for (let test of tests) {
            test.classList.remove('hidden')
            if (test.dataset.testType != categ.textContent) {
                test.classList.add('hidden')
            }
        }
        category.textContent = categ.textContent
        categoryChoose.classList.add('hidden')
    }
}

eel.expose(testSearch)
function testSearch(tests, categories, progress, attEst, attTot) {
    let k = 0
    for (let test of tests) {
        let newTest = document.createElement('div')
        newTest.classList.add('test')
        newTest.dataset.testName = 'test' + test
        let testText = document.createElement('p')
        testText.classList.add('test-text')
        testText.textContent = test
        newTest.dataset.testType = categories[k]
        check_categs(categories[k])
        testsContainer.append(newTest)
        newTest.append(testText)
        textAutoSize(newTest, testText, 24)
        newTest.onclick=()=>{
            eel.activate_test(testText.textContent)
        }
        enable_menu(newTest)
        if (progress[k] == '100%') {
            newTest.classList.add('test100')
        } else {
            let prog = document.createElement('div')
            prog.classList.add('progress')
            prog.style.width = progress[k]
            newTest.append(prog)
        }
        if (attEst[k] == attTot[k]) {
            console.log(attEst[k],attTot[k])
            let lock = document.createElement('p')
            lock.classList.add('material-icons')
            lock.classList.add('lock')
            lock.textContent = 'lock'
            newTest.prepend(lock)
        }
        k++
    }
    
}

allCategs.onclick=()=>{
    let tests = testsContainer.querySelectorAll('.test')
    for (let test of tests) {
        test.classList.remove('hidden')
    }
    category.textContent = allCategs.textContent
    categoryChoose.classList.add('hidden')
}

function buildTask(counter, place, mode, content, task_answer, complete, userAnswer, images) {
    let task = document.createElement('div');
    let taskHeader = document.createElement('p')
    let answer = document.createElement('input')

    answer.setAttribute('type','text')
    answer.classList.add('answer')
    answer.setAttribute('placeholder', 'Введите ответ...')

    taskHeader.classList.add('task-header')
    taskHeader.textContent = 'Задание ' + counter

    let imageGrid;
    imageGrid = document.createElement('div')
    imageGrid.classList.add('image-grid')

    let taskText;
    let taskImage;
    let label;
    console.log(images)
    if (mode === 'editor') {
        taskText = document.createElement('textarea')
        taskText.setAttribute('placeholder', 'Введите задание...')
        label = document.createElement('label')
        label.classList.add('task-image-button')
        label.textContent = 'Выберите картинку'
        taskImage = document.createElement('input')
        taskImage.classList.add('task-image')
        taskImage.setAttribute('type', 'file')
        taskImage.setAttribute('multiple','')
        taskImage.setAttribute('accept', 'image/*')
        taskImage.onchange=()=>{
            let files = taskImage.files
            for (let file of files) {
                let fileRead = new FileReader()
                fileRead.onload=(e)=>{
                    let image = document.createElement('img')
                    image.src = e.target.result
                    imageGrid.append(image)
                    image.oncontextmenu=(e)=>{
                        e.preventDefault()
                        image.remove()
                    }
                }
                fileRead.readAsDataURL(file)
            }
            taskImage.value = ''
        }
        task.append(label)
        label.append(taskImage)
    } else if (mode === 'exist') {
        console.log('work')
        taskText = document.createElement('p')
        taskText.textContent = content
        task.dataset.taskAnswer = task_answer
        task.dataset.number = 'task' + counter
        let imageAmount = images['imageAmount']
        console.log(imageAmount)
        for (let i = 1; i <= imageAmount; i++) {
            let image = document.createElement('img')
            image.onclick=()=>{
                let menu = document.createElement('div')
                let gridCon = document.createElement('div')
                gridCon.classList.add('image-container')
                menu.classList.add('image-viewer')
                task.append(gridCon)
                gridCon.append(menu)
                let image1 = image.cloneNode(false)
                menu.append(image1)
                close_menu(menu, document, 'image')
            }
            image.src = images['image'+i]
            imageGrid.append(image)
        }
        console.log(complete)
        if (complete == 'pass') {
            task.style.backgroundColor = 'green'
            answer.disabled = true
        } else if (complete == 'fail') {
            task.style.backgroundColor = 'red'
        }
        answer.value = userAnswer 
    }

    taskText.classList.add('task-text')
    task.classList.add('task')
    place.append(task)
    task.append(taskHeader)
    task.append(taskText)
    task.append(imageGrid)
    if (mode == 'editor') {task.append(label);label.append(taskImage)}
    task.append(answer)
}

eel.expose(buildTestFromExist)
function buildTestFromExist(jsonFile, mode) {
    jsonFile = JSON.parse(jsonFile)
    testViewer.dataset.openedName = jsonFile['testName']
    let tasks = Number(jsonFile['taskAmount'])
    console.log(tasks)
    console.log(jsonFile['task1']['images'])
    if (mode === 'menu') {
        testViewer.classList.remove('hidden')
        for (let i = 1; i <= tasks; i++) {
            console.log(i, testViewer, 'exist', jsonFile['task' + i]['taskText'], jsonFile['task' + i]['taskAnswer'], jsonFile['task'+i]['complete'], jsonFile['task'+i]['userAnswer'], jsonFile['task' + i]['images'])
            buildTask(i, testViewer, 'exist', jsonFile['task' + i]['taskText'], jsonFile['task' + i]['taskAnswer'], jsonFile['task'+i]['complete'], jsonFile['task'+i]['userAnswer'], jsonFile['task' + i]['images'])
        }
        if (jsonFile['attemptsTotal'] == '') {
            attempts.textContent = 'Попытка: ' + jsonFile['attemptsEst']
            attempts.dataset.attemptsTotal = ''
            attempts.dataset.attempt = jsonFile['attemptsEst']
        }
        else {
            attempts.textContent = 'Попытка: ' + jsonFile['attemptsEst'] + '/' + jsonFile['attemptsTotal']
            attempts.dataset.attempt = jsonFile['attemptsEst']
            attempts.dataset.attemptsTotal = jsonFile['attemptsTotal']
            if (Number(attempts.dataset.attempt)==Number(attempts.dataset.attemptsTotal)){
                for (let task of document.querySelectorAll('.answer')){task.disabled = true; console.log(task)}
                let lock = document.querySelector('.lock').cloneNode(true)
                attemptsCorrects.append(lock)
            }
        }
        corrects.textContent = 'Верно: ' + jsonFile['corrects'] + '/' + jsonFile['taskAmount']
    }
    if (mode === 'exist') {
        eel.save_test(jsonFile['testName'], JSON.stringify(jsonFile), 'exist')
        let newTest = document.createElement('div')
        newTest.classList.add('test')
        newTest.dataset.testName = 'test'+jsonFile['testName']
        let testText = document.createElement('p')
        testText.classList.add('test-text')
        testText.textContent = jsonFile['testName']
        
        newTest.dataset.testType = jsonFile['testCategory']
        check_categs(jsonFile['testCategory'])
        testsContainer.append(newTest)
        newTest.append(testText)
        textAutoSize(newTest, testText, 24)
        newTest.onclick=()=>{
            eel.activate_test(newTest.textContent)
        }
        enable_menu(newTest)
        let progress = document.createElement('div')
        progress.classList.add('progress')
        newTest.append(progress)
    }
}

addTest.onclick=()=>{
    nto.classList.remove('hidden');
    close_menu(nto, document)
}


reloadButton.onclick=()=>{
    location.reload()
}

category.onclick=()=>{
    categoryChoose.classList.remove('hidden')
    close_menu(categoryChoose, window)
    window.onclick=''
}

shopButton.onclick=()=>{
    shop.classList.remove('hidden')
    close_menu(shop, document)
}

function load_files(files) {
    for (let file of files) {
        let fileRead = new FileReader()
        fileRead.onload=(e)=>{
            buildTestFromExist(e.target.result, 'exist')
            testUpload.value = ''
        }
        fileRead.readAsText(file)
    }
}

openExist.onclick=()=>{
    console.log('11111')
    nto.classList.add('hidden')
    testUpload.onchange=()=>{
        console.log('22222')
        let files = testUpload.files
        load_files(files)
    }
}

function editorViewerClose(element) {
    let tasks = element.querySelectorAll('.task')
    for (let task of tasks) {
        task.remove()
    }
    if (element === editor) {
        let testName = editor.querySelector('#test-name')
        testName.value = ''
    } else if (element === testViewer) {
        testViewer.dataset.openedName = ''
        if (testViewer.querySelector('.lock')!=null) {
            testViewer.querySelector('.lock').remove()
        }
    }
    element.classList.add('hidden')
    nto.classList.add('hidden')
}

viewerClose.onclick=()=>{
    editorViewerClose(testViewer)
}

editorClose.onclick=()=>{
    editorViewerClose(editor)
}

for (let good of goods) {
    let confirm = good.querySelector('.confirm')
    confirm.onclick=()=>{
        if (coins == 0) {
            return
        }
        coins--
        coinCount.textContent = coins
        localStorage.setItem('coins', coins)
        if (good.classList == 'buy-color') {
            let color = good.querySelector('input')
            console.log(color.value)
            style.textContent += '.progress {background-image: linear-gradient(to right,'+ color.value + ', ' + color.value + '44' + ', ' + color.value + ') !important;} .test100 {background-color:'+ color.value + '44' +'}'
            localStorage.setItem('color', color.value)
        } else if (good.classList == 'buy-font') {
            let font = good.querySelector('select')
            style.textContent += 'body {font-family:'+ font.value +'}'
            localStorage.setItem('font', font.value)
        } else if (good.classList == 'buy-lucky') {
            confirm.textContent = Math.floor(Math.random() * 100)
        } else if (good.classList == 'buy-pacman') {
            eel.new_window(8050, '../pac-man/index.html')
        }
    }
}

checkAnswers.onclick=()=>{
    let tasks = testViewer.querySelectorAll('.task')
    let test = testsContainer.querySelector('div[data-test-name="test' + testViewer.dataset.openedName + '"]')
    let total = 0
    let correct = 0
    console.log(attempts.dataset.attempt,attempts.dataset.attemptsTotal)
    if (Number(attempts.dataset.attempt) == Number(attempts.dataset.attemptsTotal)) {
        for (let task of tasks) {task.querySelector('.answer').disabled = true}
        let lock = document.createElement('p')
        lock.classList.add('material-icons')
        lock.classList.add('lock')
        lock.textContent = 'lock'
        test.prepend(lock)
        let lock2 = lock.cloneNode(true)
        attemptsCorrects.append(lock2)
        
    }
    for (let task of tasks) {
        total++
        let answer = task.querySelector('.answer')
        if (answer.value === task.dataset.taskAnswer && task.style.backgroundColor != 'green') {
            coins++
            coinCount.textContent = coins
            localStorage.setItem('coins', coins)
            correct++
            task.style.backgroundColor = 'green'
            answer.disabled = true
            eel.check_ans(testViewer.dataset.openedName, task.dataset.number, 'pass', answer.value)
        } else if (answer.value !== task.dataset.taskanswer && answer.value != '' && task.style.backgroundColor != 'green') {
            task.style.backgroundColor = 'red'
            eel.check_ans(testViewer.dataset.openedName, task.dataset.number, 'fail', answer.value)
        } else if (task.style.backgroundColor == 'green') {
            correct++
        }
    }
    console.log(testViewer.dataset.openedName)
    
    console.log(test)
    prog = correct / total * 100 + '%'
    let progress = test.querySelector('.progress')
    if (prog == '100%') {
        test.classList.add('test100')
        if(test.querySelector('.progress')!=null){progress.remove()}
    } else {
        progress.style.width = prog
    }
    corrects.textContent = 'Верно: ' + correct + '/' + total
    let attempt;
    if (Number(attempts.dataset.attempt) == Number(attempts.dataset.attemptsTotal)) {
        attempt = attempts.dataset.attempt
        eel.progress_update(testViewer.dataset.openedName, prog, attempt, correct)
        return
    }
    attempt = Number(attempts.dataset.attempt) + 1
    attempts.dataset.attempt++
    if (attempts.dataset.attemptsTotal == '') {
        attempts.textContent = 'Попытка: ' + attempts.dataset.attempt
    } else {
        attempts.textContent = 'Попытка: ' + attempts.dataset.attempt + '/' + attempts.dataset.attemptsTotal
    }
    eel.progress_update(testViewer.dataset.openedName, prog, attempt, correct)
    
}

openEditor.onclick=()=>{
    nto.classList.add('hidden')
    editor.classList.remove('hidden')
    let placeholder = document.createElement('option')
    placeholder.textContent = 'Выберите категорию...'
    placeholder.setAttribute('selected','')
    categorySelect.prepend(placeholder)
    categorySelect.onclick=()=>{
        categorySelect.querySelector('option:first-of-type').remove()
        setTimeout(()=>{categorySelect.onclick=''},100)
    }
    let taskCreateCounter = 1;
    newTask.onclick=()=>{
        buildTask(taskCreateCounter, editorMainArea, 'editor')
        taskCreateCounter++
    }
}




save.onclick = ()=>{
    let jsonFile = {}
    let testName = document.querySelector('#test-name').value
    jsonFile["testName"] = testName
    if (categorySelect.value == 'Выберите категорию...') {
        jsonFile["testCategory"] = 'Без категории'
    } else {
        jsonFile["testCategory"] = categorySelect.value
    }
    let tasks = document.querySelectorAll('.task')
    let i = 1;
    for (let task of tasks) {
        let textArea = task.querySelector('textarea')
        let answer = task.querySelector('input[type=text]')
        let images = task.querySelectorAll('img')
        jsonFile['task' + i] = {}
        jsonFile['task' + i]['taskName'] = task.querySelector('.task-header').textContent
        jsonFile['task' + i]['taskText'] = textArea.value
        jsonFile['task' + i]['taskAnswer'] = answer.value
        jsonFile['task' + i]['complete'] = 'none'
        jsonFile['task' + i]['userAnswer'] = ''
        jsonFile['task' + i]['images'] = {}
        jsonFile['task' + i]['images']['imageAmount'] = images.length
        
        
        let k = 1
        for (let image of images) {
            jsonFile['task' + i]['images']['image' + k] = image.src
            k++
        }
        i++
    }
    jsonFile['corrects'] = 0
    jsonFile['attemptsEst'] = 1
    jsonFile['attemptsTotal'] = attemptsTotal.value
    jsonFile['progress'] = '0'
    jsonFile['taskAmount'] = String(i - 1)
    jsonFile = JSON.stringify(jsonFile)
    eel.save_test(testName, jsonFile, 'editor')
}

attemptsTotal.onchange=()=>{if(attemptsTotal.value == 0){attemptsTotal.value=''}}

let drag = 0
document.ondragenter=(e)=>{e.stopPropagation();e.preventDefault();drag++;console.log('файл есть!');dragAndDrop.classList.remove('hidden')}
document.ondragover=(e)=>{e.stopPropagation();e.preventDefault();console.log('файл поверх!')}
document.ondragleave=(e)=>{e.stopPropagation();e.preventDefault();drag--;if(drag==0){console.log('файл ушел!');dragAndDrop.classList.add('hidden')}}

document.ondrop=(e)=>{
    e.stopPropagation()
    e.preventDefault()
    console.log('файл получен!')
    dragAndDrop.classList.add('hidden')
    let data = e.dataTransfer
    let files = data.files
    for (let file of files) {
        if (file.type == 'application/json') {
            load_files([file])
        }
    }
}

window.onresize=()=>{
    let tests = testsContainer.querySelectorAll('.test')
    for (let test of tests) {
        let testText = test.querySelector('.test-text')
        textAutoSize(test, testText, 24)
    }
}