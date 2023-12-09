function sqlForPatrialUpdate(data){
    let statement = "";
    let vals = [];
    const keys=Object.keys(data);
    for(let i = 0; i < keys.length; i++){
        statement = `${statement}${i!=0?', ':""}${keys[i]} = $${i+1}`;
        vals.push(data[keys[i]]);
    }
    console.log(statement);
    console.log(vals);
    return {statement, vals};
}

function sqlForAdditionInsert(data, required=[]){
    let columns = "";
    let vals = [];
    let values = "";
    const keys=Object.keys(data).filter(k=>!required.includes(k));
    for(let i = 0; i<keys.length;i++){
        columns = `${columns}, ${keys[i]}`;
        vals.push(data[keys[i]]);
        values = `${values}, $${i+required.length+1}`;
    }
    return {columns, values, vals};
}

module.exports={
    sqlForPatrialUpdate,
    sqlForAdditionInsert
}