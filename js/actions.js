const table_entries=document.querySelector("#entries");
const table_entries_content=document.querySelector("#entries-content");
const fileinput=document.querySelector('#upload-action');
const controllers={}

fileinput.addEventListener('change',async(ev)=>{
    ev.preventDefault();

    const filelist=fileinput.files;
    /* This DOES NOT work on android */
    //const filelist= await window.showOpenFilePicker({multiple:true});
    console.log(filelist)
    for await (const x of filelist){
        send_file(x);
        show_file(x);
    }
    table_entries.style.display='block';
});

async function show_file(file_obj){
    /* WARN: unsafe value id for data-target property, consider uuid or hash */
    table_entries_content.innerHTML+=`
        <tr><td><input type="button" class="remove" value="&times;" data-target="${file_obj.name}"></td><td class="ellipsis">${file_obj.name}</td></tr>
        `;
}

async function send_file(file_obj){
    const form_data=new FormData();
    const filename= file_obj.name;
    /*
    console.log(file_obj)
    const payload= await file_obj.getFile();
    //const uuid=Crypto.randomUUID()
    */
    const controller=new AbortController();
    controllers[filename]=controller;

    form_data.append('file',file_obj);
    const csrf=document.querySelector('meta[name="csrf-token"]').content;

    // await  
    await fetch('/api/files.php',{
        method:'POST',
        body: form_data,
        headers:{'X-CSRF-Token':csrf},
        credentials:'same-origin',
        signal:controller.signal
    }).then((resp)=>{
        if(!resp.ok)
            console.log(resp);
    }).catch((ex)=>{
        console.error(ex);
        controller[filename].abort();
    }).finally(()=>{
        delete controller[filename];
    })
}

document.addEventListener('DOMContentLoaded',async()=>{
    const message=document.getElementById('message-1');
    if ( ! 'showOpenFilePicker' in self) {
        const errmsg='The `showOpenFilePicker()` method of the File System Access API is supported.';
        message.style.display='block';
        alert(errmsg);
        document.getElementById('message-1').textContent=errmsg;
    }
});

/* TODO: allow cancel and show progress */