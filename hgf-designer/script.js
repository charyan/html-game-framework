let baseScene = document.getElementById("baseScene");
let baseAction = baseScene.getElementsByClassName("action")[0];
baseAction.remove();
baseScene.remove();

function addScene() {
    let sceneList = document.getElementById("sceneList");
    let scene = baseScene.cloneNode(true);
    scene.removeAttribute("id");

    // Get new uid
    let isUnique = true;
    let newUid = 0;
    do {
        newUid = generateId(4);
        let uids = scene.getElementsByClassName("sceneUid");
        
        Array.from(uids).forEach((uid) => {
            if(uid.value == newUid){
                isUnique = false;
            }
        });
    } while (!isUnique);
    
    // Create Scene h2
    let title = scene.getElementsByTagName("h2")[0];
    title.appendChild(document.createTextNode("Scene #" + newUid));
    title.setAttribute("id", newUid);
    
    scene.getElementsByClassName("sceneUid")[0].value = newUid;
    sceneList.appendChild(scene);

    refresh();
}

function addAction(_button) {
    let actionList = _button.parentElement.getElementsByClassName("actionList")[0];
    let action = baseAction.cloneNode(true);
    actionList.appendChild(action);

    refresh();
}

function rmAction(_action) {
    _action.remove();
}

function rmScene(_scene) {
    _scene.remove();

    refresh();
}

function buildJson() {
    let sceneList = document.getElementById("sceneList");
    let scenes = sceneList.getElementsByClassName("scene");
    let j = [];


    Array.from(scenes).forEach((scene) => {
        let s = {};
        s["uid"] = scene.getElementsByClassName("sceneUid")[0].value;
        s["title"] = scene.getElementsByClassName("sceneTitle")[0].value;
        s["img"] = scene.getElementsByClassName("sceneImg")[0].value;
        s["text"] = scene.getElementsByClassName("sceneText")[0].value;

        s["actions"] = [];
        
        Array.from(scene.getElementsByClassName("action")).forEach((action) =>{
            let a = {};
            a["uid"] = action.getElementsByClassName("actionUid")[0].value;
            a["text"] = action.getElementsByClassName("actionText")[0].value;
            s["actions"].push(a);
        });
        
        j.push(s);
    });
    
    return j;
}

function download(){
    let text = JSON.stringify(buildJson());
    
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "game.json");
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}

function fillSelects() {
    let selects = document.getElementsByClassName("actionUid");

    let t = buildJson();
    Array.from(selects).forEach((select) =>{
        let lastValue = select.value;
        // Remove all options
        Array.from(select.children).forEach((child) => {
            child.remove();
        });

        // Add all options
        for(let i=0; i<t.length; ++i){
            let opt = document.createElement("option");
            opt.value = t[i]["uid"];
            opt.appendChild(document.createTextNode(t[i]["title"] + " " + t[i]["uid"]));
            select.appendChild(opt);
        }

        select.value = lastValue;
    });
}

function fillLinks() {
    // Add links to actions
    let actions = document.getElementsByClassName("action");

    Array.from(actions).forEach((action) =>{
        let link = action.getElementsByClassName("actionLink")[0];
        let uid = action.getElementsByClassName("actionUid")[0];
        link.setAttribute("href", "#" + uid.value);
    });

    // Add links to references
    let refDivs = document.getElementsByClassName("references");
    let t = buildJson();
    // For each references div
    Array.from(refDivs).forEach((ref) => {

        // Remove all children of the reference div node
        for(let i=0; i<ref.children.length; ++i){
            ref.removeChild(ref.firstChild);
        }
        
        let refUid = ref.parentElement.getElementsByClassName("sceneUid")[0].value;

        // For each action
        let actions = document.getElementsByClassName("action");
        Array.from(actions).forEach((action) =>{
            let targetUid = action.getElementsByClassName("actionUid")[0].value;
            let srcUid = action.parentElement.parentElement.getElementsByClassName("sceneUid")[0].value;
            let srcTitle = action.parentElement.parentElement.getElementsByClassName("sceneTitle")[0].value;

            if(refUid == targetUid){
                // Add references links
                let link = document.createElement("a");
                link.setAttribute("href", "#" + srcUid);
                link.appendChild(document.createTextNode(srcTitle + "#" + srcUid));
                ref.appendChild(link);
            }
        });
    });

}

function refresh() {
    fillSelects();
    fillLinks();
}


// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
}
  
// generateId :: Integer -> String
function generateId (len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

function applyJson(_content) {
    
    let sceneList = document.getElementById("sceneList");
    
    let scenes = JSON.parse(_content);
    
    // Create select
    let select = document.createElement("select");
    select.setAttribute("name", "uid");
    select.setAttribute("class", "actionUid");
    select.setAttribute("onchange", "refresh()");
    // Fill select with options
    for(let i=0; i<scenes.length; ++i){
        //    <option value="volvo">Volvo</option>
        let option = document.createElement("option");
        option.setAttribute("value", scenes[i]["uid"]);
        option.appendChild(document.createTextNode(scenes[i]["title"] + "#" + scenes[i]["uid"]));
        select.appendChild(option);
    }


    for(let i=0; i<scenes.length; ++i) {
        let scene = baseScene.cloneNode(true);
        scene.removeAttribute("id");
    
        let title = scene.getElementsByTagName("h2")[0];
        title.appendChild(document.createTextNode("Scene #" + scenes[i]["uid"]));
        title.setAttribute("id", scenes[i]["uid"]);

        scene.getElementsByClassName("sceneTitle")[0].value = scenes[i]["title"];
        scene.getElementsByClassName("sceneUid")[0].value = scenes[i]["uid"];
        scene.getElementsByClassName("sceneImg")[0].value = scenes[i]["img"];
        scene.getElementsByClassName("sceneText")[0].value = scenes[i]["text"];
                
        let actionList = scene.getElementsByClassName("actionList")[0];
        for(let j=0; j<scenes[i]["actions"].length; ++j) {
            let action = baseAction.cloneNode(true);
            
            // Fill select with options
            let select = action.getElementsByClassName("actionUid")[0];
            for(let i=0; i<scenes.length; ++i){
                let option = document.createElement("option");
                option.setAttribute("value", scenes[i]["uid"]);
                option.appendChild(document.createTextNode(scenes[i]["title"] + "#" + scenes[i]["uid"]));
                select.appendChild(option);
            }
            
            action.getElementsByClassName("actionText")[0].value = scenes[i]["actions"][j].text;
            action.getElementsByClassName("actionLink")[0].setAttribute("href", "#" + scenes[i]["actions"][j].uid);
            action.getElementsByClassName("actionUid")[0].value = scenes[i]["actions"][j].uid;
            actionList.appendChild(action);
        }

        sceneList.appendChild(scene);
    }

    refresh();
}

function upload() {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 
        var file = e.target.files[0]; 
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            applyJson(readerEvent.target.result);
        }
    }
    input.click();
}