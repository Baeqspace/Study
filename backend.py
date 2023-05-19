import eel
import glob
import os
from os.path import join, isdir
import json

eel.init('web', allowed_extensions=['.js', '.html'])



@eel.expose
def save_test(testName, data, mode):
    if mode == 'exist':
        test = open('tests/'+testName +'.json', 'w', encoding='utf-8')
    elif mode == 'editor':
        test = open(testName + '.json', 'w', encoding='utf-8')
    test.write(data)

@eel.expose
def search_tests():
    tests = glob.glob('tests/'+'/*.json')
    progress = []
    categories = []
    attEst = []
    attTot = []
    for i in range(0, len(tests)):
        print(tests[i], '1')
        tests[i] = tests[i].replace('\\', '/', 1)
        data = open(tests[i], 'r', encoding='utf-8')
        jsonFile = json.loads(data.read())
        categories.append(jsonFile['testCategory'])
        progress.append(jsonFile['progress'])
        attEst.append(jsonFile['attemptsEst'])
        attTot.append(jsonFile['attemptsTotal'])
        data.close()
        tests[i] = tests[i].replace('.json', '', 1)
        tests[i] = tests[i].replace('tests/', '',1)
        print(tests[i], '2')
        print('')
    eel.testSearch(tests, categories, progress, attEst, attTot)

@eel.expose
def activate_test(test):
    jsonFile = open('tests/' + test + '.json', 'r+', encoding='utf-8')
    eel.buildTestFromExist(jsonFile.read(), 'menu')
    jsonFile.close()

@eel.expose
def delete_test(test):
    os.remove('tests/' + test + '.json')

@eel.expose
def check_ans(name, task, state, answer):
    jsonFile = open('tests/'+name+'.json','r+',encoding='utf-8')
    text = jsonFile.read()
    part = json.loads(text)
    part[task]['complete'] = state
    part[task]['userAnswer'] = answer
    part = json.dumps(part, ensure_ascii=False)
    jsonFile.seek(0)
    jsonFile.truncate(0)
    jsonFile.write(part)
    jsonFile.close()

@eel.expose
def progress_update(test,progress, attempt, correct):
    jsonFile = open('tests/'+test+'.json','r+',encoding='utf-8')
    text = jsonFile.read()
    part = json.loads(text)
    part['progress'] = progress
    part['attemptsEst'] = attempt
    part['corrects'] = correct
    part = json.dumps(part, ensure_ascii=False)
    jsonFile.seek(0)
    jsonFile.truncate(0)
    jsonFile.write(part)
    jsonFile.close()

@eel.expose
def new_window(newPort, path):
    eel.start(path, port=newPort, size=(1500,1000))



eel.start('index.html', size=(1000, 1000))