const config = require("./dbconfig")
const sql = require('mssql')


 async function getdataWithQuery(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("SELECT * FROM blog");
        return res.recordsets;
    } catch (error){
        console.log("mathus-error:" + error)
    }
}

module.exports= {
    getdataWithQuery :getdataWithQuery
    
};
