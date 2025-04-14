/* GPLv3 you can't touch my code */

async function fetch_data(endp){
    const response=await fetch(`/api/${endp}`,{
            method:'GET',
            cors:'same-origin',
            headers:{
                "Content-Type":"application/json"
                },
            referrerPolicy:'no-referrer'
            })
            .then(data=>data.json())
            .catch((err)=>{
                console.error(err);
            })
    return response;
}
async function build_html_table_desktop(listdata){
    let html='<table><thead><th>File</th><th>Size</th><th>Created</th><th>Type</th></thead><tbody>';
    for(let row of listdata){
        html+=`\
            <tr>\
                <td><a href="${row.href}">${row.name}</a></td>\
                <td>${row.size}</td>\
                <td>${row.ctime}</td>\
                <td>${row.type}</td>\
            </tr>`;
    }
    html+='</tbody></table>';
    return html;
}

async function build_html_table_mobile(listdata){
    let html='';
    for(let row of listdata){
        html+=`\
            <table><tbody>\
                <tr><th>File</th><td><a href="${row.href}">${row.name}</a></td></tr>\
                <tr><th>Size</th><td>${row.size}</td></tr>\
                <tr><th>Created</th><td>${row.ctime}</td></tr>\
                <tr><th>Type</th><td>${row.type}</td></tr>\
            </tbody></table><hr/>`;
    }

    return html;
}

async function populate(uri){
    const listdata=await fetch_data(uri);
    let htable='<p>No data</p>';
    if(window.screen.width > 600){
        htable=await build_html_table_desktop(listdata);
    }else{
        htable=await build_html_table_mobile(listdata);
    }
    document.querySelector("#files").innerHTML=htable;
}

async function search_action(){
    const entry=document.querySelector("#search > .entry");
    if( entry == null ){
        console.error("null entry");
        return null;
    }
    const value=entry.value;

    if( /^\s*$/.exec(value) ){
        populate("files.php");
        return null;
    }
    populate(`files.php?q=${value}`);
}


document.onload=populate("files.php");
document.querySelector("#search > .button").onclick=()=>search_action();
